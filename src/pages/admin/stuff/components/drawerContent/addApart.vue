<template>
    <div id="addApart">
        <ul>
            <li>
                <p>所属上级</p><span>{{apartName}}</span>
            </li>
            <li>
                <p>部门名称</p>
                <Input class="input" :class="{'error': inputErr}" v-model="inputVal" width="200px" placeholder="请输入部门名称"/>
                <i class="err_color" v-show="inputErr">部门名称不能为空且不能超过40个字符</i>
            </li>
        </ul>
        <div class="handles">
            <i-button type="primary" class="width_bg" @click="saveApart">保存</i-button>
            <i-button @click="handle('goback')">取消</i-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'addApart',
        data() {
            return {
                inputVal: '',
                inputErr: false
            }
        },
        computed: {
            apartName() {
              return this.param.type === 'add' ? this.param.label : this.param.parentLabel
            }
        },
        props: {
          param: {
            type: Object,
            default: () => { return {} }
          }
        },
        created() {
          this.init()
        },
        methods: {
          init() {
            this.inputVal = this.param.type === 'add' ? '' : this.param.label
          },
          handle(key) {
            this.$emit('close')
          },
          dealInput() {
              if (!this.inputVal || this.inputVal.length > 40) {
                  this.inputErr = true
                  return false
              }
              return this.inputVal
          },
          saveApart() {
            if (this.param.type === 'add') {
              this.addNew()
            } else {
              this.modifyApart()
            }
          },
          addNew() {
            let name = this.dealInput()
            this.addApart({
              deptParentLink: this.param.id,
              name,
              isSys: 0
            }).then((res) => {
                if (res.code === 1) {
                  console.log(res.data.id)
                  this.param.afterAdd({id: res.data.id, label: name})
                  this.$Message.success("添加成功")
                  this.$emit('close')
                } else if (res.code === 3534) {
                  this.$Message.error('抱歉，子部门最多只能有4层')
                } else if (res.code === 3533) {
                  this.$Message.error('抱歉，部门总数最多只能100个')
                } else {
                  this.$Message.error(res.message)
                }
            })
          },
          modifyApart() {
            let name = this.dealInput()
            this.addApart({
              deptParentLink: this.param.parentId,
              id: this.param.id,
              name,
              isSys: 0,
            }).then((res) => {
                if (res.code === 1) {
                  console.log(res.data.id)
                  this.param.afterAdd({id: res.data.id, label: name})
                  this.$Message.success("修改成功")
                  this.$emit('close')
                } else {
                  this.$Message.error(res.message)
                }
            })
          }
        }
    }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
  #addApart
    height:100%
    relative()
    ul
      li
        padding: 20px
        relative()
        padt(30px)
        fn(16px)
        p
          fl()
          width:120px
        i
          absolute()
          top:62px
          left: 140px
          fn(12px)
        .input
          fl()
          mt(-10px)
          width:300px
          &.error
            input
              border-color:err_color
</style>
