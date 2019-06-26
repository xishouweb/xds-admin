<template>
  <div id="fansManage">
    <div class="tabs" v-if="!isBlank">
      <div class="tabs-bar">
        <router-link
          v-for="(item,index) in routes"
          :key="index"
          class="tabs-bar-item"
          exact-active-class="active"
          :to="item.to"
        >{{item.name}}</router-link>
      </div>
      <div class="tabs-panel">
        <router-view></router-view>
      </div>
    </div>
    <div v-else class="notSeat">
      <div class="noImg">
        <img src="@/assets/images/admin/noTencent.png" alt>
      </div>
      <p>当前员工暂无坐席，无法查看所属粉丝。</p>
    </div>
    <FansDetail v-model="fanVisible"/>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import FansDetail from "./component/FansDetail"
export default {
  name: "fansManage",
  components: { FansDetail },
  data() {
    return {
      routes: [],
      fanVisible: false,
      isBlank: false
    }
  },
  computed: {
    ...mapState("nav", {
      allSecondObj: state => state.allSecondObj
    })
  },
  created() {
    this.init()
    // 重定向路
    this.$root.Bus.$on("actionFans", payload => {
      this.fanVisible = payload
    })
  },
  methods: {
    ...mapActions("fans", [
      "getGroupList",
      "queryCondList"
    ]),
    async init() {
      this.queryCondList()
      const res = await this.getGroupList()
      if (res.code === 1) {
        this.resetRoute(res.data.seatId)
      } else {
        this.$Message.error("获取粉丝信息失败")
      }
    },
    resetRoute(val) {
      // 判断是否有全部粉丝
      let addRoute = []
      if (JSON.stringify(this.allSecondObj).includes("全部粉丝")) {
        addRoute.push({
          name: "全部粉丝",
          to: { name: "allFans" }
        })
      }
      if (val) {
        this.routes = [
          {
            name: "我的所属粉丝",
            to: { name: "myFans" }
          },
          ...addRoute
        ]
        this.$router.replace({
          name: this.$route.name === "fansPage" ? "myFans" : this.$route.name
        })
      } else {
        if (addRoute.length) {
          this.routes = [
            {
              name: "全部粉丝",
              to: { name: "allFans" }
            }
          ]
          this.$router.replace({ name: "allFans" })
        } else {
          this.isBlank = true
        }
      }
    }
  },
  destroyed() {
    this.$root.Bus.$off("actionFans")
  }
}
</script>

<style lang="stylus">
#fansManage
  position relative
  height 100%
  background #fff
  .tabs
    display flex
    flex-direction column
    height 100%
    .tabs-bar
      position relative
      z-index 8
      height 72px
      padding-left 20px
      box-shadow 0px 1px 0px 0px #edeef0
      text-align left
      .tabs-bar-item
        display inline-block
        line-height 54px
        padding 8px 25px
        font-size 18px
        cursor pointer
        &:hover
          color #409fff
        &.active
          color #409fff
          border-bottom solid 2px #409fff
    .tabs-panel
      flex 1
      // overflow auto
  .ivu-tabs-bar
    padding-left 20px
    border-bottom none
    box-shadow 0px 1px 0px 0px #edeef0
    .ivu-tabs-nav
      height 70px
    .ivu-tabs-tab
      line-height 54px
      padding 8px 25px
      font-size 18px
  #fans
    position relative
    display flex
    height 100%
    .fans_left
      padding-top 30px
      width 230px
      flex-shrink 0
    .fans_right
      flex 1
      padding-left 20px
      border-left solid 1px #edeef0
      overflow auto
  .groupAction
    margin 0 10px 20px
    button
      width 100%
  .notSeat
    text-align center
    color #606366
    .noImg
      padding-top 100px
    p
      margin-top 20px
</style>
