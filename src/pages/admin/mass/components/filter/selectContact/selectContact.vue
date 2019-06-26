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
              <span>指定</span>
            </Radio>
            <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
          </li>
        </ul>
      </RadioGroup>
    </div>
    <div class="selectGroup1" v-if="selectValue.type === 1">
        <ul>
          <li v-for="(item, index) in selectList" :key="index">
              <Checkbox :label="item.value" @on-change="(flag) => changeField(item,flag)" :value="selectValue.value.hasOwnProperty(item.value)">
                <span>{{item.label}}</span>
              </Checkbox>
            <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
          </li>
        </ul>
    </div>
    <div class="selectGroup2" v-if="selectValue.type === 1 && currentSelect.value">
      <RadioGroup :value="selectValue.value[currentSelect.value]" @on-change="changeFieldValue">
        <ul>
          <li v-for="item in currentSelect.children" :key="item.value">
            <Radio :label="item.value">
              <span>{{item.label}}</span>
            </Radio>
          </li>
        </ul>
      </RadioGroup>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectContact",
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
      selectValue: JSON.parse(JSON.stringify(this.value)),
      selectList: [
        {
          value: "mobile",
          label: "电话",
          children: [
            {
              value: 1,
              label: "有电话"
            },
            {
              value: 0,
              label: "无电话"
            }
          ]
        },
        {
          value: "wx",
          label: "微信",
          children: [
            {
              value: 1,
              label: "有微信"
            },
            {
              value: 0,
              label: "无微信"
            }
          ]
        },
        {
          value: "qq",
          label: "QQ",
          children: [
            {
              value: 1,
              label: "有QQ"
            },
            {
              value: 0,
              label: "无QQ"
            }
          ]
        },
        {
          value: "email",
          label: "邮箱",
          children: [
            {
              value: 1,
              label: "有邮箱"
            },
            {
              value: 0,
              label: "无邮箱"
            }
          ]
        }
      ],
      currentSelect: {} // 当前选中的模块
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectValue = JSON.parse(JSON.stringify(val))
      },
      deep: true
    },
    selectValue: {
      deep: true,
      handler(nv) {
        this.$emit('selectChange', nv)
      }
    }
  },
  methods: {
    changeType(val) {
      if (!val) {
        this.selectValue = {
          type: 0,
          value: {}
        }
        this.currentSelect = {}
      } else {
        this.selectValue = {
          type: 1,
          value: {}
        }
      }
    },
    changeField(item, flag) {
      // 设置子元素
      if (!this.currentSelect.value || this.currentSelect.value !== item.value) {
        this.currentSelect = item
      }
      // 设置值
      let value = this.selectValue.value
      if (flag) {
        value[item.value] = 1
      } else {
        this.currentSelect = {}
        delete value[item.value]
      }
      this.selectValue = {
        ...this.selectValue,
        value
      }
    },
    changeFieldValue(val) {
      let value = this.selectValue.value
      value[this.currentSelect.value] = val
      this.selectValue = {
        ...this.selectValue,
        value
      }
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
