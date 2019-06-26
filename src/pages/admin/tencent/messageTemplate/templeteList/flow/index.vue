<template>
  <div id="tempFlow">
    <div class="container">
      <Spin fix v-if="loadingData">
        <Icon type="load-c" size="40" class="spin-icon-load"></Icon>
        <div>loading</div>
      </Spin>
      <template v-else>
        <BScroll :offsetBottom="60" v-if="templateList.length" @click.native="closePoptip">
          <div class="cardList">
            <Waterfall align="left" @click.native="closePoptip">
              <template>
                <WaterfallItem
                  class="msgCard"
                  v-for="item in templateList"
                  :key="item.id"
                  :width="330"
                  :class="{disabled: !item.status}"
                  style="margin-bottom: 50px"
                >
                  <i class="icon close" v-if="!item.status">&#xe75f;</i>
                  <Poptip
                    :style="{position:'absolute', 'right': '15px'}"
                    placement="bottom-end"
                    transfer
                    popper-class="popperTemp"
                    v-if="item.status"
                    v-model="item.showPoptip"
                    @click.native="poptipClick(item)"
                  >
                    <Icon class="action" type="android-more-horizontal" size="24"></Icon>
                    <div slot="content" class="action-list">
                      <ul>
                        <li @click="modityTemp(item)">修改</li>
                        <li @click="delTemp(item)">删除</li>
                        <li :class="{disabled: !item.linkAddress || item !== 1}">
                          <a :href="item.linkAddress" target="_blank">查看链接</a>
                        </li>
                      </ul>
                    </div>
                  </Poptip>
                  <div class="head">
                    <span class="title">
                      {{item.title}}
                      <!-- <Poptip
                        placement="bottom-end"
                        transfer
                        popper-class="popperTemp"
                        v-if="item.status"
                        v-model="item.showPoptip"
                        @click.native="poptipClick(item)"
                      >
                        <Icon class="action" type="android-more-horizontal"></Icon>
                        <div slot="content" class="action-list">
                          <ul>
                            <li @click="modityTemp(item)">修改</li>
                            <li @click="delTemp(item)">删除</li>
                            <li :class="{disabled: !item.linkAddress}">
                              <a :href="item.linkAddress" target="_blank">查看链接</a>
                            </li>
                          </ul>
                        </div>
                      </Poptip> -->
                      <span class="action del" @click="delTemp(item)" v-if="!item.status">删除</span>
                    </span>
                    <a class="temp-mp" v-if="item.jumpType === 2"><i class="icon">&#xe68f;</i></a>
                    <p class="date">{{item.createTime | filtTime}}</p>
                  </div>
                  <div class="body">
                    <p class="txt" v-html="formatCont(item.content, item.templateDateList)"></p>
                  </div>
                  <div class="footer">
                    <div class="txt">{{item.name}}</div>
                  </div>
                </WaterfallItem>
              </template>
            </Waterfall>
          </div>
        </BScroll>
        <div class="nodata" v-else>
          <div class="cont">
            <img src="@/assets/images/nodata.png" alt="暂无数据">
            <p>模板消息为空</p>
          </div>
        </div>
      </template>
    </div>
    <div class="page">
      <Page
        :total="totalCount"
        v-show="totalCount > 10"
        size="small"
        show-total
        show-elevator
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      ></Page>
    </div>
    <NewModal v-model="showModal" header="删除提示" content="确定删除该模板吗？" @ok="delTempOk"></NewModal>
  </div>
</template>

<script>
import { mapState } from "vuex"
// import { addTags } from "@/utils/textHtmlChange"
import { addTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
import { Waterfall, WaterfallItem } from "vue2-waterfall"
export default {
  name: "tempFlow",
  components: {
    Waterfall,
    WaterfallItem
  },
  data() {
    const col = String(
      parseInt((document.documentElement.clientWidth - 540) / 280)
    )
    return {
      loadingData: false,
      showModal: false,
      totalCount: 1,
      templateList: [],
      currentTem: {},
      curItem: null, // 当前显示了操作按钮的对象
      filter: {
        groupId: "",
        pageSize: 10,
        curPage: 1,
        condition: ""
      },
      col: col
    }
  },
  computed: {
    ...mapState("publicAccount", {
      appAccountId: state => state.curPublic.appAccountId,
      curPublic: state => state.curPublic
    }),
    groupTotal() {
      return this.groupList.reduce((init, next) => {
        return init + next.count
      }, 0)
    }
  },
  watch: {
    curPublic() {
      this.filter = {
        groupId: "",
        pageSize: 10,
        curPage: 1,
        condition: ""
      } // 重置
      this.initData()
    }
  },
  filters: {
    filtTime(val) {
      // 过滤掉创建时间中的时分秒
      if (!val) {
        return ""
      }
      val = val.split(/\s/g)
      return val[0]
    }
  },
  created() {
    this.on(document.body, "click", this.closePoptip)
  },
  mounted() {
    // 交互更新
    this.$root.Bus.$on("updateTemplate", obj => {
      const params = { ...this.filter, ...obj }
      if (obj.groupId) {
        sessionStorage.setItem("messageTemplateGroupId", obj.groupId)
        params.condition = ""
      }
      this.filter = params
      this.initData()
    })
    // 公众号切换更新
    // this.$root.Bus.$on("updateData", () => {
    //   this.filter = {
    //     groupId: "",
    //     pageSize: 10,
    //     curPage: 1,
    //     condition: ""
    //   } // 重置
    //   this.initData()
    // })
    // 更新col
    window.onresize = () => {
      this.col = String(
        parseInt((document.documentElement.clientWidth - 540) / 280)
      )
    }
    this.initData()
  },
  methods: {
    async initData() {
      this.loadingData = true
      const { curPage, pageSize, ...rest } = this.filter
      let params = {
        appAccountId: this.appAccountId,
        offset: (curPage - 1) * pageSize,
        limit: pageSize,
        ...rest
      }
      const response = await this.post(
        this.Path.getCustomTemplateListByPage,
        params
      )
      this.loadingData = false
      const { code, data } = response
      if (code === 1) {
        this.templateList = data.records
        this.totalCount = data.totalCount
      } else {
        this.$Message.error("系统错误，表单错误")
      }
    },
    pageChange(page) {
      if (page !== this.filter.curPage) {
        this.filter = { ...this.filter, curPage: page }
        this.initData()
      }
    },
    pageSizeChange(pageSize) {
      if (this.filter.pageSize !== pageSize) {
        this.filter = { ...this.filter, curPage: 1, pageSize }
        this.initData()
      }
    },
    delTemp(item) {
      document.body.click()
      this.currentTem = item
      this.showModal = true
    },
    modityTemp(item) {
      // 设置信息
      document.body.click()
      this.$router.push({
        name: "messageTAdd",
        params: { step: 1 },
        query: { id: item.id, templateId: item.templateId }
      })
    },
    async delTempOk() {
      let params = {
        appAccountId: this.appAccountId,
        id: this.currentTem.id
      }
      const response = await this.post(
        this.Path.deleteCssCustomTemplate,
        params
      )
      if (response.code === 1) {
        this.$Message.success("删除成功")
        this.initData()
        this.$root.Bus.$emit("updateGroup") // 更新分组
      } else {
        this.$Message.error("删除失败")
      }
      this.showModal = false
    },
    formatCont(cont, list) {
      cont = (cont || "").replace(/\n/g, "<br/>")
      let newCont = cont.replace(/{{.+?}}/g, function(txt) {
        let value
        list.forEach(item => {
          item.value = addTags(item.value, 'text')
          if (txt.includes(item.key)) {
            value = item.value
              ? `<span style="color:${item.color}">${item.value}</span>`
              : ""
          }
        })
        return value
      })
      // 对内容头无内容移除换行
      newCont = newCont.replace(/^(<br\/>)+/, "")
      return newCont
    },
    poptipClick(v) {
      // 点击气泡提示
      this.closePoptip()
      this.curItem = v
    },
    closePoptip() {
      // 关闭气泡提示
      if (this.curItem && this.curItem.showPoptip) {
        this.curItem.showPoptip = false
      }
    }
  }
}
</script>

<style lang="stylus">
#tempFlow
  height 100%
  display flex
  flex-direction column
  .container
    position relative
    flex 1
  .page
    padding 20px 0 40px
    text-align right
  .nodata
    height 100%
    display flex
    justify-content center
    align-items center
    text-align center
    line-height 30px
.cardList
  padding 8px
  .msgCard
    position relative
    margin-bottom 20px
    width 280px
    background-color #ffffff
    border solid 1px #e3e4e5
    padding 15px 15px 0
    line-height 20px
    text-align left
    &:hover
      box-shadow 0px 3px 12px 0px rgba(0, 0, 0, 0.25)
      .action
        color #409eff
    &.disabled
      opacity 0.3
      .close
        position absolute
        font-size 80px
        left 50%
        top 50%
        transform translateX(-50%) translateY(-50%)
      .title .action.del
        float right
        font-size 14px
        opacity 1
    .head
      .title
        position relative
        font-size 16px
        color #000
        .ivu-poptip
          float right
        .action
          font-size 24px
          // position absolute
          // right 0
      .date
        font-size 12px
        color #8c8c8c
      .temp-mp
        color: #b1b2b2
        // &:hover
        //   cursor: pointer
        //   color: #409fff
        >i
          margin-left: 5px
    .body
      color #000000
      padding-bottom 13px
      font-size 14px
      .txt
        margin-top 30px
        word-break break-all
    .footer
      border-top solid 1px #e3e4e6
      font-size 12px
      line-height 36px
.popperTemp.ivu-poptip-popper
  min-width auto
  .ivu-poptip-inner
    box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35) !important
    border none !important
    .ivu-poptip-body
      padding 0
  .action-list
    width 90px
    padding 10px 0
    text-align center
    li
      line-height 30px
      &:not(.disabled):hover
        background #409eff
        color #fff
        a
          color #fff
      &.disabled
        a
          color #cacbcc
          pointer-events none
</style>
