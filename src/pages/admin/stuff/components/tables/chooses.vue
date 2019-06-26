<template>
  <div id="chooses" >
    <div class="choose_all">选择项目</div>
    <ul class="choose_ul">
        <li v-for="(item, idx) in Columns" v-if="item.title" :key="idx">
            <Checkbox v-model="item.show" @on-change="setting"></Checkbox>{{item.title}}
        </li>
    </ul>
    <div class="choose_all">按置顶排序</div>
    <div class="is_top" @click.stop>
      <i-select v-model="isTop" style="width:100px" @on-change='change'>
        <i-option :value="1">是</i-option>
        <i-option :value="0">否</i-option>
      </i-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Columns: [],
      isTop: 1
    }
  },
  props: {
    columns: {
      default: () => { return [] },
      type: Array
    }
  },
  created() {
    let chooseObj = localStorage && JSON.parse(localStorage.getItem(this.installName('stuff')))
    if (chooseObj) {
      let arr = this.columns.slice()
      arr.forEach((item, index) => {
        this.$set(item, 'show', chooseObj[index])
      })
      this.$set(this, 'Columns', arr)
    } else {
      this.Columns = this.columns.slice()
    }
    this.changeTable()
  },
  methods: {
    setting() {
      // 更改要列选项
      let tableHeads = []
      let key = this.installName('stuff')
      this.Columns.forEach((item, index) => {
        tableHeads[index] = item.show
      })
      localStorage && localStorage.setItem(key, JSON.stringify(tableHeads))
      this.changeTable()
    },
    changeTable() {
      let arr = []
      this.Columns.forEach((item, index) => {
        item.show && arr.push(item)
      })
      this._BUS.$emit('setColumn', arr)
    },
    change(val) {
      this.$store.commit('stuff/SET_TOP', val)
      this._BUS.$emit('getUsers')
    },
    // 公用方法，组装localStorage中存储的列表头显示数据的名称，为“用户id_公司id_页面名称”
    installName(pageName) {
      let userId = this.getToken().userId
      let applyId = this.localStorageSaveOrRead('currentCorp').applyId
      return userId + '_' + applyId + '_' + pageName
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/index'

#chooses
  height 100%
  width 100%
  .choose_ul
    li
      margin:10px 0
      label
        fn(12px)
        mr(10px)
  .is_top
    padt(10px)
    .ivu-select-item
      padl(10px)
      vertical(30px)
      &:hover
        color(text_color)
    .ivu-select-item-selected:hover
      color(#fff)
</style>
