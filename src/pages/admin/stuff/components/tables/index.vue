<template>
    <div id="table">
        <div v-if="(currentTreeNode && currentTreeNode.eeNum) || datas.length">
          <div class="middle">
            <i-button @click="addUser" type="primary">添加员工</i-button>
            <div class="right_pro flex">
              <SearchBox
                v-model="searchInput"
                :search="getParams"
                :clear="cleankey"
                @search="setInputVal"
                :holder="'输入姓名/手机号'"
                :width="'220px'"
              ></SearchBox>
              <div class="hand-btn">
                <span class="icon" @click="setFilter">&#xe748;</span>
                <span class="icon" @click="exportCsv">&#xe66c;</span>
                <span class="icon" @click="refresh">&#xe62b;</span>
                <Poptip placement="left-start" v-model="showSet">
                  <span class="icon cursor pop_span">&#xe633;</span>
                  <div slot="content">
                    <Chooses :columns="columns"></Chooses>
                  </div>
                </Poptip>
              </div>
            </div>
          </div>
          <div class="table">
            <BScroll :offsetBottom="120">
              <Table ref="table" :loading="loading" @on-row-click="rowClick" :columns="columns" :data="datas" @on-selection-change="selectionChange"></Table>
            </BScroll>
          </div>
          <div class="common_pro">
            <div class="left_pro">
              <div class="checkbox">
                  <i><Checkbox v-model="isAllChoosed" @on-change="setAllChoose"></Checkbox></i> 全选
              </div>
              <i-button size="small" @click="handle('delete')">批量删除</i-button>
              <i-button size="small" @click="handle('stop')">批量停用</i-button>
            </div>
            <div class="pages" v-if="pageTotal > 10">
              <Page
              show-elevator
              :page-size = 'pageSize'
              :total="pageTotal"
              :current="currPage"
              show-total
              show-sizer
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
              ></Page>
            </div>
          </div>
        </div>
        <div v-else class="no_data">
          <div class="no_wrap">
            <img src="@/assets/images/imgs/stuff/no_data.png"/>
            <p>当前部门尚未添加员工</p>
            <i-button @click="addUser" type="primary">添加员工</i-button>
          </div>
        </div>
    </div>
</template>
<script>
    import { mapState, mapGetters } from 'vuex'
    import Chooses from './chooses'
    export default {
      name: 'tables',
      data() {
          return {
            searchInput: '',
            corId: -1,
            timer: null,
            currPage: 1,
            pagination: true,
            pageSize: 10,
            loading: false,
            isAllChoosed: false,
            processData: null,
            pageParam: {
              offset: 0,
              limit: 10
            },
            showSet: false, // 控制右上角设置项的显示
          }
      },
      props: {
        columns: {
          type: Array,
          default: () => { return [] }
        },
        datas: {
          type: Array,
          default: () => { return [] }
        },
        pageTotal: {
          type: Number,
          default: 0
        }
      },
      created() {
        this._BUS.$on('setNotChoose', () => {
          this.isAllChoosed = false
        })
        this._BUS.$on('tableLoading', (loadParam) => {
          loadParam && (this.loading = loadParam)
          if (!loadParam) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.loading = loadParam
            }, 300)
          }
        })
      },
      mounted() {
        this.on(document.body, 'click', () => {
          this.showSet = false
        })
      },
      computed: {
        ...mapGetters({
          currApart: 'stuff/getCurrApart',
          fitlerName: 'stuff/getFitlerName',
        }),
        ...mapState({
          currentTreeNode: state => state.stuff.currentTreeNode
        }),
      },
      components: {Chooses},
      watch: {
        currPage() {
          this.getParams()
        },
        pageSize() {
          this.getParams()
        },
        datas () {
          this.$nextTick(() => {
            this.$root.Bus.$emit('calcScrollHeight')
            this.isAllChoosed = false
          })
        },
        currentTreeNode() {
          this.currPage = 1
          this.pageSize = 10
          this.getParams()
        },
        fitlerName() {
          this.currPage = 1
          this.pageSize = 10
        }
      },
      methods: {
        getParams() {
          // debugger
          this.pageParam = {
            offset: (this.currPage - 1) * this.pageSize,
            limit: this.pageSize
          }
          this._BUS.$emit('getUsers')
        },
        addUser() {
          // this._BUS.$emit('handle', 'addUser')
          this._BUS.$emit('addUser')
        },
        rowClick(val) {
          this._BUS.$emit('handle', 'show', val.eeId)
        },
        cleankey() {
          this.setInputVal('')
          this.getParams()
        },
        setInputVal(key) {
          this.$store.commit('stuff/SET_FILTE_NAME', key)
        },
        // 刷新数据
        refresh() {
          this._BUS.$emit('getUsers')
        },
        // 导出数据
        exportCsv() {
          this.$refs.table.exportCsv({
            filename: '员工用户数据' + new Date().toLocaleDateString(),
            columns: this.columns.filter((col, index) => index > 0 && index < this.columns.length - 1),
            data: this.datas.map(item => {
              return {
                ...item,
                seatStatus: item.seatStatus ? '已分配' : '未分配',
                status: item.status === 1 ? '正常' : item.status === 2 ? '停用' : item.status === 3 ? '未加入' : item.status === 5 ? '已退出' : ''
              }
            })
          })
        },
        setFilter() {
          this._BUS.$emit('showFilter', {nowCompo: "Filters", drawerTitle: '筛选'})
        },
        setAllChoose() {
          // this.isAllChoosed = !this.isAllChoosed
          this.$refs.table.selectAll(this.isAllChoosed)
        },
        pageChange(page) {
          if (page !== this.currPage) {
            this.currPage = page
          }
        },
        pageSizeChange(pageSize) {
          if (this.pageSize !== pageSize) {
            this.pageSize = pageSize
          }
        },
        changeOrder(param) {
          let arg = {
            key: param.key,
            order: param.order
          }
          this._BUS.$emit('sortChange', arg)
        },
        selectionChange(selection) {
          this.isAllChoosed = selection.length === this.datas.length
          this.$store.commit('stuff/SET_SELECT_ROWS', this.deepCopy(selection))
        },
        handle(key) {
          // this.isAllChoosed = false
          this._BUS.$emit('handle', key)
        }
      },
      beforeDestroy() {
        this._BUS.$off('setNotChoose')
        this._BUS.$off('tableLoading')
      }
    }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #table
    .like_a
      border:1px solid text_color
      inline()
      center()
      width: 50px
      radius(3px)
      height:24px
      line-height:22px
      color:#409eff
    .ivu-table th
      bort(1px solid #e3e4e6)
      borb(0)
    .ivu-table-cell
      padr(5px)
      padl(5px)
      overflow visible
    .process_btn
      inline()
      padding:15px
      fn(22px)
      font-weight:bold
    .mr10
      inline()
      mr(8px)
    .img_portrait
      width: 20px
      height: 20px
      vertical-align middle
      mr(5px)
    .wechat_name
      mt(2px)
    .ivu-spin-fix
      bgColor(hsla(0,0%,100%,.9))

  #table
    .middle
      setBetween()
      mb(20px)
      .right_pro
        fr()
        .icon
          color: #909499
        .search_input
          fl()
          border_()
          vertical(40px)
          radius(3px)
          relative()
          width:200px
          mr(10px)
          input
            absolute()
            left:10px
            top:0
            height:100%
            bottom:0
            right:20px
          i
            absolute()
            right:0
            width:28px
            cursor()
            fn(20px)
            color(#aaa)
        >.ivu-icon
          cursor()
          width 30px
          height 30px
          fn(14px)
          text-align center
          border 1px solid #ddd
        .hand-btn
          margin-left: 20px
          >span, .pop_span
            fl()
            margin:0 10px
            mt(10px)
            cursor()
            fn(18px)
            &:hover
              color(text_color)
          .pop_span
            mt(8px)
            fn(24px)
          .pop_span:hover
            color(text_color)
    .common_pro
      setBetween()
      mt(20px)
      .left_pro
        fl()
        button
          fl()
          margin:0 5px
          bgColor()
        .checkbox
          mt(8px)
          fl()
          mr(20px)
      .pages
        fr()
        mt(-5px)
    .no_data
      margin:0 auto
      text-align:center
      vertical-align:middle
      .no_wrap
        width:200px
        inline()
        mt(200px)
        img, p, button
          inline()
          margin-bottom 30px
        p
          font-family: MicrosoftYaHei;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #303133;
        button
          width: 160px;
          height: 40px;
          background-color: #409eff;
          border-radius: 3px;
</style>
