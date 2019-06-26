<template>
  <div class="selectControl" :class="{'selectControl-visible': visible}">
    <Poptip v-model="visible" placement="bottom-start">
      <div class="selectControl-selection" @click="toggleMenu">
        <input type="hidden">
        <div>
          <span v-if="!value.vertical || (!value.min && !value.max)" class="selectControl-value">不限</span>
          <!-- <span v-else class="selectControl-value">{{value.min || 0}}~{{value.max || '10000'}}</span> -->
          <span v-else class="selectControl-value">{{value | text}}</span>

          <Icon type="arrow-down-b" class="selectControl-arrow"></Icon>
        </div>
      </div>
      <div slot="content" class="selectControl-dropdown" @click.stop>
        <slot>
          <Form ref="form" :model="formValue">
            <ul class="formField">
              <RadioGroup v-model="formValue.vertical" vertical @on-change="changeVertical">
                <li>
                  <Radio label>
                    <span>不限</span>
                  </Radio>
                </li>
                <li class="formInput">
                  <Radio label="rangeValue">
                    <span>指定</span>
                  </Radio>
                  <FormItem class="range" v-if="formValue.vertical === 'rangeValue'">
                    <InputNumber :min="0" v-model="formValue.min"></InputNumber>
                    <span :style="{margin: '0 6px'}">-</span>
                    <InputNumber :min="0" v-model="formValue.max"></InputNumber>
                    <span :style="{marginLeft: '6px'}">{{label}}</span>
                  </FormItem>
                </li>
              </RadioGroup>
            </ul>
            <div class="formBottom">
              <Button
                :type="canConfirm ? 'default' : 'primary'"
                :disabled="canConfirm"
                size="small"
                @click="ok('form')"
              >确定</Button>
              <Button
                type="default"
                size="small"
                style="margin-left: 8px"
                @click="visible = false"
              >取消</Button>
            </div>
          </Form>
        </slot>
      </div>
    </Poptip>
  </div>
</template>

<script>
export default {
  name: "selectControl",
  inheritAttrs: false,
  props: {
    placeholder: {
      type: String,
      default: "请选择"
    },
    value: {
      type: Object,
      default() {
        // 外部也会引用
        return {
          vertical: "",
          min: null,
          max: null
        }
      }
    },
    label: {
      type: String,
      default: "次"
    }
  },
  filters: {
    text(val) {
      let min = val.min
      let max = val.max
      let text
      if (min && max) {
        text = min + "~" + max
      } else if (!min && max) {
        text = "小于等于" + max
      } else if (min && !max) {
        text = "大于等于" + min
      }
      return text
    }
  },
  data() {
    return {
      visible: false,
      formValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  mounted() {
    this.on(document.body, 'click', () => {
      this.visible = false
    })
  },
  computed: {
    canConfirm() {
      // 判断确定按钮是否可以点击
      let { vertical, min, max } = this.formValue
      if (vertical === "rangeValue" && !min && !max) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.formValue = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    toggleMenu() {
      this.visible = !this.visible
    },
    changeVertical() {
      if (!this.formValue.vertical) {
        this.$emit("input", { ...this.formValue, min: null, max: null })
      }
    },
    ok(name) {
      if (
        this.formValue.min &&
        this.formValue.max &&
        this.formValue.min > this.formValue.max
      ) {
        this.$Message.error("第一个值不能比第二个值大")
        this.$emit("input", { ...this.formValue, min: null, max: null })
        return
      }
      this.visible = false
      this.$emit("input", this.formValue)
    }
  }
}
</script>

<style lang="stylus">
.selectControl
  display inline-block
  width 100%
  box-sizing border-box
  vertical-align middle
  color #515a6e
  font-size 14px
  .selectControl-selection
    height 34px
    position relative
    display block
    box-sizing border-box
    user-select none
    cursor pointer
    outline 0
    background-color #fff
    border-radius 4px
    border 1px solid #dcdee2
    transition all 0.2s ease-in-out
    &:hover
      border-color #57a3f3
  .selectControl-placeholder, .selectControl-value
    height 34px
    line-height 34px
    font-size 14px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    padding-left 8px
    padding-right 24px
    color #c5c8ce
  .selectControl-value
    color #303133
  .selectControl-arrow
    position absolute
    top 50%
    right 8px
    line-height 1
    margin-top -7px
    font-size 14px
    color #9ea7b4
    transition all 0.2s ease-in-out
.selectControl-visible
  .selectControl-arrow
    transform rotate(180deg)
.selectControl
  .ivu-poptip-body
    padding 0
  .formField
    width 300px
    padding 20px
    .ivu-radio-group
      width 100%
    .formInput
      margin-top 6px
      display flex
      justify-content space-between
      align-items center
      .range
        display flex
        align-items center
  .formBottom
    border-top solid 1px #edeef0
    padding 20px
    text-align right
</style>
