<template>
  <div>
    <HeaderTitle>二维码列表</HeaderTitle>
    <HeaderSubtitle>
      <p>
        <i @click="$router.push({name: 'qrcodeTheme'})" style="cursor: pointer">主题列表</i> /
        <span>{{getQrCodeThemeName}}</span>
      </p>
    </HeaderSubtitle>

    <PageMain>
      <!-- 列表 -->
      <div style="width: calc(100%)">
        <NewTable v-bind="table" @sortChange="pageChange" :outputFileName="getQrCodeThemeName">
          <tableHeader slot="header" @search="pageChange" placeholder="输入二维码名称或二维码ID搜索" inputWidth="284">
            <i-button slot="left" @click="addQrCode" type="primary">新建二维码</i-button>
            <Select slot="right-bf" v-model="qrCodeType" @on-change="changeType" style="width:130px">
              <Option value="-1">二维码类型</Option>
              <Option value="QR_LIMIT_STR_SCENE">永久二维码</Option>
              <Option value="QR_STR_SCENE">临时二维码</Option>
            </Select>
          </tableHeader>

          <tablePagenation slot="footer" v-bind="tableParam" @pageChange="pageChange">
            <template slot-scope="data">
              <i-button size="small" @click="handle('delete', data.selection)">批量删除</i-button>
            </template>
          </tablePagenation>
        </NewTable>
      </div>
    </PageMain>

    <Drawer
      v-model="drawer.show"
      :titleTips="drawer.title"
      :isScroll="false"
      :width="drawer.width || '530px'"
      ref="Drawer"
    >
      <div slot="content">
        <!-- 详细 -->
        <template v-if="drawer.type === 'info'">
          <qrCodeInfo v-if="drawer.show" :drawer="drawer" @on-success="getGroupList"></qrCodeInfo>
        </template>
      </div>
    </Drawer>

    <NewModal
      :header="modal.header"
      :maxZIndex="true"
      v-model="modal.show"
      width="464"
      @ok="modal.ok"
    >
      <div>{{modal.message}}</div>
    </NewModal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { deleteGroup } from "@/api/markting"
import tableMixin from "./tableMixin.js"
export default {
  name: "qrcode-list",
  components: {
    HeaderTitle: () => import("@/components/pageStyle/headerTitle.vue"),
    HeaderRemind: () => import("@/components/pageStyle/headerRemind.vue"),
    PageMain: () => import("@/components/pageStyle/pageMain.vue"),
    NewTable: () => import("@/components/tableStyle/tables"),
    tableHeader: () => import("@/components/tableStyle/tableHeader"),
    tablePagenation: () => import("@/components/tableStyle/tablePagenation"),
    HeaderSubtitle: () => import("@/components/pageStyle/headerSubtitle.vue"),
    qrCodeInfo: () => import("../drawerContent/qrCodeInfo/index")
  },
  data() {
    return {
      metarialType: "channel_qr_code",
      qrCodeThemeId: null,
      labelList: [],
      drawer: {
        show: false,
        title: "",
        type: "",
        current: {}
      },
      modal: {
        show: false,
        header: "删除",
        message: "",
        ok() {}
      },
      qrCodeType: "-1"
    }
  },
  mixins: [tableMixin],
  watch: {
    currPublic() {
      this.$router.push({ name: "qrcodeTheme" })
    }
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getQrcodeGroupList: "markting/getQrcodeGroupList",
      qrcodeDefaultGroupId: "markting/qrcodeDefaultGroupId",
      getQrCodeNumber: "markting/getQrCodeNumber",
      getCanCreateQrCode: "markting/getCanCreateQrCode",
      getQrCodeThemeName: "markting/getQrCodeThemeName"
    })
  },
  created() {
    // 获取二维码主题id
    this.qrCodeThemeId = parseInt(this.$route.params.id)
  },
  mounted() {
    this.getGroupList()
    this.getTableData()
  },
  methods: {
    ...mapActions({
      queryCssGroup: "markting/queryCssGroup",
      canSaveQrCode: "markting/canSaveQrCode",
      getQrCodeNum: 'markting/getQrCodeNum',
      updateGchannelQrCode: "markting/updateGchannelQrCode",
      getGchannelQrCodeListByPage: "markting/getGchannelQrCodeListByPage", // 查询二维码list
      deleteGchannelQrCodeByIds: "markting/deleteGchannelQrCodeByIds", // 删除二位吗
      queryGchannelQrCodeById: "markting/queryGchannelQrCodeById" // 查询二位吗详情
    }),
    // 分组相关操作
    async getGroupList() {
      if (!this.currPublic) return
      let param = {
        appAccountId: this.currPublic.appAccountId,
        type: this.metarialType
      }
      await this.queryCssGroup(param)
      this.labelList = this.deepCopy(this.getQrcodeGroupList)
    },
    createNewGroup(type, data) {
      if (type === "modify") {
        this.drawer = {
          show: true,
          title: "修改分组",
          type: "create",
          currentGroup: data
        }
      } else {
        this.drawer = {
          show: true,
          title: "新建分组",
          type: "create",
          currentGroup: data
        }
      }
    },
    async deleteGroup(param) {
      let _param = {
        appAccountId: this.currPublic.appAccountId,
        id: param.groupId
      }
      let res = await deleteGroup(_param)
      if (res.code === 1) {
        return true
      } else {
        return false
      }
    },
    selectGroup(param) {
      // 分组相关操作
      this.tableParam.groupId = param.groupId
      this.drawer.currentGroup = param
      this.getTableData() // mixins中的方法
    },
    // 跳转到新建二位码页面
    // 检测当前公众号下能否新建二维码
    async addQrCode() {
      let param = {appAccountId: this.currPublic.appAccountId}
      await this.canSaveQrCode(param) // 判断当前公众号是否可以新建二位码
      await this.getQrCodeNum(param) // 获取二维码的数量
      if (
        !(
          this.getQrCodeNumber.lavePackageQrLimitNum +
          this.getQrCodeNumber.lavePackageQrNum
        )
      ) {
        // 无剩余
        this.$Message.error("当前公众号无剩余可用的永久二维码/临时二维码。")
      } else if (this.getCanCreateQrCode !== true) {
        // 在创建中
        this.$Message.error(this.getCanCreateQrCode)
      } else {
        this.$router.push({
          name: "qrcodeEdit",
          params: { themeId: this.qrCodeThemeId }
        })
      }
    },
    handle(type, selection) {
      if (!selection.length) {
        return this.$Message.info("请至少选择一项")
      }
      switch (type) {
        case "delete":
          this.delete(selection)
          break
        default:
          break
      }
    },
    // 选择公众号类型
    changeType(type) {
      this.qrCodeType = type
      this.getTableData()
    }
  }
}
</script>

<style lang="stylus">
</style>
