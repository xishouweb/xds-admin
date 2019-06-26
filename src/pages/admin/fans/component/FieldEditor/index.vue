<template>
  <div id="editor" class="editor">
    <div class="editor-text" v-if="!isEdit">
      <p class="text" v-if="name === 'phone'">{{formValue.value | formatPhone}}</p>
      <p class="text" v-else-if="name === 'kfSetArea'">{{formValue.value | formatArea}}</p>
      <p class="text" v-else>{{formValue.value || '无'}}</p>
      <span class="icon" @click="editor">&#xe61d;</span>
    </div>
    <div class="editor-control" v-if="isEdit">
      <!-- 根据类型渲染 -->
      <textarea
        v-if="type === 'text'"
        class="textarea"
        ref="control"
        v-model="formValue.value"
        v-click-outside="blur"
        @keyup.enter.prevent="blur"
      ></textarea>
      <div v-else-if="type === 'area'" class="area">
        <!-- 地区类型 -->
        <AreaSelect v-model="formValue.value" @blur="blur" ref="control"></AreaSelect>
      </div>
      <input
        v-else
        class="input"
        ref="control"
        :type="type"
        v-model="formValue.value"
        v-click-outside="blur"
        @keyup.enter.prevent="blur"
      >
      <transition name="fade">
        <p v-if="errorTxt" class="valid-error">{{errorTxt}}</p>
      </transition>
    </div>
  </div>
</template>
<script>
import { directive as clickOutside } from "v-click-outside-x"
import Schema from "async-validator"
import AreaSelect from "./AreaSelect"
const rule = {
  name(rule, value, callback) {
    if (value && value.replace(/(^\s*)|(\s*$)/g, "").length > 30) {
      callback(new Error("姓名不能超过30个字"))
    } else {
      callback()
    }
  },
  phone: {
    pattern: /^1[3,4,5,7,8][0-9]{9}$/,
    message: "请填写正确格式的手机号",
  },
  weChat: {
    pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/,
    message: "请填写正确格式的微信号"
  },
  qq: {
    pattern: /^[0-9]{6,12}$/,
    message: "请填写正确格式的QQ"
  },
  email: {
    type: "email",
    message: "请填写正确格式的邮箱"
  },
  age: {
    pattern: /^[0-9]{1,2}$/,
    message: "请填写正确的年龄"
  },
  remark(rule, value, callback) {
    if (value && value.replace(/(^\s*)|(\s*$)/g, "").length > 40) {
      callback(new Error("备注不能过长"))
    } else {
      callback()
    }
  }
}
export default {
  name: "fieldEditor",
  components: {
    AreaSelect
  },
  directives: { clickOutside },
  filters: {
    formatPhone(val) {
      if (val) {
        return val.replace(/(\d{3})(\d{4})(\d{4})/g, ($0, $1, $2, $3) => {
          return $1 + "-" + $2 + "-" + $3
        })
      } else {
        return "无"
      }
    },
    formatArea(val) {
      if (val) {
        return val.replace(/,/g, '')
      } else {
        return "无"
      }
    }
  },
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: "input"
    },
    // 字段
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      errorTxt: null,
      hideErrortimer: null,
      validator: null,
      formValue: {
        value: this.value
      },
      isEdit: false // 可编辑状态
    }
  },
  watch: {
    value(val) {
      this.formValue.value = val
    },
    name(val) {
      this.ruleValidate = rule[val]
    },
    errorTxt(val) {
      if (val) {
        this.hideError()
      }
    }
  },
  created() {
    this.validator = new Schema(rule)
    this.closeTimer = setTimeout(() => {}, 2 * 1000)
  },
  methods: {
    editor() {
      this.isEdit = true
      this.$nextTick(() => {
        if (!this.type === 'area') {
          this.$refs.control.focus()
        }
      })
    },
    async blur() {
      // 根据类型校验
      const valid = await this.handleValidate(this.name, this.formValue.value)
      if (valid) {
        this.errorTxt = null
        this.isEdit = false
        const value = this.name === 'name' ? this.formValue.value.replace(/(^\s*)|(\s*$)/g, "") : this.formValue.value
        this.$emit("change", {
          name: this.name,
          value: value
        })
      }
    },
    hideError() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
      this.closeTimer = setTimeout(() => {
        this.errorTxt = null
      }, 2 * 1000)
    },
    handleValidate(name, value) {
      return new Promise((resolve, reject) => {
        this.validator.validate({ [name]: value }, (errors, fields) => {
          if (errors) {
            resolve(false)
            this.errorTxt = errors[0].message
          } else {
            resolve(true)
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#editor
  flex 1
  vertical-align middle
  .editor-text
    display flex
    align-items center
    .text
      position relative
      padding 3px
      padding-left 0
      border-radius 2px
      word-break break-all
    .icon
      display none
      cursor pointer
      margin-left 4px
      font-size 12px
      color #979899
  .editor-control
    position relative
    .input
      display inline-block
      padding 3px
      padding-left 6px
      width 174px
      height 30px
      background-color #ffffff
      border-radius 3px
      border solid 1px #cacbcc
    .textarea
      display inline-block
      width 174px
      height 44px
      line-height 22px
      padding 3px
      padding-left 6px
      background-color #ffffff
      border-radius 3px
      border solid 1px #cacbcc
      resize none
    .valid-error
      position absolute
      color #fe3b30
      font-size 12px
      line-height 20px
#editor.editable
  .editor-text:hover
    .icon
      display inline
</style>
