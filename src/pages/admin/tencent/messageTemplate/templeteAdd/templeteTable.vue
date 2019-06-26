<template>
  <div id="tempTable">
    <div class="tableAction">
      <p class="tableActonL">
        当前已有
        <span>{{data.length}}</span> 个模板，还可添加
        <span>{{25 - data.length}}</span> 个模版
      </p>
      <div class="tableActionR">
        <Button @click="syncWxTemps" :loading="syncLoading">同步微信模板</Button>
        <Button @click="routerWx">登陆微信公众平台添加模板</Button>
      </div>
    </div>
    <div class="tableWrapper">
      <BScroll :offsetBottom="80">
        <div id="newtable-container">
          <table id="records-table" cellspacing="0">
            <thead class="new-table-header">
              <tr>
                <td class="td1">选择</td>
                <td class="td2">序号</td>
                <td class="td3">模板ID</td>
                <td class="td4">标题</td>
                <td class="td5">一级行业</td>
                <td class="td6">二级行业</td>
                <td class="td8">操作</td>
              </tr>
            </thead>
            <tbody class="new-table-body" v-if="data.length > 0">
              <tr
                class="new-table-tr"
                v-for="(item, index) of data"
                :key="index"
                @click="getCurrentTemp(item.templateId)"
              >
                <td>
                  <div class="td-container">
                    <Radio :value="item.templateId === selectedRowId"></Radio>
                  </div>
                </td>
                <td class="td2">
                  <div class="td-container">{{index + 1}}</div>
                </td>
                <td class="td3">
                  <div class="td-container">
                    <div>{{item.templateId}}</div>
                  </div>
                </td>
                <td class="td4">
                  <div class="td-container">{{item.title}}</div>
                </td>
                <td class="td5">
                  <div class="td-container">{{item.primaryIndustry}}</div>
                </td>
                <td class="td6">
                  <div class="td-container">{{item.deputyIndustry}}</div>
                </td>
                <td class="td8">
                  <div class="td-container">
                    <ShowDetail :item="item" :dex="index" :nowDex="nowDex" @cut="cut"></ShowDetail>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="data.length === 0"
            style="height: 60px; line-height: 60px; text-align: center"
          >暂无记录，请到微信公众平台添加模板</div>
        </div>
      </BScroll>
    </div>
    <div class="actionFooter">
      <div>
        <Button type="primary" v-if="data.length" @click="nextPage(true)">下一步</Button>
        <Button class="white" @click="cancelPage">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import ShowDetail from './ShowDetail'
export default {
  components: { ShowDetail },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    }),
  },
  data() {
    return {
      syncLoading: false,
      selectedRowId: '',
      data: [],
      nowDex: -1
    }
  },
  mounted() {
    this.initData()
    this.on(document.body, 'click', () => {
      this.closePop(this.data, 'showPop') // 公共方法，见util.js
      this.nowDex = -1
    })
  },
  watch: {
    selectedRowId(val) {
      this.$emit('changeSelect', val)
    }
  },
  methods: {
    cut(i) { // 查看详情
      this.nowDex = i
    },
    async initData() {
      this.loadingData = true
      let params = {
        appAccountId: this.appAccountId
      }
      const response = await this.post(this.Path.getWechatTemplateList, params)
      this.loadingData = false
      const { code, data } = response
      if (code === 1) {
        this.data = data
      } else {
        this.$Message.error("系统错误，表单错误")
      }
    },
    getCurrentTemp(id) {
      this.selectedRowId = id
    },
    async syncWxTemps() {
      this.syncLoading = false
      let params = {
        appAccountId: this.appAccountId,
      }
      const response = await this.post(this.Path.syncWechatTemplateList, params)
      this.syncLoading = false
      if (response.code === 1) {
        this.$Message.success("模板消息同步成功")
      } else {
        this.$Message.error("模板消息同步失败")
      }
      this.initData()
    },
    nextPage(flag) {
      if (!this.selectedRowId) {
          this.$Message.error("请选择一个模板")
          return false
        }
      this.$router.push({name: 'messageTAdd', params: {step: 1}, query: {templateId: this.selectedRowId}})
    },
    cancelPage() {
      // this.$router.push({ name: "messageTemplate" })
      this.$router.back()
    },
    routerWx() {
      window.open("https://mp.weixin.qq.com/")
      // location.href = "https://mp.weixin.qq.com/"
    }
  }
}
</script>

<style lang="stylus">
#tempTable
  .ivu-radio-inner:after
    display block
  .tableAction
    display flex
    align-items flex-end
    justify-content space-between
    margin-bottom 20px
    .tableActonL
      span
        color #409eff
    button
      background #fff
      margin-left 18px
  .tableWrapper
    min-height: 530px
  #newtable-container
    background-color #fff
    width 100%
  #records-table
    position relative
    border-collapse separate
    border-spacing 0px 10px
    width 100%
    td:first-child
      padding-left 20px
    .new-table-header
      background #f7f9fa
      td
        color: #606366
        height 45px
        line-height 45px
        font-weight 700
    .new-table-body
      margin-top 10px
      td
        vertical-align middle
        border-bottom 1px solid #e3e4e6
        .td-container
          padding 10px 0
    .td1, .td2, .td3, .td4, .td5, .td6, .td7, .td8
      min-width 100px
    .td1, .td2
      width 80px
    .td3
      text-align center
    .td5
      .td-container
        display flex
        align-items center
        .avatar
          width 40px
          height 40px
    .detail:hover
      cursor pointer
      color #0099CC
    .td6
      width 260px
    .td8
      text-align center
    .cancle
      cursor pointer
      font-size 12px
</style>
