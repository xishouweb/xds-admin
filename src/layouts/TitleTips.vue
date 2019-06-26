<template>
  <div class="titleTips"></div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'titleTips',
  data() {
    return {
      secondMenu: {
        tencent: {
          name: '公众号',
          list: [
            {
              menuUrl: 'tencentManage',
              menuName: '公众号管理'
            },
            {
              menuUrl: '',
              menuName: '自定义菜单'
            },
            {
              menuUrl: '',
              menuName: '个性化菜单'
            },
            {
              menuUrl: '',
              menuName: '素材管理'
            },
            {
              menuUrl: '',
              menuName: '自动回复'
            }
          ]
        },
        setting: {
          name: '设置',
          list: [
            {
              menuUrl: 'seatSetting',
              menuName: '坐席设置'
            },
            {
              menuUrl: 'records',
              menuName: '订单记录'
            },
            {
              menuUrl: '',
              menuName: '发票管理'
            },
            {
              menuUrl: 'corpInfo',
              menuName: '企业信息'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      routerInfo: 'nav/getRouterInfo',
      allSecondObj: 'nav/getAllSecondObj'
    })
  },
  methods: {
    ...mapActions({
      setSecondMenu: 'nav/setSecondMenu'
    })
  },
  watch: {
    'routerInfo.name'(val) {
      switch (val) {
        case 'register':
          document.title = '免费试用-欢迎注册销大师'
          break
        case 'company':
          document.title = '我的企业'
          break
        case 'login':
          document.title = '销大师-登录'
          break
        default:
          document.title = '销大师-社交营销系统'
          break
      }
    },
    'routerInfo.path'(val) {
      for (let k in this.allSecondObj) {
        if (val.indexOf(k) >= 0) {
          this.setSecondMenu(this.allSecondObj[k] || [])
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.titleTips
  display none
</style>


