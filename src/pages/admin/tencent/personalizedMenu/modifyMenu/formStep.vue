<template>
  <div class="form-step">
    <Form ref="formMenu" :model="formMenu" :rules="ruleInline" :label-width="99">
      <FormItem prop="area" label="选择地区">
        <div @click.stop>
          <Input v-model="formMenu.area" readonly @on-focus.stop="showCascader" placeholder="不限" icon="arrow-down-b"></Input>
        </div>
        <WordCascader v-model="showCascaderModal" @areaSelect="areaSelect"></WordCascader>
      </FormItem>
      <FormItem prop="sex" label="选择性别">
        <Select v-model="formMenu.sex" placeholder="不限">
          <Option value="">不限</Option>
          <Option value="MALE">男</Option>
          <Option value="FEMALE">女</Option>
        </Select>
      </FormItem>
      <FormItem prop="clientPlatformType" label="手机操作系统">
        <Select v-model="formMenu.clientPlatformType" placeholder="不限">
          <Option value="">不限</Option>
          <Option value="IOS">IOS</Option>
          <Option value="ANDROID">Android</Option>
          <Option value="OTHERS">其他</Option>
        </Select>
      </FormItem>
      <FormItem prop="language" label="语言">
        <Select v-model="formMenu.language" placeholder="不限" :transfer="true">
          <Option :value="item.itemValue" :key="index" v-for="(item, index) in languageData">{{item.itemName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="tagNames" label="用户标签">
          <Input type="text" class="nowrap" v-model="formMenu.tagNames" @on-focus.stop="showMark" icon="edit" placeholder="不限">
          </Input>
      </FormItem>
      <FormItem prop="matchRuleName" label="个性化标题">
        <Input type="text" v-model.trim="formMenu.matchRuleName" placeholder="请输入个性化菜单标题"></Input>
      </FormItem>
    </Form>
    <div class="submit">
      <Button type="primary" @click="saveAndNext('formMenu')">保存并下一步</Button>
      <Button type="ghost" @click="cancel">取消</Button>
    </div>
    <!-- 标签选择弹框 -->
    <NewModal width="700" header="用户标签" @ok="ok"  :cancelBtn="false" :transfer="true" :maskClosable="false" confrim="确定" v-model="showTag">
      <div class="tag-radio" :class="{'tag-boder':tagType === 2}">
        <RadioGroup v-model="tagType">
          <Radio :label="1">不限</Radio>
          <Radio :label="2">指定标签</Radio>
        </RadioGroup>
      </div>
      <div v-show="tagType == 1" class="tab-blank"></div>
      <TagAction @singleFalse="singleFalse" v-show="tagType == 2" :single="personalMenuItem && !personalMenuItem.newCreate" :value="allTags"></TagAction>
    </NewModal>
    <!-- 重复菜单弹框 -->
    <NewModal
      v-model="showConfirm"
      header="操作提示"
      content="个性化菜单中已有完全相同的条件，设置条件中必须至少有1项条件与已有的个性化菜单不同，请重新设置条件。"
      :cancelBtn="false"
      confrim="知道了"></NewModal>
  </div>
</template>
<script>
import TagAction from '../tagSelect'
import {mapState} from 'vuex'
export default {
  name: 'fromStep',
  data() {
    const validateArea = (rule, value, callback) => {
      let areaArr = value.split('/')
      if (areaArr.length === 1 && areaArr[0]) {
        callback(new Error('您还没有选择省'))
      } else if (areaArr.length === 2) {
        callback(new Error('您还没有选择市'))
      } else {
        callback()
      }
    }
    return {
      tagType: 1,
      showTag: false,
      showCascaderModal: false,
      showConfirm: false,
      formMenu: {
        area: '',
        language: '',
        sex: '',
        clientPlatformType: '',
        tagNames: '',
        matchRuleName: ''
      },
      ruleInline: {
        matchRuleName: [
          { type: 'string', max: 16, message: '个性化标题不能超过16个字', trigger: 'blur' }
        ],
        area: {trigger: 'input', validator: validateArea}
      },
      allTags: [],
      languageData: [],
      tagIds: '',
      throttle: false,
      personalMenuItem: this.localStorageSaveOrRead('personalMenuItem'),
      tagPayload: {}
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  watch: {
    allTags: {
      handler(arr) {
        let tagIds = []
        let tagNames = []
        for (let i = 0; i < arr.length; i++) {
          let ele = arr[i].fansWxTagDtos
          if (ele) {
            for (let j = 0; j < ele.length; j++) {
              if (ele[j].flag) {
                tagIds.push(ele[j].tagId)
                tagNames.push(ele[j].tagName)
              }
            }
          }
        }
        this.tagPayload = {
          tagNames: tagNames.join(' / '),
          tagIds: tagIds.join(',')
        }
      },
      deep: true
    }
  },
  created() {
    this.getItemValue('WX_LANGUAGE')
    this.getWxGroupAndTagList()
    this.init()
  },
  methods: {
    ok() {
      if (this.tagType === 1) {
        this.tagIds = ''
        this.formMenu.tagNames = ''
        this.setAllTagNull()
      } else {
        this.formMenu.tagNames = this.tagPayload.tagNames
        this.tagIds = this.tagPayload.tagIds
      }
    },
    singleFalse() {
      this.allTags = this.allTags.map((item) => {
        if (item.fansWxTagDtos) {
          item.fansWxTagDtos = item.fansWxTagDtos.map(_item => {
            return {..._item, flag: false}
          })
        }
        return item
      })
    },
    setAllTagNull() {
      this.allTags = this.allTags.map((item) => {
        if (item.fansWxTagDtos) {
          item.fansWxTagDtos = item.fansWxTagDtos.map(_item => {
            return {..._item, flag: false}
          })
        }
        return item
      })
    },
    init() {
      if (this.personalMenuItem) {
        console.log(this.personalMenuItem)
        let personalMenuItem = this.personalMenuItem
        let area = ''
        if (personalMenuItem.country) {
          area = `${personalMenuItem.country}/${personalMenuItem.province}/${personalMenuItem.city}`
        }
        if (this.personalMenuItem.tagIds) {
          this.tagType = 2
        }
        this.formMenu = {
          area: area,
          language: personalMenuItem.language || '',
          sex: personalMenuItem.sex ? (personalMenuItem.sex === 1 ? 'MALE' : 'FEMALE') : '',
          clientPlatformType: personalMenuItem.clientPlatformType || '',
          tagNames: (personalMenuItem.tagList && personalMenuItem.tagList[0].tagName) || '',
          matchRuleName: personalMenuItem.matchRuleName || ''
        }
        this.tagIds = personalMenuItem.tagIds
      } else {
        this.personalMenuItem = {
          newCreate: true
        }
      }
    },
    async checkMathRuleData() {
      let areaArr = this.formMenu.area.split('/')
      let params = {
        id: null,
        appAccountId: this.appAccountId,
        country: areaArr[0] || null,
        province: areaArr[1] || null,
        city: areaArr[2] || null,
        clientPlatformType: this.formMenu.clientPlatformType || null,
        language: this.formMenu.language || null,
        matchRuleName: this.formMenu.matchRuleName || null,
        sex: this.formMenu.sex || null,
        tagIds: this.tagIds || null
      }
      if (this.personalMenuItem.id) {
        params.id = this.personalMenuItem.id
      }
      const response = await this.post(this.fylPath.checkMathRuleData, params)
      return response
    },
    getWxGroupAndTagList() {
      let params = {
        appAccountId: this.appAccountId
      }
      this.post(this.fylPath.getWxGroupAndTagList, params).then(data => {
        if (data.code === 1) {
          if (this.personalMenuItem && this.personalMenuItem.tagIds) {
            let tagIds = this.personalMenuItem.tagIds.split(',')
            let fansGroupAndTagDtos = data.data.fansGroupAndTagDtos.map((item) => {
              if (item.fansWxTagDtos) {
                item.fansWxTagDtos = item.fansWxTagDtos.map(_item => {
                  if (tagIds.indexOf(_item.tagId.toString()) > -1) {
                    return {..._item, flag: true}
                  } else {
                    return {..._item, flag: false}
                  }
                })
              }
              return item
            })
            this.allTags = fansGroupAndTagDtos
          } else {
            this.allTags = data.data.fansGroupAndTagDtos
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    getItemValue(key) {
      let obj = {
        itemKey: key
      }
      this.queryTItemValueByPager(obj).then(data => {
        switch (data.code) {
          case 1:
            let allValue = [{itemValue: '', itemName: '不限'}]
            this.languageData = allValue.concat(data.data.sort(this.sortBy('itemIdx')))
            break
          default:
            break
        }
      })
    },
    showMark() {
      this.showTag = true
    },
    showCascader() {
      this.showCascaderModal = true
    },
    parentCadcader() {
      this.showCascaderModal = false
    },
    areaSelect(areaName) {
      this.formMenu.area = areaName
    },
    async saveAndNext(name) {
      const validate = await this.$refs[name].validate()
      if (validate) {
        let isSubmit = false
        for (let key in this.formMenu) {
          if (this.formMenu[key] && key !== 'matchRuleName') {
            isSubmit = true
            break
          }
        }
        if (!isSubmit) {
          this.$Message.warning('设置条件至少选择一项')
          return
        }
        const response = await this.checkMathRuleData()
        if (response.code === 1) {
          let areaArr = this.formMenu.area.split('/')
          let params = {
            appAccountId: this.appAccountId,
            country: areaArr[0] || null,
            province: areaArr[1] || null,
            city: areaArr[2] || null,
            clientPlatformType: this.formMenu.clientPlatformType || null,
            language: this.formMenu.language || null,
            matchRuleName: this.formMenu.matchRuleName || null,
            sex: this.formMenu.sex || null,
            tagIds: this.tagIds || null
          }
          this.localStorageSaveOrRead('personalMenuItem', Object.assign(this.personalMenuItem, params))
          this.$emit('doneStep', 1)
        } else {
          switch (response.code) {
            case 6704:
              this.showConfirm = true
              break
            default:
              this.$Message.error(response.message)
              break
          }
        }
      }
    },
    cancel() {
      this.$router.push({ name: 'personalizedMenu' })
    }
  },
  components: {
    TagAction
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.tab-blank
  margin-top 15px
  height 20px
.tag-radio
  padding-bottom 30px
  &.tag-boder
    border-bottom solid 1px #e6e6e6
  .ivu-radio-wrapper
    margin-right 30px
.form-step
  margin-top 50px
  text-align center
  .ivu-form
    display inline-block
    width 346px
    text-align left
    .ivu-form-item
      .ivu-form-item-label
        line-height 40px
        height 40px
        padding 0
        text-align left
      .ivu-form-item-content
        position relative
        .nowrap
          .ivu-input
            no-wrap()
  .submit
    margin-top 150px
    padding 10px
    border-top solid 1px #e3e4e5
    text-align center
    .ivu-btn
      width 110px
      &:nth-of-type(1)
        margin-right 30px
  .common-modal
    .ivu-modal-mask
      background-color transparent
    .ivu-modal-content
      box-shadow 0px 1px 6px 0px rgba(0, 0, 0, 0.2)
      border solid 1px #cacbcc
</style>

