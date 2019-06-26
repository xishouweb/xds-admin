<template>
  <div class="modalContainer poster">
    <slot></slot>
    <Modal v-model="visible" class="modalPoster modalPosterSingle" width="700" @on-cancel="close">
      <div slot="header" class="modal-title">
        <span>裂变海报</span>
      </div>
      <div class="modal-content">
        <div class="poster-container select-container">
          <ul class="select-wrap">
            <li class="block">
              <p class="block-title">选择公众号</p>
              <div class="block-cont">
                <BScroll :data="publicList">
                  <ul>
                    <li
                      v-for="item in publicList"
                      :key="item.appAccountId"
                      :class="{'active': item.appAccountId === curPublic.appAccountId }"
                      @click="queryPosterGroups(item)"
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
                  <BScroll :data="poster.group">
                    <ul>
                      <li
                        v-for="item in poster.group"
                        :key="item.groupId"
                        @click="queryPosterList({ groupId: item.groupId, curPage:1, pageSize: 20 })"
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
              <li class="block" :style="{width: '40%'}">
                <p class="block-title">选择裂变海报</p>
                <div class="block-cont">
                  <BScroll
                    :data="poster.list.records"
                    :listenScroll="true"
                    :distanceBottom="0"
                    @downLoadingData="loadMorePoster"
                  >
                    <ul>
                      <CheckboxGroup v-model="selectedValue">
                        <li
                          v-for="item in poster.list.records"
                          :key="item.id"
                          :class="{ active: selectedValue.includes(item.id) }"
                        >
                          <Checkbox :label="item.id">
                            <span>{{ item.posterTemplateName }}</span>
                          </Checkbox>
                        </li>
                      </CheckboxGroup>
                      <div class="scroll-status">
                        <p class="noData" v-if="posterPage.noData">{{noDataTxt}}</p>
                        <p class="noMore" v-if="!posterPage.hasMore">{{noMoreTxt}}</p>
                        <p class="loading" v-if="posterPage.isLoading">
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
                  <p>当前公众号为订阅号，无法选择裂变海报</p>
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
              <span class="selectedNum">{{ selectedValue.length }}</span>个裂变海报
            </template>
          </div>
          <div class="modal-footer-right">
            <Button type="primary" @click="posterSaveOk">确定</Button>
            <Button @click="close">取消</Button>
          </div>
        </div>
      </div>
      <Modal v-model="actionVisible" title="提示" class="actionGroup" width="300">
        <div class="actionWrapper">裂变海报最多可选{{ maxNum }}个。</div>
        <div slot="footer" class="modal-footer">
          <Button type="primary" @click="actionVisible = false">知道了</Button>
        </div>
      </Modal>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { queryPosterGroup, getPosterTemplateByPage } from "@/api/fans"
export default {
  name: "poster-container",
  props: {
    title: {
      type: String,
      default: "裂变海报"
    },
    value: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default() {
        return {
          public: {},
          group: {},
          poster: []
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
      poster: {
        group: [],
        list: {
          records: []
        }
      },
      posterPage: {
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
          this.selectedValue = val.poster
        }
      },
      deep: true
    },
    // "$store.state.fans.publicAccountList"(val) {
    //   if (val) {
    //     this.publicList = val.filter(item => item.status === 1)
    //   }
    // },
    curPublic: {
      deep: true,
      handler(nv) {
        this.queryPosterGroups()
      }
    }
  },
  mounted() {
    // this.$root.Bus.$on("setPublic", val => {
    //   this.publicList = val
    // })
    this.queryPosterGroups()
  },
  methods: {
    async queryPosterGroups(payload) { // 获取裂变海报分组
      payload = this.curPublic
      if (!payload) { return }
      // if (payload.appAccountId === this.curPublic.appAccountId) return
      // 重置之前选中的状态
      this.posterPage = {
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
      this.selectedValue = []
      const response = await queryPosterGroup({
        appAccountId: payload.appAccountId,
        type: "posterTemplate"
      })
      // console.log(response)
      if (response.code === 1 && response.data) {
        response.data = response.data.sort(
          (a, b) => a.groupOrder - b.groupOrder
        )
        if (!response.data.length) {
          this.noGroup = true
        }
        this.poster = {
          group: response.data,
          list: []
        }
        // this.curPublic = payload
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    async queryPosterList(payload) { // 获取粉丝列表
      if (payload.groupId === this.curGroup.groupId) return
      this.posterPage = {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
      // 清空当前选中
      this.selectedValue = []
      const params = {}
      params.groupId = payload.groupId
      params.offset = (payload.curPage - 1) * payload.pageSize
      params.limit = payload.pageSize
      const response = await getPosterTemplateByPage({
        ...params,
        appAccountId: this.curPublic.appAccountId || payload.appAccountId
      })
      if (response.code === 1 && response.data) {
        if (!response.data.records.length) {
          this.$set(this.posterPage, "noData", true)
        } else {
          if (response.data.records.length < payload.pageSize) {
            this.$set(this.posterPage, "hasMore", false)
          }
        }
        this.poster = {
          group: this.poster.group,
          list: response.data
        }
        this.curGroup = { groupId: payload.groupId }
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    async loadMorePoster() {
      if (!this.posterPage.hasMore) return
      if (this.posterPage.isLoading) return
      this.$set(this.posterPage, "curPage", ++this.posterPage.curPage)
      this.$set(this.posterPage, "isLoading", true) // 正在加载
      const params = {}
      params.groupId = this.curGroup.groupId
      params.offset = (this.posterPage.curPage - 1) * this.posterPage.pageSize
      params.limit = this.posterPage.pageSize
      const response = await getPosterTemplateByPage({
        ...params,
        appAccountId: this.curPublic.appAccountId
      })
      if (response.code === 1 && response.data) {
        if (response.data.records.length < this.posterPage.pageSize) {
          this.$set(this.posterPage, "hasMore", false)
        }
        this.$set(this.poster.list, "records", [
          ...this.poster.list.records,
          ...response.data.records
        ])
        this.$set(this.posterPage, "isLoading", false)
      } else {
        this.$Message.error(response.error || "获取失败")
      }
    },
    posterSaveOk() {
      this.$emit("on-ok", {
        public: this.curPublic,
        group: this.curGroup,
        poster: this.selectedValue
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
.modalContainer.poster
  display inline-block
.modalPoster
  // 模态
  position relative
  z-index 90
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      top 0
      margin: 0 !important
      .ivu-modal-header
        border-bottom none
      .ivu-modal-footer
        border-top 1px solid #e3e8ee
  &.modalPosterSingle
    .ivu-modal-body
      padding-top 10px
      padding-bottom 0
  $.modalPosterMutiple
    .ivu-modal
      .ivu-modal-header
        border-bottom 1px solid #e3e8ee
  // 业务
  .poster-container.select-container
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
        width 30%
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
      top 0
      margin: 0 !important
      .ivu-modal-header
        border-bottom none
</style>
