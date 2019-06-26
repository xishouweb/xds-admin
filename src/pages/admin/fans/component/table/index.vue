<template>
  <div id="fansTable">
    <slot name="actionTop">
      <div class="table-action">
        <div class="table-action-left">
          <p v-if="total !== ''">{{total}}</p>
          <div class="actionGroup">
            <Button size="small" type="primary">新建</Button>
          </div>
        </div>
        <div class="table-action-right">
          <SearchBox v-model="searchInput" holder="搜索"></SearchBox>
          <!-- <div class="searchInputWrap"> 没有搜索的事件处理？
            <input v-model="searchInput" placeholder="搜索">
            <p class="inputExtra">
              <i class="icon">&#xe634;</i>
            </p>
          </div>-->
          <div class="actionWrap">
            <span class="icon">&#xe66c;</span>
            <span class="icon">&#xe62b;</span>
          </div>
        </div>
      </div>
    </slot>
    <div class="fans-table" :style="{paddingRight: '10px'}">
      <Table
        ref="table"
        :loading="loading"
        :columns="columns"
        :data="data"
        @on-selection-change="selectionChange"
        @on-sort-change="sortChange"
        no-data-text="粉丝列表为空"
      ></Table>
    </div>
    <div class="fans-common_pro" slot="action">
      <div class="fans-left_pro">
        <div class="fans-checkbox">
          <i>
            <Checkbox :value="isAllChoosed" :disabled="!data.length" @on-change="setAllChoose">全选</Checkbox>
          </i>
        </div>
        <Button size="small" @click.stop="setTag">设置标签</Button>
        <Button size="small" @click="setSeat">设置客服</Button>
        <slot name="action" :data="validItems"></slot>
      </div>
      <div class="fans-pages">
        <slot name="page"></slot>
      </div>
    </div>
    <!-- <FansDetail v-model="fanVisible"/> -->
    <Tag v-model="tagVisible" :params="params"></Tag>
    <Cooperation v-model="cooVisible" :params="params"/>
    <Group v-model="groupVisible" :params="params"/>
    <NewModal
      v-model="showModal"
      header="删除提示"
      content="您正在删除该粉丝信息，删除后列表中不显示，您确定要删除吗？"
      @ok="delFanOk"
    ></NewModal>
    <NewModal
      v-model="actionVisible"
      header="操作提示"
      confrim="知道了"
      :cancelBtn="false"
      :content="tipContent"
    ></NewModal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
// import FansDetail from "../FansDetail"
import Tag from "../actionModal/tag"
import Cooperation from "../actionModal/cooperation"
import Group from "../actionModal/group"
// 场景常量
const subscribeScene = {
  ADD_SCENE_SEARCH: "搜索公众号",
  ADD_SCENE_ACCOUNT_MIGRATION: "公众号迁移",
  ADD_SCENE_PROFILE_CARD: "名片分享",
  ADD_SCENE_QR_CODE: "扫描二维码",
  ADD_SCENE_PROFILE_LINK: "图文页内名称点击",
  ADD_SCENE_PROFILE_ITEM: "图文页右上角菜单",
  ADD_SCENE_PAID: "支付后关注",
  ADD_SCENE_OTHERS: "其他",
  ADD_SCENE_UNKNOWN_CHANNEL_QR_CODE: "未知渠道二维码",
  ADD_SCENE_UNKNOWN_FANS_POSTER: "未知裂变海报"
}
const SEX = {
  0: "未知",
  1: "男",
  2: "女"
}
export default {
  name: "tablesAll",
  components: { Tag, Cooperation, Group },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: [String, Number],
      default() {
        ""
      }
    },
    addField: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      timer: null,
      actionVisible: false,
      // fanVisible: false,
      tagVisible: false,
      cooVisible: false,
      groupVisible: false,
      showModal: false,
      searchInput: "",
      params: {}, // 交互需要的参数
      selectedGroup: "",
      processData: null,
      selectedItems: [], // 选择的粉丝
      visible: false,
      focusFans: {},
      tipContent: ""
    }
  },
  computed: {
    ...mapState("fans", {
      seatId: state => state.fansGroupList.seatId
    }),
    validItems() {
      if (this.selectedItems.length) {
        return this.selectedItems.every(
          item => item.appAccountId === this.selectedItems[0].appAccountId
        )
      } else {
        return false
      }
    },
    isAllChoosed() {
      let isAllChoosed = true
      if (!this.selectedItems.length) isAllChoosed = false
      if (this.selectedItems.length !== this.data.length) isAllChoosed = false
      return isAllChoosed
    },
    isCreator() {
      const userInfo = this.getToken()
      return (
        this.$store.state.survey.saveloginCompany.createId === userInfo.userId
      )
    }
  },
  mounted() {
    this.$root.Bus.$on("tagModal", params => {
      this.getTagsByWx({ appAccountIds: [params.appAccountId] }).then(() => {
        this.params = params
        this.tagVisible = true
      })
    })
    this.$root.Bus.$on("toggleModal", params => {
      this.params = params
      this.groupVisible = true
    })
    this.$root.Bus.$on("serviceModal", params => {
      this.params = params
      this.cooVisible = true
    })
    this.$root.Bus.$on("resetSelect", params => {
      this.resetTableSelect()
    })
  },
  methods: {
    ...mapActions("fans", ["getFan", "getTagsByWx", "deleteFans"]),
    async showFan(item) {
      const res = await this.getFan({
        id: item.fansId,
        appAccountId: item.appAccountId
      })
      if (res.code === 1) {
        // this.fanVisible = true
        this.$root.Bus.$emit("actionFans", true)
      } else {
        this.$Message.error("获取粉丝信息失败")
      }
    },
    deleteFan(fans) {
      this.focusFans = fans
      this.showModal = true
    },
    async delFanOk() {
      const params = {}
      params.id = this.focusFans.fansId
      params.appAccountId = this.focusFans.appAccountId
      const response = await this.deleteFans(params)
      if (response.code === 1) {
        this.$Message.success("删除成功")
        // 刷新
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$root.Bus.$emit("freshfans")
        }, 2000)
      } else {
        this.$Message.error("删除失败")
      }
    },
    // 导出数据,根据columns格式化数据
    exportCsv() {
      let columns = [
        {
          key: "nickName",
          title: "粉丝昵称"
        },
        {
          key: "name",
          title: "姓名"
        },
        {
          key: "wxPublicAccountName",
          title: "公众号"
        },
        {
          key: "subscribeScene",
          title: "来源"
        },
        {
          key: "phone",
          title: "联系电话"
        },
        {
          key: "kfSeatId",
          title: "所属客服"
        },
        {
          key: "subscribe",
          title: "关注状态"
        },
        {
          key: "conversationNum",
          title: "粉丝来访"
        },
        {
          key: "messageNum",
          title: "粉丝消息"
        },
        {
          key: "fansWxTagDtos",
          title: "标签"
        },
        {
          key: "conversationActiveTime",
          title: "最后互动时间"
        },
        {
          key: "sex",
          title: "性别"
        },
        {
          key: "age",
          title: "年龄"
        },
        {
          key: "kfSetArea",
          title: "地区"
        },
        {
          key: "weChat",
          title: "微信号"
        },
        {
          key: "qq",
          title: "QQ"
        }
      ]
      let data = []
      data = (this.data || []).map(item => ({
        ...item,
        subscribeScene: `${item.specificSourceName ||
          subscribeScene[item.subscribeScene]}`,
        kfSeatId: item.seatNo ? `${item.eeName || "--"}/${item.seatNo}` : `--`,
        subscribe: item.subscribe ? "已关注" : "已取消",
        sex: SEX[item.sex],
        fansWxTagDtos: (item.fansWxTagDtos || []).map(v => v.tagName).join("/"),
        kfSetArea: (
          item.kfSetArea ||
          item.positionSetArea ||
          item.wxSetArea ||
          ""
        ).replace(/,/g, "")
      }))
      this.$refs.table.exportCsv({
        filename: "粉丝列表",
        original: false,
        columns: columns,
        data: data
      })
    },
    setAllChoose(val) {
      // 全选及取消全选
      this.$refs.table.selectAll(!this.isAllChoosed)
    },
    selectionChange(selection) {
      this.selectedItems = selection
    },
    sortChange({ column, key, order }) {
      this.$emit("sort", { order, sort: key })
    },
    filterSelectFan() {
      if (this.selectedItems.length) {
        if (
          this.selectedItems.some(item => item.kfSeatId !== this.seatId) &&
          !this.isCreator
        ) {
          this.actionVisible = true
          this.tipContent =
            "当前所选粉丝中不是你的所属粉丝，无法设置，请重新选择。"
          // "当前所选粉丝中包含其他客服的所属粉丝，无法设置，请重新选择"
          return false
        }
        if (this.selectedItems.length === 1) {
          return {
            fans: this.selectedItems,
            appAccountId: this.selectedItems[0].appAccountId,
            selectedTag: this.selectedItems[0].fansWxTagDtos,
            type: "single"
          }
        } else {
          // 多选
          const firstItemId = this.selectedItems[0].appAccountId
          if (
            this.selectedItems.every(item => item.appAccountId === firstItemId)
          ) {
            // 相同公众号
            return {
              fans: this.selectedItems,
              appAccountId: this.selectedItems[0].appAccountId,
              type: "mutiple"
            }
          } else {
            // 不同公众号
            this.actionVisible = true
            this.tipContent =
              "当前所选的粉丝不在同一公众号内，请选择同一公众号的粉丝或者选择一个公众号再选择粉丝"
            // this.$Message.error("请选择同一公众号的粉丝")
            return false
          }
        }
      } else {
        this.$Message.info("至少选择一个粉丝")
        return false
      }
    },
    // 设置标签
    async setTag() {
      const res = this.filterSelectFan()
      if (res) {
        const { appAccountId } = res
        const response = await this.getTagsByWx({
          appAccountIds: [appAccountId]
        })
        if (response.code === 1) {
          this.params = res
          this.tagVisible = true
        }
      }
    },
    setSeat() {
      const res = this.filterSelectFan()
      if (res) {
        this.params = res
        this.cooVisible = true
      }
    },
    resetTableSelect() {
      this.$refs.table.selectAll(false)
    }
  },
  destroyed() {
    this.$root.Bus.$off("tagModal")
    this.$root.Bus.$off("toggleModal")
    this.$root.Bus.$off("serviceModal")
    this.$root.Bus.$off("resetSelect")
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
#fansTable
  .table-action
    z-index 10
    position relative
    display flex
    justify-content space-between
    align-items center
    margin-bottom 20px
    &-left, &-right
      display flex
      align-items center
      font-size 14px
    .actionGroup
      button
        margin-right 10px
      .icon
        cursor pointer
    // .searchInputWrap
    // position relative
    // display inline-block
    // border 1px solid #ddd
    // line-height 40px
    // height 42px
    // border-radius 3px
    // position relative
    // width 200px
    // margin-right 10px
    // input
    // position absolute
    // left 10px
    // top 1px
    // height 38px
    // right 20px
    // .inputExtra
    // position absolute
    // right 0
    // width 28px
    // text-align center
    // cursor pointer
    // font-size 20px
    // color #aaa
    // .icon
    // font-size 20px
    .actionGroup
      .icon
        font-size 18px
        margin 0 10px
  .ivu-table-wrapper
    width 100%
    .ivu-table-tip span
      display inline-block
      padding 57px
      font-size 14px
  .fans-like_a
    border 1px solid text_color
    inline()
    center()
    width 50px
    radius(3px)
    height 24px
    line-height 22px
    color #409eff
  .fans-ivu-table th
    bort(1px solid #e3e4e6)
    borb(0)
  .fans-ivu-table-cell
    padr(5px)
    padl(5px)
    overflow visible
  .fans-process_btn
    inline()
    padding 15px
    fn(22px)
    font-weight bold
  .fans-mr10
    inline()
    mr(8px)
  .fans-img_portrait
    fl()
    width 20px
    height 20px
    mr(5px)
  .fans-wechat_name
    fl()
    mt(2px)
  .fans-ivu-spin-fix
    bgColor(hsla(0, 0%, 100%, 0.9))
  .basicInfo
    display flex
    align-items center
    padding 15px 0
    line-height 24px
    img
      width 44px
      height 44px
    .right
      margin-left 15px
      .nickName
        color #303133
      .name
        color #979899
  .wrap
    line-height 24px
    .txt1
      color #303133
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .txt2
      width 126px
      color #979899
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
  .fans-common_pro
    margin-right 10px
    margin-bottom 20px
    setBetween()
    mt(20px)
    .fans-left_pro
      fl()
      & > button
        fl()
        margin 0 5px
        // bgColor()
      .fans-checkbox
        mt(8px)
        fl()
        mr(20px)
        ml(18px)
    .fans-pages
      fr()
      mt(-5px)
  .choosesWrap
    .chooses-title
      margin-bottom 14px
    .chooses-list
      li
        margin-bottom 10px
  .moveGroupWrap
    .ivu-poptip-body
      padding 0
    .chooses-servicer
      height 200px
    .chooses-list, .chooses-servicer
      padding 16px 0 12px 14px
      li
        margin-bottom 16px
    .chooses-action
      padding-bottom 10px
      text-align center
      & > button
        margin 0 5px
</style>
