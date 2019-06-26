<template>
  <div id="repository" ref="repository">
    <data-loading :data-satau='loading.all' @reload="reload">
      <div class="title_public">
        知识库
      </div>
      <div class="repository-wrapper" v-show="changePage">
        <div class="group-wrapper">
          <Group ref="group" @getTempsData="getTempsData" @sendGroup="sendGroup"></Group>
        </div>
        <div class="content-wrapper">
          <div class="operation">
            <div class="move-group float-left" @click.stop>
              <Button type="ghost" @click.stop="operate('showPopGroup')">移动分组</Button>
              <PoptipCustom v-model="showMoveGroup" width="170px">
                <div class="group">
                  <div class="group-main">
                    <scroll-bar :isAbsolute="true">
                      <RadioGroup v-model="group" vertical>
                        <Radio v-for="(item) in groupArr" :key="item.id" :label="item.id"><span class="noWrap">{{item.groupName}}</span></Radio>
                      </RadioGroup>
                    </scroll-bar>
                  </div>
                  <div class="group-operation">
                    <Button type="primary" style="float:left" @click="operate('groupOk')">确定</Button>
                    <Button type="ghost" style="float:left" @click="operate('groupCancel')">取消</Button>
                  </div>
                </div>
              </PoptipCustom>
            </div>
            <div class="delete-group float-left">
              <Button type="ghost" @click="operate('deleteRepository')">删除</Button>
            </div>
            <div class="float-right">
              <div class="search">
                <!-- <SearchBox
                  v-model="listParams.title"
                  :search="operate"
                  holder="搜索"
                  width="284px"
                ></SearchBox> -->
                <Input v-model="listParams.title" @on-keydown.enter="operate('search')" @on-click="operate('search')" placeholder="搜索" icon="ios-search-strong" style="width: 284px"></Input>
              </div>
              <div class="add">
                <Button type="primary" @click="addKnowledge">添加知识库</Button>
              </div>
            </div>
          </div>
          <div class="table-list">
            <BScroll :offsetBottom="100" :data="repositoryList">
              <div>
                <Table ref="table" :loading="loading.list" @on-selection-change="selectionChange" :highlight-row="true" :columns="columns" :data="repositoryList">
              </Table>
              </div>
            </BScroll>
          </div>
          <div class="commom-page">
            <Page :current="currentPage" :total="totalCount" v-show="totalCount > 10" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
          </div>
        </div>
      </div>
      <BScroll :isTop="true" v-if="!changePage">
        <addRepository :groupArr="groupArr" v-model="changePage" :itemParams="itemParams" @close="changeList"></addRepository>
      </BScroll>
    </data-loading>
    <NewModal v-model="deleteModal" header="删除提示" content="确定要删除么？" @ok="del"></NewModal>
  </div>
</template>
<script>
import PoptipCustom from '@/components/poptipCustom'
import addRepository from './addRepository'
import Group from "../components/group"
import Const from './const'
export default {
  name: 'repository',
  data() {
    return {
      changePage: true,
      loadingStatu: 1,
      currentPage: 1,
      loading: {
        all: 1,
        list: true
      },
      groupArr: [],
      showMoveGroup: false,
      group: '',
      deleteModal: false,
      columns: [],
      repositoryList: [
      ],
      listParams: {
        companyId: this.localStorageSaveOrRead('currentCorp').applyId,
        groupId: null,
        title: '',
        offset: 0,
        limit: 10,
      },
      itemParams: {},
      totalCount: 0,
      delId: null,
      selectListData: [],
      ids: []
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    changePage(val) {

    }
  },
  methods: {
    // 知识库列表分页（包含搜索以及点击分组）
    queryKnowledgeBaseListByPage() {
      this.post(this.fylPath.queryKnowledgeBaseListByPage, this.listParams).then(data => {
        this.loading.list = true
        if (data.code === 1) {
          this.loading.all = 2
          this.loading.list = false
          this.totalCount = data.data.totalCount
          this.repositoryList = data.data.records
        } else {
          this.loading.all = 3
          this.$Message.error(data.message)
        }
      })
    },
    // 根据ids批量删除知识库
    delCorpKnowledgeBaseByIds() {
      let params = {
        ids: this.delId.join(','),
        companyId: this.localStorageSaveOrRead('currentCorp').applyId,
      }
      this.post(this.fylPath.delCorpKnowledgeBaseByIds, params).then(data => {
        if (data.code === 1) {
          this.$Message.success('删除成功')
          this.currentPage = 1
          this.listParams.offset = 0
          this.queryKnowledgeBaseListByPage()
          this.$refs.group.queryKnowledgeBaseGroupListInfo()
        } else {
          this.$Message.error(data.message || '删除失败')
        }
      })
    },
    moveKnowledgeBase() {
      let params = {
        groupId: this.group,
        companyId: this.localStorageSaveOrRead('currentCorp').applyId,
        ids: this.ids
      }
      this.post(this.fylPath.moveKnowledgeBase, params).then(data => {
        if (data.code === 1) {
          this.$Message.success('移动分组成功')
          this.selectListData = []
          this.currentPage = 1
          this.listParams.offset = 0
          this.queryKnowledgeBaseListByPage()
          this.$refs.group.queryKnowledgeBaseGroupListInfo()
        } else {
          this.$Message.error(data.message || '移动分组失败')
        }
      })
    },
    getTempsData(item) {
      this.itemParams.groupId = item.id
      this.currentPage = 1
      this.listParams.offset = 0
      this.listParams.groupId = item.id
      this.queryKnowledgeBaseListByPage()
    },
    reload() {
      this.queryKnowledgeBaseListByPage()
    },
    init() {
      this.queryKnowledgeBaseListByPage()
      this.columns = Const.columns(this)
      this.$nextTick(() => {
        let h = document.documentElement.clientHeight || document.body.clientHeight
        this.$refs.repository.style.height = h - 90 + 'px'
        window.onresize = () => {
          h = document.documentElement.clientHeight || document.body.clientHeight
          this.$refs.repository.style.height = h - 90 + 'px'
        }
      })
    },
    changeList(val) {
      this.itemParams = {}
      this.currentPage = 1
      this.listParams.offset = 0
      this.listParams.groupId = null
      this.queryKnowledgeBaseListByPage()
      this.$refs.group.refreshKnowledgeGroup()
    },
    del() {
      this.delCorpKnowledgeBaseByIds()
    },
    operate(type) {
      switch (type) {
        case 'showPopGroup':
          if (this.selectListData.length === 0) {
            this.$Message.warning('至少选择一项')
            return
          } else {
            let arr = []
            this.selectListData.forEach(item => {
              arr.push(item.id)
            })
            this.ids = arr
          }
          this.showMoveGroup = true
          break
        case 'groupOk':
          this.showMoveGroup = false
          this.moveKnowledgeBase()
          break
        case 'groupCancel':
          this.showMoveGroup = false
          break
        case 'deleteRepository':
          if (this.selectListData.length === 0) {
            this.$Message.warning('至少选择一项')
            return
          } else {
            let arr = []
            this.selectListData.forEach(item => {
              arr.push(item.id)
            })
            this.delId = arr
          }
          this.deleteModal = true
          break
        case 'search':
          this.queryKnowledgeBaseListByPage()
          break
        default:
          break
      }
    },
    sendGroup(arr) {
      this.groupArr = arr
    },
    addKnowledge() {
      this.itemParams.title = ''
      this.itemParams.content = ''
      this.changePage = false
    },
    edit(index, item) {
      console.log(index)
      this.itemParams = item
      this.changePage = false
    },
    delRepository(index, type, item) {
      this.delId = [item.id]
      this.deleteModal = true
    },
    pageChange(val) {
      this.listParams.offset = this.listParams.limit * (val - 1)
      this.queryKnowledgeBaseListByPage()
    },
    pageSizeChange(val) {
      this.listParams.limit = val
      this.queryKnowledgeBaseListByPage()
    },
    selectionChange(arr) {
      console.log(arr)
      this.selectListData = arr
    }
  },
  components: {
    PoptipCustom,
    addRepository,
    Group
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
#repository
  .repository-wrapper
    height calc(100% - 49px)
    padding-top 30px
    clear()
    .group-wrapper
      position relative
      float left
      width 190px
      height 100%
    .content-wrapper
      float left
      height calc(100% - 60px)
      width calc(100% - 190px)
      padding-left 30px
      clear()
      .operation
        clear()
        .float-left
          float left
        .move-group
          position relative
          .ivu-btn
            width 90px
          .group
            .group-main
              position relative
              min-height 300px
              margin: 15px 5px 20px 20px
              .ivu-radio-wrapper
                .noWrap
                  display inline-block
                  line-height 16px
                  vertical-align middle
                  max-width 110px
                  no-wrap()
            .group-operation
              clear()
              padding 20px 10px
              border-top solid 1px #e3e5e6
              .ivu-btn
                width 70px
                &:nth-of-type(1)
                  margin-right 10px
        .delete-group
          margin-left 10px
          .ivu-btn
            width 70px
        .float-right
          float right
          clear()
          .search
            float left
            margin-right 20px
          .add
            float left
            width 114px
            .ivu-btn
              width 114px
      .table-list
        margin-top 10px
        height calc(100% - 50px)
        .ivu-table-tbody
          tr
            height 60px
      .commom-page
        margin-top 14px
</style>


