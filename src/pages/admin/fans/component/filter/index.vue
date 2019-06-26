<template>
  <div id="fans-filter" class="filter">
    <CondList @select="onSelectCond" ref="condSelect"></CondList>
    <div class="filterForm">
      <Form :model="selectConditions">
        <AccountField
          v-model="selectConditions.appAccountId"
          @change="onChangeAccount"
          @clearValue="clearPublicChangeValue"
          :isShowMore="isShowMore"
          @showMore="isShowMore = false"
        ></AccountField>
        <div v-show="!isShowMore">
          <TagField
            v-model="selectConditions.tagValue"
            :listValue="selectConditions.tagObject"
            ref="tagField"
          ></TagField>
          <SourceField
            v-model="selectConditions.fansOrigin"
            :qrcodeObj="selectConditions.qrcodeObj"
            :posterObj="selectConditions.posterObj"
            @clearOther="clearSourceChangeValue"
          >
            <SelectQrcode
              v-model="qrcodeVisible"
              @on-ok="qrcodeOk"
              slot="qrcode"
              ref="qrcode"
              :defaultValue="selectConditions.qrcodeObj"
            >
              <CheckboxItem
                v-if="selectConditions.qrcodeObj.qrcode.length || selectConditions.qrcodeObj.theme.qrCodeThemeId"
                @click="qrcodeVisible = true"
                :value="!!selectConditions.qrcodeObj.qrcode.length || selectConditions.qrcodeObj.theme.qrCodeThemeId"
              >
                <span>渠道二维码({{selectConditions.qrcodeObj.qrcode.length || '1个主题'}})</span>
                <i class="icon">&#xe7d6;</i>
              </CheckboxItem>
              <CheckboxItem v-else @click="qrcodeVisible = true">
                <span>渠道二维码</span>
                <i class="icon">&#xe7d6;</i>
              </CheckboxItem>
            </SelectQrcode>
            <SelectPoster
              v-model="posterVisible"
              @on-ok="posterOk"
              slot="poster"
              ref="poster"
              :defaultValue="selectConditions.posterObj"
            >
              <CheckboxItem
                v-if="selectConditions.posterObj.poster.length"
                @click="posterVisible = true"
                :value="!!selectConditions.posterObj.poster.length"
              >
                <span>裂变海报({{selectConditions.posterObj.poster.length}})</span>
                <i class="icon">&#xe7d6;</i>
              </CheckboxItem>
              <CheckboxItem v-else @click="posterVisible = true">
                <span>裂变海报</span>
                <i class="icon">&#xe7d6;</i>
              </CheckboxItem>
            </SelectPoster>
          </SourceField>
          <TimeField v-model="selectConditions.time"></TimeField>
          <FormItem>
            <div class="formItem">
              <div class="formItemLabel">其他</div>
              <div class="formItemControl">
                <div class="container">
                  <p class="containerLabel">关注状态</p>
                  <div class="containerControl">
                    <Select v-model="selectConditions.status" size="large">
                      <Option value="0">不限</Option>
                      <Option value="1">已关注</Option>
                      <Option value="2">已取消</Option>
                    </Select>
                  </div>
                </div>
                <div class="container">
                  <p class="containerLabel">联系方式</p>
                  <div class="containerControl">
                    <SelectContact v-model="selectConditions.contactWay"></SelectContact>
                  </div>
                </div>
                <div class="container">
                  <p class="containerLabel">互动次数</p>
                  <div class="containerControl">
                    <RangeField v-model="selectConditions.conversation"></RangeField>
                  </div>
                </div>
                <div class="container">
                  <p class="containerLabel">年龄</p>
                  <div class="containerControl">
                    <RangeField v-model="selectConditions.age" label="岁"></RangeField>
                  </div>
                </div>
                <div class="container">
                  <p class="containerLabel">性别</p>
                  <div class="containerControl">
                    <Select v-model="selectConditions.sex" size="large">
                      <Option value="0">不限</Option>
                      <Option value="1">男</Option>
                      <Option value="2">女</Option>
                      <Option value="3">未知</Option>
                    </Select>
                  </div>
                </div>
                <div class="container">
                  <p class="containerLabel">所在地区</p>
                  <div class="containerControl">
                    <SelectArea v-model="selectConditions.fansArea"></SelectArea>
                  </div>
                </div>
              </div>
              <a class="filterAction" @click="isShowMore = true">收起更多</a>
            </div>
          </FormItem>
        </div>
        <slot name="action"></slot>
      </Form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import dayjs from "dayjs"
import CondList from "./field/condList"
import AccountField from "./field/AccountField"
import TagField from "./field/TagField"
import SourceField from "./field/sourceField"
import TimeField from "./field/TimeField"
import RangeField from "./field/rangeField"
import SelectArea from "./SelectArea"
import SelectContact from "./selectContact"
import CheckboxItem from "../checkbox/checkbox-item"
import SelectQrcode from "./selectQrcode"
import SelectPoster from "./selectPoster"
const selectConditions = {
  appAccountId: [],
  tagValue: "",
  tagObject: {
    count: 0,
    value: {},
    originList: [],
    list: []
  },
  fansOrigin: [],
  time: "",
  status: "0",
  sex: "0",
  conversation: {
    vertical: "",
    min: null,
    max: null
  },
  age: {
    vertical: "",
    min: null,
    max: null
  },
  fsGroupId: "",
  contactWay: {
    type: 0,
    value: {}
  },
  fansArea: {
    type: 0,
    value: {}
  },
  qrcodeObj: {
    public: {},
    group: {},
    theme: {},
    qrcode: []
  },
  posterObj: {
    public: {},
    group: {},
    poster: {}
  }
}
export default {
  name: "fansFilter",
  components: {
    CondList,
    AccountField,
    TagField,
    SourceField,
    TimeField,
    RangeField,
    SelectArea,
    SelectContact,
    SelectQrcode,
    SelectPoster,
    CheckboxItem
  },
  props: {
    groupId: {
      type: [String, Number],
      default: ""
    },
    kfSeatId: {
      type: [String, Number],
      default: ""
    },
    origin: {
      type: String,
      default: ""
    }
  },
  data() {
    const validateCondName = (rule, value, callback) => {
      value = value.replace(/\s*/g, "") // 过滤空格
      if (!value.length) {
        callback(new Error("请填写筛选名称"))
      } else if (value.length > 10) {
        callback(new Error("分组筛选不超过10个字"))
      } else {
        callback()
      }
    }
    return {
      selectConditionsRule: {
        selectName: [
          { required: true, message: "请填写筛选名称", trigger: "blur" },
          {
            validator: validateCondName,
            trigger: "blur"
          }
        ]
      },
      selectConditions: JSON.parse(JSON.stringify(selectConditions)),
      otherConditions: {
        selectName: ""
      },
      isShowMore: true,
      modalVisible: false,
      filterMore: false,
      condList: [],
      nkNameNamePhone: "",
      qrcodeVisible: false,
      posterVisible: false,
      clickConditions: ''
    }
  },
  computed: {
    ...mapState("fans", {
      eeId: state => state.fansGroupList.eeId,
      fansSeatTags: state => state.fansSeatTags
    }),
    ...mapGetters("fans", ["validPublicAList"])
  },
  watch: {
    "selectConditions.conversation": {
      deep: true,
      handler(v) {
        // console.log(v)
      }
    },
    selectConditions: {
      handler(v) {
        if (v && JSON.stringify(v) !== this.clickConditions) {
          this.$refs.condSelect && this.$refs.condSelect.resetSelect()
          this.clickConditions = ''
        }
      },
      deep: true
    }
  },
  created() {
    // 获取标签
    this.getTagsBySeatId({})
  },
  mounted() {
    // 其他组件进行过滤
    this.$root.Bus.$on("filter", () => {
      // 设置过滤参数
      // 搜索
      this.filterSearch()
    })
  },
  methods: {
    ...mapActions("fans", ["getTagsBySeatId", "getAllList"]),
    // 条件交互
    onSelectCond(cond) {
      this.clickConditions = JSON.stringify(cond) // 缓存选中条件
      this.selectConditions = cond
      // 清空渠道二维码和裂变海报的列表数据获取重新请求列表数据
      this.condResetQrcode(cond)
      this.condResetPoster(cond)
    },
    condResetQrcode(cond) {
      if (
        !cond.qrcodeObj.qrcode.length &&
        !cond.qrcodeObj.theme.qrCodeThemeId
      ) {
        // 清空列表
        this.clearQrcodeState()
      } else {
        // 请求列表数据
        const appAccountId = cond.qrcodeObj.public.appAccountId
        const groupId = cond.qrcodeObj.group.groupId
        const qrCodeThemeId = cond.qrcodeObj.theme.qrCodeThemeId
        // 请求数据
        this.$refs["qrcode"].queryQrcodeGroups({
          appAccountId: appAccountId,
          type: "channel_qr_code"
        })
        this.$refs["qrcode"].queryQrcodeThemeList({
          appAccountId: appAccountId,
          groupId: groupId,
          curPage: 1,
          pageSize: 20
        })
        this.$refs["qrcode"].queryQrcodeList({
          appAccountId: appAccountId,
          qrCodeThemeId: qrCodeThemeId,
          curPage: 1,
          pageSize: 20
        })
      }
    },
    condResetPoster(cond) {
      if (!cond.posterObj.poster.length) {
        // 清空列表
        this.clearPosterState()
      } else {
        // 请求列表数据
        const appAccountId = cond.posterObj.public.appAccountId
        const groupId = cond.posterObj.group.groupId
        // 请求数据
        this.$refs["poster"].queryPosterGroups({
          appAccountId: appAccountId,
          type: "posterTemplate"
        })
        this.$refs["poster"].queryPosterList({
          appAccountId: appAccountId,
          groupId: groupId,
          curPage: 1,
          pageSize: 20
        })
      }
    },
    // 公众号交互
    onChangeAccount(val) {
      const publicList = this.validPublicAList
      const params = {}
      if (val.length) {
        params.appAccountIds = val
      }
      // 传递公众号列表
      if (val.length) {
        const selectPublic = publicList.filter(item =>
          val.includes(item.appAccountId)
        )
        this.$root.Bus.$emit("setPublic", selectPublic)
      } else {
        this.$root.Bus.$emit("setPublic", publicList)
      }
      this.getTagsBySeatId(params)
    },
    clearPublicChangeValue() {
      this.clearTagsValue()
      this.clearQrcodeValue()
      this.clearPosterValue()
    },
    clearSourceChangeValue() {
      this.clearQrcodeValue()
      this.clearPosterValue()
    },
    clearTagsValue() {
      this.$set(this.selectConditions, "tagValue", "")
      this.$set(this.selectConditions, "tagObject", {
        count: 0,
        value: {},
        originList: [],
        list: []
      })
    },
    clearQrcodeValue() {
      // 清空选中和列表数据
      this.$set(this.selectConditions, "qrcodeObj", {
        public: {},
        group: {},
        theme: {},
        qrcode: []
      })
      this.clearQrcodeState()
    },
    clearQrcodeState() {
      this.$refs["qrcode"].qrcode = {
        group: [],
        themeList: {
          records: []
        },
        list: {
          records: []
        }
      }
      this.$refs["qrcode"].noGroup = false
      this.$refs["qrcode"].themePage = {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
      this.$refs["qrcode"].qrcodePage = {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
    },
    clearPosterValue() {
      // 清空状态
      this.$set(this.selectConditions, "posterObj", {
        public: {},
        group: {},
        poster: []
      })
      this.clearPosterState()
    },
    clearPosterState() {
      this.$refs["poster"].poster = {
        group: [],
        list: {
          records: []
        }
      }
      this.$refs["poster"].noGroup = false
      this.$refs["poster"].posterPage = {
        curPage: 2,
        pageSize: 10,
        isLoading: false,
        hasMore: true,
        noData: false
      }
    },
    async filterSearch() {
      // 去筛选
      const params = this.formatParams()
      this.getAllList(params)
    },
    async exportCsv() {
      this.$root.Bus.$emit("exportCsv")
    },
    async refresh() {
      this.filterSearch()
    },
    changeSetting(value) {
      this.$emit("onChangeField", value)
    },
    // 获取原始数据
    getOriginValue() {
      if (this.selectConditions.tagValue === "HAS_TAGS") {
        this.selectConditions.tagObject = this.$refs[
          "tagField"
        ].sureSelectedValue
      }
      return this.selectConditions
    },
    // 获取值
    getValue() {
      return this.formatParams()
    },
    // 清空值
    clearValue() {
      this.selectConditions = JSON.parse(JSON.stringify(selectConditions))
      // 清空
      this.clearQrcodeValue()
      this.clearPosterValue()
    },
    formatContactWay(key, value) {
      switch (key) {
        case "mobile":
          return value ? "HAS_PHONE" : "NO_PHONE"
        case "wx":
          return value ? "HAS_WX" : "NO_WX"
        case "qq":
          return value ? "HAS_QQ" : "NO_QQ"
        case "email":
          return value ? "HAS_EMAIL" : "NO_EMAIL"
      }
    },
    formatZeroTime(day) {
      day = day || 0
      return dayjs(
        dayjs()
          .subtract(day, "day")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD HH:mm:ss")
    },
    // 对状态过滤
    formatParams() {
      const params = {}
      const {
        appAccountId,
        tagValue,
        fansOrigin,
        time,
        sex,
        status,
        conversation,
        age,
        contactWay,
        fansArea,
        qrcodeObj,
        posterObj
      } = this.selectConditions
      if (appAccountId.length) {
        params.appAccountId = appAccountId
      }
      if (tagValue) {
        if (tagValue === "NO_TAGS") {
          params.existTags = "NO_TAGS"
        }
        if (tagValue === "HAS_TAGS") {
          params.tagIdList = this.$refs[
            "tagField"
          ].sureSelectedValue.originList.map(item => item.id)
        }
      }
      if (fansOrigin.length) {
        params.subscribeScene = fansOrigin
      }
      // 联系方式
      if (contactWay.type === 1 && Object.keys(contactWay.value).length) {
        params.contactWay = []
        for (let key in contactWay.value) {
          let val = this.formatContactWay(key, contactWay.value[key])
          params.contactWay.push(val)
        }
      }
      // 所在地区
      if (fansArea.type === 1) {
        params.fansArea = []
        if (Object.keys(fansArea.value).length) {
          for (let key in fansArea.value) {
            if (fansArea.value[key].length) {
              const areaList = fansArea.value[key].map(item => {
                return key + "," + item
              })
              params.fansArea = [...params.fansArea, ...areaList]
            } else {
              params.fansArea.push(key)
            }
          }
        } else {
          params.fansArea.push("中国")
        }
      }
      if (time) {
        if (typeof time === "string") {
          switch (time) {
            case "1":
              params.convStartTime = this.formatZeroTime(0)
              params.convEndTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
              break
            case "2":
              params.convStartTime = this.formatZeroTime(1)
              params.convEndTime = this.formatZeroTime(0)
              break
            case "3":
              params.convStartTime = dayjs()
                .subtract(2, "day")
                .format("YYYY-MM-DD HH:mm:ss")
              params.convEndTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
              break
            case "4":
              params.convStartTime = this.formatZeroTime(7)
              params.convEndTime = this.formatZeroTime(0)
              break
            case "5":
              params.convStartTime = this.formatZeroTime(15)
              params.convEndTime = this.formatZeroTime(0)
              break
            case "6":
              params.convStartTime = this.formatZeroTime(30)
              params.convEndTime = this.formatZeroTime(0)
              break
          }
        } else if (time && time[0]) {
          params.convStartTime = dayjs(time[0]).format("YYYY-MM-DD HH:mm:ss")
          params.convEndTime = dayjs(time[1]).format("YYYY-MM-DD HH:mm:ss")
        }
      }
      if (sex === "1") {
        params.sex = "MALE"
      } else if (sex === "2") {
        params.sex = "FEMALE"
      } else if (sex === "3") {
        params.sex = "UNKNOW"
      }
      if (status === "1") {
        params.subscribe = "SUBSCRIBE"
      } else if (status === "2") {
        params.subscribe = "UN_SUBSCRIBE"
      }
      if (conversation.vertical) {
        if (conversation.min) {
          params.conversationMinNum = conversation.min
        }
        if (conversation.max) {
          params.conversationMaxNum = conversation.max
        }
      }
      if (age.vertical) {
        if (age.min) {
          params.minAge = age.min
        }
        if (age.max) {
          params.maxAge = age.max
        }
      }
      if (posterObj.poster.length) {
        params.fansPosterTemplateIds = posterObj.poster
      }
      if (qrcodeObj.theme.qrCodeThemeId || qrcodeObj.qrcode.length) {
        if (qrcodeObj.qrcode.length) {
          params.channelQrCodeIds = qrcodeObj.qrcode
        }
        params.channelQrThemeId = qrcodeObj.theme.qrCodeThemeId
      }
      if (posterObj.poster.length || qrcodeObj.theme.qrCodeThemeId || qrcodeObj.qrcode.length) {
        if (params.subscribeScene) {
          params.subscribeScene = [...params.subscribeScene, "ADD_SCENE_QR_CODE"]
        } else {
          params.subscribeScene = ["ADD_SCENE_QR_CODE"]
        }
      }
      return params
    },
    qrcodeOk(val) {
      this.$set(this.selectConditions, "qrcodeObj", val)
    },
    posterOk(val) {
      this.$set(this.selectConditions, "posterObj", val)
    }
  },
  destroyed() {
    this.$root.Bus.$off("filter")
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
#fans-filter
  font-size 14px
  color #606366
  .filterCond
    display flex
    align-items center
    margin-right 20px
    padding 20px 0 18px 0
    box-shadow 0px 1px 0px 0px #edeef0
  .condLabel
    width 70px
    text-align left
  .condList
    flex 1
    margin-left 60px
  .filterForm
    padding-top 30px
    .ivu-form-item
      margin-bottom 20px
  .formItem
    display flex
    align-items center
    .formItemLabel
      width 70px
      text-align left
      .ivu-poptip-inner
        white-space normal
        .ivu-poptip-body
          padding 16px
          color #606366
          line-height 24px
          letter-spacing 1px
    .formItemControl
      flex 1
      margin-left 60px
  .filterAction
    margin-right 10px
    font-size 12px
    color #409eff
  .dateSelect
    .ivu-input-icon
      height 34px
      line-height 34px
    .ivu-input
      height 34px
  .condTag
    display inline-block
    margin-right 14px
    background #fff
    line-height 30px
    padding 0 10px 0 12px
    font-size 14px
    cursor pointer
    border 1px solid transparent
    .icon
      visibility hidden
      font-size 12px
      transform scale(0.8)
    &:hover
      border-radius 3px
      border solid 1px #409eff
      color #409eff
      .icon
        visibility visible
    &.checked
      border-radius 3px
      border solid 1px #409eff
      color #409eff
      .icon
        visibility visible
  .radioControl
    .ivu-radio-group
      .ivu-radio-wrapper
        height 34px
        line-height 32px
        margin-right 20px
        border-radius 3px
        border solid 1px #e3e4e5
        &:hover
          border solid 1px #409fff
          color #409fff
        &:before
          height 0
        &:after
          height 0
        &-checked
          border solid 1px #409fff
          color #409fff
          box-shadow none
  .container
    position relative
    display inline-flex
    align-items center
    margin-right 20px
    .containerLabel
      margin-right 10px
    .containerControl
      .ivu-select-selection
        height 34px
  .submit
    display flex
    align-items center
    justify-content space-between
    .submitLeft
      .ivu-btn
        padding 0 16px
        margin-right 10px
        height 32px
        line-height 33px
    .submitRight
      display flex
      align-items center
      .fans-search_input
        fl()
        border_()
        line-height 40px
        height 42px
        radius(3px)
        relative()
        width 200px
        mr(10px)
        input
          absolute()
          left 10px
          top 1px
          height 38px
          // bottom 0
          right 20px
        i
          absolute()
          right 0
          width 28px
          cursor()
          fn(20px)
          color(#aaa)
      >.fans-ivu-icon
        cursor()
        width 30px
        height 30px
        fn(14px)
        text-align center
        border 1px solid #ddd
      >span, .fans-pop_span
        margin 0 10px
        cursor()
        fn(18px)
        &:hover
          color(text_color)
      .fans-pop_span
        mt(8px)
        fn(24px)
      .fans-pop_span:hover
        color(text_color)
    .choosesWrap
      min-width auto
    .chooses
      padding 4px 6px
      color #303133
      &-title
        margin-bottom 8px
        font-size 13px
        line-height 28px
      &-list
        li
          margin-bottom 8px
.tagModalFooter
  display flex
  align-items center
  justify-content space-between
  padding-top 20px
  border-top solid 1px #edeff0
  .tagNum
    color #979899
</style>
