<template>
  <Modal v-model="visible" class="modalService" width="660" @on-cancel="close" @on-visible-change="visibleChange">
    <div slot="header" class="modal-title">
      <span v-if="oldService.seatNo">修改所属客服</span>
      <span v-else>设置所属客服</span>
      <Poptip trigger="hover" placement="right" width="186" content="只展示粉丝关注绑定的公众号下对应的坐席。">
        <i class="icon">&#xe635;</i>
      </Poptip>
    </div>
    <div class="modal-content">
      <div class="service-container">
        <div class="service-target" v-if="oldService.seatNo">
          <p>当前所属客服： {{oldService.eeName}}（{{oldService.seatNo}}）</p>
          <p>请选择新客服</p>
        </div>
        <div class="service-wrapper">
          <ScrollBar>
            <ul>
              <li :key="item.id" v-for="item in list">
                <div
                  class="service-item"
                  @click="selectService(item)"
                  :class="{'service-item-active': item.id === curService.id}"
                >
                  <div class="service-item-info">
                    <span class="name">{{item.eeName || '--'}}</span>
                    <span>({{item.seatNo}})</span>
                  </div>
                  <div class="service-item-info">
                    <span class="status_text">{{item.deptName || '--'}}</span>
                  </div>
                  <div class="service-item-status" v-if="item.id === curService.id">
                    <i class="icon" :style="{color: '#409fff'}">&#xe637;</i>
                  </div>
                </div>
              </li>
            </ul>
          </ScrollBar>
        </div>
        <div class="page">
          <Page
            v-if="totalCount > 10"
            :total="totalCount"
            show-elevator
            :page-size="pageSize"
            :current="curPage"
            size="small"
            show-total
            show-sizer
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
          ></Page>
        </div>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <div class="modalFooter">
        <div class="modal-footer-left">
          已选所属客服：
          <span
            v-if="curService.seatNo"
            class="selectedNum"
          >{{curService.eeName}}({{curService.seatNo}})</span>
          <span v-else class="selectedNum">--</span>
        </div>
        <div class="modal-footer-right">
          <Button type="primary" @click="ok">确定</Button>
          <Button @click="close">取消</Button>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { mapActions } from "vuex"
import { getSeatList } from "@/api/fans"
export default {
  name: "cooperation",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {
          fans: []
        }
      }
    }
  },
  data() {
    return {
      timer: null,
      visible: this.value,
      curService: {},
      totalCount: 0,
      curPage: 1,
      pageSize: 10,
      list: []
    }
  },
  computed: {
    oldService() {
      if (this.params.type === "single") {
        const { kfSeatId, seatNo, eeName } = this.params.fans[0]
        return { id: kfSeatId, eeName, seatNo }
      } else {
        return {}
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      if (!val) {
        // 重置
        this.curService = {}
      }
      this.$emit("input", val)
    },
    params: {
      handler(val) {
        if (val && val.type === "single") {
          const { kfSeatId, seatNo, eeName } = val.fans[0]
          this.curService = { id: kfSeatId, eeName, seatNo }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("fans", ["updateKfSeatSet", "updateKfSeat"]),
    async init() {
      const params = {
        limit: this.pageSize,
        offset: (this.curPage - 1) * this.pageSize,
        status: "ACTIVE",
        appAccountId: this.params.appAccountId
      }
      const res = await getSeatList(params)
      const { code } = res
      if (code === 1 && res.data) {
        this.list = res.data.records.filter(item => item.status !== 4)
        this.totalCount = res.data.totalCount
      }
    },
    selectService(item) {
      if (this.curService.id === item.id) {
        this.curService = {}
        return
      }
      this.curService = item
    },
    async ok() {
      // if (!this.curService.id) {
      //   this.$Message.error("请选择一个坐席")
      // }
      const params = {}
      params.fansIds = this.params.fans.map(item => item.fansId)
      params.targetId = this.curService.id
      params.appAccountId = this.params.appAccountId
      let res = {}
      if (this.params.origin === "detail") {
        res = await this.updateKfSeat({
          fansId: this.params.fans.map(item => item.fansId)[0],
          targetId: this.curService.id,
          appAccountId: this.params.appAccountId
        })
      } else {
        res = await this.updateKfSeatSet(params)
      }
      this.visible = false
      if (res.code === 1) {
        this.$Message.success("设置成功")
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$root.Bus.$emit("resetSelect")
          this.$root.Bus.$emit("updateCurFans")
          this.$root.Bus.$emit("freshfans")
        }, 2000)
      } else {
        this.$Message.error(res.message || "设置失败")
      }
    },
    close() {
      this.visible = false
    },
    pageChange(page) {
      if (page !== this.curPage) {
        this.curPage = page
        this.init()
      }
    },
    pageSizeChange(pageSize) {
      if (this.pageSize !== pageSize) {
        this.pageSize = pageSize
        this.init()
      }
    },
    visibleChange(state) {
      if (state) {
        this.init()
      }
    }
  }
}
</script>
<style lang="stylus">
.modalService
  // 模态
  position relative
  z-index 90
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      top 0
      margin 0 !important // 处理对话框在IE上不居中问题
      .ivu-modal-header
        border-bottom none
      .ivu-modal-footer
        border-top 1px solid #e3e8ee
  // popTip交互
  .ivu-poptip
    .ivu-poptip-popper
      min-width auto
      .ivu-poptip-inner
        white-space normal
      .ivu-poptip-body
        padding 16px
        color #606366
        line-height 24px
        letter-spacing 1px
  // 业务
  .service-target
    margin-bottom 10px
    p
      line-height 30px
  .service-wrapper
    border-top solid 1px #edeff0
    padding-top 20px
    height 420px
    ul
      &:after
        content '.'
        display block
        clear both
        visibility hidden
      li
        float left
        .service-item
          width 140px
          position relative
          border solid 1px #c9cacb
          cursor pointer
          margin-right 15px
          margin-bottom 15px
          border-radius 3px
          height 70px
          padding 14px
          line-height 1
          &-active
            border solid 1px #409fff
          .service-item-info
            display flex
            line-height 24px
            .name, .status_text
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
          .service-item-status
            position absolute
            right -1px
            bottom 0
            .icon
              color #409fff
    .page
      padding 15px 0
  .modalFooter
    display flex
    align-items center
    justify-content space-between
    .modal-footer-left
      color #979899
      .selectedNum
        color #409fff
</style>
