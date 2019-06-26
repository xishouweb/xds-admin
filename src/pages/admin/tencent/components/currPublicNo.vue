<template>
  <!-- 公众号切换组件 -->
  <div id="public-no">
    <Dropdown trigger="click" @on-click="getcurrent" style="position: relative;">
      <div
        class="public-no"
        :class="{zhengchang: currentPublicNo.status == 1, jingyong: currentPublicNo.status == 0}"
      >
        <div class="item">
          <img :src="currentPublicNo.headImg || defaultImg" alt>
        </div>
        <div class="item">
          <span class="public-name">{{currentPublicNo.principalName}}</span>
          <p class="public-type">{{type[currentPublicNo.serviceTypeInfo]}}</p>
        </div>
        <span class="badge"></span>
        <div class="item btn">
          <span class="icon">&#xe7d6;</span>
        </div>
      </div>

      <DropdownMenu slot="list">
        <DropdownItem
          class="drop-down-item"
          v-for="(item, index) in publicList"
          :name="item.appAccountId"
          :key="index"
        >
          <div
            class="public-no"
            :class="{zhengchang: item.status == 1, jinyong: item.status == 0, tingyong: item.status == 2}"
          >
            <div class="item">
              <img :src="item.headImg || defaultImg" alt>
            </div>
            <div class="item">
              <span class="public-name">{{item.principalName}}</span>
              <p class="public-type">{{type[item.serviceTypeInfo]}}</p>
            </div>
            <span class="badge"></span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <!-- <NewModal header="要切换公众号吗?" v-model="visible" content="系统可能不会保存您所做的更改" @ok="ok"></NewModal> -->
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex"
export default {
  name: "currentPublicNumbuer",
  props: {
    onSelect: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      defaultImg: `${process.env.SELF_BASE_URL}/logo.png`,
      visible: false,
      type: ["订阅号", "订阅号", "服务号"] // 公众号类型
    }
  },
  computed: {
    ...mapState({
      currentPublicNo: state => state.publicAccount.curPublic,
      publicList: state => state.publicAccount.publicAccountList
    })
  },
  methods: {
    ...mapMutations("publicAccount", ["SET_CURPUBLICACCOUNT"]),
    getcurrent(appAccountId) {
      if (appAccountId === this.currentPublicNo.appAccountId) {
        return
      }
      const curPublic =
        this.publicList.filter(item => item.appAccountId === appAccountId)[0] ||
        {}
      // 进行过滤操作
      if (curPublic.status === 2) {
        this.$Message.error("该公众号已被停用")
        return
      }
      if (curPublic.status === 0) {
        this.$Message.error("该公众号已被禁用")
        return
      }
      this.curPublic = curPublic
      // this.visible = true
      this.SET_CURPUBLICACCOUNT(curPublic)
      this.onSelect(this.curPublic.appAccountId)
    }
    // ok() {
    //   this.SET_CURPUBLICACCOUNT(this.curPublic)
    //   this.onSelect(this.curPublic.appAccountId)
    //   this.visible = false
    // }
  }
}
</script>
<style lang="stylus">
#public-no
  .ivu-dropdown.disabled
    pointer-events none
  .drop-down-item:hover
    background #f2f4f5 !important
  .ivu-select-dropdown
    left 3px !important
  .public-no
    display flex
    align-items center
  .item
    vertical-align top
    padding-right 10px
    .public-name
      display inline-block
      max-width 114px
      font-size 14px
      line-height 14px
      color #303133
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
    .public-type
      margin-top 2px
      font-size 12px
      line-height 12px
      color #606366
  .btn
    padding-left 14px
    // display flex
    // align-items center
    .icon
      font-size 14px
  img
    width 28px
    height 28px
    border-radius 3px
  .zhengchang
    color #303133
  .jinyong, .tingyong
    color #979899
  .badge
    position relative
    display inline-block
    height 16px
    line-height 16px
    width 32px
    text-align center
    border-radius 3px
    font-size 12px
    color #ffffff
    align-self flex-start
    &:after
      display inline-block
      transform scale(0.8)
  .zhengchang
    .badge
      background #329800
      &:after
        content '正常'
  .jingyong
    .badge
      background #b1b2b3
      &:after
        content '禁用'
  .tingyong
    .badge
      background #b1b2b3
      &:after
        content '停用'
</style>
