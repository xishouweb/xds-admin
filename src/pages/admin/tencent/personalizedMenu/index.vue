<template>
  <div>
    <publicCut></publicCut>
    <div id="personalizedMenu">
      <div class="wechat-title">
        <div class="personName">个性化菜单
          <Poptips width="227" content="个性化菜单支持用户标签，当用户身上的标签超过1个时，以最后打上的标签为匹配"></Poptips>
        </div>
        <div class="tongbuName" @click="updateCssWxPublicAccountDataToDb">同步菜单</div>
      </div>
      <div>
        <button class="add-personal-menu" @click="isCanSaveCustomerMenu">添加个性化菜单</button>
      </div>
      <div :style="{height: mainHeight}">
        <NewTable @getcurrent="getcurrent" :datas="tableData"></NewTable>
        <div class="pagenation">
            <Page :styles="{height: '28px'}"
            :total="pageTotal"
            v-if="pageTotal>10"
            :page-size='pageSize'
            :current="currPage"
            @on-change="change"
            @on-page-size-change="pageSizeChange"
            size="small" show-total show-elevator show-sizer  />
          </div>
      </div>

    </div>
    <NewModal
      v-model="showConfirm"
      :header="confirm.label"
      :content="confirm.content"
      @ok="actions"
      @cancel="cancel"></NewModal>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import PublicNo from '../components/currPublicNo'
import NewTable from './newtable/'
import {updateCssWxPublicAccountDataToDb} from '@/api/query'
export default {
  name: 'personalizedMenu',
  components: {
    PublicNo,
    NewTable
  },
  data() {
    return {
      pageTotal: 0,
      pageSize: 10,
      currPage: 1,
      mainHeight: '',
      // currPublic: {},
      showConfirm: false,
      confirm: {
        label: "停用个性化菜单",
        content: "确定要停用个性化菜单吗？停用后，个性化菜单将失效，用户使用默认菜单。",
        type: null
      },
      tableData: []
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    }),
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      loginCompanyData: 'survey/getSaveloginCompany'
    })
  },
  watch: {
    currPublic () {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      let h = document.documentElement.clientHeight || document.body.clientHeight
      this.mainHeight = h - 124 - 160 + 'px'
      window.addEventListener('resize', () => {
        h = document.documentElement.clientHeight || document.body.clientHeight
        this.mainHeight = h - 124 - 160 + 'px'
      })
    })
  },
  methods: {
    getcurrent(param, type) {
      if (type === "edit") {
        this.edit(param)
      } else {
        this.showConfirm = true
        if (type === "active") {
          // this.active(param)
          this.confirm = {
            label: "启用个性化菜单",
            content: "确定要启用个性化菜单吗？启用个性化菜单后，需将默认菜单发布后才能生效。",
            type: type
          }
        } else if (type === "stop") {
          this.confirm = {
            label: "停用个性化菜单",
            content: "确定要停用个性化菜单吗？停用后，个性化菜单将失效，用户使用默认菜单。",
            type: type
          }
        } else if (type === "delete") {
          this.confirm = {
            label: "删除个性化菜单",
            content: "确定要删除个性化菜单吗？删除后，个性化菜单将失效，用户使用默认菜单。",
            type: type
          }
        }
      }
      this.confirm.param = param
    },
    actions() {
      let param = this.confirm.param
      let type = this.confirm.type
      if (type === "active") {
        this.active(param)
      } else if (type === "stop") {
        this.stop(param, 1)
      } else if (type === "delete") {
        this.delete(param, 1)
      }
    },
    cancel() {
      this.showConfirm = false
    },
    edit(param) {
      this.localStorageSaveOrRead('personalMenuItem', Object.assign({}, param, {newCreate: false}))
      this.$router.push({name: 'modifyMenu'})
    },
    async active() {
      let param = this.confirm.param
      let res = await this.$post(this.Path.updateWxMenuEnable, {
                  appAccountId: this.currPublic.appAccountId,
                  id: param.id
                })
      this.afterAction(res.data)
    },
    async stop() {
      let param = this.confirm.param
      let res = await this.$post(this.Path.updateWxMenuDisable, {
                  appAccountId: this.currPublic.appAccountId,
                  id: param.id
                })
      this.afterAction(res.data)
    },
    async delete() {
      let param = this.confirm.param
      let res = await this.$post(this.Path.deleteWxMenu, {
                  appAccountId: this.currPublic.appAccountId,
                  id: param.id
                })
      this.afterAction(res.data)
    },
    afterAction(data) {
      if (data.code === 1) {
          this.cancel()
          this.getList()
          this.$Message.success("操作成功！")
      } else if (typeof data.message === "object") {
         this.$Message.error(data.message.errmsg)
      } else {
         data.message !== 'null' ? this.$Message.error(data.message) : this.$Message.error('操作失败！')
      }
    },
    async getList() {
      let param = {
        appAccountId: this.currPublic.appAccountId,
        offset: (this.currPage - 1) * this.pageSize,
        limit: this.pageSize
      }
      let res = await this.$post(this.Path.getWxMenuListByPage, param)
      if (res.data.code !== 1) {

      }
      res = res.data.data
      try {
        this.tableData = res.records || []
        this.pageTotal = res.totalCount
        this.currPage = parseInt(res.offset / res.limit) + 1
        this.pageSize = res.limit
      } catch (err) {

      }
    },
    // 公众号信息一键同步
    updateCssWxPublicAccountDataToDb() {
      let obj = {
        updatePublicAccountData: ['CUSTOMER_MENU'],
        eeId: this.loginCompanyData.employeeData.eeId,
        appAccountId: this.appAccountId
      }
      updateCssWxPublicAccountDataToDb(obj).then(data => {
        switch (data.code) {
          case 1:
            this.$Message.success('数据同步中')
            this.queryCssSynList()
            break
          default:
            break
        }
      })
    },
    async isCanSaveCustomerMenu() {
      let params = {
        appAccountId: this.appAccountId
      }
      const response = await this.post(this.fylPath.isCanSaveCustomerMenu, params)
      const { code, message } = response
      if (code === 1) {
        this.localStorageRemove('personalMenuItem')
        this.$router.push({name: 'modifyMenu'})
      } else {
        this.$Message.error(message)
      }
    },
    change(page) {
      this.currPage = page
      this.getList()
    },
    pageSizeChange(size) {
      this.currPage = 1
      this.pageSize = size
      this.getList()
    }
  }
}
</script>
<style lang="stylus">
#personalizedMenu
  padding 0 20px
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  .wechat-title
    display flex
    justify-content space-between
    .personName
      font-weight bold
    .tongbuName
      color #606366
      cursor pointer
      font-size 16px
      line-height 18px
      &:hover
        color #409fff
  .weixin-wrapper
    padding 0 10px 20px
  .add-personal-menu
    cursor pointer
    width: 140px;
    height: 40px;
    color #ffffff
    background-color: #409eff;
    border-radius: 3px;
    margin-top 30px
    margin-bottom 20px
  .pagenation
    padding 30px 0
    text-align right
</style>
