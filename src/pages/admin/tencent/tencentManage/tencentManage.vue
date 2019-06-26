<template>
  <div id="tencentMange">
    <data-loading :data-satau='loadingStatu' @reload="reload">
      <div class="title title_public" v-show="noData">
        公众号列表
      </div>
      <div class="title title_public" v-show="!noData">
        公众号管理
      </div>
      <div class="noData-wrapper" v-show="noData">
        <div class="tips-wrapper">
          <div class="noImg">
            <img src="@/assets/images/admin/noTencent.png" alt="">
          </div>
          <div class="tip-1">
            您尚未添加任何公众号
          </div>
          <div class="tip-2">当前套餐版本最多支持{{corpInfoData.packAppidNum}}个公众号，如需更多服务请<span @click="upgrade"> 升级</span></div>
          <Button class="tip-3" type="primary" @click="addTencent">添加公众号</Button>
        </div>
        <div class="bottom-tip">
          <div class="explain">授权说明</div>
          <div>1、公众号分为四种类型：非认证订阅号、认证订阅号、非认证服务号、认证服务号。销大师支持认证服务号和认证订阅号，不支持非认证服务号和非认证订阅号。</div>
          <div>2、授权绑定公众号后，可在销大师系统使用自定义菜单、自动回复、消息群发等功能。</div>
          <div>3、不同类型的公众号，接口权限不一样，在销大师系统可使用的功能也不一样。认证服务号拥有最多的接口权限，销大师系统相应的拥有最多的功能。</div>
          <div>4、一个微信公众号仅可绑定一个企业；绑定之后支持解除绑定。</div>
          <div>5、为保证所有功能的正常使用，授权时请保持默认选择，把权限统一授权给销大师。</div>
        </div>
      </div>
      <div class="tencentManage-wrapper" v-show="!noData">
        <div class="table-wrapper">
          <div class="table-btn">
            <div class="left">
              <Button type="primary" @click="addTencent">添加公众号</Button>
            </div>
            <div class="right" @click="refreshPage">
              <span class="icon">&#xe62b;</span>
              刷新
            </div>
          </div>
          <div class="table-list">
            <BScroll :offsetBottom="0" :data="tencentListData">
              <Table :loading="loadingImg" :row-class-name="rowClassName" :columns="columns" :data="tencentListData"></Table>
            </BScroll>
          </div>
        </div>
      </div>
      <SyncTencent v-model="ansyDrawer" :serviceTypeInfo="serviceTypeInfo" :appAccountId="appAccountId"></SyncTencent>
    </data-loading>
    <common-modal ref="addTencent" header="套餐不足" confrim="立即升级" :content="content" @ok="upgrade" ></common-modal>
    <common-modal ref="relieve" header="解除授权" content="解除授权后该账号将无法使用在销大师系统设置的所有功能，但数据会被妥善保存，再次重新授权后可继续使用。" @ok="relieve" ></common-modal>
    <common-modal ref="deleteTencent" header="删除公众号" content="您正在删除公众号，删除后需重新添加授权才能继续使用，确定要删除公众号吗？" @ok="deleteTencent" ></common-modal>
    <common-modal ref="blockUp" header="停用公众号" content="您正在停用公众号，停用后，该公众号的所有操作无法使用，确定停用吗？" @ok="blockUp" ></common-modal>
    <common-modal ref="forbidden" header="禁用提示" content="您的公众号已被禁用，无法操作，请联系客服人员。"></common-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { addComma } from '@/utils/util'
import Const from '@/utils/const'
import SyncTencent from './syncTencent'
import {
  getPublicAccountList,
  checkAppIdNum,
  getAuthUrl,
  updateCssWxPublicAccountStatusToDelete,
  updateCssWxPublicAccountToAuthBlockUp,
  updateCssWxPublicAccountToBlockUp,
  updateCssWxPublicAccountToDisabled,
  updateCssWxPublicAccountToActive
} from '@/api/query'
export default {
  name: 'tencentMange',
  components: {
    SyncTencent
  },
  data() {
    return {
      ansyDrawer: false,
      loadingStatu: 1,
      closeLoop: true,
      timer: null,
      noData: false,
      modalSync: false,
      isAddTencent: false,
      tencentRules: Const.tencentRules,
      content: '',
      tencentListData: [],
      userInfo: this.getToken() || null,
      currentCorp: this.localStorageSaveOrRead('currentCorp'),
      thirdplatUrl: '',
      checkAll: false,
      loadingImg: true,
      checkAllGroup: [],
      appAccountId: -1,
      appId: '',
      appIdList: [],
      serviceTypeInfo: null,
      columns: [
        {
          title: '公众号名称',
          key: 'principalName',
          width: 180,
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                }
              },
              [
                h('img', {
                  class: {
                    inbl: true
                  },
                  attrs: {
                    src: params.row.headImg || `${process.env.SELF_BASE_URL}/logo.png`
                  }
                }),
                h(
                  'div',
                  {
                    class: {
                      inbl: true
                    },
                    attrs: {
                      title: params.row.principalName
                    }
                  },
                  params.row.principalName
                )
              ]
            )
          }
        },
        {
          title: '账号类型',
          key: 'serviceTypeInfo',
          render: (h, params) => {
            return h(
              'div',
              params.row.serviceTypeInfo === 2 ? '服务号' : '订阅号'
            )
          }
        },
        {
          title: '认证状态',
          key: 'verifyTypeInfo',
          render: (h, params) => {
            return h(
              'div',
              params.row.verifyTypeInfo === 0 ? '已认证' : '未认证'
            )
          }
        },
        {
          title: '授权时间',
          key: 'privilegedTime',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.privilegedTime
                }
              },
              params.row.privilegedTime.substring(0, 16)
            )
          }
        },
        {
          title: '授权员工',
          key: 'privilegedEeName',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                },
                attrs: {
                  title: params.row.privilegedEeName
                }
              },
              params.row.privilegedEeName || '--'
            )
          }
        },
        {
          title: '最近同步时间',
          key: 'lockInTime',
          render: (h, params) => {
            return h('div',
            {
              class: {
                noWrap: true
              },
              attrs: {
                title: params.row.privilegedTime
              }
            },
            params.row.lockInTime.substring(0, 16))
          }
        },
        {
          title: '用户数',
          key: 'userCount',
          render: (h, params) => {
            return h('div', addComma(params.row.userCount))
          }
        },
        {
          title: '公众号状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'div',
              {
                class: {
                  noWrap: true
                }
              },
              params.row.status === 0
                ? '禁用'
                : params.row.status === 1
                  ? '正常'
                  : params.row.status === 2 ? '停用' : '未授权'
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  class: {
                    isHideAction: !(params.row.status === 1)
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'ansy',
                        params.row.status,
                        params.row.appAccountId,
                        params.row.serviceTypeInfo
                      )
                    }
                  }
                },
                '同步管理'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '6px'
                  },
                  class: {
                    isHideAction: params.row.authorizationStatus === 1
                  },
                  on: {
                    click: () => {
                      this.addTencent()
                    }
                  }
                },
                '重新授权'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost',
                    disabled: this.appIdList.indexOf(params.row.appId) >= 0
                  },
                  class: {
                    isHideAction:
                      params.row.authorizationStatus === 0 ||
                      !params.row.authorizationStatus
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'relieve',
                        params.row.status,
                        params.row.appAccountId
                      )
                    }
                  }
                },
                '解除授权'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  class: {
                    isHideAction: params.row.status !== 1
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'blockUp',
                        params.row.status
                      )
                    }
                  }
                },
                '停用'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  class: {
                    isHideAction: params.row.status !== 2
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.updateCssWxPublicAccountToActive(params.row.appId)
                    }
                  }
                },
                '启用'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  style: {
                    marginRight: '6px'
                  },
                  class: {
                    isHideAction: params.row.status === 1
                  },
                  on: {
                    click: () => {
                      this.showSelect(
                        params.row.appId,
                        'deleteTencent',
                        params.row.status
                      )
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      corpInfoData: 'survey/getCorpInfo',
      loginCompanyData: 'survey/getSaveloginCompany'
    })
  },
  watch: {
    tencentListData: {
      handler(arr) {
        arr.forEach(item => {
          let idx = this.appIdList.indexOf(item.appId)
          if (idx >= 0 && item.authorizationStatus === 0) {
            this.appIdList.splice(idx, 1)
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.getPublicAccountList()
  },
  methods: {
    reload() {
      this.appIdList = []
      this.getPublicAccountList()
    },
    // 删除微信公众号
    updateCssWxPublicAccountStatusToDelete(params) {
      updateCssWxPublicAccountStatusToDelete(params).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('删除公众号成功')
            this.$root.Bus.$emit('regainCompanyInfo', false)
            this.getPublicAccountList()
            break
          default:
            this.$Message.error(data.message)
            break
        }
      })
    },
    // 操作解除授权按钮停用微信公众号
    updateCssWxPublicAccountToAuthBlockUp(params) {
      updateCssWxPublicAccountToAuthBlockUp(params).then(data => {
        switch (data.code) {
          case 1:
            if (this.appIdList.indexOf(this.appId) < 0) {
              this.appIdList.push(this.appId)
            }
            setTimeout(() => {
              this.$Message.success('解除授权成功')
              this.getPublicAccountList()
            }, 400)
            break
          case 3503:
            this.$Message.error('解除授权失败，公司不存在')
            break
          case 6000:
            this.$Message.error('解除授权失败，公众号不存在')
            break
          case 6004:
            this.$Message.error('解除授权失败，公众号未授权')
            break
          default:
            this.$Message.error(data.message)
            break
        }
      })
    },
    // 操作停用按钮停用微信公众号
    updateCssWxPublicAccountToBlockUp(params) {
      updateCssWxPublicAccountToBlockUp(params).then(data => {
        switch (data.code) {
          case 1:
            setTimeout(() => {
              this.$Message.success('停用成功')
            this.getPublicAccountList()
            }, 400)
            break
          case 3503:
            this.$Message.error('停用失败，公司不存在')
            break
          case 6004:
            this.$Message.error('停用失败，应用账号未授权')
            break
          case 6000:
            this.$Message.error('停用失败，公众号不存在')
            break
          default:
            this.$Message.error(data.message)
            break
        }
      })
    },
    // 禁用微信公众号
    updateCssWxPublicAccountToDisabled(params) {
      updateCssWxPublicAccountToDisabled(params).then(data => {
        switch (data.code) {
          case 1:
            break
          case 3503:
            this.$Message.error('禁用失败，公司不存在')
            break
          default:
            break
        }
      })
    },
    // 启用微信公众号
    updateCssWxPublicAccountToActive(params) {
      updateCssWxPublicAccountToActive({ appId: params }).then(data => {
        switch (data.code) {
          case 1:
            setTimeout(() => {
              this.$Message.success('启用成功')
              this.getPublicAccountList()
            }, 400)
            break
          case 3503:
            this.$Message.error('启用失败，公司不存在')
            break
          default:
            break
        }
      })
    },
    getAuthUrl() {
      let params = {
        redirectUrl: this.constRedirectUrl,
        reqType: 0,
        authType: 3
      }
      getAuthUrl(params).then(data => {
        if (data.code === 1) {
          this.thirdplatUrl = data.data.url
          this.skipUrl(this.thirdplatUrl)
          this.localStorageSaveOrRead('preAuthCode', data.data.preAuthCode)
        } else {
          this.$Message.error('获取授权url失败')
        }
      }).catch(() => {
        this.$Message.error('获取授权url失败')
      })
    },
    getPublicAccountList(msg) {
      this.loadingImg = true
      let params = {
        corpId: this.currentCorp.applyId
      }
      getPublicAccountList(params).then(data => {
        if (data.code === 1) {
          if (msg) { this.$Message.success(msg) }
          this.loadingStatu = 2
          this.loadingImg = false
          let tencentData = data.data
          this.tencentListData = tencentData
          // 新的数据,操作重新获取数据
          this.actionPublicAccountList()

          if (tencentData.length <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.noData = true
          } else {
            let accountList = this.localStorageSaveOrRead('accountList')
            if (accountList && accountList.length > 0) {
              // this.closeLoop = true
              for (let i = 0; i < accountList.length; i++) {
                for (let j = 0; j < tencentData.length; j++) {
                  if (accountList[i].appAccountId === tencentData[j].appAccountId) {
                    if (
                      accountList[i].lockInStatus === 0 &&
                      tencentData[j].lockInStatus === 1
                    ) {
                      this.$Message.success(
                        `${tencentData[j].principalName}公众号同步完成`
                      )
                      break
                    }
                  }
                  if (tencentData[j].lockInStatus === 0) {
                    this.intervalLoop()
                    this.closeLoop = true
                  }
                }
              }
              // if (this.closeLoop) {
              //   clearInterval(this.timer)
              //   this.timer = null
              // }
            }
            this.noData = false
          }
          let cookieTencentData = this.transformData(tencentData, this.tencentRules)
          this.localStorageSaveOrRead('accountList', cookieTencentData || [])
        } else {
          this.loadingStatu = 3
          this.loadingImg = false
        }
      })
    },
    // intervalLoop() {
    //   if (this.timer) {
    //     return
    //   }
    //   this.timer = setInterval(() => {
    //     this.getPublicAccountList()
    //   }, 3000)
    // },
    checkAppIdNum() {
      checkAppIdNum().then(data => {
        switch (data.code) {
          case 1:
            if (data.data) {
              this.getAuthUrl()
              // this.isAddTencent = true
            } else {
              // this.isAddTencent = false
              this.content = `当前套餐版本最多支持${this.corpInfoData.packAppidNum}个公众号，如需更多服务请升级。`
              this.$refs.addTencent.showModal()
            }
            break
          case 3503:
            break
          default:
            break
        }
      })
    },
    refreshPage() {
      this.appIdList = []
      this.getPublicAccountList('刷新成功')
    },
    showSelect(params, type, status, appAccountId, serviceTypeInfo) {
      if (status === 0) {
        this.$refs['forbidden'].showModal()
        return
      }
      this.appId = params
      if (type === 'ansy') {
        this.serviceTypeInfo = serviceTypeInfo
        this.ansyDrawer = true
        this.appAccountId = appAccountId
      } else if (type === "relieve") {
        this.appAccountId = appAccountId
        this.$refs[type].showModal()
      } else {
        this.$refs[type].showModal()
      }
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.checkAllGroup = [
          'MENU',
          'USER_INFO',
          'TEMPLATE',
          'MEDIA_IMG',
          'AUTO_REPLY'
        ]
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 5) {
        this.checkAll = true
      } else if (data.length > 0) {
        this.checkAll = false
      } else {
        this.checkAll = false
      }
    },
    addTencent() {
      this.checkAppIdNum()
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
    relieve() {
      this.updateCssWxPublicAccountToAuthBlockUp({ appId: this.appId })
    },
    deleteTencent() {
      this.updateCssWxPublicAccountStatusToDelete({ appId: this.appId })
    },
    blockUp() {
      this.updateCssWxPublicAccountToBlockUp({ appId: this.appId })
    },
    rowClassName(row, index) {
      if (row.authorizationStatus === 0) {
        return 'table-unactive-row'
      }
      return ''
    },
    ...mapActions({
      setPayStatu: 'pay/setPayStatu',
      actionPublicAccountList: 'publicAccount/actionPublicAccountList'
    })
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>
<style lang="stylus">
@import './tencentManage.styl'
#tencentMange
  background-color #fff
  border-radius 3px
  .isHideAction
    display none
  .table-unactive-row
    color #787c80
</style>
