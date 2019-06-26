<template>
  <!-- 公众号切换组件 -->
  <div class="public-no">
    <template v-if="selectType ==1">
    <Dropdown trigger="click" @on-click="getcurrent" style="position: relative;">
      <!-- 当前公众号 -->
      <div class="public-item public-now" :class="{zhengchang: currentPublicNo.status == 1, jingyong: currentPublicNo.status == 0}">
        <img :src="currentPublicNo.headImg || defaultImg" alt="">
        <div class="name">
          <span>{{currentPublicNo.principalName}}</span>
          <p>{{type[currentPublicNo.serviceTypeInfo]}}</p>
        </div>
        <div class="badge"></div>
        <div class="icon">&#xe7d6;</div>
      </div>
      <!-- 下拉选项 -->
      <DropdownMenu slot="list" >
        <DropdownItem
          class="drop-down-item"
          v-for="(item, index) in publicList"
          :name="item.appAccountId"
          :key="index"
        >
          <!-- :disabled="item.status === 1" -->
          <div class="public-item" :class="{zhengchang: item.status == 1, jingyong: item.status == 0, tingyong: item.status == 2}">
            <img :src="item.headImg || defaultImg" alt="">
            <div class="name">{{item.principalName}}</div>
            <div class="badge"></div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    </template>
    <template v-if="selectType == 2">
    <div>
      <Select :value="null" size="small" style="width:124px" @on-change="getcurrentType">
        <Option :value="null">全部公众号</Option>
        <Option v-for="(item, index) in publicList"
          :name="item.appAccountId"
          :key="index" :value="item.appAccountId">{{item.principalName}}</Option>
      </Select>
    </div>
    </template>
  </div>

</template>
<script>
import { mapState, mapMutations } from "vuex"
export default {
  name: 'PublicCut',
  props: {
    onSelect: {
      type: Function,
      default() {
        return () => {}
      }
    },
    selectType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      defaultImg: `${process.env.SELF_BASE_URL}/logo.png`,
      visible: false,
      type: ['订阅号','订阅号','服务号'] // 公众号类型
    }
  },
  computed: {
    ...mapState({
      currentPublicNo: state => state.publicAccount.curPublic,
      publicList: state => state.publicAccount.publicAccountList,
    }),
  },
  watch: {
    currentPublicNo() {
      this.getAllGroupList()
    }
  },
  mounted() {
    // this.getAllGroupList()
  },
  methods: {
    ...mapMutations('publicAccount', ['SET_CURPUBLICACCOUNT']),
    getcurrent(appAccountId) {
      if (appAccountId === this.currentPublicNo.appAccountId) {
        return
      }
      const curPublic = this.publicList.filter(item => item.appAccountId === appAccountId)[0] || {}
      // 进行过滤操作
      if (curPublic.status === 2) {
        this.$Message.error('该公众号已被停用')
        return
      }
      if (curPublic.status === 0) {
        this.$Message.error('该公众号已被禁用')
        return
      }
      this.curPublic = curPublic
      // this.visible = true
      this.SET_CURPUBLICACCOUNT(this.curPublic)
      this.onSelect(this.curPublic.appAccountId)
    },
    getcurrentType(appAccountId) {
      this.$emit('on-change', appAccountId)
    },
    getAllGroupList() {
      // 分组媒体类型,news:图文;image:图片;voice:语音;video:视屏;"file":文件
      ["news", "image", "voice", "video","file"].forEach(item => {
        this.$store.dispatch("tencent/queryCssGroup", {
          type: item,
          appAccountId: this.currentPublicNo.appAccountId
        })
      })
    }
  }
}
</script>
<style lang="stylus">
.public-now
  .badge
    align-self: start
.public-item
  cursor: pointer
  display: flex
  align-items: center
  img
    width: 24px;
    height: 24px;
    border-radius: 3px;
  >div
   margin-left: 10px
  .name
    font-size: 14px
    max-width 114px
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    >p
      font-size: 12px
      padding-top: 4px
      color: #606366

.public-no
  .ivu-dropdown.disabled
    pointer-events none
  .drop-down-item:hover
    background #f2f4f5 !important
  .ivu-select-dropdown
    left: 3px !important
  .zhengchang
    color #303133
  .jingyong
    color #979899
  .zhengchang .badge, .jingyong .badge, .tingyong .badge
      height 16px
      line-height 16px
      width 32px
      text-align center
      border-radius 3px
      font-size 10px
      color #ffffff
      background #329800
      &:after
        letter-spacing 2px
        display inline-block
        transform scale(0.8)
        content '正常'
  .jingyong
    .name
      color: #787c80
    .badge
      background #b1b2b3
      &:after
        content '禁用'
  .tingyong
    .name
      color: #787c80
    .badge
      background #b1b2b3
      &:after
        content '停用'
</style>
