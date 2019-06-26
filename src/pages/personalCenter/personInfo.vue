<template>
  <div id="personInfo">
    <div class="title">个人信息</div>
    <div class="form">
      <Form v-if="userInfo" label-position="left" ref="formPersonInfo" :model="formPersonInfo" :rules="ruleValidate"  :label-width="80">
        <FormItem label="微信头像">
            <div class="user-header">
              <img class="img" :src="userInfo.picUrl" alt="">
            </div>
        </FormItem>
        <FormItem label="微信昵称">
            <div>{{userInfo.nickName}}</div>
        </FormItem>
        <FormItem label="手机号码" v-for="(item, index) in userInfo.corpList" :key="index">
            <div>
              <p class="editPhone">
                {{item.eeMobile}}
                <Icon class="handle" size="16" title="修改" @click="phoneEdit(item.eeMobile, item.corpId)" type="edit"></Icon>
              </p>
              <p class="company-item">
                {{item.companyName}}
              </p>
            </div>
        </FormItem>
        <FormItem label="QQ" prop="qq">
            <Input v-model="formPersonInfo.qq" clearable placeholder="请填写您的QQ">
            </Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
            <Input v-model="formPersonInfo.email" clearable placeholder="请填写您的邮箱">
            </Input>
        </FormItem>
        <FormItem class="end">
          <div class="go-on">
            <Button class="left" type="primary" @click="handleSubmit('formPersonInfo')">保存</Button>
            <Button class="right" @click="cancel">返回</Button>
          </div>
        </FormItem>
      </Form>
      <Spin fix v-show="loadingImg">
        <Icon type="load-c" size=40 class="spin-icon-load"></Icon>
        <div>loading</div>
      </Spin>
    </div>
  </div>
</template>

<script>
import { editUser, getPersonalInfo } from '@/api/query'
export default {
  data() {
    return {
      formPersonInfo: {
        qq: '',
        email: ''
      },
      ruleValidate: {
        email: [
          { type: 'email', message: '请输入正确的邮箱号', trigger: 'blur' }
        ]
      },
      userInfo: {},
      token: this.getToken(),
      loadingImg: true
    }
  },
  mounted() {
    this.getPersonalInfo()
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.editUser()
        } else {
        }
      })
    },
    fileBoob() {

    },
    getPersonalInfo() {
      getPersonalInfo().then(data => {
        if (data.code === 1) {
          this.loadingImg = false
          this.userInfo = data.data
          this.formPersonInfo.qq = this.userInfo.qq
          this.formPersonInfo.email = this.userInfo.email
        }
      })
    },
    editUser() {
      let params = {
        userId: this.token.userId,
        qq: this.formPersonInfo.qq,
        email: this.formPersonInfo.email
      }
      editUser(params).then(data => {
        if (data.code === 1) {
          this.$router.push({ name: 'company' })
          this.$Message.success('恭喜你，保存成功！')
        }
      })
    },
    phoneEdit(mobile, applyId) {
      this.$router.push({
        name: 'editPhone',
        params: {
          oldMobile: mobile,
          applyId: applyId
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'company' })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/mixin'
#personInfo
  padding 42px 43px 20px 43px
  .title
    font-size 20px
  .form
    position relative
    min-height 350px
    width 400px
    margin 75px auto
    .user-header
      .img
        width 36px
        border-radius 50%
    .editPhone
      position relative
      .handle
        display none
        position absolute
        color #409eff
        right 10px
        top 8px
        cursor pointer
      &:hover
        .handle
          display inline-block
    .company-item
      no-wrap()
    .end
      .ivu-form-item-content
        margin-left 0 !important
        .go-on
          .ivu-btn
            height 40px
            width 140px
          .left
            float left
          .right
            float right
</style>


