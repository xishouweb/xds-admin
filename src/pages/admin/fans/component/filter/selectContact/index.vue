<template>
  <div
    class="selectControl"
    :class="{'selectControl-visible': visible}"
  >
    <Poptip
      v-model="visible"
      placement="bottom-start"
    >
      <div
        class="selectControl-selection"
        @click="toggleMenu"
      >
        <input type="hidden">
        <div>
          <span
            class="selectControl-value"
          >{{showValue}}</span>
          <Icon
            type="arrow-down-b"
            class="selectControl-arrow"
          ></Icon>
        </div>
      </div>
      <div
        slot="content"
        class="selectControl-dropdown"
      >
        <div class="formSelect">
          <SelectContact :value="formValue" @selectChange="selectChange" ref="contact"></SelectContact>
        </div>
        <div class="formBottom">
          <Button
            size="small"
            :type="canConfitm ? 'default' : 'primary'"
            :disabled="canConfitm"
            @click="ok('form')"
          >确定</Button>
          <Button
            type="default"
            size="small"
            style="margin-left: 8px"
            @click="visible = false"
          >取消</Button>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
import SelectContact from "./selectContact"
export default {
  name: "selectContactWrap",
  inheritAttrs: false,
  components: { SelectContact },
  props: {
    placeholder: {
      type: String,
      default: "请选择"
    },
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
      visible: false,
      formValue: this.value, // 被选中的值
      selectValue: {type: 0, value: {}}, // 被选中，但未确认的值
    }
  },
  mounted() {
    this.on(document.body, 'click', () => {
      this.visible = false
    })
  },
  computed: {
    showValue() {
      if (this.formValue.type) {
        let contactWay = []
        for (let key in this.formValue.value) {
          let val = this.formatContactWay(key,this.formValue.value[key])
          contactWay.push(val)
        }
        return contactWay.join('/')
      } else {
        return '不限'
      }
    },
    canConfitm() { // 判断确定按钮是否可以点击
      let {type, value} = this.selectValue
      if (type === 1) {
        value = JSON.stringify(value)
        return (value === '{}')
      } else {
        return false
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.formValue = val
      },
      deep: true
    }
  },
  methods: {
    toggleMenu() {
      this.visible = !this.visible
    },
    selectChange(v) {
      this.selectValue = v
    },
    ok(name) {
      this.visible = false
      this.$emit("input", this.$refs['contact'].selectValue)
    },
    formatContactWay(key,value) {
      switch (key) {
        case 'mobile':
          return value ? "有联系电话" : "无联系电话"
        case 'wx':
          return value ? "有微信" : "无微信"
        case 'qq':
          return value ? "有QQ" : "无QQ"
        case 'email':
          return value ? "有邮箱" : "无邮箱"
      }
    },
  }
}
</script>

<style lang="stylus">
.selectControl {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  vertical-align: middle;
  color: #515a6e;
  font-size: 14px;

  .selectControl-selection {
    height: 34px;
    position: relative;
    display: block;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    outline: 0;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdee2;
    transition: all 0.2s ease-in-out;

    &:hover {
      border-color: #57a3f3;
    }
  }

  .selectControl-placeholder, .selectControl-value {
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 24px;
    color: #c5c8ce;
  }

  .selectControl-value {
    color: #666;
  }

  .selectControl-arrow {
    position: absolute;
    top: 50%;
    right: 8px;
    line-height: 1;
    margin-top: -7px;
    font-size: 14px;
    color: #808695;
    transition: all 0.2s ease-in-out;
  }
}

.selectControl-visible {
  .selectControl-arrow {
    transform: rotate(180deg);
  }
}

.selectControl {
  .ivu-poptip-body {
    padding: 0;
  }

  .formField {
    width: 300px;
    padding: 20px;

    .ivu-radio-group {
      width: 100%;
    }

    .formInput {
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .range {
        display: flex;
        align-items: center;
      }
    }
  }

  .formSelect {
    width: 340px
    padding: 20px
  }
  .formBottom {
    border-top: solid 1px #edeef0;
    padding: 20px;
    text-align: right;
  }
}
</style>
