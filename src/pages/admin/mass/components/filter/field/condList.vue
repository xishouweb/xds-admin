<template>
  <div class="filterCond" v-show="condList.length">
    <p class="condLabel">筛选分组</p>
    <div class="condList">
      <div
        class="condTag"
        :class="{'checked': curCondition.id === item.id}"
        v-for="item in condList"
        :key="item.id"
        @click="filterDetail(item.id)"
      >
        <span class="condTxt">{{item.selectName}}</span>
        <!-- <span class="icon" @click.stop="filterDelete(item.id)">&#xe674;</span> -->
      </div>
    </div>
  </div>
</template>
<script>
// import { mapState } from "vuex"
import { querySelectConditions, deleteSelectCondition } from "@/api/fans"
export default {
  name: "condList",
  props: {},
  data() {
    return {
      condList: [],
      curCondition: {},
      // nowFilterId: null, // 当前选中筛选条件
    }
  },
  mounted() {
    this.init()
    this.$root.Bus.$on('condFresh', () => {
      this.init()
    })
  },
  computed: {
    // ...mapState("fans", {
    //   condList: state => state.condList
    // })
  },
  methods: {
    async init() {
      const response = await querySelectConditions()
      const { code, data } = response
      if (code === 1) {
        this.condList = data
      }
    },
    async filterDetail(id) {
      // 获取详情
      const curCondition = this.condList.filter(item => item.id === id)[0]
      this.curCondition = curCondition
      if (curCondition.selectConditions) {
        let params = JSON.parse(curCondition.selectConditions)

        params.sex = params.sex ? Number(params.sex) : '*' // 性别
        if (params.sex === 0) {
          params.sex = '*'
        } else if (params.sex === 3) {
          params.sex = 0
        }

        if (params.status === '1') { // 关注状态
          params.status = 1
        } else if (params.status === '2') {
          params.status = 0
        } else {
          params.status = '*'
        }

        if (params.tagValue === "HAS_TAGS") { // 标签
          let tags = params.tagObject.value
          let obj = []
          if (JSON.stringify(tags) === '{}') {
            params.tagValue = ''
          } else {
            params.tagObject.originList.forEach(v => {
              obj.push(v.tagId)
            })
            params.tagValue = obj
          }
        }
        this.$emit("select", params)
      }
    },
    // async filterDelete(id) {
    //   const response = await deleteSelectCondition({ id })
    //   const { code } = response
    //   if (code === 1) {
    //     this.$Message.success("删除成功")
    //     this.init()
    //   } else {
    //     this.$Message.error("删除失败")
    //   }
    // }
  }
}
</script>
