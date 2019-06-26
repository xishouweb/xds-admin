<template>
  <Modal v-model="visible" class="modalGroup" width="600" @on-cancel="close">
    <div slot="header" class="modal-title">
      <span>修改所属分组</span>
    </div>
    <div class="modal-content">
      <div class="group-container">
        <ScrollBar>
          <div class="group-inner">
            <div class="group-label">选择所属分组</div>
            <div class="group-wrap">
              <div class="group-list">
                <div
                  class="group-item"
                  :class="{'group-item-checked': selectedGroup.fsGroupId === item.fsGroupId }"
                  v-for="(item,index ) in formatFansGroups"
                  v-if="index > 0"
                  :key="item.fsGroupId"
                  @click="selectGroup(item)"
                >
                  <span v-if="item.fsGroupName !=='未分组'">{{item.fsGroupName}}</span>
                  <span v-else :style="{marginRight: '10px'}">{{item.fsGroupName}}</span>
                  <Poptip
                    v-model="item.showPop"
                    placement="bottom"
                    width="75"
                    v-if="item.fsGroupName !=='未分组'"
                  >
                    <i class="icon">&#xe63e;</i>
                    <div slot="content" class="group-item-action" @click.stop="closePoptip(index)">
                      <ul>
                        <li @click="createNewGroup(item.fsGroupId, item.fsGroupName)">修改</li>
                        <li @click="deleteGroup(item.fsGroupId)">删除</li>
                      </ul>
                    </div>
                  </Poptip>
                </div>
              </div>
              <div class="group-action">
                <p
                  class="group-tip"
                  v-if="formatFansGroups.length >= 51"
                >当前分组已满50个，不能就绪新增，请适当删减或编辑已有分组</p>
                <p class="group-new" v-else @click.stop="createNewGroup('', '')">新建分组</p>
              </div>
            </div>
          </div>
        </ScrollBar>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <div class="modalFooter">
        <div class="modal-footer-left">
          当前所选分组：
          <span class="selectedNum">{{selectedGroup.fsGroupName || '无'}}</span>
        </div>
        <div class="modal-footer-right">
          <Button type="primary" @click="groupOk">确定</Button>
          <Button @click="close">取消</Button>
        </div>
      </div>
    </div>
    <!-- 新增分组 -->
    <Modal
      v-model="groupProp.visible"
      :title="groupProp.title"
      class="createGroup"
      width="300"
      @on-cancel="closeCreate"
    >
      <Form ref="groupForm" :model="groupProp.form" :rules="groupProp.rule" @keydown.native.enter.prevent="addGroupOk">
        <FormItem prop="name">
          <Input type="text" v-model="groupProp.form.name" placeholder="请输入组名, 不超过10个字"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="modal-footer">
        <Button type="primary" @click="addGroupOk">保存</Button>
        <Button @click="closeCreate">取消</Button>
      </div>
    </Modal>
    <!-- 删除分组 -->
    <Modal
      v-model="deleteVisible"
      title="删除分组"
      class="createGroup"
      width="300"
      @on-cancel="closeDelete"
    >
      <div class="deleteWrapper">
        删除分组后，该分组下的粉丝将没有所属分组，确定删除分
        组吗？
      </div>
      <div slot="footer" class="modal-footer">
        <Button type="primary" @click="deleteOk">确定</Button>
        <Button @click="closeDelete">取消</Button>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  name: "fansGroupList",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const validateGroupName = (rule, value, callback) => {
      value = value.replace(/\s*/g, "") // 过滤空格
      if (!value.length) {
        callback(new Error("请填写分组名称"))
      } else if (value.length > 10) {
        callback(new Error("分组名称不超过10个字"))
      } else {
        callback()
      }
    }
    return {
      visible: this.value,
      deleteVisible: false,
      selectedGroup: {},
      focusGroupId: "",
      groupProp: {
        visible: false,
        rule: {
          name: [
            { required: true, message: "请填写分组名称", trigger: "blur" },
            {
              validator: validateGroupName,
              trigger: "blur"
            }
          ]
        },
        form: {
          name: ""
        },
        title: "新建分组",
        status: "add"
      }
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      e.stopPropagation()
      this.closePoptip()
    })
  },
  computed: {
    ...mapGetters("fans", ["formatFansGroups"])
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit("input", val)
    },
    params: {
      handler(val) {
        if (val && val.type === "single") {
          const { kfFansGroupId, kfFansGroupName } = val.fans[0]
          this.selectedGroup = {
            fsGroupId: kfFansGroupId,
            fsGroupName: kfFansGroupName
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("fans", [
      "getGroupList",
      "saveGroup",
      "updateWxGroup",
      "deleteWxGroup",
      "updateWxGroupByMoveSingle"
    ]),
    createNewGroup(id, name) {
      this.$set(this.groupProp, "form", { name: name, id })
      if (id) {
        this.groupProp = {
          ...this.groupProp,
          visible: true,
          title: "编辑分组",
          status: "edit"
        }
      } else {
        this.groupProp = {
          ...this.groupProp,
          visible: true,
          title: "新建分组",
          status: "add"
        }
      }
    },
    deleteGroup(id) {
      this.focusGroupId = id
      this.deleteVisible = true
    },
    async deleteOk() {
      const res = await this.deleteWxGroup({ id: this.focusGroupId })
      if (res.code === 1) {
        this.selectedGroup = {}
        this.deleteVisible = false
        this.$Message.success("分组删除成功")
        this.getGroupList()
      } else {
        this.$Message.error(res.message)
      }
    },
    selectGroup(item) {
      this.selectedGroup = item
    },
    async addGroupOk() {
      const valid = await this.$refs["groupForm"].validate()
      if (!valid) return
      const name = this.groupProp.form.name.replace(/\s*/g, "") // 过滤空格后的值
      if (!this.groupProp.form.id) {
        const res = await this.saveGroup({ name })
        if (res.code === 1) {
          this.$Message.success("分组保存成功")
          this.getGroupList()
          this.$set(this.groupProp, "visible", false)
          this.$set(this.groupProp, "form", { name: "" })
        } else {
          this.$Message.error("分组保存失败")
        }
      } else {
        // 修改
        const res = await this.updateWxGroup({
          name,
          id: this.groupProp.form.id
        })
        if (res.code === 1) {
          this.$Message.success("分组修改成功")
          this.getGroupList()
          this.$set(this.groupProp, "visible", false)
          this.$set(this.groupProp, "form", { name: "" })
        } else {
          this.$Message.success("分组修改失败")
        }
      }
    },
    async groupOk() {
      if (!this.selectedGroup.fsGroupId) {
        this.$Message.error("请选择分组")
      }
      const params = {}
      params.fansIds = this.params.fans.map(item => ({
        fansId: item.fansId,
        appAccountId: this.params.appAccountIds
      }))
      params.targetId = this.selectedGroup.fsGroupId
      const res = await this.updateWxGroupByMoveSingle(params)
      if (res.code === 1) {
        this.visible = false
        this.$root.Bus.$emit("updateCurFans")
        this.$root.Bus.$emit("freshfans")
        this.$Message.success("设置成功")
      } else {
        this.$Message.error("设置失败")
      }
    },
    close() {
      this.visible = false
    },
    closeCreate() {
      this.$set(this.groupProp, "visible", false)
      this.$set(this.groupProp, "form", { name: "" })
    },
    closeDelete() {
      this.deleteVisible = false
    },
    closePoptip(dex) {
      // 关闭气泡提示
      this.closePop(this.formatFansGroups, "showPop", dex)
    }
  }
}
</script>

<style lang="stylus">
.modalGroup
  // 模态
  position relative
  z-index 90
  // .ivu-modal-mask
  // display none
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      top 0
      margin 0 !important // 处理对话框在IE上不居中问题
      .ivu-modal-header
        border-bottom none
  // popTip交互
  .ivu-poptip
    .ivu-poptip-popper
      min-width auto
    .ivu-poptip-body
      padding 0
      .group-item-action
        color #303133
        padding 10px 0
        li
          line-height 30px
          text-align center
          &:hover
            background #409eff
            color #fff
  // 业务
  .group-container
    height 340px
    .group-inner
      padding-top 40px
      display flex
      .group-label
        margin-right 16px
        padding-top 8px
        color #303133
      .group-wrap
        flex 1
        .group-item
          position relative
          display inline-block
          border solid 1px #cacbcc
          border-radius 3px
          padding 0 10px 0 20px
          margin 0 15px 15px 0
          height 36px
          line-height 36px
          color #606366
          background #fff
          .icon
            display inline-block
            cursor pointer
            transform rotate(90deg)
          &:hover
            border solid 1px #409eff
            color #409eff
          &-checked
            border solid 1px #409eff
            color #409eff
      .group-action
        margin-top 10px
        .group-new
          display inline-block
          cursor pointer
          color #409fff
        .group-tip
          margin-top 8px
          color #fe3b30
  // 底部交互
  .modalFooter
    display flex
    align-items center
    justify-content space-between
    .modal-footer-left
      color #979899
      .selectedNum
        color #409fff
// 创建
.createGroup
  // 模态
  position relative
  z-index 100
  .ivu-modal-mask
    display none
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      margin 0 !important // 处理对话框在IE上不居中问题
      box-shadow 0px 1px 6px 0px rgba(0, 0, 0, 0.2)
      border-radius 3px
      border solid 1px #cacbcc
      top 0
      .ivu-modal-header
        border-bottom none
</style>
