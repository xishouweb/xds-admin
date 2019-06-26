<template>
  <div id="fans">
    <Spin fix v-if="loadingData">
      <Icon type="load-c" size="40" class="spin-icon-load"></Icon>
      <div>loading</div>
    </Spin>
    <template v-else>
      <div class="fans_left">
        <div class="fans_left_wrapper">
          <Group
            :isOperate="false"
            :currentId="kfSeatId"
            :groupData="seatInfoList"
            @getTempsData="getTempsData"
            :hasCount="false"
          ></Group>
        </div>
      </div>
      <div class="fans_right">
        <BScroll>
          <div>
            <div class="fans_filter">
              <fans-filter ref="filter"></fans-filter>
            </div>
            <div class="fans_table">
              <FansTable
                ref="tables"
                :data="records"
                :columns="columns"
                :loading="loading"
                @sort="sortChange"
              >
                <div class="table-action" slot="actionTop">
                  <div class="table-action-left">
                    <p :style="{width: '70px', marginRight: '60px'}">共{{totalCount}}条</p>
                    <div class="actionGroup">
                      <Button
                        :style="{height: '32px', padding: '0 16px'}"
                        size="small"
                        type="primary"
                        @click="search"
                      >筛选</Button>
                      <Button
                        :style="{height: '32px', padding: '0 16px'}"
                        size="small"
                        type="default"
                        @click="filterClear"
                      >清空筛选条件</Button>
                      <Button
                        :style="{height: '32px', padding: '0 16px'}"
                        size="small"
                        type="default"
                        @click="filterSave"
                      >保存筛选条件</Button>
                    </div>
                  </div>
                  <div class="table-action-right">
                    <SearchBox
                      v-model="nkNameNamePhone"
                      :search="search"
                      holder="搜索"
                      width="220px"
                    ></SearchBox>
                    <!-- <div class="searchInputWrap">
                      <input
                        v-model="nkNameNamePhone"
                        placeholder="搜索"
                        @keyup.enter.prevent="search"
                      >
                      <p class="inputExtra" @click="search">
                        <i class="icon">&#xe634;</i>
                      </p>
                    </div> -->
                    <div class="actionGroup">
                      <span class="icon" @click="exportCsv" :style="{color: '#909499'}">&#xe66c;</span>
                      <!-- <span class="icon" @click="refresh">&#xe62b;</span> -->
                      <Poptip v-model="showSet" placement="left-start" popper-class="choosesWrap">
                        <span
                          class="icon fans-cursor fans-pop_span"
                          :style="{fontSize: '24px', color: '#909499'}"
                        >&#xe633;</span>
                        <div slot="content" class="chooses" @click.stop>
                          <div class="chooses-title">设置</div>
                          <ul class="chooses-list">
                            <CheckboxGroup v-model="selectedFields">
                              <li
                                v-if="item.title"
                                v-for="(item, index) in selectedColumns"
                                :key="index"
                              >
                                <Checkbox :label="item.key" :disabled="item.isDisabeld">
                                  <span :style="{marginLeft: '5px'}">{{item.title}}</span>
                                </Checkbox>
                              </li>
                            </CheckboxGroup>
                          </ul>
                        </div>
                      </Poptip>
                    </div>
                  </div>
                </div>
                <!-- 存放交互 -->
                <Page
                  v-if="totalCount > 10"
                  slot="page"
                  show-elevator
                  :page-size="pageSize"
                  :total="totalCount"
                  :current="curPage"
                  size="small"
                  show-total
                  show-sizer
                  @on-change="pageChange"
                  @on-page-size-change="pageSizeChange"
                ></Page>
              </FansTable>
            </div>
          </div>
        </BScroll>
      </div>
    </template>
    <!-- 新增分组 -->
    <NewModal
      header="保存筛选条件"
      :maxZIndex="true"
      :isAutoClose="false"
      v-model="condProp.visible"
      width="400"
      @ok="filterSaveOk"
      @close="resetModalForm('condiForm')"
    >
      <Form ref="condiForm" :model="condProp.form" :rules="condProp.rule">
        <FormItem prop="selectName">
          <Input type="text" v-model="condProp.form.selectName" placeholder="请输入筛选条件名称, 不超过10个字"></Input>
        </FormItem>
      </Form>
    </NewModal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import FansFilter from "../component/filter"
import FansTable from "../component/table"
import tableMixins from "../component/table/mixins"
// 过滤初始值
export default {
  name: "fansAll",
  components: { FansFilter, FansTable },
  mixins: [tableMixins],
  data() {
    const validateSelectName = (rule, value, callback) => {
      value = value.replace(/\s*/g, "") // 过滤空格
      if (!value.length) {
        callback(new Error("请填写筛选名称"))
      } else if (value.length > 10) {
        callback(new Error("筛选名称不超过10个字"))
      } else {
        callback()
      }
    }
    return {
      showSet: false, // 控制设置项的显示
      kfSeatId: -1, // 当前坐席
      condProp: {
        visible: false,
        rule: {
          selectName: [
            { required: true, message: "请填写筛选名称", trigger: "blur" },
            {
              validator: validateSelectName,
              trigger: "blur"
            }
          ]
        },
        form: {
          selectName: ""
        }
      },
      curPage: 1, // 当前页
      pageSize: 10, // 当前页数量
      fiterForm: {}, // 过滤表单
      nkNameNamePhone: "", // 过滤搜索
      fansTags: {},
      tagsType: "single",
      curFansList: [],
      curFansWx: "", // 公众号
      curCoo: {},
      loadingData: false,
      order: "", // 排序
      sort: "" // 排序字段
    }
  },
  computed: {
    ...mapState("fans", {
      fanTagsByWx: state => state.fanTagsByWx,
      records: state => state.allFans.records,
      loading: state => state.allloading,
      totalCount: state => state.allFans.totalCount,
      seatInfoList: state => state.seatInfoList,
      eeId: state => state.fansGroupList.eeId
    })
  },
  mounted() {
    this.init()
    // 刷新
    this.$root.Bus.$on("freshfans", () => {
      this.refresh()
    })
    this.on(document.body, 'click', () => {
      this.showSet = false
    })
  },
  methods: {
    ...mapActions("fans", [
      "querySeatList",
      "getAllList",
      "getGroupList",
      "getTagsByWx",
      "updateBatchSetUserTag",
      "addCond",
      "queryCondList",
      "syncFans",
      "getPublicAccountList"
    ]),
    async init() {
      this.loadingData = true
      // 获取当前用户坐席
      await this.getGroupList()
      // 获取公众号
      await this.getPublicAccountList()
      // 获取坐席列表
      await this.querySeatList()
      // 获取所有粉丝
      await this.getAllList({
        offset: (this.curPage - 1) * this.pageSize,
        limit: this.pageSize
      })
      this.loadingData = false
    },
    // 分组操作
    getTempsData(item) {
      this.kfSeatId = item.id
    },
    search() {
      this.curPage = 1
      this.pageSize = 10
      this.filterSearch()
    },
    // 排序
    sortChange({ sort, order }) {
      if (order === "asc") {
        this.sort = sort
        this.order = "ASC"
      } else if (order === "desc") {
        this.sort = sort
        this.order = "DESC"
      } else {
        this.sort = ""
        this.order = ""
      }
      this.search()
    },
    // 表格交互
    async filterSearch() {
      const value = this.$refs.filter ? this.$refs.filter.getValue() : {}
      const sort = this.order
        ? {
            order: this.order,
            sort: this.sort
          }
        : {}
      const params = {
        ...value,
        ...sort,
        offset: (this.curPage - 1) * this.pageSize,
        limit: this.pageSize
      }
      if (this.kfSeatId !== -1 && this.kfSeatId !== 0) {
        params.kfSeatId = this.kfSeatId
      }
      if (this.kfSeatId === 0) {
        params.existKfSeatId = "NO_KF_SEAT_ID"
      }
      if (this.nkNameNamePhone) {
        params.nkNameNamePhone = this.nkNameNamePhone
      }
      this.getAllList(params)
    },
    filterClear() {
      this.$refs.filter.clearValue()
      // 其他清空
      this.kfSeatId = -1
      this.curPage = 1
      this.pageSize = 10
      this.nkNameNamePhone = ""
      this.filterSearch()
    },
    filterSave() {
      this.condProp = {
        ...this.condProp,
        visible: true,
        form: {
          selectName: ""
        }
      }
    },
    async filterSaveOk() {
      // 保存 this.filterObj
      const valid = await this.$refs["condiForm"].validate()
      const params = this.$refs.filter.getOriginValue()
      if (valid) {
        const response = await this.addCond({
          eeId: this.eeId,
          selectConditions: JSON.stringify(params),
          selectName: this.condProp.form.selectName
        })
        const { code } = response
        if (code === 1) {
          this.condProp.visible = false
          this.$Message.success("添加成功")
          this.queryCondList()
        } else {
          this.$Message.error("添加失败")
        }
      }
    },
    deleteFan(row) {
      this.$refs["tables"].deleteFan(row)
    },
    showFan(row) {
      this.$refs["tables"].showFan(row)
    },
    exportCsv() {
      this.$refs["tables"].exportCsv()
    },
    refresh() {
      // this.syncFans({
      //   appAccountId: 21,
      //   eeId: this.eeId,
      //   updatePublicAccountData: ["USER_INFO"]
      // })
      this.filterSearch()
    },
    pageChange(page) {
      if (page !== this.curPage) {
        this.curPage = page
        this.$refs["tables"].selectedItems = []
      }
      this.filterSearch()
    },
    pageSizeChange(pageSize) {
      if (this.pageSize !== pageSize) {
        this.pageSize = pageSize
        this.$refs["tables"].selectedItems = []
      }
      this.filterSearch()
    },
    resetModalForm(name) {
      this.$refs[name].resetFields()
    }
  },
  destroyed() {
    this.$root.Bus.$off("freshfans")
  }
}
</script>

<style lang="stylus">


















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































// #fansManage
//   position relative
//   height 100%
//   background #fff
//   .tabs
//     display flex
//     flex-direction column
//     height 100%
//     .tabs-bar
//       height 70px
//       padding-left 20px
//       box-shadow 0px 1px 0px 0px #edeef0
//       .tabs-bar-item
//         display inline-block
//         line-height 54px
//         padding 8px 25px
//         font-size 18px
//         cursor pointer
//         &:hover
//           color #409fff
//         &.active
//           color #409fff
//           border-bottom solid 2px #409fff
//     .tabs-panel
//       flex 1
//   .ivu-tabs-bar
//     padding-left 20px
//     border-bottom none
//     box-shadow 0px 1px 0px 0px #edeef0
//     .ivu-tabs-nav
//       height 70px
//     .ivu-tabs-tab
//       line-height 54px
//       padding 8px 25px
//       font-size 18px
//   #fans
//     display flex
//     height calc(100% - 10px)
//     .fans_left
//       padding-top 30px
//       width 230px
//       .fans_left_wrapper
//         padding-right 10px
//         padding-left 10px
//         .groupAction
//           margin-bottom 20px
//           button
//             width 100%
//     .fans_right
//       width calc(100% - 230px)
//       flex 1
//       padding-left 20px
//       border-left solid 1px #edeef0
</style>
