<template>
  <FormItem>
    <div class="formItem">
      <div class="formItemLabel">{{dat.tit}}</div>
      <div class="formItemCont">
        <CheckboxItem class="unlimit" name :value="!selectedValue.length" @click="clearSelected">
          <span>不限</span>
        </CheckboxItem>
        <CheckboxList class="checkList" v-if="dat.list" v-model="selectedValue" @change="changeSelected">
          <template v-for="(v,i) in dat.list">
            <CheckboxItem :key="i" :name="v.name" v-if="v.text">
              <span>{{v.text}}</span>
            </CheckboxItem>
          </template>
        </CheckboxList>
      </div>
    </div>
  </FormItem>
</template>

<script>
import CheckboxList from "../checkbox/checkbox-list"
import CheckboxItem from "../checkbox/checkbox-item"
export default {
  name: "sourceField",
  components: { CheckboxList, CheckboxItem },
  props: {
    value: {
      type: [Array,String],
      default() {
        return []
      }
    },
    dat: { // 选项数据
      type: Object,
      default() {
        return {
          tit: '',
          list: [
            {
              name: '', // 选项绑定数据
              text: '' // 选项显示文本
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      selectedValue: this.value
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectedValue = val
        this.$emit("change", val)
      },
      deep: true
    }
  },
  methods: {
    clearSelected() {
      this.$emit("input", [])
    },
    changeSelected(val) {
      this.$emit("input", val)
    }
  }
}
</script>
<style lang="stylus">
.formItemCont
  position: relative
  .unlimit
    position: absolute
    left: 0
    top: 0
  .checkbox-list .checkbox-tag:first-child
    margin-left: 74px
.formItemLabel
  // line-height: 46px
  align-self: satrt
</style>
