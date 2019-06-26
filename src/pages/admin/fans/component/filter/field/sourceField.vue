<template>
  <FormItem>
    <div class="formItem">
      <div class="formItemLabel">来源</div>
      <div class="formItemControl">
        <CheckboxItem
          name
          :value="!selectedValue.length && !qrcodeObj.qrcode.length && !qrcodeObj.theme.qrCodeThemeId && !posterObj.poster.length"
          @click="clearSelected"
        >
          <span>不限</span>
        </CheckboxItem>
        <slot name="qrcode"></slot>
        <slot name="poster"></slot>
        <CheckboxList v-model="selectedValue" @change="changeSelected">
          <CheckboxItem name="ADD_SCENE_SEARCH">
            <span>搜索公众号</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENE_ACCOUNT_MIGRATION">
            <span>公众号迁移</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENE_PROFILE_CARD">
            <span>名片分享</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENE_QR_CODE" v-if="!hideScan">
            <span>扫描二维码</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENEPROFILE_LINK">
            <span>图文页内名称点击</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENE_PROFILE_ITEM">
            <span>图文页右上角菜单</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENE_PAID">
            <span>支付后关注</span>
          </CheckboxItem>
          <CheckboxItem name="ADD_SCENE_OTHERS">
            <span>其他</span>
          </CheckboxItem>
        </CheckboxList>
      </div>
    </div>
  </FormItem>
</template>

<script>
import CheckboxList from "../../checkbox/checkbox-list"
import CheckboxItem from "../../checkbox/checkbox-item"
export default {
  name: "sourceField",
  components: { CheckboxList, CheckboxItem },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    qrcodeObj: {
      type: Object,
      default() {
        return {
          public: {},
          group: {},
          theme: {},
          qrcode: []
        }
      }
    },
    posterObj: {
      type: Object,
      default() {
        return {
          public: {},
          group: {},
          poster: []
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
  computed: {
    hideScan() {
      return (
        this.qrcodeObj.qrcode.length ||
        this.qrcodeObj.theme.qrCodeThemeId ||
        this.posterObj.poster.length
      )
    }
  },
  methods: {
    clearSelected() {
      this.$emit("input", [])
      this.$emit("clearOther")
    },
    changeSelected(val) {
      this.$emit("input", val)
    }
  }
}
</script>
