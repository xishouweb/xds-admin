<template>
  <FormItem>
    <div class="formItem">
      <div class="formItemLabel">
        <Poptip
          trigger="hover"
          placement="right"
          word-wrap
          width="214"
          content="公众号与公众号之间的标签选择为并集关系，标签分组内为并集，组与组之间为交集。并集即满足任意一个标签。交集即每个已选的分组，都有任意一个标签。"
        >
          <span>标签</span>
          <i class="icon">&#xe635;</i>
        </Poptip>
      </div>
      <div class="formItemControl">
        <RadioList v-model="selectedValue" @change="changeValue">
          <RadioItem name>
            <span>不限</span>
          </RadioItem>
          <RadioItem name="NO_TAGS">
            <span>无标签</span>
          </RadioItem>
        </RadioList>
        <!-- 指定标签 -->
        <SelectTag
          v-model="tagVisible"
          ref="selectTag"
          :defaultValue="defaultSelectedValue"
          @on-ok="tagsOk"
        >
          <template>
            <RadioItem @click="tagVisible = true" :value="selectedValue === 'HAS_TAGS'">
              <span>指定标签</span>
            </RadioItem>
            <div
              v-if="sureSelectedValue.count"
              class="selectedRadio"
              :style="{display: 'inline-block'}"
            >
              <div
                class="condTag"
                :style="{marginTop: '16px'}"
                :class="{'checked': true}"
                v-for="item in sureSelectedValue.list"
                :key="item.id"
              >
                <span class="condTxt">{{item.name}}</span>
                <span class="icon" @click.stop="deleteTag(item.id)">&#xe674;</span>
              </div>
              <span
                v-if="sureSelectedValue.count > 3"
                :style="{color: '#409fff', cursor: 'pointer' }"
                @click="tagVisible = true"
              >查看全部{{sureSelectedValue.count}}标签</span>
            </div>
          </template>
        </SelectTag>
      </div>
    </div>
  </FormItem>
</template>

<script>
import { mapState } from "vuex"
import RadioList from "../../radio/radio-list"
import RadioItem from "../../radio/radio-item"
import SelectTag from "../SelectTag"
export default {
  name: "tagField",
  components: { RadioList, RadioItem, SelectTag },
  props: {
    value: {
      type: String, // '', 'NO_TAGS', 'HAS_TAGS'
      default() {
        return ""
      }
    },
    listValue: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tagVisible: false,
      selectedValue: this.value, // 保存选中的值 3层
      sureSelectedValue: this.listValue,
      defaultSelectedValue: this.listValue.value,
      noTags: "",
      hasTag: false,
      isSaveTag: false
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
    listValue: {
      handler(val) {
        this.sureSelectedValue = val
        this.defaultSelectedValue = val.value
      },
      deep: true
    }
  },
  computed: {
    ...mapState("fans", {
      fansSeatTags: state => state.fansSeatTags
    })
  },
  methods: {
    changeValue(val) {
      this.$emit("input", val)
      // 清空选中标签
      if (val === "" || val === "NO_TAGS") {
        this.clearValue()
      }
    },
    deleteTag(id) {
      const cloneValue = JSON.parse(
        JSON.stringify(this.$refs["selectTag"].selectedValue)
      )
      delete cloneValue[id]
      this.$refs["selectTag"].selectedValue = cloneValue
      const list = this.sureSelectedValue.originList.filter(
        item => item.id !== id
      )
      delete this.sureSelectedValue.value[id]
      this.sureSelectedValue = {
        ...this.sureSelectedValue,
        count: list.length,
        originList: list,
        list: list.length > 3 ? list.slice(0, 3) : list
      }
      // 重置
      if (list.length) {
        this.selectedValue = "HAS_TAGS"
      } else {
        this.selectedValue = ""
      }
    },
    tagsOk(val) {
      this.sureSelectedValue = val
      this.selectedValue = "HAS_TAGS"
    },
    clearValue() {
      this.sureSelectedValue = {
        count: 0,
        value: {},
        originList: [],
        list: []
      }
      this.$refs["selectTag"].selectedValue = {}
    }
  }
}
</script>
