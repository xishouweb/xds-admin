<template>
  <div class="selectWrap" @click.stop>
    <div class="selectGroup">
      <RadioGroup :value="selectValue.type" @on-change="changeType">
        <ul>
          <li>
            <Radio :label="0">
              <span>不限</span>
            </Radio>
          </li>
          <li>
            <Radio :label="1">
              <span>中国</span>
            </Radio>
            <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
          </li>
          <!-- <li>
            <Radio :label="2">
              <span>其他</span>
            </Radio>
          </li> -->
        </ul>
      </RadioGroup>
    </div>
    <div
      class="selectGroup1"
      v-if="selectValue.type === 1"
      :style="{'height': '320px', 'overflowY': 'auto'}"
    >
      <ul :style="{'paddingRight': '20px'}">
        <li v-for="(item, index) in selectList" :key="index">
          <Checkbox
            :label="item.value"
            @on-change="(flag) => changeField(item,flag)"
            :value="selectValue.value.hasOwnProperty(item.value)"
          >
            <span>{{item.label}}</span>
          </Checkbox>
          <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
        </li>
      </ul>
    </div>
    <div
      class="selectGroup2"
      v-if="selectValue.type === 1 && currentSelect.value"
      :style="{'height': '320px', 'overflowY': 'auto'}"
    >
      <ul :style="{'paddingLeft': '10px','paddingRight': '20px'}">
        <li v-for="item in currentSelect.children" :key="item.value">
          <Checkbox :label="item.value" @on-change="(flag) => changeFieldValue(item,flag)" :value="selectValue.value[currentSelect.value].includes(item.value)">
            <span>{{item.label}}</span>
          </Checkbox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { loadTConfigListTree, getValueByKeyAndPv } from "@/api/query"
export default {
  name: "selectGroup",
  props: {
    value: {
      type: Object,
      default() {
        return {
          type: 0,
          value: {}
        }
      }
    }
  },
  data() {
    return {
      keys: ['WECHAT_COUNTRY', 'WECHAT_PROVINCE', 'WECHAT_CITY'], // 获取三级地区数据相应的Key值
      selectValue: JSON.parse(JSON.stringify(this.value)),
      selectList: [],
      currentSelect: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectValue = JSON.parse(JSON.stringify(val))
      },
      deep: true
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
        this.selectList = this.formatAreaData(res.data || [], true)
      }
    },
    async loadData(item) {
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
    },
    changeType(val) {
      this.selectValue = {
        type: val,
        value: {}
      }
      if (val === 0) {
        this.currentSelect = {}
      }
    },
    async changeField(item, flag) {
      // 设置子元素
      if (
        !this.currentSelect.value ||
        this.currentSelect.value !== item.value
      ) {
        // 请求数据
        !item.children.length && (await this.loadData(item))
        this.currentSelect = item
      }
      // 设置值
      if (flag) {
        this.selectValue.value[item.value] = []
      } else {
        delete this.selectValue.value[item.value]
        this.currentSelect = {}
      }
    },
    changeFieldValue(item, flag) {
      // 设置值
      if (flag) {
        this.selectValue.value[this.currentSelect.value].push(item.value)
      } else {
        const index = this.selectValue.value[this.currentSelect.value].indexOf(item.value)
        this.selectValue.value[this.currentSelect.value].splice(index, 1)
      }
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

<style lang="stylus">
.selectWrap
  display flex
  ul
    padding-right 20px
    li
      padding 5px
      &:hover
        background #efefef
</style>
