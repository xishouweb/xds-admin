<template>
  <div>
    <div class="marketing-header-title">
      <HeaderTitle>主题列表</HeaderTitle>
      <HeaderRemind>
        <span>
          当前公众号永久二维码已使用个数：
          <strong>{{getQrCodeNumber.qrLimitNum}}</strong>
        </span>
        <span>
          临时二维码已使用个数：
          <strong>{{getQrCodeNumber.qrNum}}</strong>
        </span>
      </HeaderRemind>
    </div>
    <PageMain class="qr-code-theme-main" >
        <!-- 分组 -->
        <div style="width: 190px;padding-right: 15px;">
          <div class="groupAction" :style="{marginBottom: '20px'}">
            <Button @click="createNewGroup" type="default" :style="{width: '100%'}">
              <Icon type="plus"></Icon>新建分组
            </Button>
          </div>
          <Group
            deleteTip="当前分组下有二维码主题不可删除"
            :groupData="labelList"
            :currentId="groupId"
            :noSelectNum="2"
            :createdId="createdId"
            @transmitEvent="operationGroup"
            @moveEvent="moveGroup"
            @getTempsData="getTempsData"
          ></Group>
        </div>
        <!-- 列表 -->
        <div style="width: calc(100% - 190px)">
          <NewTable v-bind="table" @sortChange="pageChange">
            <tableHeader
              slot="header"
              @search="pageChange"
              placeholder="输入二维码主题名称搜索"
              inputWidth="260"
            >
              <i-button @click="addTheme" type="primary" slot="left">新建二维码主题</i-button>
            </tableHeader>

            <tablePagenation slot="footer" v-bind="tableParam" @pageChange="pageChange">
              <template slot-scope="data">
                <MoveGroup
                  :selectedList="data.selection"
                  :groupList="getQrcodeGroupList"
                  @save="saveMoveGroup"
                />
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
      ref="Drawer">
      <div slot="content">
        <!-- 新建分组 -->
        <template v-if="drawer.type === 'group'">
          <createGroup
            v-if="drawer.show"
            :drawer="drawer"
            :metarialType="metarialType"
            @on-success="getGroupList"
          ></createGroup>
        </template>
        <!-- 新建主题 -->
        <template v-if="drawer.type === 'theme'">
          <createTheme v-if="drawer.show" :drawer="drawer" @on-success="addThemeSuccess"></createTheme>
        </template>
        <!-- 查看数据 -->
        <template v-if="drawer.type === 'statis'">
          <Statis
            v-if="drawer.type === 'statis'"
            :drawer="drawer"
            :params="drawer.params"
            :curPublic="currPublic"
          ></Statis>
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
import { mapGetters, mapActions, mapMutations } from "vuex"
import { deleteGroup } from "@/api/markting"
import tableMixin from "./tableMixin.js"
export default {
  name: "qrcodeTheme",
  components: {
    HeaderTitle: () => import("@/components/pageStyle/headerTitle.vue"),
    HeaderRemind: () => import("@/components/pageStyle/headerRemind.vue"),
    PageMain: () => import("@/components/pageStyle/pageMain.vue"),
    NewTable: () => import("@/components/tableStyle/tables"),
    tableHeader: () => import("@/components/tableStyle/tableHeader"),
    tablePagenation: () => import("@/components/tableStyle/tablePagenation"),
    GroupList: () => import("@/components/group/groupList.vue"),
    MoveGroup: () => import("@/components/group/moveGroup.vue"),
    createGroup: () => import("../drawerContent/createGroup"),
    createTheme: () => import("../drawerContent/createTheme"),
    Statis: () => import("../drawerContent/Statis")
  },
  data() {
    return {
      groupId: -1,
      createdId: -1,
      metarialType: "channel_qr_code",
      labelList: [],
      drawer: {
        show: false,
        title: "",
        type: "",
        currentGroup: {}
      },
      modal: {
        show: false,
        header: "删除",
        message: "",
        ok() {}
      }
    }
  },
  mixins: [tableMixin],
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getQrCodeNumber: "markting/getQrCodeNumber",
      getQrcodeGroupList: "markting/getQrcodeGroupList",
      qrcodeDefaultGroupId: "markting/qrcodeDefaultGroupId",
      getCanCreateQrCode: "markting/getCanCreateQrCode"
    })
  },
  watch: {
    currPublic(nv) {
      if (nv.serviceTypeInfo === 2) {
        this.tableParam = {
          totalPage: 0,
          pageSize: 10,
          currPage: 1,
          keyword: null,
          groupId: null
        }
        debugger
        this.init()
      }
    }
  },
  mounted() {
    this.init()
    this.on(document.body, 'click', this.closePoptip)
  },
  methods: {
    init() {
      // 页面初始化
      this.getGroupList()
      this.getTableData()
    },
    ...mapMutations({
      setQrCodeThemeName: "markting/SET_QRCODE_THEME_NAME"
    }),
    ...mapActions({
      queryCssGroup: "markting/queryCssGroup",
      getGchannelQrCodeThemeListByPage: "markting/getGchannelQrCodeThemeListByPage",
      deleteGchannelQrCodeTheme: "markting/deleteGchannelQrCodeTheme",
      updateThemeToGroup: "markting/updateThemeToGroup",
      canSaveQrCode: "markting/canSaveQrCode",
      getQrCodeNum: "markting/getQrCodeNum"
    }),
    // 分组相关操作
    async getGroupList(groupId) {
      if (!this.currPublic) return
      let param = {
        appAccountId: this.currPublic.appAccountId,
        type: this.metarialType
      }
      await this.queryCssGroup(param)
      this.labelList = this.deepCopy(this.getQrcodeGroupList)
      groupId && (this.createdId = groupId)
    },
    createNewGroup() {
      // document.body.click()
      if (this.labelList.length >= 52) {
        this.$Message.error("最多可新建50个分组")
        return
      }
      this.drawer = {
        show: true,
        title: "新建分组",
        type: "group",
        currentGroup: {}
      }
    },
    addTheme() {
      this.drawer = {
        ...this.drawer,
        show: true,
        title: "新建二维码主题",
        type: "theme",
        current: {groupId: this.groupId},
        afterSuccess: () => this.getTableData()
      }
    },
    addThemeSuccess(groupId) {
      this.groupId = groupId
      this.getGroupList()
      this.getTempsData({ groupId })
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
    // 移动分组
    async saveMoveGroup(groupId, selectedList) {
      let _param = {
        appAccountId: this.currPublic.appAccountId,
        groupId: groupId,
        themeIds: selectedList.map(item => item.id)
      }
      let res = await this.updateThemeToGroup(_param)
      if (res.code === 1) {
        document.body.click()
        this.$Message.success("移动分组成功！")
        this.init()
      } else {
        this.$Message.error("移动分组失败！")
      }
    },
    async operationGroup(type, group) {
      if (type === "modify") {
        this.drawer = {
          show: true,
          title: "修改分组",
          type: "group",
          currentGroup: JSON.parse(JSON.stringify(group))
        }
      } else if (type === "del") {
        let _param = {
          appAccountId: this.currPublic.appAccountId,
          id: group.groupId
        }
        let res = await deleteGroup(_param)
        if (res.code === 1) {
          this.getGroupList()
          this.$Message.success("删除成功")
        } else {
          this.$Message.error(res.message || "删除失败")
        }
      }
    },
    async moveGroup(type, arr, index1, index2) {
      const res = await this.$post(this.Path.updateGroupOrder, {
        appAccountId: this.currPublic.appAccountId,
        upCssGroupId: arr[index1]["groupId"],
        downCssGroupId: arr[index2]["groupId"]
      }).then(data => data.data)
      if (res.code === 1) {
        this.getGroupList()
        this.$Message.success("移动成功")
      } else {
        this.$Message.error("移动失败")
      }
    },
    getTempsData(item) {
      // 分组相关操作
      this.groupId = item.groupId
      this.tableParam.groupId = item.groupId
      this.drawer.currentGroup = item
      this.resetTableParam() // mixins中的方法
      this.getTableData() // mixins中的方法
    }
  }
}
</script>

<style lang="stylus">
  .process_btn
    font-size: 28px
  .theme-remind
    margin-right: 50px
    >i
      font-size: 18px
      font-weight: 700
  .qr-code-theme-main
    height
    padding-top 20px
    .qr-code-theme-content
      display flex
</style>
