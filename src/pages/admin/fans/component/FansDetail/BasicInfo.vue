<template>
  <div id="basicInfo">
    <ul class="info_detail">
      <li>
        <span>姓名</span>
        <FieldEditor
          name="name"
          v-model="userInfo.name"
          @change="changeFansInfo"
          :class="{editable: isEditable}"
        ></FieldEditor>
      </li>
      <li>
        <span>联系电话</span>
        <FieldEditor
          name="phone"
          v-model="userInfo.phone"
          @change="changeFansInfo"
          :class="{editable: isEditable}"
        ></FieldEditor>
      </li>
      <li>
        <span>所在地区</span>
        <div>
          <FieldEditor
            type="area"
            name="kfSetArea"
            v-model="areaInfo"
            @change="changeFansInfo"
            :class="{editable: isEditable}"
          ></FieldEditor>
        </div>
      </li>
      <li>
        <span>微信号</span>
        <FieldEditor
          name="weChat"
          v-model="userInfo.weChat"
          @change="changeFansInfo"
          :class="{editable: isEditable}"
        ></FieldEditor>
      </li>
      <li>
        <span>QQ</span>
        <FieldEditor
          name="qq"
          v-model="userInfo.qq"
          @change="changeFansInfo"
          :class="{editable: isEditable}"
        ></FieldEditor>
      </li>
      <li>
        <span>邮箱</span>
        <FieldEditor
          name="email"
          v-model="userInfo.email"
          @change="changeFansInfo"
          :class="{editable:isEditable}"
        ></FieldEditor>
      </li>
      <li>
        <span>年龄</span>
        <FieldEditor
          name="age"
          v-model="userInfo.age"
          @change="changeFansInfo"
          :class="{editable: isEditable}"
        ></FieldEditor>
      </li>
      <li>
        <span>所属客服</span>
        <div v-if="userInfo.kfSeatId">
          <span
            v-if="isEditable"
            @click="openServiceModal"
            class="focusStatus"
            :style="{cursor: 'pointer'}"
          >{{userInfo.eeName || userInfo.seatNo || '--'}}</span>
          <span v-else>{{userInfo.eeName || userInfo.seatNo || '--'}}</span>
          <p class="action" v-if="(userInfo.kfSeatId === seatId && isZhuanshu) || isCreator ">
            <!-- 是否是坐席专属 -->
            <Button
              v-if="userInfo.isExclusiveKf === 1"
              @click="setBelong('NO_EXCLUSIVE_KF', userInfo.name || userInfo.nickName)"
            >取消专属</Button>
            <Button
              v-else
              @click="setBelong('IS_EXCLUSIVE_KF', userInfo.name || userInfo.nickName)"
              class="active"
            >设置专属</Button>
          </p>
        </div>
        <div
          v-else-if="isCreator"
          @click="openServiceModal"
          class="focusStatus"
          :style="{cursor: 'pointer'}"
        >--</div>
        <div v-else>--</div>
      </li>
      <li>
        <span>所属分组</span>
        <div
          @click="toggleGroupModal"
          class="focusStatus"
          v-if="userInfo.kfSeatId === seatId"
          :style="{cursor: 'pointer'}"
        >{{userInfo.kfFansGroupName || '--'}}</div>
        <div v-else>{{userInfo.kfFansGroupName || '--'}}</div>
      </li>
      <li>
        <span>备注</span>
        <FieldEditor
          name="remark"
          type="text"
          v-model="userInfo.remark"
          @change="changeFansInfo"
          :class="{editable: isEditable}"
        ></FieldEditor>
      </li>
    </ul>
    <ul class="user_tags">
      <li
        v-for="(item, idx) in choosedMarks"
        :key="idx"
        :style="{background: item.color }"
      >{{item.tagName}}</li>
      <li class="define" @click="openTagModal" v-if="isEditable">编辑标签</li>
      <p v-else-if="!choosedMarks.length" :style="{color: '#979899', textAlign: 'left'}">暂无标签</p>
    </ul>
    <!-- 专属粉丝 -->
    <NewModal
      :header="modalProps.title"
      :maxZIndex="true"
      v-model="modalVisible"
      width="300"
      @ok="setBelongOk"
    >
      <div v-html="modalProps.content"></div>
    </NewModal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
import FieldEditor from "../FieldEditor"
const colors = [
  "#9ad5ff",
  "#f5d787",
  "#ffb2b2",
  "#93eb8c",
  "#88e5d7",
  "#b2b2ff",
  "#ffc3a6",
  "#d4adff",
  "#ffade1"
]
const fields = {
  name: "姓名",
  phone: "联系电话",
  kfSetArea: "所在地区",
  weChat: "微信号",
  qq: "QQ",
  email: "邮箱",
  age: "年龄",
  isExclusiveKf: "专属",
  remark: "备注"
}
export default {
  props: {
    curFans: {
      type: Object,
      default() {
        return {
          fansWxTagDtos: []
        }
      }
    }
  },
  data() {
    const { kfSetArea, wxSetArea } = this.curFans
    const areaInfo = kfSetArea || wxSetArea || ""
    return {
      userInfo: this.curFans,
      areaInfo: areaInfo,
      modalVisible: false,
      isExclusiveKf: "IS_EXCLUSIVE_KF",
      modalProps: {
        title: "设为专属粉丝",
        content: ""
      }
    }
  },
  computed: {
    ...mapState("fans", {
      seatId: state => state.fansGroupList.seatId
    }),
    choosedMarks() {
      return (this.curFans.fansWxTagDtos || []).map(item => {
        return { ...item, color: colors[Math.floor(Math.random() * 9)] }
      })
    },
    isZhuanshu() {
      return JSON.stringify(this.$store.state.nav.allSecondObj).includes(
        "设置专属"
      )
    },
    isEditable() {
      const userInfo = this.getToken()
      return (
        this.curFans.kfSeatId === this.$store.state.fans.fansGroupList.seatId ||
        (this.$store.state.survey.saveloginCompany.createId === userInfo.userId)
      )
    },
    isCreator() {
      const userInfo = this.getToken()
      return (
        this.$store.state.survey.saveloginCompany.createId === userInfo.userId
      )
    }
  },
  watch: {
    curFans: {
      handler(val) {
        if (val) {
          const { kfSetArea, wxSetArea } = val
          this.userInfo = val
          this.areaInfo = kfSetArea || wxSetArea || ""
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("fans", ["updateFansExtInfo", "updateExclusiveSeat"]),
    openServiceModal() {
      this.$root.Bus.$emit("serviceModal", {
        fans: [this.curFans],
        appAccountId: this.curFans.appAccountId,
        type: "single",
        origin: "detail"
      })
    },
    openTagModal() {
      this.$root.Bus.$emit("tagModal", {
        fans: [this.curFans],
        appAccountId: this.curFans.appAccountId,
        type: "single",
        selectedTag: this.curFans.fansWxTagDtos || []
      })
    },
    toggleGroupModal(status) {
      this.$root.Bus.$emit("toggleModal", {
        fans: [this.curFans],
        appAccountIds: this.curFans.appAccountId,
        type: "single"
      })
    },
    setBelong(isExclusiveKf, name) {
      this.modalVisible = true
      this.isExclusiveKf = isExclusiveKf
      if (isExclusiveKf === "IS_EXCLUSIVE_KF") {
        this.modalProps = {
          title: "设为专属粉丝",
          content: `您确定将粉丝"<span style="color:#409fff">${name}</span>"设为专属粉丝`
        }
      } else {
        this.modalProps = {
          title: "取消专属",
          content: `您确定将粉丝"<span style="color:#409fff">${name}</span>"取消专属，设为普通粉丝吗`
        }
      }
    },
    async setBelongOk() {
      const type = this.isExclusiveKf === "NO_EXCLUSIVE_KF" ? 2 : 1
      const res = await this.updateExclusiveSeat({
        seatId: this.userInfo.kfSeatId,
        fansId: this.userInfo.fansId,
        appAccountId: this.userInfo.appAccountId,
        type
      })
      if (res.code === 1) {
        // 刷新数据
        this.$root.Bus.$emit("updateCurFans")
        this.$root.Bus.$emit("freshfans")
        this.$Message.success(`专属修改成功`)
      } else {
        this.$Message.error(res.message || `专属修改失败`)
      }
    },
    async changeFansInfo({ name, value }) {
      if (name === 'age') value = Number(value)
      if (this.curFans && (this.curFans[name] === value)) return
      const res = await this.updateFansExtInfo({
        fansId: this.userInfo.fansId,
        appAccountId: this.userInfo.appAccountId,
        [name]: value
      })
      if (res.code === 1) {
        // 刷新数据
        this.$root.Bus.$emit("updateCurFans")
        // this.$root.Bus.$emit("freshfans")
        this.$Message.success(`${fields[name]}修改成功`)
      } else {
        // this.userInfo = {...this.userInfo, [name]: this.curFans[name]}
        this.$Message.error(`${fields[name]}修改失败`)
      }
    }
  },
  components: {
    FieldEditor
  }
}
</script>
<style lang="stylus" scoped>
.focusStatus
  display inline-block
  &:hover
    padding 4px 7px
    border solid 1px #dcdee2
    border-radius 3px
    width 170px
    margin-bottom 10px
    &:after
      float right
      margin-right 4px
      color #9ea7b4
      font-family Ionicons
      content '\F104'
      vertical-align middle
</style>

