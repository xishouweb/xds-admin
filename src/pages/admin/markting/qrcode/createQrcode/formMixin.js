import { saveQrCode } from '@/api/markting'

export default {
  data() {
    let self = this
    const validateEmployee = (rule, value, callback) => {
      if (
        this.formValidate.qrCodeCreateType === 'EMPLOYEE_ID_LIST' &&
        !value.length
      ) {
        callback(new Error('请选中员工'))
      } else {
        callback()
      }
    }
    const validateService = (rule, value, callback) => {
      if (
        this.formValidate.customerServiceType === 'SEAT_OR_DEPT_SPECIFIED' &&
        !value.length
      ) {
        callback(new Error('请选中客服/部门'))
      } else {
        callback()
      }
    }
    const validateTag = (rule, value, callback) => {
      if (this.autoTags && !value.length) {
        callback(new Error('请选择标签'))
      } else {
        callback()
      }
    }
    const qrCodeReplyList = (rule, value, callback) => {
      if (this.formValidate.isReply && !value.length) {
        callback(new Error('请选择自动回复内容'))
      } else {
        callback()
      }
    }
    const createNum = (rule, value, callback) => {
      let int = parseInt(value) || 0
      if (!int) {
        callback(new Error('请输入批量生成数量'))
      } else if (int > 20) {
        callback(new Error('最多不能超过20个'))
      } else {
        callback()
      }
    }
    return {
      maxValidityPeriod: 2592000 * 1000, // 单位 ms
      autoTags: false,
      formValidate: {
        qrCodeName: '',
        qrCodeType: 'QR_LIMIT_STR_SCENE',
        qrCodeEffectiveDate: 2592000, // 临时二维码有效秒数,最大2592000
        qrCodeCreateType: 'NUM',
        createNum: 1,
        employeeIdList: [],
        customerServiceType: 'SEAT_OR_DEPT_SPECIFIED', // SEAT_OR_DEPT_SPECIFIED：指定客服 + 指定部门 UMLIMITED：不限 UNSPECIFIED：不指定
        customerServiceIdList: [], // 客服和部门集合
        customerServiceDeptIdList: [],
        customerServiceSeatIdList: [],
        tagIdList: [],
        isReply: false, // 0, 1
        qrCodeReplyList: []
      },
      ruleValidate: {
        qrCodeName: [
          { required: true, message: '请输入二维码名称', trigger: 'blur' },
          {
            required: true,
            max: 20,
            message: '不能超过20个字',
            trigger: 'blur'
          }
        ],
        createNum: [
          {
            trigger: 'blur',
            validator: createNum
          }
        ],
        employeeIdList: [
          {
            validator: validateEmployee,
            trigger: 'change'
          }
        ],
        customerServiceIdList: [
          {
            validator: validateService,
            trigger: 'change'
          }
        ],
        tagIdList: [
          {
            validator: validateTag,
          }
        ],
        qrCodeReplyList: [
          {
            validator: qrCodeReplyList,
            trigger: 'blur'
          }
        ]
      },
      options: {
        disabledDate: function(date) {
          const time = new Date(date).getTime()
          const now = Date.now()
          return !(time - now <= self.maxValidityPeriod && time - now >= 0)
        }
      }
    }
  },
  created() {},
  methods: {
    // 获取临时二维码过期时间
    getSecond(date) {
      let s = parseInt((new Date(date).getTime() - Date.now()) / 1000)
      if (s > this.maxValidityPeriod) {
        s = this.maxValidityPeriod / 1000
      }
      this.formValidate.qrCodeEffectiveDate = s
    },
    // 获取回复组件内部的数据
    getReplay() {
      this.formValidate.isReply &&
        (this.formValidate.qrCodeReplyList = this.$refs['replay'].save())
    },
    // 提交保存
    async saveFrom(params) {
      let res = await saveQrCode(params)
      if (res.code === 1) {
        this.clearCurrentQrCode()
        this.visible = true
      } else {
        this.$Message.error('保存失败!')
      }
    },
    // 提交修改保存
    async saveModifyFrom(params) {
      let res = await this.updateGchannelQrCode({
        ...params,
        id: this.qrCodeId
      })
      if (res.code === 1) {
        this.clearCurrentQrCode()
        this.$Message.success('修改成功!')
        this.$router.push({
          name: 'qrcodeList',
          params: { id: this.qrCodeThemeId }
        })
      } else {
        if (res.message) {
          this.$Message.error(res.message)
        } else {
          this.$Message.error('修改失败!')
        }
      }
    },
    // 格式化选中的数据
    formatSubmitData() {
      let params = {
        appAccountId: this.currPublic.appAccountId,
        qrCodeThemeId: this.qrCodeThemeId,
        ...this.formValidate
      }
      // 移除不需要的初始化字段
      params.isReply = params.isReply ? 1 : 0
      // 类型
      if (params.qrCodeType !== 'QR_STR_SCENE') {
        delete params.qrCodeEffectiveDate
      }
      // 处理生成方式
      if (params.qrCodeCreateType !== 'EMPLOYEE_ID_LIST') {
        delete params.employeeIdList
      } else {
        delete params.createNum
      }
      // 处理接待客服
      if (params.customerServiceType !== 'SEAT_OR_DEPT_SPECIFIED') {
        delete params.customerServiceDeptIdList
        delete params.customerServiceIdList
        delete params.customerServiceSeatIdList
      } else {
        delete params.customerServiceIdList
        if (!params.customerServiceDeptIdList.length) {
          delete params.customerServiceDeptIdList
        }
        if (!params.customerServiceSeatIdList.length) {
          delete params.customerServiceSeatIdList
        }
      }
      // 处理标签
      if (!this.autoTags) {
        delete params.tagIdList
      }
      // 处理自动回复
      if (!params.isReply) {
        delete params.qrCodeReplyList
      }
      // 处理修改编辑，删除不必要的字段
      if (this.pageType) {
        delete params.qrCodeType
        delete params.qrCodeEffectiveDate
        delete params.qrCodeCreateType
        delete params.createNum
        delete params.employeeIdList
        delete params.qrCodeThemeId
        delete params.isReply
      }

      !this.autoTags && (params.tagIdList = [])
      return params
    },
    handleSubmit(name) {
      this.getReplay()
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = this.formatSubmitData()
          if (this.$route.meta.leaveIntercept !== undefined) {
            this.$route.meta.leaveIntercept = false
          }
          if (this.pageType) {
            this.saveModifyFrom(params)
          } else {
            this.saveFrom(params)
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
      this.clearCurrentQrCode()
      this.$router.back()
    }
  }
}
