<template>
  <div class="second-step" @click.stop>
    <Form ref="formBusiness" :model="formBusiness" :rules="ruleValidate"  :label-width="80">
      <FormItem label="企业名称" prop="name" :error="cropName">
          <Input v-model="formBusiness.name" clearable placeholder="请填写企业全称">
          </Input>
      </FormItem>
      <FormItem label="联系人" prop="linkman">
        <Input v-model="formBusiness.linkman" clearable placeholder="请填写联系人姓名"></Input>
      </FormItem>
      <FormItem required label="所在地区" prop="area">
        <Input v-model="formBusiness.area" clearable readonly @on-focus.stop="showCascader" placeholder="请选择省/市/区" icon="chevron-down"></Input>
        <cascader :showCascaderModal="showCascaderModal" @areaSelect="areaSelect" @parentCadcader="parentCadcader"></cascader>
        <!-- <Cascader :transfer="true" :data="provinceData" :load-data="loadData" v-model="formBusiness.area"></Cascader> -->
      </FormItem>
      <FormItem :label-width="0.1">
        <div v-show="type=='new'">
          <Button type="primary" :loading="repeatClick" @click="handleSubmit('formBusiness')">
            <span v-if="!repeatClick">完成</span>
            <span v-if="repeatClick">公司初始化中...</span>
          </Button>
        </div>
        <div class="go-on" v-show="type=='go-on'">
          <Button class="left" type="primary" @click="handleSubmit('formBusiness')">保存</Button>
          <Button class="right" @click="cancel">返回</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {
  saveCorpCreateApply,
  getPersonalInfo,
  saveloginCompany
} from '@/api/query'
import { uuid } from '@/utils/util'
import Cascader from '@/components/Cascader'
import { setTimeout, clearTimeout } from 'timers'
export default {
  props: {
    type: {
      default: 'new',
      type: String
    }
  },
  data() {
    const validateArea = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择所在地区'))
      } else {
        callback()
      }
    }
    const validTrim = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('填写内容不能为空！'))
      } else {
        callback()
      }
    }
    return {
      formBusiness: {
        name: '',
        linkman: '',
        area: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请填写企业名称！',
            trigger: 'blur'
          },
          {
            validator: validTrim,
            trigger: 'blur'
          },
          {
            max: 100,
            message: '企业名称长度不能大于100！'
          }
        ],
        linkman: [
          {
            required: true,
            message: '请填写联系人姓名！',
            trigger: 'blur'
          },
          {
            validator: validTrim,
            trigger: 'blur'
          },
          {
            max: 100,
            message: '联系人姓名长度不能大于100！'
          }
        ],
        area: [
          {
            validator: validateArea,
            trigger: 'change'
          }
        ]
      },
      token: this.getToken(),
      cropName: '',
      showCascaderModal: false,
      repeatClick: false,
      doneTimer: null
    }
  },
  mounted() {
    // this.getDefaultInfo()
  },
  methods: {
    // 进入公司信息
    saveloginCompany(param, name) {
      let obj = {
        corpId: param
      }
      saveloginCompany(obj).then(data => {
        this.repeatClick = false
        if (data.code === 1) {
          if (!data.data.menuTree) {
            this.$Message.error('非常抱歉，您暂无权限，不能进入管理')
            return
          }
          this.$router.push({ name: name })
        } else {
          this.$Message.error(data.message)
          this.localStorageRemove('currentCorp')
        }
      })
    },
    getPersonalInfo() {
      getPersonalInfo().then(data => {
        if (data.code === 1) {
          let tokenData = {}
          tokenData.corpList = (data.data.corpList && data.data.corpList.length) || 0
          tokenData = Object.assign({}, this.token, tokenData)
          this.setToken(tokenData, 0.5)
          if (data.data.corpList.length === 1) {
            if (data.data.corpList[0].corpStatus !== 'ACTIVE') {
              this.$router.push({ name: 'company' })
            } else {
              let currentCorp = {
                applyId: data.data.corpList[0].corpId,
                corpName: data.data.corpList[0].companyName
              }
              this.localStorageSaveOrRead('currentCorp', currentCorp)
              clearTimeout(this.doneTimer)
              this.doneTimer = setTimeout(() => {
                this.saveloginCompany(data.data.corpList[0].corpId, 'survey')
              }, 3000)
            }
          } else {
            this.$router.push({ name: 'company' })
          }
        } else {
          this.repeatClick = false
        }
      })
    },
    handleSubmit(name) {
      this.cropName = ''
      this.$refs[name].validate(valid => {
        if (valid) {
          let areaArr = this.formBusiness.area.split('/')
          if (areaArr.length === 1) {
            this.$Message.error('您还没有选择市')
            return
          } else if (areaArr.length === 2) {
            this.$Message.error('您还没有选择区')
            return
          }
          let params = {
            userId: this.token.userId,
            regNo: uuid(),
            corpName: this.formBusiness.name.trim(),
            contactName: this.formBusiness.linkman.trim(),
            telephone: this.token.bindMobile,
            province: areaArr[0] || '',
            city: areaArr[1] || '',
            area: areaArr[2] || ''
          }
          // this.saveCorpCreateApply(params)
          if (this.type === 'new') {
            this.saveCorpCreateApply(params)
          } else {
            let obj = {
              regNo: uuid(),
              corpName: this.formBusiness.name.trim(),
              contactName: this.formBusiness.linkman.trim(),
              telephone: this.token.bindMobile,
              province: areaArr[0],
              city: areaArr[1] || '',
              area: areaArr[2] || '',
            }
            this.localStorageSaveOrRead('corpName', obj.corpName)
            this.localStorageSaveOrRead('companyParams', obj)
            this.$emit('companyParams', obj)
          }
        } else {
        }
      })
    },
    showCascader() {
      this.showCascaderModal = true
    },
    parentCadcader() {
      this.showCascaderModal = false
    },
    saveCorpCreateApply(params) {
      if (this.repeatClick) {
        return
      }
      this.repeatClick = true
      saveCorpCreateApply(params).then(data => {
        switch (data.code) {
          case 1:
            this.getPersonalInfo()
            break
          case 3515:
            this.repeatClick = false
            this.cropName = '您已创建了该企业'
            break
          case 3519:
            this.repeatClick = false
            this.$Message.error('创建企业失败，您可能已经创建了待审批的企业，还没有通过审批。请联系销大师客服人员')
            break
          default:
            this.repeatClick = false
            this.$Message.error('创建企业失败')
            break
        }
      })
    },
    areaSelect(areaName) {
      this.formBusiness.area = areaName
    },
    cancel() {
      if (this.getToken().corpList === 0) {
        location.href = process.env.MOBILE_BASE_URL + '/index.html'
      } else {
        this.$router.push({ name: 'company' })
      }
    },
    // getDefaultInfo() {
    //   getDefaultInfo().then(data => {
    //     this.packId = data.data.defaultFreePackage
    //   })
    // }
  },
  components: {
    Cascader
  }
}
</script>

<style lang="stylus">
.second-step
  width 410px
  margin 109px auto 0
  .ivu-form .ivu-form-item-label
    height 40px
    line-height 1.3
  .ivu-input-group-prepend
    color #cdcdcd
  .ivu-form-item-content
    line-height 40px
    position relative
  .ivu-btn
    height 40px
    width 100%
  .ivu-form-item
    margin-bottom 34px
  .go-on
    .ivu-btn
      height 40px
      width 140px
    .left
      float left
    .right
      float right
</style>


