<template>
  <div class="filterCond" v-show="condList.length">
    <p class="condLabel">筛选条件</p>
    <div class="condList">
      <div
        class="condTag"
        :class="{'checked': curCondition.id === item.id}"
        v-for="item in condList"
        :key="item.id"
        @click="filterDetail(item.id)"
      >
        <span class="condTxt">{{item.selectName}}</span>
        <span class="icon" @click.stop="filterDelete(item.id)">&#xe674;</span>
      </div>
    </div>
    <NewModal v-model="showModal" header="删除提示" content="确定要删除该条件分组吗？" @ok="delOk"></NewModal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
export default {
  name: "condList",
  props: {},
  data() {
    return {
      showModal: false,
      focusCondId: "",
      curCondition: {}
    }
  },
  computed: {
    ...mapState("fans", {
      condList: state => state.condList
    })
  },
  methods: {
    ...mapActions("fans", ["deleteCond"]),
    async filterDetail(id) {
      // 获取详情
      const curCondition = this.condList.filter(item => item.id === id)[0]
      this.curCondition = curCondition
      if (curCondition.selectConditions) {
        this.$emit("select", JSON.parse(curCondition.selectConditions))
      }
    },
    filterDelete(id) {
      this.showModal = true
      this.focusCondId = id
    },
    async delOk() {
      const response = await this.deleteCond({ id: this.focusCondId })
      const { code } = response
      if (code === 1) {
        this.$Message.success("删除成功")
      } else {
        this.$Message.error("删除失败")
      }
    },
    resetSelect() {
      this.curCondition = {}
    }
  }
}
</script>
