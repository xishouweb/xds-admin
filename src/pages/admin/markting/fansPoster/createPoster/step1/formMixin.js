import {
  formatDateTime
} from '@/utils/util'

export default {
  data() {
    return {
      maxValidityPeriod: 2592000 * 1000, // 单位 ms
      validityPeriodType: 0, // 临时二维码有效类型，0: 有效天数, 1: 到期时间
      autoTags: false, // 是否自动打标签
      formValidate: {
        posterTemplateName: "",
        groupId: "", // long
        activityNeedFollowers: 0, // 活动所需关注人数
        activityValidityPeriod: '', // 活动有效期
        fansPosterValidityTime: "30", // 裂变海报有效秒数
        qrCodeSize: 140,	// 二维码尺寸	是	[long]
        fanAvatarIsShow: "SHOW", //	粉丝头像是否显示，NOT_SHOW不显示SHOW显示
        fanAvatarType: "FILLET", //	FILLET 圆角，ROUND圆形，显示头像必传	是	[string]
        fanAvatarSize: 88, //	粉丝头像尺寸,显示头像必传	是	[int]
        fanNickNameIsShow: "SHOW", //	粉丝昵称是否显示，NOT_SHOW不显示SHOW显示	是	[string]
        fanNickNameFontSize: 28 ,//	粉丝昵称字体大小，显示粉丝昵称必传	是	int
        fanNickNameColor: "#606366", //	RGB颜色参数，显示粉丝昵称必传	是	[string]
        receiveTagType: "NOT_AUTO",//	领取裂变海报是否自动打标签 NOT_AUTO:不打标签 AUTO：打标签	是	[string]
        receiveTagIds: [], //	领取裂变海报自动打标签列表，自动打标签必传	是	[array]
        activeTagType: "NOT_AUTO", //	完成活动任务的粉丝是否自动打标签 NOT_AUTO:不打标签 AUTO：打标签	是	[string]
        activeTagIds: [], //	完成活动任务的粉丝自动打标签列表，完成活动自动打标签必传	是	[array]
        fanNickNamePositionX: 156, //	粉丝昵称定位x，显示粉丝昵称必传	是	[int]
        fanNickNamePositionY: 106, //	粉丝昵称定位y，显示粉丝昵称必传	是	[int]
        fanAvatarPositionX: 60, //	粉丝头像定位x，显示粉丝头像必传	是	[int]
        fanAvatarPositionY: 80, // 粉丝头像定位y，显示粉丝头像必传	是	[int]
        fanPosterQrCodePositionX: 264,//	裂变海报二维码定位x	是	[int]
        fanPosterQrCodePositionY:	928, // 裂变海报二维码定位y	是	[int]
        isReply: "REPLAY", //	自动回复 NO_REPLAY:不回复 REPLAY:回复	是	[string]
        fansPosterTemplateReplyDtoList: [],	// 回复内容,最多5条	是	[string]
      },
      ruleValidate: {
        posterTemplateName: [
            { required: true, message: '请输入海报模板名称', trigger: 'blur' },
            { required: true, max: 20, message: '不能超过20个字', trigger: 'blur' },
        ],
        activityValidityPeriod: [
          { required: true, type: 'date', message: '请设置活动有效期', trigger: 'blur' },
        ],
        fansPosterValidityTime: [
          { required: true, min: 0, max: 730, message: '海报有效期默认为30天', trigger: 'blur' },
        ]
      },
      options: {
        disabledDate: function(date) {
          // 不超过30天
          const time = new Date(date).getTime()
          const now = Date.now()
          return !(time - now >= 0)
          // return !(time - now <= self.maxValidityPeriod && time - now >= 0)
        }
      }
    }
  },
  methods: {
    // 获取临裂变海报有效期 s
    getSecond(date) {
      return parseFloat(date) * 24 * 60 * 60
    },
    // 获取回复组件内部的数据
    getReplay() {
      this.formValidate.isReply && (this.formValidate.fansPosterTemplateReplyDtoList = this.$refs['replay'].save('save'))
    },
    // 提交保存
    saveForm() {
      this.formValidate.fansPosterValidityTime = this.getSecond(this.formValidate.fansPosterValidityTime)
      this.formValidate.activityNeedFollowers = parseInt(this.formValidate.activityNeedFollowers)
      this.formValidate.activityValidityPeriod = formatDateTime(this.formValidate.activityValidityPeriod)
      this.$emit('changeStep', this.backgroudImgFile, this.formValidate)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.getReplay()
            if (this.formValidate.activeTagType === 'AUTO' && !this.formValidate.activeTagIds.length) {
              this.$Message.error('请选择完成任务打标签 ')
            } else if (this.formValidate.receiveTagType === 'AUTO' && !this.formValidate.receiveTagIds.length) {
              this.$Message.error('请选择领取海报打标签 ')
            } else if (this.formValidate.isReply === 'REPLAY' && !this.formValidate.fansPosterTemplateReplyDtoList.length) {
              this.$Message.error('请选择回复内容')
            } else {
              this.saveForm()
            }
          }
      })
    },
    handleReset (name) {
        this.$refs[name].resetFields()
        this.$router.back()
    }
  }
}
