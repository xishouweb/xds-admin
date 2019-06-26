<template>
  <div class="areaSelect" v-click-outside="blur">
    <Cascader :data="data" :load-data="loadData" v-model="selectArea" :transfer="true"></Cascader>
    <Input v-model="selectDes" placeholder="请输入详情地址" :style="{marginTop: '10px'}"/>
  </div>
</template>
<script>
import { directive as clickOutside } from "v-click-outside-x"
import { loadTConfigListTree, getValueByKeyAndPv } from "@/api/query"
export default {
  name: "areaSelect",
  directives: { clickOutside },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    let area = []
    let areaDes = ''
    const arr = this.value.split(',')
    if (arr.length && arr[0] === '中国') {
      area = arr.slice(1,3)
      areaDes = arr[3]
    } else {
      area = []
      areaDes = ''
    }
    return {
      keys: ['WECHAT_COUNTRY', 'WECHAT_PROVINCE', 'WECHAT_CITY'], // 获取三级地区数据相应的Key值
      selectArea: area,
      selectDes: areaDes,
      data: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      let obj = {
        itemKey: this.keys[1]
      }
      const res = await loadTConfigListTree(obj)
      if (res.code === 1) {
          this.data = this.formatAreaData(res.data || [], true)
      }
    },
    async loadData(item, callback) {
      item.loading = true
      let params = {
        itemKey: this.keys[2],
        itemPv: item.type
      }
      const res = await getValueByKeyAndPv(params)
      if (res.code === 1) {
          item.children = this.formatAreaData(res.data || [], false)
        } else {
          item.children = []
      }
      item.loading = false
      callback()
    },
    blur() {
      const address = '中国' + ',' + this.selectArea.join(',') + ',' + this.selectDes
      this.$emit('input', address)
      this.$emit("blur")
    },
    formatAreaData(data = [], isLoading) {
      return data.map(item => {
        if (isLoading) {
          return {
            value: item.itemName,
            label: item.itemName,
            children: [],
            loading: false,
            type: item.itemValue
          }
        } else {
          return {
            value: item.itemName,
            label: item.itemName,
            type: item.itemValue
          }
        }
      })
    }
  }
}
</script>
