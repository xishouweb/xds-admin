<template>
  <div id="msgWrapper">
    <PublicNo :onSelect="changePublic"></PublicNo>
    <!-- <publicCut></publicCut> -->
    <div id="msgT" class="msgT">
      <div class="msgT-title">模板消息</div>
      <div class="msgTCont">
        <router-view v-if="curPublic.serviceTypeInfo === 2"></router-view>
        <NoValidService  v-else-if="curPublic.serviceTypeInfo === 1" :text="text2" class="template-error-tips"></NoValidService>
        <NoValidService v-else :text="text1"></NoValidService>
      </div>
    </div>
    <!-- 模板抽屉 -->
    <Drawer
      v-model="drawer"
      :titleTips="groupState === 'add' ? '新建分组' : '修改分组'"
      :isScroll="false"
      :showFooter="true"
      ref="Drawer"
      @close="drawer = false"
      width="530px"
    >
      <div class="contAction" slot="content">
        <Form ref="groupForm" :model="formValue" :rules="formValidate" :label-width="100">
          <FormItem prop="name" label="分组名称">
            <Input type="text" v-model="formValue.name" placeholder="请填写分组名称，不超过10个字"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <div class="footerAction">
          <Button type="primary" @click="saveGroup">保存</Button>
          <Button class="white" @click="drawer = false">取消</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { mapState } from "vuex"
import PublicNo from "../components/currPublicNo"
import NoValidService from "../../error/noValidService"
export default {
  name: "msgTemplete",
  components: {
    PublicNo,
    NoValidService
  },
  computed: {
    ...mapState({
      curPublic: state => state.publicAccount.curPublic
    })
  },
  data() {
    const validateGroupName = (rule, value, callback) => {
      value = value.replace(/\s*/g, "") // 过滤空格
      if (!value.length) {
        callback(new Error("请输入分组名称"))
      } else if (value.length > 10) {
        callback(new Error("不能超过10个字"))
      } else {
        callback()
      }
    }
    return {
      drawer: false,
      formValue: {
        name: ""
      },
      formValidate: {
        name: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          {
            validator: validateGroupName,
            trigger: "blur"
          }
        ]
      },
      groupState: "add",
      text1: [
        "当前企业暂无服务号，无法设置模板消息",
        "模板消息功能只支持服务号，您可前往“公众号管理”添加服务号再设置"
      ],
      text2: [
        "当前公众号为订阅号，无法设置模板消息",
        "模板消息功能只支持服务号，您可前往“公众号管理”添加服务号再设置"
      ]
    }
  },
  mounted() {
    this.$root.Bus.$on("add-group", num => {
      if (num >= 52) {
        this.$Message.error("最多可新建50个分组")
        return
      }
      this.drawer = true
      this.groupState = "add"
      this.formValue = { name: "" }
    })
    this.$root.Bus.$on("modity-group", group => {
      this.drawer = true
      this.groupState = "modity"
      this.formValue = group
    })
  },
  watch: {},
  methods: {
    async saveGroup() {
      const valid = await this.$refs["groupForm"].validate()
      if (valid) {
        const name = this.formValue.name.replace(/\s*/g, "") // 过滤空格后的值
        let params = {
          appAccountId: this.curPublic.appAccountId,
          type: "template",
          name: name
        }
        if (this.groupState !== "add") {
          params.groupId = this.formValue.groupId
        }
        const response = await this.post(this.Path.saveOrUpdateGroup, params)
        const { code, message } = response
        if (code === 1) {
          this.$Message.success("保存成功")
          // 更新分组
          this.drawer = false
          this.$root.Bus.$emit("updateGroup")
        } else {
          this.$Message.error(message)
        }
      }
    },
    changePublic() {
      this.$router.replace({ name: "messageTemplate" })
    }
  },
  destroyed() {
    this.$root.Bus.$off("add-group")
    this.$root.Bus.$off("modity-group")
  }
}
</script>
<style lang="stylus">
.msgT
  position relative
  padding 0 20px
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  &.disabled
    opacity 0.6
  &-title
    font-size 18px
    color #0c0c0d
    border-bottom solid 1px #e3e5e6
    padding 32px 0 19px
    font-weight bold
  &-action
    margin 31px 0
    display flex
    align-items center
    justify-content space-between
    .actionLeft
      display inline-block
      font-size 16px
      color #323333
    .actionRight
      .searchInput
        position relative
        margin-right 20px
        float left
        width 170px
        height 40px
        line-height 40px
        border-radius 3px
        border solid 1px #e3e4e5
        input
          position absolute
          left 10px
          top 0
          height 100%
          bottom 0
          right 20px
          width 132px
        >p
          position absolute
          right 0
          width: 56px
          i
            cursor pointer
            font-size 20px
            color #aaa
.contAction
  padding-top 50px
  .label
    color #303133
    text-align right
.footerAction
  .ivu-btn
    padding 0 46px
    border-radius 3px
    margin-right 20px
    height 40px
  .white
    background #fff
.template-error-tips
  height calc(100vh - 60px)
  padding-top 14% !important
</style>
