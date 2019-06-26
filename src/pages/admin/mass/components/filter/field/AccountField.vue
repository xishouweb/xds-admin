<template>
  <FormItem>
    <div class="formItem">
      <div class="formItemLabel">
        <Poptip
          trigger="hover"
          placement="right"
          width="186"
          content="只显示当前企业下正常状态的公众号，停用和禁用的公众号不显示。"
        >
          <span>公众号</span>
          <a>
            <i class="icon">&#xe635;</i>
          </a>
        </Poptip>
      </div>
      <div class="formItemControl">
        <CheckboxItem :value="!selectedValue.length" @click="clearSelected">
          <span>不限</span>
        </CheckboxItem>
        <CheckboxList v-model="selectedValue" @change="changeSelected">
          <CheckboxItem
            :name="item.appAccountId"
            v-for="item in validPublicAList"
            :key="item.appAccountId"
          >
            <span>{{item.principalName}}</span>
          </CheckboxItem>
        </CheckboxList>
      </div>
      <a class="filterAction" v-show="isShowMore" @click="onShowMore">更多选项</a>
    </div>
  </FormItem>
</template>

<script>
import { mapGetters } from "vuex"
import CheckboxList from "../checkbox/checkbox-list"
import CheckboxItem from "../checkbox/checkbox-item"
export default {
  name: "accountField",
  components: { CheckboxList, CheckboxItem },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    isShowMore: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters("publicAccount", ["validPublicAList"])
  },
  watch: {
    value: {
      handler(val) {
        this.selectedValue = val
        // this.$emit("input", val)
        this.$emit("change", val)
      },
      deep: true
    }
  },
  data() {
    return {
      selectedValue: this.value
    }
  },
  methods: {
    clearSelected() {
      this.$emit("input", [])
    },
    changeSelected(val) {
      this.$emit("input", val)
    },
    onShowMore() {
      this.$emit('showMore')
    }
  }
}
</script>
