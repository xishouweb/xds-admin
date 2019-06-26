<template>
  <div id="fans">
    <Spin fix v-if="loadingData">
      <Icon type="load-c" size="40" class="spin-icon-load"></Icon>
      <div>loading</div>
    </Spin>
    <template v-else>
      <div class="fans_left">
        <BScroll :data="formatFansGroups">
          <div class="fans_left_wrapper">
            <div class="groupAction">
              <Button @click.stop="addGroup" type="default">
                <Icon type="plus"></Icon>新建分组
              </Button>
            </div>
            <Group
              :groupData="formatFansGroups"
              :currentId="groupId"
              :createdId="createId"
              :noSelectNum="2"
              @transmitEvent="operationGroup"
              @moveEvent="moveGroup"
              @getTempsData="getTempsData"
              :hasCount="false"
            ></Group>
          </div>
        </BScroll>
      </div>
      <div class="fans_right">
        <BScroll>
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
                    <input v-model="nkNameNamePhone" placeholder="搜索" @keyup.enter.prevent="search">
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
              <div slot="action" :style="{display: 'inline-block'}" slot-scope="slotProps">
                <Button size="small" v-if="!slotProps.data" @click="moveFansGroup">移动分组</Button>
                <Poptip placement="top" v-else v-model="popVisible" popper-class="moveGroupWrap">
                  <Button size="small" @click="moveFansGroup">移动分组</Button>
                  <div slot="content" class="chooses" @click.stop>
                    <div class="chooses-servicer">
                      <scroll-bar>
                        <ul>
                          <RadioGroup v-model="selectedGroup">
                            <li v-for="(item, idx) in formatFansGroups" :key="idx" v-if="idx > 0">
                              <Radio :label="item.id">
                                <span :style="{marginLeft: '5px'}">{{item.name}}</span>
                              </Radio>
                            </li>
                          </RadioGroup>
                        </ul>
                      </scroll-bar>
                    </div>
                    <div class="chooses-action">
                      <Button size="small" type="primary" @click="moveGroupOk">确定</Button>
                      <Button size="small" type="default" @click="popVisible = false">取消</Button>
                    </div>
                  </div>
                </Poptip>
              </div>
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
        </BScroll>
      </div>
    </template>
    <!-- 新增分组 -->
    <NewModal
      :header="groupProp.title"
      :maxZIndex="true"
      :isAutoClose="false"
      v-model="groupProp.visible"
      width="400"
      @ok="addGroupOk"
      @close="resetModalForm('groupForm')"
    >
      <Form ref="groupForm" :model="groupProp.form" :rules="groupProp.rule">
        <FormItem prop="name">
          <Input type="text" v-model="groupProp.form.name" placeholder="请输入组名, 不超过10个字"></Input>
        </FormItem>
      </Form>
    </NewModal>
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
        <!-- <FormItem prop="selectName">
          <AutoComplete
            v-model="condProp.form.selectName"
            :data="condNameList"
            :filter-method="filterMethod"
            placeholder="请输入筛选条件名称, 不超过10个字"
          ></AutoComplete>
        </FormItem>-->
      </Form>
    </NewModal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import FansFilter from "../component/filter"
import FansTable from "../component/table"
import tableMixins from "../component/table/mixins"
// 过滤初始值
export default {
  name: "fansMy",
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
    const validateGroupName = (rule, value, callback) => {
      value = value.replace(/\s*/g, "") // 过滤空格
      if (!value.length) {
        callback(new Error("请填写分组名称"))
      } else if (value.length > 10) {
        callback(new Error("分组名称不超过10个字"))
      } else {
        callback()
      }
    }
    return {
      showSet: false, // 控制设置项的显示
      kfSeatId: null, // 当前坐席
      eeId: null,
      groupId: -1,
      createId: -1,
      groupProp: {
        visible: false,
        rule: {
          name: [
            { required: true, message: "请填写分组名称", trigger: "blur" },
            {
              validator: validateGroupName,
              trigger: "blur"
            }
          ]
        },
        form: {
          name: ""
        },
        title: "新建分组",
        status: "add"
      },
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
      selectedGroup: null,
      popVisible: false, // 移动分组
      params: {},
      modalVisible: false,
      fansTags: {},
      curFansWx: "", // 公众号
      curCoo: {},
      loadingData: false,
      order: '', // 排序
      sort: '' // 排序字段
    }
  },
  computed: {
    ...mapState("fans", {
      records: state => state.allFans.records,
      loading: state => state.allloading,
      totalCount: state => state.allFans.totalCount,
      groupInfoList: state => state.fansGroupList.groupInfoList,
      condList: state => state.condList
    }),
    ...mapGetters("fans", ["formatFansGroups", "condNameList"])
  },
  watch: {
    popVisible(val) {
      if (!val) {
        // 重置数据
        this.selectedGroup = null
      }
    }
  },
  mounted() {
    // 初始化常量数据
    this.init()
    // 刷新
    this.$root.Bus.$on("freshfans", () => {
      this.refresh()
    })
    this.on(document.body, 'click', () => {
      this.showSet = false
      this.popVisible = false
    })
  },
  methods: {
    ...mapActions("fans", [
      "getGroupList",
      "getAllList",
      "saveGroup",
      "updateWxGroup",
      "deleteWxGroup",
      "updateWxGroupByOrder",
      "updateWxGroupByMove",
      "addCond",
      "queryCondList",
      "syncFans",
      "queryPublicsBySeat",
    ]),
    async init() {
      // 获取分组信息并且获取粉丝信息
      this.loadingData = true
      const res = await this.getGroupList()
      await this.queryPublicsBySeat()
      if (res.code === 1) {
        this.kfSeatId = res.data.seatId
        this.eeId = res.data.eeId
        await this.getAllList({
          kfSeatId: res.data.seatId,
          offset: (this.curPage - 1) * this.pageSize,
          limit: this.pageSize
        })
      } else {
        this.$Message.error("获取粉丝信息失败")
      }
      this.loadingData = false
    },
    // 分组操作
    addGroup() {
      if (this.formatFansGroups.length >= 52) {
        this.$Message.error("最多可新建50个分组")
        return
      }
      this.groupProp = {
        ...this.groupProp,
        visible: true,
        status: "add",
        title: "新建分组",
        form: {
          name: ""
        }
      }
    },
    async addGroupOk() {
      const valid = await this.$refs["groupForm"].validate()

      if (!valid) return
      const name = this.groupProp.form.name.replace(/\s*/g, "") // 过滤空格后的值
      if (this.groupProp.status === "add") {
        const res = await this.saveGroup({ name })
        if (res.code === 1) {
          this.groupProp.visible = false
          this.createId = res.data.createId
          this.$Message.success("分组创建成功")
        } else {
          this.$Message.error(res.message)
          // this.$Message.error("分组创建失败")
        }
      } else {
        // 修改
        const res = await this.updateWxGroup({ name, id: this.groupProp.id })
        if (res.code === 1) {
          this.groupProp.visible = false
          this.$Message.success("分组修改成功")
        } else {
          this.$Message.error("分组修改失败")
        }
      }
    },
    async operationGroup(type, group) {
      if (type === "modify") {
        this.groupProp = {
          ...this.groupProp,
          visible: true,
          status: "modity",
          title: "修改分组",
          id: group.id,
          form: {
            name: group.name
          }
        }
      } else if (type === "del") {
        const res = await this.deleteWxGroup({ id: group.id })
        if (res.code === 1) {
          this.$Message.success("删除成功")
        } else {
          this.$Message.error(res.message || "删除失败")
        }
      }
    },
    async moveGroup(type, arr, index1, index2) {
      const res = await this.updateWxGroupByOrder({
        sourceId: arr[index1]["id"],
        targetId: arr[index2]["id"]
      })
      if (res.code === 1) {
        this.$Message.success("移动成功")
      } else {
        this.$Message.error("移动失败")
      }
    },
    getTempsData(item) {
      this.groupId = item.id
    },
    // 筛选
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
        limit: this.pageSize,
        kfSeatId: this.kfSeatId
      }
      if (this.nkNameNamePhone) {
        params.nkNameNamePhone = this.nkNameNamePhone
      }
      if (this.groupId !== -1) {
        params.fsGroupId = Number(this.groupId)
      }
      this.getAllList(params)
    },
    filterClear() {
      this.$refs.filter.clearValue()
      // 其他清空
      this.groupId = -1
      this.curPage = 1
      this.pageSize = 10
      this.nkNameNamePhone = ""
      this.filterSearch()
    },
    filterSave() {
      if (this.condList.length >= 10) {
        this.$Message.error("筛选分组最多10个")
        return
      }
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
      console.log(valid)
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
          this.$Message.error(response.message || "添加失败")
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
    moveFansGroup() {
      const res = this.$refs["tables"].filterSelectFan()
      if (res) {
        this.params = res
      }
    },
    async moveGroupOk() {
      if (!this.selectedGroup) {
        this.$Message.error("请选择分组")
        return
      }
      // 移动分组
      const params = {}
      params.fansIds = this.params.fans.map(item => ({
        fansId: item.fansId,
        appAccountId: item.appAccountId
      }))
      params.targetId = this.selectedGroup
      const response = await this.updateWxGroupByMove(params)
      this.popVisible = false
      if (response.code === 1) {
        this.$root.Bus.$emit("resetSelect")
        this.$Message.success("移动成功")
      } else {
        this.$Message.error("移动失败")
      }
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
    filterMethod(value, option) {
      if (value) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
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
