<template>
  <div class="tagGroup">
    <p class="tagHeader">{{title}}
      <span class="selectAll" v-if="showSelectAll" :class="{isAll: isEqual }" @click="selectAll(isEqual)">{{isEqual === 'noText' ? '' : isEqual ? '取消全选': '全选'}}</span>
    </p>
    <div class="tagList">
      <div class="tag" :class="{'tag-checked': !!item.flag, 'tag-remove': closable, 'tag-disabled': !!item.disabled }" v-for="item in tagList" :key="item.id" @click.stop="ToggleSelect(item.id)">
        <span>{{item.tagName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tag-select',
  props: {
    value: {
      // tags
      type: Array,
      default: () => {
        return []
      }
    },
    title: String,
    showSelectAll: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: false
    },
    groupId: {
      type: [String, Number],
      default: ''
    },
    specialGroup: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tagList: this.value
    }
  },
  computed: {
    isEqual() {
      // 移除禁用的
      const newValue = this.value.filter(item => !item.disabled)
      if (newValue.length === 0) {
        return 'noText'
      }
      return newValue.every(item => item.flag)
    }
  },
  watch: {
    value(val) {
      this.tagList = val
    }
  },
  methods: {
    ToggleSelect(id) {
      let selectValue = this.value.slice() // 全部被选中的值
      selectValue = selectValue.map(item => {
        if (item.id === id && !item.disabled) {
          return { ...item, flag: !item.flag }
        } else {
          return item
        }
      })
      this.$emit('input', selectValue)
    },
    selectAll(flag) {
      if (flag) {
        // 设置 false
        let selectValue = this.value.slice() // 全部被选中的值
        selectValue = selectValue.map(item => {
          if (item.disabled) {
            return item
          } else {
            return { ...item, flag: false }
          }
        })
        this.$emit('input', selectValue)
      } else {
        // 设置true
        let selectValue = this.value.slice() // 全部被选中的值
        selectValue = selectValue.map(item => {
          if (item.disabled) {
            return item
          } else {
            return { ...item, flag: true }
          }
        })
        this.$emit('input', selectValue)
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
