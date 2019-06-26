<template>
  <FormItem>
    <div class="formItem">
      <div class="formItemLabel">互动时间</div>
      <div class="formItemControl">
        <RadioList v-model="selectedValue">
          <RadioItem name>
            <span>不限</span>
          </RadioItem>
          <RadioItem name="1">
            <span>今天</span>
          </RadioItem>
          <RadioItem name="2">
            <span>昨天</span>
          </RadioItem>
          <RadioItem name="3">
            <span>近48小时</span>
          </RadioItem>
          <RadioItem name="4">
            <span>近7天</span>
          </RadioItem>
          <RadioItem name="5">
            <span>近15天</span>
          </RadioItem>
          <RadioItem name="6">
            <span>近30天</span>
          </RadioItem>
          <RadioItem name="7">
            <span>自定义</span>
          </RadioItem>
        </RadioList>
        <div v-show="showPicker" class="dateSelect" :style="{display: 'inline-block'}">
          <DatePicker
            :value="typeof selectedValue === 'string' ? [] : selectedValue "
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择时间"
            @on-change="changeDate"
          ></DatePicker>
        </div>
      </div>
    </div>
  </FormItem>
</template>

<script>
import RadioList from "../../radio/radio-list"
import RadioItem from "../../radio/radio-item"
export default {
  name: "timeField",
  components: { RadioList, RadioItem },
  props: {
    value: {
      type: [Array, String], // '', []
      default() {
        return ""
      }
    }
  },
  data() {
    return {
      selectedValue: this.value,
      showPicker: false
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectedValue = val
        this.$emit("change", val)
      },
      deep: true
    },
    selectedValue(val) {
      this.$emit("input", val)
      if (val === "7" || typeof val === "object") {
        this.showPicker = true
      } else {
        this.showPicker = false
      }
    }
  },
  methods: {
    changeDate(val) {
      this.$emit("input", val)
    }
  }
}
</script>

<style lang="stylus">
  .dateSelect
    input
      height 34px
</style>
