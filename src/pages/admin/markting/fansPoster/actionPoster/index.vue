<template>
  <div>
    <HeaderTitle>裂变海报模板</HeaderTitle>
    <PageMain class="poster-theme-main">
      <!-- 分组 -->
       <!-- style="width: 200px" -->
      <div>
        <GroupList
          v-setScrollBoxHeight.60
          deleteRemind="分组删除后，分组下的内容将被放在未分组下，确定要删除吗？"
          :ableActionIndex="2"
          :labelList="labelList"
          :deleteFn="deleteGroup"
          @createNew="createNewGroup"
          @deleteGroup="getGroupList"
          @selectGroup="selectGroup"
        />
      </div>
      <!-- 列表 -->
      <div style="width: calc(100% - 220px)">
        <NewTable @sortChange="pageChange">
          <tableHeader slot="header" @search="pageChange" :csv="false" placeholder="输入海报活动模板名称搜索" inputWidth="260">
            <template slot="left" slot-scope="data">
              <i-button @click="addPosterTemp" type="primary">新建海报模板</i-button>
              <i-button @click="batchOperation = !batchOperation">
                <span v-if="!batchOperation">批量操作</span>
                <span v-else>取消批量</span>
              </i-button>
              <span v-show="batchOperation">
                <MoveGroup
                  size="default"
                  :selectedList="data.selection"
                  :groupList="labelList"
                  @save="saveMoveGroup"
                />
                <i-button @click="deletePoster(data.selection)">删除</i-button>
                <TableCheckAll></TableCheckAll>
              </span>
            </template>
          </tableHeader>
          <div slot="main">
            <tableList
              v-if="records.length"
              :list="records"
              :batchOperation="batchOperation"
              @action="tableListAction"
            ></tableList>
            <div v-else :style="{paddingTop: '200px', textAlign: 'center', color: '#979899'}">暂无裂变海报模板</div>
          </div>
          <tablePagenation :totalPage="totalCount" :pageSize="tableParam.pageSize" :currPage="tableParam.currPage" slot="footer" noLeft @pageChange="pageChange"></tablePagenation>
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
        <!-- 新建分组 -->
        <template v-if="drawer.type === 'group'">
          <createGroup
            v-if="drawer.show"
            :drawer="drawer"
            :metarialType="metarialType"
            @on-success="init"
          ></createGroup>
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
import { mapState, mapGetters, mapActions } from "vuex"
import { deleteGroup } from "@/api/markting"
import tableMixin from "./tableMixin.js"
export default {
  name: "actionPoster",
  components: {
    HeaderTitle: () => import("@/components/pageStyle/headerTitle.vue"),
    PageMain: () => import("@/components/pageStyle/pageMain.vue"),
    NewTable: () => import("@/components/tableStyle/tables"),
    tableHeader: () => import("@/components/tableStyle/tableHeader"),
    TableCheckAll: () => import("@/components/tableStyle/tableCheckAll.vue"),
    tableCheckItem: () => import("@/components/tableStyle/tableCheckItem.vue"),
    tablePagenation: () => import("@/components/tableStyle/tablePagenation"),
    tableList: () => import("../components/linkList/"),
    createGroup: () => import("../drawerContent/createGroup"),
    GroupList: () => import("@/components/group/groupList.vue"),
    MoveGroup: () => import("@/components/group/moveGroup.vue")
  },
  data() {
    return {
      batchOperation: false,
      metarialType: "posterTemplate",
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
      },
      forx: 1
    }
  },
  mixins: [tableMixin],
  computed: {
    ...mapState({
      currPublic: state => state.publicAccount.curPublic,
      // labelList: state => state.poster.posterGroupList,
      records: state => state.poster.posterList.records,
      totalCount: state => state.poster.posterList.totalCount
    }),
    ...mapGetters({
      getposterGroupList: "poster/getposterGroupList",
      posterDefaultGroupId: "poster/posterDefaultGroupId"
    })
  },
  watch: {
    currPublic(nv) {
      nv.serviceTypeInfo === 2 && this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 删除海报模板
    async deletePoster(selection) {
      if (!selection.length) {
        this.$Message.info("请至少选择一项")
      } else {
        this.delete(selection.map(item => item.param)) // 方法定义在 tableMixin.js
      }
    },
    init() {
      // 页面初始化
      this.getGroupList()
      this.getTableData()
    },
    ...mapActions({
      queryCssGroup: "poster/queryCssGroup",
      saveOrUpdateGroup: "poster/saveOrUpdateGroup",
      getPosterTemplateByPage: "poster/getPosterTemplateByPage",
      updateGroupOrder: "poster/updateGroupOrder", // 移动分组
      deletePosterTemplate: "poster/deletePosterTemplate",
      deleteGroup: "poster/deleteGroup",
      moveTemplateGroup: "poster/updatePosterTemplateGroup"
    }),
    // 分组相关操作
    async getGroupList() {
      if (!this.currPublic) return
      let param = {
        appAccountId: this.currPublic.appAccountId,
        type: this.metarialType
      }
      await this.queryCssGroup(param)
      this.labelList = this.deepCopy(this.getposterGroupList)
    },
    // 新建分组
    createNewGroup(type, data) {
      if (type === "modify") {
        this.drawer = {
          show: true,
          title: "修改分组",
          type: "group",
          currentGroup: data
        }
      } else {
        this.drawer = {
          show: true,
          title: "新建分组",
          type: "group",
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
        this.getGroupList()
        this.$Message.success('操作成功！')
      } else {
        this.$Message.error(res.message)
      }
    },
    selectGroup(param) { // 分组相关操作
      this.tableParam.groupId = param.groupId
      this.drawer.currentGroup = param
      this.resetTableParam() // mixins中的方法
      this.getTableData() // mixins中的方法
    },
    addPosterTemp() {
      this.$router.push({ name: "createPoster", params: {groupId: this.tableParam.groupId || this.posterDefaultGroupId} })
    },
    handle(type, selection) {
      if (!selection.length) {
        return this.$Message.info("请至少选择一项")
      }
      switch (type) {
        case "delete":
          this.delete(selection)
          break
      }
    },
    // 移动分组
    async saveMoveGroup(groupId, selectedList) {
      let _param = {
        appAccountId: this.currPublic.appAccountId,
        groupId: groupId,
        idList: selectedList.map(item => item.param.id)
      }
      let res = await this.moveTemplateGroup(_param)
      if (res.code === 1) {
        document.body.click()
        this.batchOperation = false
        this.$Message.success("移动分组成功！")
        this.init()
      } else {
        this.$Message.error("移动分组失败！")
      }
    }
  }
}
</script>

<style lang="stylus">
.poster-theme-main
  padding-top 20px
</style>
