<template>
  <div :class="calcClass">
    <div class="modalAction" @click="visible = true">
      <slot :selected="selectedTree">
        <Button>选择员工</Button>
      </slot>
    </div>
    <Modal
      v-model="visible"
      class="modalStuff"
      width="620"
      @on-cancel="close"
      @on-visible-change="changeVisible"
    >
      <div slot="header" class="modal-title">
        <span>{{modeProps[mode]['title']}}</span>
        <Poptip
          trigger="hover"
          placement="bottom"
          width="200"
          :content="modeProps[mode]['titleTip']"
        >
          <i class="icon">&#xe635;</i>
        </Poptip>
      </div>
      <div class="modal-content">
        <div class="stuff-container">
          <div class="stuff-header">
            <div class="stuff-header-left">
              {{modeProps[mode]['stuffLeft']}}
              <span
                class="stuffNum"
                v-if="mode === 'stuff'"
              >({{stuffTotal}})</span>
            </div>
            <div class="stuff-header-right">
              {{modeProps[mode]['stuffRight']}}
              <span
                class="stuffNum"
                v-if="mode === 'stuff'"
              >({{selectedTree.length}})</span>
            </div>
          </div>
          <div class="stuff-wrapper">
            <div class="stuff-wrapper-left">
              <div class="searchInputWrap">
                <input
                  v-model="searchInput"
                  :placeholder="placeholder"
                  @keyup.enter.prevent="searchData"
                >
                <p class="inputExtra" @click="searchData">
                  <i class="icon">&#xe634;</i>
                </p>
              </div>
              <div class="sutff-tree-wrapper" v-if="mode === 'stuff'">
                <Spin fix v-if="treeLoaing">
                  <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
                  <div>请求中</div>
                </Spin>
                <scroll-bar v-else>
                  <Tree
                    :data="treeData"
                    show-checkbox
                    :render="renderContent"
                    @on-check-change="changeTreeCheck"
                  ></Tree>
                </scroll-bar>
              </div>
              <div class="sutff-tree-wrapper" v-if="mode === 'department'">
                <div class="stuff-tabs">
                  <div class="stuff-tabs-bar">
                    <div
                      class="stuff-tabs-nav"
                      :class="{active: curTab === 'stuff'}"
                      @click="changeTab('stuff')"
                    >客服({{stuffTotal}})</div>
                    <div
                      class="stuff-tabs-nav"
                      :class="{active: curTab === 'department'}"
                      @click="changeTab('department')"
                    >部门({{departmentTotal}})</div>
                  </div>
                  <div class="stuff-tabs-panels">
                    <div class="stuff-tabs-panel" v-show="curTab === 'stuff'">
                      <Spin fix v-if="treeLoaing">
                        <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
                        <div>请求中</div>
                      </Spin>
                      <scroll-bar v-else>
                        <Tree
                          :data="treeData"
                          show-checkbox
                          :render="renderContent"
                          @on-check-change="changeTreeCheck"
                        ></Tree>
                      </scroll-bar>
                    </div>
                    <div class="stuff-tabs-panel" v-show="curTab === 'department'">
                      <Spin fix v-if="departmentLoading">
                        <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
                        <div>请求中</div>
                      </Spin>
                      <scroll-bar v-else>
                        <ul class="department">
                          <CheckboxGroup v-model="selectedDepartmentIds">
                            <li v-for="item in departmentData" :key="item.id">
                              <Checkbox :label="item.id">
                                <span class="department-title">{{item.title}}</span>
                              </Checkbox>
                            </li>
                          </CheckboxGroup>
                        </ul>
                      </scroll-bar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="stuff-wrapper-right">
              <div class="searchInputWrap">
                <input
                  v-model="selectedSearchInput"
                  :placeholder="selectedPlaceholder"
                  @keyup.enter.prevent="searchSelectedData"
                >
                <p class="inputExtra" @click="searchSelectedData">
                  <i class="icon">&#xe634;</i>
                </p>
              </div>
              <div class="sutff-selected-wrapper">
                <div class="sutff-selected-none" v-if="!selectedData.length">
                  <p v-if="mode === 'stuff'">已选择 0 位员工</p>
                  <p v-if="mode === 'department'">已选择 0 位客服， 0个部门</p>
                </div>
                <scroll-bar v-else>
                  <ul>
                    <li v-for="(item, index) in selectedData" :key="index">
                      <span>{{item.title}}</span>
                      <i class="icon" @click="removeStuff(item)">&#xe703;</i>
                    </li>
                  </ul>
                </scroll-bar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="modal-footer">
        <div class="modalFooter">
          <div class="modal-footer-left" v-if="mode === 'stuff'">
            已选择
            <span class="selectedNum">{{selectedTree.length}}</span>位员工
          </div>
          <div class="modal-footer-left" v-if="mode === 'department'">
            已选择
            <span class="selectedNum">{{selectedTree.length}}</span>
            位客服，
            <span class="selectedNum">{{selectedDepartment.length}}</span>个部门
          </div>
          <div class="modal-footer-right">
            <Button type="primary" @click="saveSelectTree">保存</Button>
            <Button @click="close">取消</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAllDeptAndEmp, selectAllSeat, selectAllDept } from "@/api/markting"
export default {
  name: "staffTreePicker",
  props: {
    mode: {
      type: String,
      default: "stuff" // 默认员工模式 department
    },
    buttonTxt: {
      type: String,
      default: "选择员工"
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    onSave: {
      type: Function,
      default() {
        return () => {}
      }
    },
    defaultValue: {
      // 选中的值，用于回填,员工列表
      type: Object,
      default() {
        return {
          stuff: [],
          department: [],
          stuffAndDept: []
        }
      }
    }
  },
  data() {
    // 根据defaultValue重置初始值, selectedTree, selectedDepartmentIds, treeData
    return {
      isLoading: false,
      visible: false,
      curTab: "stuff",
      modeProps: {
        stuff: {
          title: "选择员工",
          titleTip: "只显示当前企业下员工状态为正常的员工。",
          stuffLeft: "待选员工",
          stuffRight: "已选员工"
        },
        department: {
          title: "选择客服/部门",
          titleTip:
            "显示当前企业下所有的客服和部门。选择部门后，默认选中该部门下所有与公众号绑定的客服，粉丝扫码关注或扫码进入公众号后只分配给选中客服和部门与公众号绑定的客服。",
          stuffLeft: "待选客服/部门",
          stuffRight: "已选客服/部门"
        }
      },
      stuffTotal: null, // 树数据
      treeLoaing: false,
      treeData: [],
      departmentTotal: null,
      departmentLoading: false,
      departmentData: [],
      searchInput: "",
      selectedSearchInput: "",
      selectedDepartmentIds: [],
      selectedDepartment: [],
      selectedTree: [],
      selectedData: []
    }
  },
  computed: {
    calcClass() {
      return ["modalContainer", `modalContainer-${this.mode}`]
    },
    placeholder() {
      return this.curTab === "stuff" ? "输入姓名搜索" : "输入部门搜索"
    },
    selectedPlaceholder() {
      return this.curTab === "stuff" ? "输入姓名搜索" : "输入姓名或者部门搜索"
    },
    cloneSelectedData() {
      // 选选中的混合数据
      return [...this.selectedTree, ...this.selectedDepartment]
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (val && val.department) {
          this.selectedDepartmentIds = val.department.map(item => item.id)
          this.selectedTree = val.stuff
          this.selectedData = val.stuffAndDept
          this.selectedDepartment = val.department
        }
      },
      deep: true
    },
    selectedDepartmentIds: {
      handler(val) {
        if (this.departmentData.length) {
          this.selectedDepartment = this.departmentData.filter(item =>
            val.includes(item.id)
          )
        }
      },
      deep: true
    },
    selectedTree: {
      handler(val) {
        this.selectedData = [...val, ...this.selectedDepartment]
      },
      deep: true
    },
    selectedDepartment: {
      handler(val) {
        this.selectedData = [...this.selectedTree, ...val]
      },
      deep: true
    }
  },
  methods: {
    async getPersonData() {
      this.treeLoaing = true
      const personData = await getAllDeptAndEmp()
      this.treeLoaing = false
      if (personData.code === 1 && personData.data) {
        const { data, personTotal } = this.formatPersonData(
          personData.data || {}
        )
        this.stuffTotal = personTotal
        this.treeData = data
      }
    },
    async getStuffData() {
      this.treeLoaing = true
      const stuffData = await selectAllSeat({
        appAccountId: this.params.appAccountId,
        empName: this.searchInput
      })
      this.treeLoaing = false
      if (stuffData.code === 1 && stuffData.data) {
        const formatStuffData = this.formatStuffData(stuffData.data || {})
        this.stuffTotal = stuffData.data.count
        this.treeData = formatStuffData
      }
    },
    async getDeptData() {
      this.departmentLoading = true
      const deptData = await selectAllDept({ deptName: this.searchInput })
      this.departmentLoading = false
      if (deptData.code === 1 && deptData.data) {
        const formatDeptData = this.formatDeptData(deptData.data.list || [])
        this.departmentTotal = deptData.data.count
        this.departmentData = formatDeptData
      }
    },
    renderContent(h, { root, node, data }) {
      return h(
        "div",
        {
          style: {
            display: "inline-block"
            // position: 'relative',
            // top: '15px\9'
          },
          class: "tree-name"
        },
        [
          h(
            "p",
            {
              style: {
                display: "flex",
                // width: "200px",
                marginBottom: "8px"
              }
            },
            [
              h(
                "span",
                {
                  style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                data.title
              )
              // h(
              //   "span",
              //   {
              //     style: {
              //       color: "#979899"
              //     }
              //   },
              //   `(${data.count || 0})`
              // )
            ]
          )
        ]
      )
    },
    changeTreeCheck(selected) {
      this.selectedTree = selected.filter(item => item.type === "stuff")
      this.filterSelectedTree = selected.filter(item => item.type === "stuff")
    },
    async removeStuff(item) {
      if (item.type === "department") {
        this.selectedDepartmentIds = this.selectedDepartmentIds.filter(
          _item => _item !== item.id
        )
      } else {
        // 移除选中的员工
        // 移除tree数据
        this.selectedTree = this.selectedTree.filter(
          _item => _item.id !== item.id
        )
        this.$set(item, "checked", false)
      }
    },
    searchData() {
      // 根据tab搜索
      // 把选中的值清空
      if (this.curTab === "stuff") {
        this.getStuffData()
      } else {
        this.getDeptData()
      }
    },
    searchSelectedData() {
      this.selectedData = this.cloneSelectedData.filter(item => {
        return item.title.includes(this.selectedSearchInput)
      })
    },
    saveSelectTree() {
      if (this.mode === "stuff") {
        this.onSave({
          stuff: this.selectedTree
        })
      } else {
        this.onSave({
          stuff: this.selectedTree,
          department: this.selectedDepartment,
          stuffAndDept: this.selectedData
        })
      }
      this.visible = false
    },
    close() {
      this.visible = false
    },
    formatInitValue() {
      // 处理回填
    },
    formatPersonData(data) {
      let personTotal = 0
      const fn = data => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = data[i].key
          data[i].title = data[i].label
          if (data[i].acEmployeeDtos) {
            if (data[i].children) {
              data[i].children = [
                ...data[i].children,
                ...data[i].acEmployeeDtos
              ]
            } else {
              data[i].children = [...data[i].acEmployeeDtos]
            }
          }
          if (!data[i].parentId) {
            // 节点没有父节点，就是底层员工节点
            personTotal++
            continue
          }

          if (data[i] && data[i].children) {
            // 有子节点
            data[i].expand = true // 展开
            fn(data[i].children)
          }
        }
      }
      fn(data)
      return { data, personTotal }
    },
    formatStuffData(data) {
      let tree = []
      tree = data.list.map(item => {
        const children = item.list.map(_item => {
          const checked = this.selectedTree.some(
            __item => __item.id === _item.seatId
          )
          return {
            id: _item.seatId,
            title: _item.empName,
            checked,
            type: "stuff"
          }
        })
        return {
          title: item.deptName,
          expand: true,
          count: item.count || 0,
          children
        }
      })
      return tree
    },
    formatDeptData(list) {
      return list.map(item => {
        return { id: item.deptId, title: item.deptName, type: "department" }
      })
    },
    changeTab(type) {
      this.curTab = type
    },
    changeVisible(flag) {
      // 第一次显示获取数据
      if (!this.isLoading && flag) {
        this.isLoading = true
        if (this.mode === "stuff") {
          this.getPersonData()
        } else {
          this.getStuffData()
          this.getDeptData()
        }
      }
    }
  }
}
</script>

<style>
.tree-name {
  position: relative;
  top: 15px\9; /* 在IE6-10生效 */
}
</style>
<style lang="stylus">
.modalContainer
  display inline-block
.modalStuff
  // 模态
  .ivu-modal-wrap
    display flex
    align-items center
    justify-content center
    .ivu-modal
      top 0
      margin 0 !important
      .ivu-modal-header
        border-bottom none
  // 输入框
  .searchInputWrap
    position relative
    margin 20px
    display block
    border 1px solid #ddd
    line-height 40px
    height 42px
    border-radius 3px
    background #fff
    input
      position absolute
      left 10px
      top 1px
      height 38px
      right 20px
    .inputExtra
      position absolute
      right 0
      width 28px
      text-align center
      cursor pointer
      font-size 20px
      color #aaa
      .icon
        font-size 20px
  // popTip提示
  .ivu-poptip-inner
    white-space normal
    .ivu-poptip-body
      padding 16px
      color #606366
      line-height 24px
      letter-spacing 1px
  // tabs
  .stuff-tabs
    .stuff-tabs-bar
      display flex
      .stuff-tabs-nav
        width 50%
        text-align center
        padding-bottom 14px
        &.active
          color #409fff
          border-bottom solid 2px #409fff
    .stuff-tabs-panel
      position relative
      padding-top 10px
      height 230px
  // 业务
  .stuff-container
    .stuff-header
      display flex
      & > div
        width 50%
        .stuffNum
          color #979899
    .stuff-wrapper
      display flex
      margin-top 16px
      border solid 1px #edeff0
      & > div
        width 50%
        text-align center
        .sutff-tree-wrapper
          position relative
          height 260px
          margin 20px
          text-align left
        .sutff-selected-wrapper
          height 260px
          li
            display flex
            align-items center
            justify-content space-between
            height 40px
            padding 0 10px 0 26px
            .icon
              color #cacbcc
              cursor pointer
            &:hover
              background #f2f3f5
              .icon
                color #909499
        .sutff-selected-none
          padding-top 60px
          color #979899
      .stuff-wrapper-left
        background-color #f7f9fa
      .department
        li
          margin-bottom 20px
          .department-title
            display inline-block
            width 210px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            margin-left 6px
            vertical-align bottom
  // 底部交互
  .modalFooter
    display flex
    align-items center
    justify-content space-between
    .modal-footer-left
      color #979899
      .selectedNum
        color #409fff
</style>
