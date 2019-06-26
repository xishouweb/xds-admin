<template>
  <div style="display:inline-block">
    <i-button v-if="!selectedList.length" :size="size" @click="none">移动分组</i-button>
    <Poptip v-else placement="top-start" width="200" popper-class="media-move-popperTemp" transfer>
        <i-button :size="size">移动分组</i-button>
        <div class="qrcode-poptip-content" slot="content" >
          <ScrollBar style="height: 370px">
            <RadioGroup v-model="groupId">
                <div class="group-list" v-for="(item, index) in groupList" :key="index" v-if="index > 0">
                  <Radio :label="item.groupId">
                      <span>{{item.name}}</span>
                  </Radio>
                </div>
            </RadioGroup>
          </ScrollBar>
          <div class="poptip-bottom-button">
            <Button type="primary" @click="save">确定</Button>
            <Button @click="cancle">取消</Button>
          </div>
        </div>
    </Poptip>
  </div>
</template>

<script>

export default {
  name: "ykt-poptip",
  data() {
    return {
      groupId: null
    }
  },
  props: {
    selectedList: {
      type: Array,
      default: () => []
    },
    groupList: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => 'small' // small, default, large
    }
  },
  methods: {
    save() {
      this.$emit("save", this.groupId, this.selectedList)
    },
    cancle() {
      document.body.click()
    },
    none() {
      this.$Message.info("请至少选择一项")
    }
  },
}
</script>

<style lang="stylus">
.qrcode-poptip-content
  padding 0 20px
  overflow hidden
  .group-list
    height 34px
    line-height 34px
.poptip-bottom-button
  border-top 1px solid #fafafa
  padding-top 10px
  height 60px
  text-align center
  button
    width: 70px;
    margin-right: 10px
.media-move-popperTemp.ivu-poptip-popper
  min-width auto
  .ivu-poptip-arrow:after
    left: 0px !important
  .ivu-poptip-inner
    box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35) !important
    border none !important
    .ivu-poptip-body
      padding 10px 0 !important
</style>
