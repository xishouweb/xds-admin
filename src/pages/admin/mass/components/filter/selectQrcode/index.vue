<template>
  <div class="modalContainer qrcode">
    <slot></slot>
    <Modal v-model="visible" class="modalQrcode modalQrcodeSingle" width="800" @on-cancel="close">
      <div slot="header" class="modal-title">
        <span>渠道二维码</span>
      </div>
      <div class="modal-content">
        <div class="qrcode-container select-container">
          <ul class="select-wrap">
            <li class="block">
              <p class="block-title">选择公众号</p>
              <div class="block-cont">
                <BScroll :data="publicList">
                  <ul>
                    <li
                      v-for="item in publicList"
                      :key="item.appAccountId"
                      @click="queryQrcodeGroups(item)"
                      :class="{active: item.appAccountId === curPublic.appAccountId}"
                    >
                      <span>{{ item.principalName }}</span>
                      <i class="icon">&#xe7da;</i>
                    </li>
                  </ul>
                </BScroll>
              </div>
            </li>
            <template v-if="!isdingyue">
              <li class="block">
                <p class="block-title">选择分组</p>
                <div class="block-cont">
                  <BScroll :data="qrcode.group">
                    <ul>
                      <li
                        v-for="item in qrcode.group"
                        :key="item.groupId"
                        @click="queryQrcodeThemeList({ groupId: item.groupId, curPage:1, pageSize: 20 })"
                        :class="{ active: item.groupId === curGroup.groupId }"
                      >
                        <span>{{ item.name }}</span>
                        <i class="icon">&#xe7da;</i>
                      </li>
                      <div class="scroll-status">
                        <p class="noData" v-if="noGroup">{{noDataTxt}}</p>
                      </div>
                    </ul>
                  </BScroll>
                </div>
              </li>
              <li class="block">
                <p class="block-title">选择二维码主题</p>
                <div class="block-cont">
                  <BScroll
                    :data="qrcode.themeList.records"
                    :listenScroll="true"
                    :distanceBottom="0"
                    @downLoadingData="loadMoreTheme"
                  >
                    <ul>
                      <li
                        v-for="item in qrcode.themeList.records"
                        :key="item.id"
                        :class="{ active: item.id === curTheme.qrCodeThemeId }"
                      >
                        <Radio
                          :value="item.id === curTheme.qrCodeThemeId"
                          @on-change="queryQrcodeList({ qrCodeThemeId: item.id, curPage:1, pageSize: 20 })"
                        >
                          <span>{{ item.themeName }}</span>
                        </Radio>
                        <i class="icon">&#xe7da;</i>
                      </li>
                      <div class="scroll-status">
                        <p class="noData" v-if="themePage.noData">{{noDataTxt}}</p>
                        <p class="noMore" v-if="!themePage.hasMore">{{noMoreTxt}}</p>
                        <p class="loading" v-if="themePage.isLoading">正在加载中...</p>
                      </div>
                    </ul>
                  </BScroll>
                </div>
              </li>
              <li class="block">
                <p class="block-title">选择渠道二维码</p>
                <div class="block-cont">
                  <BScroll
                    :data="qrcode.list.records"
                    :listenScroll="true"
                    :distanceBottom="0"
                    @downLoadingData="loadMoreQrcode"
                  >
                    <ul>
                      <CheckboxGroup v-model="selectedValue">
                        <li
                          v-for="item in qrcode.list.records"
                          :key="item.id"
                          :class="{ active: selectedValue.includes(item.id) }"
                        >
                          <Checkbox :label="item.id">
                            <span>{{ item.qrCodeName }}</span>
                          </Checkbox>
                        </li>
                      </CheckboxGroup>
                      <div class="scroll-status">
                        <p class="noData" v-if="qrcodePage.noData">{{noDataTxt}}</p>
                        <p class="noMore" v-if="!qrcodePage.hasMore">{{noMoreTxt}}</p>
                        <p class="loading" v-if="qrcodePage.isLoading">
                          <i class="icon">&#xe640;</i> 加载中...
                        </p>
                      </div>
                    </ul>
                  </BScroll>
                </div>
              </li>
            </template>
            <template v-else>
              <div class="noService">
                <div>
                  <img src="@/assets/images/admin/noTencent.png" alt>
                  <p>当前公众号为订阅号，无法选择渠道二维码</p>
                </div>
              </div>
            </template>
          </ul>
        </div>
      </div>
      <div slot="footer" class="modal-footer">
        <div class="modalFooter">
          <div class="modal-footer-left">
            <template v-if="selectedValue.length">
              已选
              <span class="selectedNum">{{ selectedValue.length }}</span>个渠道二维码
            </template>
            <template v-else-if="curTheme.qrCodeThemeId">
              已选
              <span class="selectedNum">1</span>个渠道二维码主题
            </template>
          </div>
          <div class="modal-footer-right">
            <Button type="primary" @click="qrcodeSaveOk">确定</Button>
            <Button @click="close">取消</Button>
          </div>
        </div>
      </div>
      <Modal v-model="actionVisible" title="提示" class="actionGroup" width="300">
        <div class="actionWrapper">渠道二维码最多可选{{ maxNum }}个。</div>
        <div slot="footer" class="modal-footer">
          <Button type="primary" @click="actionVisible = false">知道了</Button>
        </div>
      </Modal>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import {
  queryQrcodeGroup,
  getGchannelQrCodeThemeListByPage,
  getGchannelQrCodeListByPage
} from "@/api/fans"
export default {
  name: "qrcode-container",
  props: {
    title: {
      type: String,
      default: "渠道二维码"
    },
    value: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default() {
        return {
          public: {}, // 公众号数据
          group: {}, // 分组id {groupId: 123}
          theme: {}, // 主题id {qrCodeThemeId: 12}
          qrcode: [] // 二维码id [1, 2]
        }
      }
    },
    maxNum: {
      type: [String, Number],
      default: 10
    },
    noDataTxt: {
      type: String,
      default: "暂无数据"
    },
    noMoreTxt: {
      type: String,
      default: "没有更多了"
    }
  },
  data() {
    // const publicList = this.$store.state.fans.publicAccountList.filter(
    //   item => item.status === 1
    // )
    return {
      visible: this.value,
      actionVisible: false,
      selectedValue: [],
      // publicList: publicList, // 可用的服务号列表
      // curPublic: {},
      curGroup: {},
      noGroup: false,
      curTheme: {},
      qrcode: {
        group: [],
        themeList: {
          records: []
        },
        list: {
          records: []
        }
      },
      themePage: {
        curPage: 2, // 从第二页开始
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      },
      qrcodePage: {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      },
      isdingyue: false
    }
  },
  computed: {
    // ...mapGetters("fans", ["validPublicAList"])
    ...mapGetters({
      curPublic: 'publicAccount/curPublic'
    }),
    publicList() {
      return [this.curPublic]
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit("input", val)
    },
    selectedValue(val) {
      if (val && val.length > this.maxNum) {
        this.actionVisible = true
        val.splice(val.length - 1, 1)
      }
    },
    defaultValue: {
      handler(val) {
        if (val) {
          // this.curPublic = val.public
          this.curGroup = val.group
          this.curTheme = val.theme
          this.selectedValue = val.qrcode
        }
      },
      deep: true
    },
    // "$store.state.fans.publicAccountList"(val) {
    //   if (val) {
    //     this.publicList = val.filter(item => item.status === 1)
    //   }
    // }
    curPublic: {
      deep: true,
      handler(nv) {
        this.queryQrcodeGroups()
      }
    }
  },
  mounted() {
    // this.$root.Bus.$on("setPublic", val => {
    //   this.publicList = val
    // })
    this.queryQrcodeGroups()
  },
  methods: {
    async queryQrcodeGroups(payload) {
      payload = this.curPublic
      if (!payload) { return }
      // if (payload.appAccountId === this.curPublic.appAccountId) return
      // 重置之前的状态
      this.themePage = {
        curPage: 2, // 从第二页开始
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
      // 重置之前的状态
      this.qrcodePage = {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
      if (payload.serviceTypeInfo === 1) {
        // this.curPublic = payload
        this.isdingyue = true
        return
      } else {
        this.isdingyue = false
      }
      // 清空当前选中
      this.curGroup = {}
      this.curTheme = {}
      this.selectedValue = []
      const response = await queryQrcodeGroup({
        appAccountId: payload.appAccountId,
        type: "channel_qr_code"
      })
      if (response.code === 1 && response.data) {
        response.data = response.data.sort(
          (a, b) => a.groupOrder - b.groupOrder
        )
        if (!response.data.length) {
          this.noGroup = true
        }
        this.qrcode = {
          group: response.data,
          themeList: [],
          list: []
        }
        // this.curPublic = payload
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    async queryQrcodeThemeList(payload) {
      if (payload.groupId === this.curGroup.groupId) return
      // 重置之前的状态
      this.themePage = {
        curPage: 2, // 从第二页开始
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
      // 清空当前选中
      this.curTheme = {}
      this.selectedValue = []
      const params = {}
      params.groupId = payload.groupId
      params.offset = (payload.curPage - 1) * this.pageSize
      params.limit = payload.pageSize
      const response = await getGchannelQrCodeThemeListByPage({
        ...params,
        appAccountId: this.curPublic.appAccountId || payload.appAccountId
      })
      if (response.code === 1 && response.data) {
        if (!response.data.records.length) {
          this.$set(this.themePage, "noData", true)
        } else {
          if (response.data.records.length < payload.pageSize) {
            this.$set(this.themePage, "hasMore", false)
          }
        }
        this.qrcode = {
          group: this.qrcode.group,
          themeList: response.data,
          list: []
        }
        this.curGroup = { groupId: payload.groupId }
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    async queryQrcodeList(payload) {
      if (payload.qrCodeThemeId === this.curTheme.qrCodeThemeId) return
      // 重置之前的状态
      this.qrcodePage = {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
      // 清空当前选中
      this.selectedValue = []
      const params = {}
      params.qrCodeThemeId = payload.qrCodeThemeId
      params.offset = (payload.curPage - 1) * payload.pageSize
      params.limit = payload.pageSize
      const response = await getGchannelQrCodeListByPage({
        ...params,
        appAccountId: this.curPublic.appAccountId || payload.appAccountId
      })
      if (response.code === 1 && response.data) {
        if (!response.data.records.length) {
          this.$set(this.qrcodePage, "noData", true)
        } else {
          if (response.data.records.length < payload.pageSize) {
            this.$set(this.qrcodePage, "hasMore", false)
          }
        }
        this.qrcode = {
          group: this.qrcode.group,
          themeList: this.qrcode.themeList,
          list: response.data
        }
        this.curTheme = { qrCodeThemeId: payload.qrCodeThemeId }
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    async loadMoreTheme() {
      if (!this.themePage.hasMore) return
      if (this.themePage.isLoading) return
      this.$set(this.themePage, "curPage", ++this.qrcodePage.curPage)
      this.$set(this.themePage, "isLoading", true) // 正在加载
      const params = {}
      params.groupId = this.curGroup.groupId
      params.offset = (this.qrcodePage.curPage - 1) * this.qrcodePage.pageSize
      params.limit = this.qrcodePage.pageSize
      const response = await getGchannelQrCodeThemeListByPage({
        ...params,
        appAccountId: this.curPublic.appAccountId
      })
      if (response.code === 1 && response.data) {
        if (response.data.records.length < this.themePage.pageSize) {
          this.$set(this.themePage, "hasMore", false)
        }
        this.$set(this.qrcode.themeList, "records", [
          ...this.qrcode.themeList.records,
          ...response.data.records
        ])
        this.$set(this.themePage, "isLoading", false)
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    async loadMoreQrcode() {
      if (!this.qrcodePage.hasMore) return
      if (this.qrcodePage.isLoading) return
      this.$set(this.qrcodePage, "curPage", ++this.qrcodePage.curPage)
      this.$set(this.qrcodePage, "isLoading", true) // 正在加载
      const params = {}
      params.qrCodeThemeId = this.curTheme.qrCodeThemeId
      params.offset = (this.qrcodePage.curPage - 1) * this.qrcodePage.pageSize
      params.limit = this.qrcodePage.pageSize
      const response = await getGchannelQrCodeListByPage({
        ...params,
        appAccountId: this.curPublic.appAccountId
      })
      if (response.code === 1 && response.data) {
        if (response.data.records.length < this.qrcodePage.pageSize) {
          this.$set(this.qrcodePage, "hasMore", false)
        }
        this.$set(this.qrcode.list, "records", [
          ...this.qrcode.list.records,
          ...response.data.records
        ])
        this.$set(this.qrcodePage, "isLoading", false)
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    qrcodeSaveOk() {
      // if (!this.selectedValue.length && !this.curTheme.qrCodeThemeId) {
      //   this.visible = false
      //   return
      // }
      this.$emit("on-ok", {
        public: this.curPublic,
        group: this.curGroup,
        theme: this.curTheme,
        qrcode: this.selectedValue
      })
      this.visible = false
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="stylus">
.modalContainer.qrcode
  display inline-block
.modalQrcode
  // 模态
  position relative
  z-index 90
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      top 0
      margins: 0 !important
      .ivu-modal-header
        border-bottom none
      .ivu-modal-footer
        border-top 1px solid #e3e8ee
  &.modalQrcodeSingle
    .ivu-modal-body
      padding-top 10px
      padding-bottom 0
  $.modalQrcodeMutiple
    .ivu-modal
      .ivu-modal-header
        border-bottom 1px solid #e3e8ee
  // 业务
  .qrcode-container.select-container
    height 440px
    .scroll-status
      margin-bottom 10px
      text-align center
      color #979899
      .noData
        padding-top 100px
    .noService
      flex 1
      display flex
      align-items center
      justify-content center
      text-align center
      p
        margin-top 12px
    ul.select-wrap
      display flex
      height 100%
      font-size 14px
      li.block
        display flex
        flex-direction column
        width 25%
        &:not(:last-of-type)
          border-right solid 1px #edeef0
        .block-title
          padding-left 20px
          color #979899
          margin-bottom 10px
        .block-cont
          flex 1
          overflow auto
          width: 100%
          li
            display flex
            justify-content space-between
            padding-right 10px
            padding-left 20px
            line-height 34px
            &>label
              flex 1
              margin-right 0
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
            &:hover
              background-color #e6edf5
              color #409eff
            &.active
              background-color #e6edf5
              color #409eff
  // 底部交互
  .modalFooter
    display flex
    align-items center
    justify-content space-between
    .modal-footer-left
      color #979899
      .selectedNum
        color #409fff
// 交互model
.actionGroup
  // 模态
  position relative
  z-index 100
  .ivu-modal-mask
    display none
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      box-shadow 0px 1px 6px 0px rgba(0, 0, 0, 0.2)
      border-radius 3px
      border solid 1px #cacbcc
      top 0
      .ivu-modal-header
        border-bottom none
</style>
