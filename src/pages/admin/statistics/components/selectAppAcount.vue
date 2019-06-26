<template>
    <div>
      <slot></slot>
      <Select :value="all" size="small" style="width:124px" @on-change="getcurrentType">
        <Option :value="-1">全部公众号</Option>
        <Option v-for="(item, index) in filterPublicList"
          :name="item.appAccountId"
          :key="index" :value="item.appAccountId">{{item.principalName}}</Option>
      </Select>
    </div>

</template>
<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      all: -1
    }
  },
  computed: {
    ...mapState({
      currentPublicNo: state => state.publicAccount.curPublic,
      publicList: state => state.publicAccount.publicAccountList,
    }),
    filterPublicList() {
      return this.publicList.filter(item => [0,4,5].includes(item.verifyTypeInfo) && item.status === 1)
    }
  },
  watch: {
    publicList() {
      this.getcurrentType(-1)
    }
  },
  mounted() {
    this.getcurrentType(-1)
  },
  methods: {
    getcurrentType(appAccountId) {
      this.all = appAccountId
      let appIdList = []
      if (appAccountId === -1) {
        appIdList = this.filterPublicList.map(item => item.appAccountId)
      } else {
        appIdList = [appAccountId]
      }
      this.$emit('on-change', appIdList)
    }
  }
}
</script>
<style lang="stylus">
</style>
