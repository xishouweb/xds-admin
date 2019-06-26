<template>
  <div id="corpInfo">
    <data-loading :data-satau='loadingStatu' @reload="reload">
      <div class="title_public">
        企业信息
      </div>
      <BScroll :offsetBottom="0" :data="corpData">
        <div class="corpInfo-wrapper">
          <div class="part-wrapper">
            <div class="part-title">
              基本信息
            </div>
            <div class="basic-wrapper">
              <div class="corp-info-item corp-logo-item">
                <div class="left">企业logo</div>
                <div class="right">
                  <div class="default">
                    <div class="default-left default-logo">
                      <upload-logo :isUpload="saveloginCompany.admin"
                      v-if="corpData.logo || corpData.logo==='' || corpData.logo===null"
                      :imgSrc="corpData.logo"></upload-logo>
                    </div>
                    <div class="default-right default-logo-text">建议尺寸：300X300像素</div>
                  </div>
                </div>
              </div>
              <div class="corp-info-item">
                <div class="left">企业名称</div>
                <div class="right">
                  <div class="default" v-if="typeEdit!=='company'">
                    <span class="span nowrap" :title="corpData.corpName">{{corpData.corpName || '- -'}}</span>
                    <span class="span nowrap-icon" v-if="saveloginCompany.admin">
                      <Icon class="edit-icon handle" title="修改" @click="editInfo('company', corpData.corpName)" type="edit"></Icon>
                    </span>
                  </div>
                  <div class="edit" v-if="typeEdit=='company'">
                    <Input ref="inputFocus" v-model="companyInfo" placeholder="请输入企业名称"></Input>
                    <span class="span handle" @click="saveEdit('company')">保存</span>
                    <span class="span handle cancel" @click="cancelEdit">取消</span>
                    <div class="err" v-show="errorType=='company'">{{corpErrorText}}</div>
                  </div>
                </div>
              </div>
              <div class="corp-info-item">
                <div class="left">所在地址</div>
                <div class="right">
                  <div class="default">
                    <span class="span">{{corpData.province | area(corpData.city)}}{{corpData.area}}</span>
                    <span class="span" v-if="saveloginCompany.admin">
                      <Icon class="edit-icon handle" title="修改" @click="editInfo('area')" type="edit"></Icon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="corp-info-item">
                <div class="left">创建时间</div>
                <div class="right">
                  <div class="default">
                    <span class="span">{{corpData.createTime}}</span>
                  </div>
                </div>
              </div>
              <div class="corp-info-item">
                <div class="left">联系人</div>
                <div class="right">
                  <div class="default" v-if="typeEdit!=='linkman'">
                    <span class="span nowrap" :title="corpData.contactName">{{corpData.contactName}}</span>
                    <span class="span nowrap-icon" v-if="saveloginCompany.admin">
                      <Icon class="edit-icon handle" title="修改" @click="editInfo('linkman', corpData.contactName)" type="edit"></Icon>
                    </span>
                  </div>
                  <div class="edit" v-if="typeEdit=='linkman'">
                    <Input ref="inputFocus" v-model="companyInfo" placeholder="请输入联系人姓名"></Input>
                    <span class="span handle" @click="saveEdit('linkman')">保存</span>
                    <span class="span handle cancel" @click="cancelEdit">取消</span>
                    <div class="err" v-show="errorType=='linkman'">{{linkmanErrorText}}</div>
                  </div>
                </div>
              </div>
              <div class="corp-info-item">
                <div class="left">手机号</div>
                <div class="right">
                  <div class="default">
                    <span class="span">{{corpData.phoneNumber}}</span>
                    <span class="span" v-if="saveloginCompany.admin">
                      <Icon class="edit-icon handle" title="修改" @click="editInfo('phone')" type="edit"></Icon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="corp-info-item corp-info-weixin">
                <div class="left">
                  <div>管理员微信</div>
                  <div class="tip-text">(创建人)</div>
                </div>
                <div class="right">
                  <div class="default">
                    <img class="default-left default-weixin" :src="corpData.picUrl" alt="logo">
                    <div class="default-right default-weixin-text">{{corpData.accountNickName}}</div>
                  </div>
                </div>
              </div>
              <div class="corp-info-item">
                <div class="left">已绑公众号</div>
                <div class="right">
                  <div class="default">
                    <span class="span">{{corpData.appidNum}}个</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="part-wrapper">
              <div class="part-title">
                套餐信息
              </div>
              <div class="basic-wrapper">
                <div class="corp-info-item">
                  <div class="left">当前套餐</div>
                  <div class="right">
                    <div class="default">
                      <span class="span">{{corpData.packageName}}</span>
                      <span class="span upgrade" @click="upgrade">
                        续费升级
                      </span>
                    </div>
                  </div>
                </div>
                <div class="corp-info-item">
                  <div class="left">套餐状态</div>
                  <div class="right">
                    <div class="default">
                      <span class="span" v-show="corpData.status==='ACTIVE'">正常</span>
                      <span class="span" v-show="corpData.status==='DISABLED'">停用</span>
                      <span class="span" v-show="corpData.status==='EXPIRE'">已过期</span>
                      <span class="span" v-show="corpData.status==='FORBIDDEN'">禁用</span>
                      <span class="span" v-show="corpData.status==='DOING'">新创建</span>
                    </div>
                  </div>
                </div>
                <div class="corp-info-item">
                  <div class="left">有效时间</div>
                  <div class="right">
                    <div class="default">
                      <span class="span">{{corpData.startTime}} 至 {{corpData.endTime}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BScroll>
    </data-loading>
    <drawer v-model="editPhoneDrawer" titleTips="修改手机号">
      <div class="drawer-phone" slot="content">
        <componentEditPhone @success="editSuccess" ref="componentEditPhone" type="editPhoneDrawer" :params="infoParams"></componentEditPhone>
      </div>
      <div slot="footer">
        <div class="footer-wrapper" id="footer-wrapper">
          <Button class="footer-btn" @click="savePhone" type="primary">保存</Button>
          <Button class="footer-btn" @click="cancel" type="ghost">取消</Button>
        </div>
      </div>
    </drawer>
    <drawer v-model="editAreaDrawer" :isScroll="false" titleTips="修改地址">
      <div slot="content" class="drawer-area">
        <cascader type="drawerArea" :showCascaderModal="true" @areaSelect="areaSelect"></cascader>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <Button class="footer-btn"  @click="saveArea" type="primary">保存</Button>
          <Button class="footer-btn" @click="cancel" type="ghost">取消</Button>
        </div>
      </div>
    </drawer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {updateCorpName} from '@/api/query'
import componentEditPhone from '@/pages/personalCenter/componentEditPhone'
import Cascader from '@/components/Cascader'
import uploadLogo from '@/components/upload/uploadLogo'
export default {
  name: 'corpInfo',
  data() {
    return {
      infoParams: {},
      editPhoneDrawer: false,
      editAreaDrawer: false,
      companyInfo: '',
      originalCompanyInfo: '',
      typeEdit: '',
      errorType: '',
      corpErrorText: '企业名称不能为空',
      linkmanErrorText: '联系人姓名不能为空!',
      corpData: {},
      address: '',
      loadingStatu: 1,
    }
  },
  computed: {
    ...mapGetters({
      saveloginCompany: 'survey/getSaveloginCompany'
    })
  },
  filters: {
    area(val1, val2) {
      return val1 !== val2 ? (val1 + val2) : val1
    }
  },
  watch: {
    saveloginCompany(params) {
      this.getCorpInfoMulti(params.packId)
    },
    typeEdit(val) {
      switch (val) {
        case 'linkman':
          this.$nextTick(() => {
            this.$refs.inputFocus.focus()
          })
          break
        case 'company':
          this.$nextTick(() => {
            this.$refs.inputFocus.focus()
          })
          break
        default:
          break
      }
    }
  },
  mounted() {
    if (this.saveloginCompany && this.saveloginCompany.packId) {
      this.getCorpInfoMulti(this.saveloginCompany.packId)
    }
  },
  methods: {
    updateCorpName(params) {
      updateCorpName(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('企业名称修改成功！')
            this.typeEdit = ''
            this.getCorpInfoMulti(this.saveloginCompany.packId)
            break
          case 3515:
            this.errorType = 'company'
            this.corpErrorText = '修改失败！此公司已被注册'
            break
          case 3520:
            this.errorType = 'company'
            this.corpErrorText = '修改失败！公司不存在或不可用'
            break
          default:
            this.$Message.error('企业名称修改失败！')
            break
        }
      }).catch(() => {
        this.$Message.error('企业名称修改失败！')
      })
    },
    getCorpInfoMulti(params) {
      let obj = {corpPackId: params}
      this.$get(this.fylPath.getCorpInfoMulti, obj).then(data => {
        if (data.code === 1) {
          this.loadingStatu = 2
          this.corpData = data.data
          if (this.corpData.startTime) {
             this.corpData.startTime = this.corpData.startTime.substring(0,10)
          } else {
             this.corpData.startTime = 0
          }
          if (this.corpData.endTime) {
            this.corpData.endTime = this.corpData.endTime.substring(0,10)
          } else {
             this.corpData.endTime = 0
          }
          this.corpData.endTime = this.corpData.endTime.substring(0,10) || 0
          let telephone = this.corpData.telephone
          this.corpData.phoneNumber = telephone.substring(0,3) + '-' + telephone.substring(3,7) + '-' + telephone.substring(7)
          let currentCorp = {
            applyId: this.corpData.corpId || this.localStorageSaveOrRead('currentCorp').applyId,
            corpName: this.corpData.corpName
          }
          this.localStorageSaveOrRead('currentCorp', currentCorp)
        } else {
          this.loadingStatu = 3
          this.$Message.error(data.message)
        }
      })
    },
    reload() {
      this.getCorpInfoMulti(this.saveloginCompany.packId)
    },
    updateAdminEmployeeName(params) {
      this.$get(this.fylPath.updateAdminEmployeeName, params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('联系人修改成功！')
            this.typeEdit = ''
            this.getCorpInfoMulti(this.saveloginCompany.packId)
            break
          case 3503:
            this.errorType = 'linkman'
            this.corpErrorText = '修改失败！公司不存在'
            break
          case 3564:
            this.errorType = 'linkman'
            this.corpErrorText = '修改失败！不是该公司员工或员工身份不为管理员'
            break
          default:
            this.$Message.error('联系人修改失败！')
            break
        }
      }).catch(() => {
        this.$Message.error('联系人修改失败！')
      })
    },
    updateCorpAddress(params) {
      this.$get(this.fylPath.updateCorpAddress, params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('所在地区修改成功！')
            this.editAreaDrawer = false
            this.getCorpInfoMulti(this.saveloginCompany.packId)
            break
          case 3503:
            this.editAreaDrawer = false
            this.corpErrorText = '修改失败！公司不存在'
            break
          case 3564:
            this.editAreaDrawer = false
            this.corpErrorText = '修改失败！不是该公司员工或员工身份不为管理员'
            break
          default:
            this.$Message.error('所在地区修改失败！')
            break
        }
      }).catch(() => {
        this.editAreaDrawer = false
        this.$Message.error('所在地区修改失败！')
      })
    },
    savePhone() {
      this.$refs.componentEditPhone.handleSubmit('formEditPhone')
    },
    saveArea() {
      let areaArr = this.address.split('/')
      if (areaArr.length === 1) {
        this.$Message.error('您还没有选择市')
        return
      } else if (areaArr.length === 2) {
        this.$Message.error('您还没有选择区')
        return
      }
      let params = {
        province: areaArr[0],
        city: areaArr[1] || '',
        area: areaArr[2] || '',
      }
      this.updateCorpAddress(params)
    },
    editSuccess(val) {
      if (val) {
        this.editPhoneDrawer = false
        this.getCorpInfoMulti(this.saveloginCompany.packId)
      } else {
        this.editPhoneDrawer = false
        this.$Message.error('修改失败')
      }
    },
    areaSelect(area) {
      this.address = area
    },
    editInfo(type, name) {
      this.errorType = ''
      if (type === 'area') {
        this.typeEdit = ''
        this.editAreaDrawer = true
      } else if (type === 'phone') {
        this.infoParams = {
          oldMobile: this.corpData.telephone,
          applyId: this.corpData.corpId || this.localStorageSaveOrRead('currentCorp').applyId
        }
        this.typeEdit = ''
        this.editPhoneDrawer = true
      } else {
        this.companyInfo = name
        this.originalCompanyInfo = name
        this.typeEdit = type
      }
    },
    cancelEdit() {
      this.typeEdit = ''
      this.errorType = ''
    },
    saveEdit(type) {
      this.errorType = ''
      if (this.companyInfo.trim() === '') {
        this.errorType = type
        if (type === 'linkman') {
          this.linkmanErrorText = '联系人姓名不能为空!'
        } else {
          this.corpErrorText = '企业名称不能为空!'
        }
        return
      } else if (this.companyInfo.trim().length > 100) {
        this.errorType = type
        if (type === 'linkman') {
          this.linkmanErrorText = '联系人长度不能大于100!'
        } else {
          this.corpErrorText = '企业名称长度不能大于100!'
        }
        return
      }
      switch (type) {
        case 'company':
          if (this.originalCompanyInfo === this.companyInfo.trim()) {
            this.typeEdit = ''
            return
          }
          let params = {
            applyId: this.localStorageSaveOrRead('currentCorp').applyId,
            corpName: this.companyInfo.trim()
          }
          this.updateCorpName(params)
          break
        case 'linkman':
          let linkmanparams = {
            name: this.companyInfo.trim()
          }
          this.updateAdminEmployeeName(linkmanparams)
          break
        default:
          break
      }
    },
    upgrade() {
      let corpId = this.localStorageSaveOrRead('currentCorp').applyId
      let corpName = this.localStorageSaveOrRead('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    cancel() {
      this.editAreaDrawer = false
      this.editPhoneDrawer = false
    },
    ...mapActions({
      setPayStatu: 'pay/setPayStatu'
    })
  },
  components: {
    componentEditPhone,
    Cascader,
    uploadLogo
  }
}
</script>
<style lang="stylus">
@import '~@/pages/admin/setting/corpInfo/corpInfo'
#corpInfo
  .drawer-phone
    width 460px
    margin-top 20px
  .drawer-area
    padding-top 30px
  .footer-wrapper
    .footer-btn
      width 120px
      margin-right 20px
      &:nth-last-of-type(1)
        margin-right: 0
</style>


