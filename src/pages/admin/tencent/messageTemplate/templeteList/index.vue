<template>
  <div class="msgT-cont">
    <div class="msgT-action">
      <div class="actionLeft">模板消息（共{{totalCount}}条）</div>
      <div class="actionRight flex">
        <SearchBox
          v-model="msgTitle"
          :width="'200px'"
          :search="searchMsgTList"
          :holder="'输入标题搜索'"
        ></SearchBox>
        <!-- <div class="searchInput">
          <input v-model="msgTitle" @keyup.enter="searchMsgTList" placeholder="输入标题搜索">
          <p class="flexA">
            <i class="icon" @click="msgTitle = ''" style="font-size: 18px">&#xe724;</i>
            <i class="icon" @click="searchMsgTList">&#xe634;</i>
          </p>
        </div> -->
        <i-button
          type="primary"
          style="margin-left: 20px;"
          @click="$router.push({name: 'messageTAdd', params: {step:0}})"
        >添加模板消息</i-button>
      </div>
    </div>
    <div class="msgT-wrapper">
      <div class="msgT-group">
        <Group @getGroupTotal="getGroupTotal"></Group>
      </div>
      <div class="msgT-list">
        <Flow ref="tempFlow"></Flow>
      </div>
    </div>
  </div>
</template>

<script>
import Group from "./group"
import Flow from "./flow"
export default {
  components: {
    Group,
    Flow
  },
  data() {
    return {
      msgTitle: "",
      totalCount: 0,
    }
  },
  methods: {
    searchMsgTList() {
      this.$root.Bus.$emit("updateTemplate", { condition: this.msgTitle })
    },
    getGroupTotal(value) {
      this.totalCount = value
    }
  }
}
</script>

<style lang="stylus">
.msgT-wrapper
  display flex
  height calc(100vh - 294px)
  .msgT-group
    width 200px
  .msgT-list
    margin-left 20px
    flex 1
</style>
