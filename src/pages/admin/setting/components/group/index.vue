<template>
  <div class="groupWrap">
    <!-- <ScrollBar> -->
    <BScroll>
      <div class="scroll-padding">
        <data-loading :data-satau='loading' @reload="reload">
          <div class="groupAction">
            <Button @click.stop="addGroup" type="ghost"><Icon type="plus"></Icon> 新建分组</Button>
          </div>
          <div class="groupList">
            <ul>
              <li class="group-item" @click.stop="getCurrentGroup(item, index)" v-for="(item, index) in groupList" :key="item.id" :class="{active: index === currentIndex}">
                <div class="group-name">{{item.groupName}}</div>
                <div class="group-count">({{item.counts|| 0}})</div>
                <div
                  class="action customClick"  ref="groupList"
                  @click.stop="operation($event, item, index)"
                  v-show="index !=0 && index !=1"
                >
                  <Icon class="action-btn" type="android-more-vertical"></Icon>
                </div>
              </li>
            </ul>
          </div>
        </data-loading>
      </div>
    </BScroll>
    <!-- </ScrollBar> -->
    <BulletBox :position="position" v-if="showBulletBox">
      <ul  class="actionWrap">
        <li
          class="actionWrap-item"
          v-for="(_item, _index) in Operations"
          :key="_index"
          @click.stop="groupAction(null, _item.type)"
        >{{_item.title}}</li>
      </ul>
    </BulletBox>
    <Modal title="删除提示" v-model="showModal" class-name="self-center-modal">
      <div>确认删除该分组吗</div>
      <div slot="footer">
        <Button type="primary" @click.stop="modalConfirm">确定</Button>
        <Button type="ghost" @click.stop="showModal = false">取消</Button>
      </div>
    </Modal>
    <!-- 模板抽屉 -->
    <Drawer
      v-model="drawer"
      titleTips="新建分组"
      :isScroll="false"
      :showFooter="true"
      ref="Drawer"
      @close="drawer = false"
      width="530px"
    >
      <div class="contAction" slot="content">
        <Form ref="group" :model="group" :rules="ruleInline" :label-width="99">
          <FormItem prop="groupName" label="分组名称">
            <Input v-model.trim="group.groupName" placeholder="请填写分组名称，不超过10个字"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <div class="footerAction">
          <Button type="primary" @click.stop="saveGroup('group')">保存</Button>
          <Button class="white" @click.stop="drawer = false">取消</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import BulletBox from "@/components/BulletBox.vue"
import _ from 'lodash'
export default {
  name: "settingGroup",
  components: { BulletBox },
  data() {
    return {
      showModal: false,
      drawer: false,
      loading: 1,
      group: {
        groupName: '',
      },
      ruleInline: {
        groupName: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '分组名称不能超过10个字', trigger: 'blur' }
        ]
      },
      companyId: this.localStorageSaveOrRead('currentCorp').applyId,
      Operations: [
        { title: "修改", type: "modify" },
        { title: "删除", type: "delete" },
        { title: "上移", type: "moveup" },
        { title: "下移", type: "movedown" }
      ],
      groupList: [

      ],
      currentIndex: 0,
      currentGroup: {},
      showBulletBox: false,
      position: { x: 0, y: 0 },
      eventCopy: null
    }
  },
  watch: {
    drawer(bool) {
      if (!bool) {
        this.$refs['group'].resetFields()
      }
    }
  },
  computed: {
  },
  created() {
    this.queryKnowledgeBaseGroupListInfo()
  },
  mounted() {
    document.addEventListener('click', e => {
      e.stopPropagation()
      this.showBulletBox = false
    })
  },
  methods: {
    // 重置分组列表
    refreshKnowledgeGroup() {
      this.currentIndex = 0
      this.queryKnowledgeBaseGroupListInfo()
    },
    // 知识库分组列表以及总条数
    queryKnowledgeBaseGroupListInfo(index2) {
      let params = {
        companyId: this.companyId
      }
      this.post(this.fylPath.queryKnowledgeBaseGroupListInfo, params).then(data => {
        if (data.code === 1) {
          this.loading = 2
          let groupData = data.data.sort(this.sortBy('groupSort', 'min'))
          groupData = groupData.sort(this.sortBy('groupType', 'max'))
          let copyData = _.cloneDeep(groupData)
          this.$emit('sendGroup', copyData)
          let total = this.groupTotal(groupData)
          groupData.unshift({counts: total, groupName: '全部', id: null})
          this.groupList = groupData
          if (index2) {
            // this.$root.Bus.$emit('aaa', index2)
            this.$nextTick(() => {
              // 用$refs dom 会出错 因为用了这段代码 copyData = copyData.sort(this.sortBy('groupSort'))
              // this.$refs.groupList[index2].onclick = (event) => {
              //   this.eventCopy = event
              // }
              // this.$refs.groupList[index2].click()
              // this.operation(this.eventCopy, this.groupList[index2], index2)
              let node = document.getElementsByClassName('customClick')[index2]
              this.operation(node, this.groupList[index2], index2)
            })
          }
        } else {
          this.loading = 3
          this.$Message.error(data.message)
        }
      })
    },
    // 更新或者保存知识库分组
    saveOrUpdateCorpKnowledgeBaseGroup(params) {
      this.post(this.fylPath.saveOrUpdateCorpKnowledgeBaseGroup, params).then(data => {
        this.drawer = false
        if (data.code === 1) {
          this.$Message.success('新建分组成功')
          this.queryKnowledgeBaseGroupListInfo()
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    async checkKnowledgeBaseGroup() {
      let companyId = this.localStorageSaveOrRead("currentCorp").applyId
      let params = {
        companyId
      }
      const res = await this.post(this.fylPath.checkKnowledgeBaseGroup, params)
      return res
    },
    // 删除知识库分组
    delCorpKnowledgeBaseGroup(params) {
      this.post(this.fylPath.delCorpKnowledgeBaseGroup, params).then(data => {
        if (data.code === 1) {
          this.$Message.success('删除成功！')
          this.queryKnowledgeBaseGroupListInfo()
          this.currentIndex = 0
          this.$emit("getTempsData", {groupName: '全部', id: null})
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 调整知识库分组排序
    changeCorpKnowledgeBaseGroupSort(params, index2) {
      this.post(this.fylPath.changeCorpKnowledgeBaseGroupSort, params).then(data => {
        if (data.code === 1) {
          this.$Message.success('移动分组成功！')
          this.queryKnowledgeBaseGroupListInfo(index2)
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    reload() {
      this.queryKnowledgeBaseGroupListInfo()
    },
    groupTotal(arr) {
      return arr.reduce((init, next) => {
        return init + next.counts
      }, 0)
    },
    async addGroup() {
      const res = await this.checkKnowledgeBaseGroup()
      const {code, message} = res
      if (code === 1) {
        this.operateType = 'add'
        this.group.groupName = ''
        this.drawer = true
      } else if (code === 3591) {
        this.$Message.error('最多创建50个分组')
      } else {
        this.$Message.error(message)
      }
    },
    async saveGroup(name) {
      let index = this.groupList.findIndex(item => {
        return item.groupName === this.group.groupName
      })
      if (index >= 0) {
        this.$Message.warning('分组不能重名')
        return
      }
      const valid = await this.$refs[name].validate()
      if (valid) {
        let params = {
          id: this.operateType === 'add' ? null : this.currentGroup.id,
          companyId: this.companyId,
          groupName: this.group.groupName
        }
        this.saveOrUpdateCorpKnowledgeBaseGroup(params)
      }
    },
    getCurrentGroup(item, index) {
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = false
      this.$emit("getTempsData", item)
    },
    operation(_event, item, index) {
      // 选中
      this.currentIndex = index
      this.currentGroup = item
      this.showBulletBox = true
      this.$emit("getTempsData", item)
      // 交互操作
      let clientRect = _event.target ? _event.target.getBoundingClientRect() : _event.getBoundingClientRect()
      let position = {
        x: Math.round(clientRect.left),
        y: Math.round(clientRect.top),
        w: Math.round(clientRect.width),
        h: Math.round(clientRect.height)
      }
      this.position = {
        x: position.x + position.w + 10,
        y: position.y - 15
      }
    },
    groupAction(e, type) {
      this.showBulletBox = false
      if (type === "modify") {
        // 修改
        this.group.groupName = this.currentGroup.groupName
        this.operateType = 'modify'
        this.drawer = true
      } else if (type === "delete") {
        // 删除
        this.showModal = true
      } else if (type === "moveup") {
        // 上移
        this.zIndexUp(this.groupList, this.currentIndex, 2)
      } else {
        // 下移
        this.zIndexDown(
          this.groupList,
          this.currentIndex,
          this.groupList.length
        )
      }
    },
    modalConfirm() {
      // this.currentGroup.groupName === '未分组' || this.currentGroup.groupName === '全部' ||
      if (!this.currentGroup.groupName) {
        this.$Message.warning('该分组不可删除')
        return
      }
      let params = {
        id: this.currentGroup.id,
        companyId: this.companyId
      }
      this.delCorpKnowledgeBaseGroup(params)
      this.showModal = false
    },
    swapArray(arr, index1, index2) {
      let params = {
        companyId: this.companyId,
        upGroupId: arr[index1].id,
        downGroupId: arr[index2].id,
      }
      this.changeCorpKnowledgeBaseGroupSort(params, index2)
    },
    zIndexUp(arr, index, length) {
      if (index !== length) {
        this.swapArray(arr, index, index - 1)
      } else {
        this.$Message.error("此分组无法上移!")
      }
    },
    zIndexDown(arr, index, length) {
      if (index !== length - 1) {
        this.swapArray(arr, index, index + 1)
      } else {
        this.$Message.error("此分组无法下移!")
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
.self-center-modal.ivu-modal-wrap{
  top:50%;
  transform: translateY(-50%)
}
.groupWrap
  width 205px
  height 100%
  font-size 14px
  color #303133
  .scroll-padding
    padding-right 15px
  .groupAction
    margin-bottom 20px
    button
      width 100%
  .groupList
    .group-item
      position relative
      display flex
      height 40px
      line-height 40px
      padding-left 15px
      cursor pointer
      &:hover
        background rgba(0, 0, 0, 0.2)
        .action
          visibility visible
      &.active
        background-color #409eff
        color #fff
        .action
          visibility visible
      .group-name
        max-width 130px
        no-wrap()
      .action
        position absolute
        right 0
        top 0
        text-align center
        font-size 24px
        cursor pointer
        visibility hidden
        .action-btn
          width 26px
          height 40px
.contAction
  padding-top 50px
  .label
    color #303133
  .error
    margin-top 10px
    color #ff3300
    font-size 12px
.footerAction
  .ivu-btn
    padding 0 46px
    border-radius 3px
    margin-right 20px
    height 40px
  .white
    background #fff
</style>
