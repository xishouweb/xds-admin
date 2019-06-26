<template>
  <div class="miniprogram">
    <div class="tips">粉丝点击该子菜单会跳到以下小程序</div>
    <div class="miniprogram-form">
      <Form ref="miniprogram" :model="messageContent.miniprogram" :rules="ruleValidate" :label-width="130">
        <FormItem label="小程序appId" prop="appid">
          <Input style="width:360px;" v-model.trim="messageContent.miniprogram.appid"></Input>
        </FormItem>
        <FormItem label="小程序页面路径" prop="pagepath">
          <Input style="width:360px;" v-model.trim="messageContent.miniprogram.pagepath"></Input>
        </FormItem>
        <FormItem label="备用网页url" prop="url">
          <Input style="width:360px;" v-model.trim="messageContent.miniprogram.url"></Input>
          <span class="url-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页，不超过1024字节。</span>
        </FormItem>
      </Form>
    </div>

  </div>
</template>

<script>
import {strLen} from '@/utils/util'
export default {
  name: 'miniprogram',
  components: {},
  props: {
    messageContent: {
      default: () => {},
      type: Object
    }
  },
  data() {
    const validateUrl = (rule, value, callback) => {
      let urlLength = strLen(value)
      if (urlLength > 1024) {
        callback(new Error('url不能超过1024字节'))
      } else {
        callback()
      }
    }
    return {
      ruleValidate: {
        appid: [{
          required: true, message: '请输入正确的小程序appid', trigger: 'blur'
        }],
        pagepath: [{
          required: true, message: '请输入正确的小程序页面路径', trigger: 'blur'
        }],
        url: [
          {
            required: true, message: '请输入正确的小程序备用网页url', trigger: 'blur'
          },
          {
            validator: validateUrl, trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'messageContent.miniprogram': {
      handler(val) {
        if (this.messageContent.key === 'miniprogram') {
          this.$root.Bus.$emit('messageChange', val, 'miniprogram', 'miniprogram')
        }
      },
      deep: true
    },
    messageContent: {
      handler(val, oldval) {
        if ((oldval && val.uuid !== oldval.uuid) || !oldval) {
          setTimeout(async () => {
            // await this.$refs.miniprogram.validate()
          }, 100)
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  created() {},
  mounted() {

  },
  methods: {
    async handlerMiniprogram() {
      console.log(111)
      let valid = await this.$refs.miniprogram.validate()
      return valid
    }
  }
}
</script>
<style lang="stylus">
.miniprogram
  border solid 1px #e3e4e5
  padding-left 24px
  padding-bottom 25px
  .tips
    color #979899
    margin-top 29px
    margin-bottom 20px
  .miniprogram-form
    .url-tips
      font-size 12px
      color #979899
      margin-left 5px
      padding-right 20px
    .ivu-form
      .ivu-form-item
        .ivu-form-item-error-tip
          font-size 12px
        .ivu-form-item-label
          text-align left
          padding-left 10px
          position relative
          &:before
            position absolute
            left 0
            top 10px
</style>
