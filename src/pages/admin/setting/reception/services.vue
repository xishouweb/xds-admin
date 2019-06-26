
<template>
  <!-- 选择客服组件 -->
  <div class="services-tab" :class="{gray:this.show.showCheck, noCont: !cont.length}" v-if="cont">
    <Table
      :columns="head"
      :data="cont"
      :row-class-name="setClass"
      :disabled-hover="show.showIndex"
      :no-data-text="noText"
    ></Table>
  </div>
</template>

<script>
  export default{
    // cont:列表数据，show:显示控制数据
    props: {
      cont: {},
      show: {},
      noText: {
        type: String,
        default: '您还未添加接待组客服'
      }
    },
    data() {
      return {
        total: 0, // 总数量
        head: [
          {
            title: '序号',
            type: 'index',
            width: 70,
          },
          {
            title: '选择',
            key: 'check',
            width: 70,
            render: (h,o) => {
              let dex = o.index
              return h('Checkbox',{
                props: {
                  value: o.row.val,
                  disabled: o.row.disabled,
                },
                on: {
                  input: (ev) => {
                    this.cont[dex].val = o.row.val = ev
                  }
                }
              })
            },
          },
          {
            title: '员工姓名',
            key: 'name',
            render: (h,o) => {
              return h('p', {
                class: 'text_over',
                style: {
                  lineHeight: 1.2
                }
              },o.row.name)
            }
          },
          {
            title: '坐席编号',
            key: 'code',
            width: 100
          },
          {
            title: '坐席备注',
            key: 'notes',
            render: (h,o) => {
              return h('p', {
                class: 'text_over',
                style: {
                  lineHeight: 1.2
                }
              },o.row.notes)
            }
          },
          {
            title: '部门',
            key: 'department',
            render: (h,o) => {
              return h('p', {
                class: 'text_over',
                style: {
                  lineHeight: 1.2
                }
              },o.row.department)
            }
          },
          {
            title: '操作',
            key: 'hand',
            width: 210,
            render: (h, o) => {
              let hand = [
                h('Button',{
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.$emit('hand', {typ: 1,dex: o.index})
                    }
                  }
                },'上移'),
                h('Button',{
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.$emit('hand', {typ: 2,dex: o.index})
                    }
                  }
                },'下移'),
                h('Button',{
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.$emit('hand', {typ: 3,dex: o.index})
                    }
                  }
                },'移除'),
              ]
              return this.setHand(h, o, hand)
            }
          },
        ],
        // cont:[
        //   {
        //     val: true,
        //     name: '郭军',
        //     code: 'ZX001',
        //     notes: '售后服务',
        //     department: '销售中心',
        //     disabled: true,
        //   },
        // ],
      }
    },
    mounted() {
      if (!this.show.showIndex) {
        this.head.splice(0,1)
      }
      if (!this.show.showCheck) {
        this.head.splice(1,1)
      }
      if (!this.show.showHand) {
        this.head.splice(this.head.length - 1,1)
      }
    },
    methods: {
      setClass(row,dex) { // 设置类名
        if (this.show.showCheck) {
          let cla = ''
          cla += row.val === true ? ' check' : ''
          cla += row.disabled === true ? ' disabled' : ''
          return cla
        }
      },
      setHand(h, o, hand) { // 设置操作按钮
        let doms
        if (this.cont.length === 1) {
          doms = [hand[2]]
        } else if (o.index === 0) {
          doms = [hand[1],hand[2]]
        } else if (o.index === this.cont.length - 1) {
          doms = [hand[0],hand[2]]
        } else {
          doms = hand
        }
        return h('div',doms)
      }
    },
  }
</script>

<style lang="stylus">
  .services-tab
    .ivu-table
      .ivu-table-cell
        font-size: 0
        padding-left: 10px
        padding-right: 10px
        p, span, div
          font-size: 14px
      td
        border-bottom:0
      .check
        >td
          background-color: #e6f0f5
      .disabled
        >td
          color:#979899
          background-color:#f7f9fa
      .ivu-btn
        padding:4px 10px
      .ivu-table-tip
        td
          color: #979899;
          height: 450px
  .gray .ivu-table
    td
      background-color:#f7f9fa
  .services-page
    position: absolute
    bottom: -35px
    left: 0
  .noCont
    .ivu-table
      td
        border-bottom: none
</style>

