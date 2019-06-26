import Vue from 'vue'
import Router from 'vue-router'
import statisticsPath from './statistics.js'
import { localSaveOrRead } from "@/utils/util.js"
import store from '../store'
Vue.use(Router)
const router = new Router({
  mode: "history",
  base: "admin",
  routes: [
    {
      path: "/",
      redirect: "/main/home"
    },
    {
      path: "/authorization",
      name: "authorization",
      meta: {
        requireAuth: true
      },
      component: () => import("@/pages/authorization/authorization")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login/login")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/register/register")
    },
    {
      path: "/client/register",
      name: "registerFromClient",
      component: () => import("@/pages/register/register")
    },
    {
      path: "/main",
      name: "main",
      component: () => import("@/pages/main/main"),
      children: [
        {
          path: "/main/home",
          name: "home",
          component: () => import("@/pages/home/home")
        },
        // 个人中心
        {
          path: "/main/personInfo",
          name: "personInfo",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/personInfo")
        },
        // 注册协议
        {
          path: "/main/agreement",
          name: "agreement",
          component: () => import("@/pages/agreement/agreement")
        },
        // 我的企业
        {
          path: "/main/company",
          name: "company",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/company")
        },
        // 创建新企业
        {
          path: "/main/createCompany",
          name: "createCompany",
          component: () => import("@/pages/personalCenter/createCompany")
        },
        {
          path: "/main/client/createCompany",
          name: "createCompanyFromClient",
          component: () => import("@/pages/personalCenter/createCompany")
        },
        // 修改手机号
        {
          path: "/main/editPhone/:oldMobile/:applyId",
          name: "editPhone",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/editPhone")
        },
        // 修改手机号
        {
          path: "/main/webLink",
          name: "webLink",
          component: () => import("@/pages/webLink")
        }
      ]
    },
    {
      path: "/admin",
      name: "admin",
      redirect: "/admin/survey",
      meta: {
        requireAuth: true
      },
      component: () => import("@/pages/admin/admin-main/admin-main"),
      children: [
        {
          path: "/admin/error/:type",
          name: 'error',
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/error")
        },
        // 概况
        {
          path: "/admin/survey",
          meta: {
            requireAuth: true
          },
          redirect: "/admin/survey/sketch",
          component: () => import("@/pages/admin/survey/index"),
          children: [
            { // 概况页
              path: "/admin/survey/sketch",
              name: "survey",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/survey/sketch")
            },
            { // 帮助列表（公告列表）
              path: "/admin/survey/help",
              name: "help",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/survey/help")
            },
            { // 帮助详情（公告详情）
              path: "/admin/survey/detail",
              name: "helpDetail",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/survey/help/detail")
            }
          ]
        },
        // 坐席
        {
          path: "/admin/seats",
          name: "seats",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/seats/seats")
        },
        // 公众号
        {
          path: "/admin/tencent",
          name: "tencent",
          redirect: () => {
            return {name: ((store.state.nav.allSecondObj['tencent'] && store.state.nav.allSecondObj['tencent'].list[0].menuUrl) || 'tencentManage')}
          },
          meta: {
            requireAuth: true
          },
          component: () => import("@/layouts/secondMenu"),
          children: [
            {
              path: "/admin/tencent/tencentManage",
              name: "tencentManage",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/tencent/tencentManage/tencentManage")
            },
            {
              // 自定义菜单
              path: "/admin/tencent/customMenu",
              name: "customMenu",
              meta: {
                requireAuth: true,
                leaveIntercept: true, // 离开该页面是否需要拦截
              },
              component: () => import("@/pages/admin/tencent/customMenu")
            },
            {
              // 个性化菜单
              path: "/admin/tencent/personalizedMenu",
              name: "personalizedMenu",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/personalizedMenu")
            },
            {
              // 编辑个性化菜单
              path: "/admin/tencent/modifyMenu",
              name: "modifyMenu",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/tencent/personalizedMenu/modifyMenu")
            },
            {
              // 素材管理
              path: "/admin/tencent/material",
              name: "material",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/tencent/materialManage/index"),
              children: [
                {
                  // 新建图文
                  path: "/admin/tencent/material/new/:groupId",
                  name: "newgraphic",
                  meta: {
                    leaveIntercept: true, // 离开该页面是否需要拦截
                  },
                  props: true,
                  component: () =>
                    import("@/pages/admin/tencent/materialManage/createNewGraphic/index")
                }
              ]
            },
            {
              // 模板消息
              path: "/admin/tencent/messageTemplate",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/messageTemplate"),
              children: [
                {
                  // 模板信息添加
                  path: "",
                  name: "messageTemplate",
                  meta: {
                    requireAuth: true
                  },
                  component: () =>
                    import("@/pages/admin/tencent/messageTemplate/templeteList")
                },
                {
                  // 模板信息添加
                  path: "/admin/tencent/messageTemplate/messageTAdd/:step",
                  name: "messageTAdd",
                  meta: {
                    requireAuth: true
                  },
                  component: () =>
                    import("@/pages/admin/tencent/messageTemplate/templeteAdd")
                }
              ]
            },
            {
              // 自动回复
              path: "/admin/tencent/autoReplay",
              name: "autoReplay",
              redirect: "/admin/tencent/autoReplay/keyReply",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/autoReplay"),
              children: [
                {
                  // 关键词回复
                  path: "/admin/tencent/autoReplay/keyReply",
                  name: "keyReply",
                  meta: {
                    requireAuth: true,
                    dex: 0
                  },
                  component: () =>
                    import("@/pages/admin/tencent/autoReplay/keyReply")
                },
                {
                  // 欢迎语
                  path: "/admin/tencent/autoReplay/greetReply",
                  name: "greetReply",
                  meta: {
                    requireAuth: true,
                    dex: 1
                  },
                  component: () =>
                    import("@/pages/admin/tencent/autoReplay/greetReply")
                },
                {
                  // 被关注回复
                  path: "/admin/tencent/autoReplay/concernReply",
                  name: "concernReply",
                  meta: {
                    requireAuth: true,
                    dex: 2
                  },
                  component: () =>
                    import("@/pages/admin/tencent/autoReplay/concernReply")
                },
                {
                  // 添加回复
                  path: "/admin/tencent/autoReplay/addReply",
                  name: "addReply",
                  meta: {
                    requireAuth: true,
                    dex: 3
                  },
                  component: () =>
                    import("@/pages/admin/tencent/autoReplay/addReply")
                }
              ]
            },
            {
              // 粉丝标签
              path: "/admin/tencent/fansLabel",
              name: "fansLabel",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/fansLabel")
            }
          ]
        },
        // 粉丝
        {
          path: "/admin/fansPage",
          name: "fansPage",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/fans"),
          children: [
            {
              path: "my",
              name: "myFans",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/fans/MyFans")
            },
            {
              path: "all",
              name: "allFans",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/fans/AllFans")
            }
          ]
        },
        // 设置
        {
          path: "/admin/setting",
          name: "setting",
          redirect: to => {
            console.log(to)
            return {name: ((store.state.nav.allSecondObj['setting'] && store.state.nav.allSecondObj['setting'].list[0].menuUrl) || 'seatSetting')}
          },
          meta: {
            requireAuth: true
          },
          component: () => import("@/layouts/secondMenu"),
          children: [
            // 坐席设置（弃用）
            {
              path: "/admin/setting/seatSetting",
              name: "seatSetting",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/setting/seatSetting/seatSetting")
            },
            // 订单记录
            {
              path: "/admin/setting/records",
              name: "records",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/orderRecords/records")
            },
            // 企业信息
            {
              path: "/admin/setting/corpInfo",
              name: "corpInfo",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/setting/corpInfo/corpInfo")
            },
            // 会话设置
            {
              path: "/admin/setting/chatSetting",
              name: "chatSetting",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/setting/chatSetting/chatSetting")
            },
            // 接待组设置
            {
              path: "/admin/setting/reception",
              name: "reception",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/setting/reception")
            },
            // 分配规则
            {
              path: "/admin/setting/allot",
              name: "allot",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/setting/allot")
            },
            // 知识库
            {
              path: "/admin/setting/repository",
              name: "repository",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/setting/repository/repository")
            },
            // {
            //   path: "/admin/setting/chatSetting",
            //   name: "chatSetting",
            //   meta: {
            //     overTime: true
            //   },
            //   component: () =>
            //     import("@/pages/admin/setting/overTime/overTime")
            // },
          ]
        },
        // 员工
        {
          path: "/admin/stuff",
          name: "stuff",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/stuff/index")
        },
        // 营销
        {
          path: "/admin/markting",
          name: "markting",
          redirect: () => {
            return {name: ((store.state.nav.allSecondObj['markting'] && store.state.nav.allSecondObj['markting'].list[0].menuUrl) || 'qrcode')}
          },
          meta: {
            requireAuth: true
          },
          component: () => import("@/layouts/secondMenu"),
          children: [
            // 渠道二维码
            {
              path: "/admin/markting/qrcode",
              name: "qrcode",
              redirect: "/admin/markting/qrcode/theme",
              meta: {
                requireAuth: true,
              },
              component: () => import("@/pages/admin/markting/qrcode"),
              children: [
                // 主题
                {
                  path: "/admin/markting/qrcode/theme",
                  name: "qrcodeTheme",
                  meta: {
                    requireAuth: true,
                    dex: 0
                  },
                  component: () => import("@/pages/admin/markting/qrcode/qrcodeTheme")
                },
                // 列表
                {
                  path: "list/:id",
                  name: "qrcodeList",
                  meta: {
                    requireAuth: true,
                    dex: 0
                  },
                  porps: true,
                  component: () =>
                    import("@/pages/admin/markting/qrcode/qrcodeList")
                },
                // 新建修改
                {
                  path: "edit/:themeId",
                  name: "qrcodeEdit",
                  meta: {
                    requireAuth: true,
                    dex: 0,
                    leaveIntercept: true, // 离开该页面是否需要拦截
                  },
                  porps: true,
                  component: () =>
                    import("@/pages/admin/markting/qrcode/createQrcode")
                }
              ]
            },
            // 裂变海报
            {
              path: "/admin/markting/fansPoster",
              name: "fansPoster",
              redirect: "/admin/markting/fansPoster/action",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/markting/fansPoster"),
              children: [
                // 1活动模板列表
                {
                  path: "/admin/markting/fansPoster/action",
                  name: "actionPoster",
                  meta: {
                    requireAuth: true,
                  },
                  component: () => import("@/pages/admin/markting/fansPoster/actionPoster"),
                },
                // 2新建海报模板
                {
                  path: "edit/:groupId",
                  name: "createPoster",
                  meta: {
                    requireAuth: true,
                    keepAlive: false,
                    leaveIntercept: true, // 离开该页面是否需要拦截
                  },
                  porps: true,
                  component: () => import("@/pages/admin/markting/fansPoster/createPoster"),
                },
                // 3模板详情
                {
                  path: "list",
                  name: "posterList",
                  meta: {
                    requireAuth: true,
                  },
                  component: () => import("@/pages/admin/markting/fansPoster/posterInfo"),
                },
              ]
            },
            // 智能接待
            {
              path: "/admin/markting/smart",
              name: "smart",
              redirect: "/admin/markting/smart/taskList",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/markting/smart"),
              children: [
                // 1接待任务列表
                {
                  path: "/admin/markting/smart/taskList",
                  name: "taskList",
                  meta: {
                    requireAuth: true,
                    keepAlive: true
                  },
                  component: () => import("@/pages/admin/markting/smart/taskList"),
                },
                // 2新建任务
                {
                  path: "/admin/markting/smart/createTask",
                  name: "createTask",
                  meta: {
                    requireAuth: true,
                    keepAlive: false
                  },
                  porps: true,
                  component: () => import("@/pages/admin/markting/smart/createTask"),
                },
              ]
            }
          ]
        },
        // 群发
        {
          path: "/admin/mass",
          name: "mass",
          redirect: () => {
            return {name: ((store.state.nav.allSecondObj['mass'] && store.state.nav.allSecondObj['mass'].list[0].menuUrl) || 'standardInfo')}
          },
          meta: {
            requireAuth: true
          },
          component: () => import("@/layouts/secondMenu"),
          children: [
            // 标准群发
            {
              path: "/admin/mass/standardInfo",
              name: "standardInfo",
              redirect: "/admin/mass/standardInfo/infoList",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/mass/standardInfo"),
              children: [
                // 群发消息列表
                {
                  path: "/admin/mass/standardInfo/infoList",
                  name: "infoList0",
                  meta: {
                    requireAuth: true,
                    dex: 0
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/infoList")
                },
                // 创建群发消息
                {
                  path: "/admin/mass/standardInfo/createMass",
                  name: "createMass0",
                  meta: {
                    requireAuth: true,
                    dex: 0
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/createMass/createMass.vue")
                }
              ]
            },
            // 高级群发
            {
              path: "/admin/mass/advanced",
              name: "advanced",
                  redirect: "/admin/mass/advanced/infoList",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/mass/advanced"),
              children: [
                // 群发消息列表
                {
                  path: "/admin/mass/advanced/infoList",
                  name: "infoList1",
                  meta: {
                    requireAuth: true,
                    dex: 1
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/infoList")
                },
                // 创建群发消息
                {
                  path: "/admin/mass/advanced/createMass",
                  name: "createMass1",
                  meta: {
                    requireAuth: true,
                    dex: 1
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/createMass/createMass.vue")
                }
              ]
            },
            // 客服消息群发
            {
              path: "/admin/mass/serviceInfo",
              name: "serviceInfo",
              redirect: "/admin/mass/serviceInfo/infoList",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/mass/serviceInfo"),
              children: [
                // 群发消息列表
                {
                  path: "/admin/mass/serviceInfo/infoList",
                  name: "infoList2",
                  meta: {
                    requireAuth: true,
                    dex: 2
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/infoList")
                },
                // 创建群发消息
                {
                  path: "/admin/mass/serviceInfo/createMass",
                  name: "createMass2",
                  meta: {
                    requireAuth: true,
                    dex: 2
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/createMass/createMass.vue")
                }
              ]
            },
            // 模板消息群发
            {
              path: "/admin/mass/templateInfo",
              name: "templateInfo",
              redirect: "/admin/mass/templateInfo/infoList",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/mass/templateInfo"),
              children: [
                // 群发消息列表
                {
                  path: "/admin/mass/templateInfo/infoList",
                  name: "infoList3",
                  meta: {
                    requireAuth: true,
                    dex: 3
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/infoList")
                },
                // 创建群发消息
                {
                  path: "/admin/mass/templateInfo/createMass",
                  name: "createMass3",
                  meta: {
                    requireAuth: true,
                    dex: 3
                  },
                  component: () =>
                    import("@/pages/admin/mass/components/createMass/createTempMass.vue")
                }
              ]
            }
          ]
        },
        // 统计 statistics
        statisticsPath
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // if (to.name === "home") {
  //   if (process.env.NODE_ENV !== 'production') {
  //     window.open('http://localhost:3000', "_self")
  //   } else {
  //     window.open('/', "_self")
  //   }
  //   return
  // }
  if (from.meta.leaveIntercept && store.getters["publicAccount/hasAccount"]) {
    store.commit('public/SET_SHOWMODAL', true)
    store.commit('public/SET_TO', next)
  } else {
    localSaveOrRead("fromPage", from.name)
    next()
  }
})
router.afterEach((to, from) => {
  const fromPath = from.fullPath.split('/')
  const toPath = to.fullPath.split('/')
  if (fromPath.indexOf('smart') !== -1 && toPath.indexOf('smart') === -1) { // 清空session中存储的智能接待场景值索引
    sessionStorage.setItem('scene', null)
  }
  if (from.meta.leaveIntercept !== undefined) {
    from.meta.leaveIntercept = true
  }
})

export default router
