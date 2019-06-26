<template>
  <div class="copy-fans-label-group">
    <div style="padding: 20px 0 30px 10px; height: 100%;">
      <div style="height: 118px">
        <div style="font-size: 12px;color: #979899; line-height: 18px;" v-if="drawer.type === 'copyGroup'">
          注：复制标签分组即将所选公众号下选中的标签及其所在的标签分组同时复制到当前公众号内。当标签分组名称或标签名称与原有相同时，将保留原有标签分组名称或标签名称。
        </div>
        <div style="font-size: 12px;color: #979899; line-height: 18px;" v-else>
          注：复制标签即将所选公众号下选中的标签复制到当前公众号内。当标签名称与原有相同的时，将保留原有的标签名称。
        </div>
        <Form ref="formValidate" :label-width="85">
            <FormItem label="选择公众号">
                <Select v-model="formValidate.appAccountId" @on-change="selectChange">
                    <Option v-for="(item, index) in usablePublicList" :key="index" :value="item.appAccountId">{{item.principalName}}</Option>
                </Select>
            </FormItem>
        </Form>
      </div>
      <div class="copy-fans-label-tags" ref="allTags" >
        <scroll-bar>
         <TagAction v-model="allTags"></TagAction>
        </scroll-bar>
      </div>
    </div>
    <div class="copy-fans-remind gray_color">
      <div>已有：<span v-if="drawer.type==='copyGroup'">{{groupCount}} 个标签分组，</span>{{tagsCount}} 个标签</div><div>可选：<span v-if="drawer.type==='copyGroup'">{{calcRemainGroup}} 个标签分组，</span>{{calcRemainTags}} 个标签</div>
    </div>
    <div class="fans-label-drawer-footer copy-fans-label-group">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveCopy">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import TagAction from '../../components/tag'
const ALLTAGSCOUNT = 100
const ALLGROUPCOUNT = 50
export default {
  name: 'fansDrawerContent',
  components: {
    TagAction
  },
  props: {
    drawer: {
      type: Object,
      default() {
        return {}
      }
    },
    groupData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formValidate: {
        appAccountId: ""
      },
      allTags: [],
    }
  },
  computed: {
    ...mapState({
      publicList: state => state.publicAccount.publicAccountList,
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    }),
    usablePublicList() {
      let arr = []
      this.publicList.forEach(item => {
        if (item.appAccountId !== this.appAccountId && item.status === 1) {
          arr.push(item)
        }
      })
      return arr
    },
    groupCount() {
      // 已有标签分组的数量
      let existingGroup = this.groupData.allTagGroup.length
      return existingGroup
    },
    tagsCount() {
      // 已有标签的数量
      let totalCount = this.groupData.allTagGroup.reduce((init, next) => {
        return init + next.fansWxTagCount
      }, 0)
      return totalCount
    },
    remainTags() {
      // 已有标签的数量
      let totalCount = this.groupData.allTagGroup.reduce((init, next) => {
        return init + next.fansWxTagCount
      }, 0)
      let copyCount = 0
      for (let i = 0; i < this.allTags.length; i++) {
        const fansWxTagDtos = this.allTags[i].fansWxTagDtos
        if (fansWxTagDtos) {
          for (let j = 0; j < fansWxTagDtos.length; j++) {
            const element = fansWxTagDtos[j]
            if (element.flag) {
              copyCount++
            }
          }
        }
      }
      let allTotal = totalCount + copyCount
      return ALLTAGSCOUNT - allTotal
    },
    remainGroup() {
      // 已有标签分组的数量
      let existingGroup = this.groupData.allTagGroup.length
      // 计算选择的分组数量
      let fansGroupAndTagForms = []
      let sameCountGroup = 0
      for (let i = 0; i < this.allTags.length; i++) {
        const fansWxTagDtos = this.allTags[i].fansWxTagDtos
        let obj = {
            name: this.allTags[i].name,
          }
        let flag = false
        if (fansWxTagDtos) {
          for (let j = 0; j < fansWxTagDtos.length; j++) {
            const element = fansWxTagDtos[j]
            if (element.flag) {
              flag = true
              break
            }
          }
        }
        if (flag) {
          fansGroupAndTagForms.push(obj)
        }
      }
      for (let i = 0; i < this.groupData.allTagGroup.length; i++) {
        const name = this.groupData.allTagGroup[i].name
        for (let j = 0; j < fansGroupAndTagForms.length; j++) {
          if (name === fansGroupAndTagForms[j].name) {
            sameCountGroup++
          }
        }
      }
      let existCountGroup = fansGroupAndTagForms.length
      let allTotal = existingGroup + existCountGroup - sameCountGroup
      return ALLGROUPCOUNT - allTotal
    },
    calcRemainGroup() {
      return this.remainGroup >= 0 ? this.remainGroup : 0
    },
    calcRemainTags() {
      return this.remainTags >= 0 ? this.remainTags : 0
    }
  },
  watch: {
    usablePublicList: {
      handler(val) {
        if (val.length > 0) {
          this.formValidate.appAccountId = val[0].appAccountId
          this.getWxGroupAndTagList(val[0].appAccountId)
        }
      },
      deep: true
    },
    allTags: {
      handler(val) {
      },
      deep: true
    }
  },
  mounted() {
    if (this.usablePublicList.length > 0) {
      this.formValidate.appAccountId = this.usablePublicList[0].appAccountId
      this.getWxGroupAndTagList(this.usablePublicList[0].appAccountId)
    }
    this.$refs.allTags.getClientRects()[0]
    // 获取数据
  },
  methods: {
    async getWxGroupAndTagList(appAccountId) {
      let params = {
        appAccountId: appAccountId
      }
      const response = await this.post(this.fylPath.getWxGroupAndTagList, params)
      const { code, data, message } = response
      if (code === 1) {
        if (data && data.fansGroupAndTagDtos) {
          let arrOrder = data.fansGroupAndTagDtos.sort(this.sortBy('groupOrder', 'max'))
          arrOrder = arrOrder.map((item) => {
            if (item.fansWxTagDtos) {
              item.fansWxTagDtos.sort(this.sortBy('tagOrder', 'max'))
              item.fansWxTagDtos.map((_item) => {
                _item.flag = false
                return _item
              })
            }
            return item
          })
          this.initData(arrOrder)
        } else {
          this.allTags = []
        }
      } else {
        this.$Message.error(message)
      }
    },
    // 复制标签分组
    async updateCopyTagGroupFromOtherAppId(params) {
      const response = await this.post(this.fylPath.updateCopyTagGroupFromOtherAppId, params)
      const { code, message } = response
      if (code === 1) {
        let copyContent = "标签分组正在复制中，请稍后…"
        this.$root.Bus.$emit('copyModal', copyContent, 'init')
      } else {
        this.$Message.error(message)
      }
    },
    // 复制标签
    async updateCopyTagFromOtherAppId(params) {
      const response = await this.post(this.fylPath.updateCopyTagFromOtherAppId, params)
      const { code, message } = response
      if (code === 1) {
        let copyContent = "标签正在复制中，请稍后…"
        this.$root.Bus.$emit('copyModal', copyContent, null)
      } else {
        this.$Message.error(message)
      }
    },
    initData(response) {
      // 将数据过滤
      const newResponse = response.map(groupItem => {
        groupItem.fansWxTagDtos = (groupItem.fansWxTagDtos || []).map(item => {
          let isSame = false
          for (let i = 0; i < this.groupData.allTagGroup.length; i++) {
            const fansWxTagDtos = this.groupData.allTagGroup[i].fansWxTagDtos
            if (fansWxTagDtos) {
              for (let j = 0; j < fansWxTagDtos.length; j++) {
                const element = fansWxTagDtos[j]
                if (element.tagName === item.tagName) {
                  isSame = true
                  break
                }
              }
            }
          }
          // 粉丝标签
          if (isSame) {
            return { ...item, disabled: true }
          } else {
            return { ...item }
          }
        })
        return groupItem
      })
      this.allTags = newResponse
    },
    selectChange() {
      this.getWxGroupAndTagList(this.formValidate.appAccountId)
    },
    saveGroup() {
      let fansGroupAndTagForms = []
      for (let i = 0; i < this.allTags.length; i++) {
        const fansWxTagDtos = this.allTags[i].fansWxTagDtos
        let obj = {
            name: this.allTags[i].name,
            groupLevel: this.allTags[i].groupLevel === 1 ? 'USER' : 'SYSTEM',
            specialGroup: this.allTags[i].specialGroup === 1 ? 'YES' : 'NO',
            tagNameList: []
          }
        if (fansWxTagDtos) {
          for (let j = 0; j < fansWxTagDtos.length; j++) {
            const element = fansWxTagDtos[j]
            if (element.flag) {
              obj.tagNameList.push(element.tagName)
            }
          }
        }
        if (obj.tagNameList.length > 0) {
          fansGroupAndTagForms.push(obj)
        }
      }
      if (fansGroupAndTagForms.length > 0) {
        this.drawer.show = false
        let params = {
          appAccountId: this.appAccountId,
          fansGroupAndTagForms
        }
        this.updateCopyTagGroupFromOtherAppId(params)
      } else {
        this.$Message.warning('至少选择一项')
      }
    },
    saveTags() {
      let tagNameList = []
      for (let i = 0; i < this.allTags.length; i++) {
        const fansWxTagDtos = this.allTags[i].fansWxTagDtos
        if (fansWxTagDtos) {
          for (let j = 0; j < fansWxTagDtos.length; j++) {
            const element = fansWxTagDtos[j]
            if (element.flag) {
              tagNameList.push(element.tagName)
            }
          }
        }
      }
      if (tagNameList.length > 0) {
        this.drawer.show = false
        let params = {
          appAccountId: this.appAccountId,
          id: this.groupData.currentTagGroup.id,
          tagNameList
        }
        this.updateCopyTagFromOtherAppId(params)
      } else {
        this.$Message.warning('至少选择一项')
      }
    },
    saveCopy() {
      if (this.drawer.type === 'copyGroup') {
        if (this.remainGroup >= 0 && this.remainTags >= 0) {
          this.saveGroup()
        } else {
          this.$Message.warning('选择标签分组不能大于50，标签不能大于100')
        }
      } else {
        if (this.remainTags >= 0) {
          this.saveTags()
        } else {
          this.$Message.warning('选择标签不能大于100')
        }
      }
    },
    cancleDrawer() {
      this.drawer.show = false
    }
  }
}
</script>
<style lang="stylus">
  .copy-fans-label-group
    height 100%
    .ivu-form
      width 270px
      .ivu-form-item
        margin-top 20px
        .ivu-form-item-label
          line-height 40px
          height 40px
          padding 0
          text-align left
    .copy-fans-label-tags
      flex 1
      border-top 1px solid #e3e4e6
      padding-top 30px
      height calc(100% - 130px)
  .copy-fans-remind
    position absolute
    display flex
    justify-content space-around
    bottom 60px
    left 0
    width: 100%
    height: 40px;
    line-height 40px
    background-color: #fffaf2;
</style>
