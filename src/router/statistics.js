// 统计模块 statistics
import store from '../store'
const statisticsPath = {
  path: "/admin/statistics",
  name: "statistics",
  redirect: "/admin/statistics/" + ((store.state.nav.allSecondObj['statistics'] && store.state.nav.allSecondObj['statistics'].list[0].menuUrl) || 'users'),
  meta: {
    requireAuth: true
  },
  component: () => import("@/layouts/secondMenu"),
  children: [
    // 用户概况
    {
      path: "/admin/statistics/users",
      name: "users",
      meta: {
        requireAuth: true
      },
      component: () => import("@/pages/admin/statistics/users"),
    },
    // 访问量统计
    {
      path: "/admin/statistics/views",
      name: "views",
      meta: {
        requireAuth: true,
      },
      component: () => import("@/pages/admin/statistics/views")
    },
    // 客服会话统计
    {
      path: "/admin/statistics/sessions",
      name: "sessions",
      meta: {
        requireAuth: true
      },
      component: () => import("@/pages/admin/statistics/sessions"),
    }
  ]
}

export default statisticsPath
