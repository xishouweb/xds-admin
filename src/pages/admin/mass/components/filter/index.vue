<template>
  <div class="filter">
    <!-- 筛选条件 -->
    <CondList @select="onSelectCond"></CondList>

    <div class="filterForm">
      <Form :model="selectConditions">
        <!-- 分组 -->
        <CommonField v-if="radioVal === 0" v-model="selectConditions.fsGroupId" :dat="{tit:'分组', list: fansGroup}"></CommonField>
        <!-- 所属客服 -->
        <CommonField v-else v-model="selectConditions.kfSeatId" :dat="{tit:'所属客服', list: myServiceList}"></CommonField>
        <!-- 标签 -->
        <TagField
          class="tag-field"
          v-model="selectConditions.tagValue"
          @on-ok="tagsOK"
          ref="tagField"
        ></TagField>
        <div v-show="!isShowMore">
          <!-- 来源 -->
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
          <!-- 互动时间 -->
          <TimeField class="time-field" v-model="selectConditions.time"></TimeField>
          <!-- 其它 -->
          <FormItem>
            <div class="formItem">
              <div class="formItemLabel">其他</div>
              <div class="formItemControl">
                <div class="container">
                  <p class="containerLabel">关注状态</p>
                  <div class="containerControl">
                    <Select v-model="selectConditions.status" size="large" style="color: #666;">
                      <Option value="*">不限</Option>
                      <Option :value="one">已关注</Option>
                      <Option :value="zero">已取消</Option>
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
                    <Select v-model="selectConditions.sex" size="large" style="color: #666;">
                      <Option value="*">不限</Option>
                      <Option :value="one">男</Option>
                      <Option :value="two">女</Option>
                      <Option :value="zero">未知</Option>
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
              <!-- <a class="filterAction" @click="isShowMore = true">收取更多</a> -->
            </div>
          </FormItem>
        </div>
        <p class="fold" @click="isShowMore = !isShowMore">{{isShowMore ? '展开更多' : '收起更多'}}</p>
        <slot name="action"></slot>
      </Form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import {
  queryKfGroupList, // 获取所属粉丝分组列表
} from '@/api/fans.js'
import dayjs from 'dayjs'
import CommonField from './field/CommonField'
import CondList from './field/condList'
import AccountField from "./field/AccountField"
import TagField from "./field/TagField"
import SourceField from "./field/sourceField"
import TimeField from "./field/TimeField"
import RangeField from './field/rangeField'
import SelectArea from './SelectArea'
import SelectContact from "./selectContact"
import CheckboxItem from "./checkbox/checkbox-item"
import SelectQrcode from "./selectQrcode"
import SelectPoster from "./selectPoster"

const selectConditions = { // 群发对象筛选条件初始数据
  appAccountId: [],
  tagValue: "",
  fansOrigin: [],
  time: "",
  status: "*",
  sex: "*",
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
  fsGroupId: [], // 分组
  kfSeatId: [], // 客服
  existKfSeatId: '', // 是否存在客服
  existTags: '', // 是否存在标签
  contactWay: { // 联系方式
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
    poster: []
  }
}
export default {
  name: "massObjFilter",
  components: {
    CommonField,
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
    radioVal: { // 单选值
      type: Number,
      default: 0
    },
    filterCont: { // 当前选中对象数据
      type: Object,
      default() {
        return {}
      }
    },
    groupId: {
      type: [String, Number],
      default: ''
    },
    kfSeatId: {
      type: [String, Number],
      default: ''
    },
    origin: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      will: '*',
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      selectConditions: JSON.parse(JSON.stringify(selectConditions)),
      // otherConditions: {
      //   selectName: ""
      // },
      isShowMore: true,
      // modalVisible: false,
      // filterMore: false,
      // condList: [],
      // nkNameNamePhone: "",
      fansGroup: [
        // {
        //   name: '',
        //   text: '未分组'
        // }
      ], // 粉丝分组列表
      myServiceList: [
        {
          name: 'NO_KF_SEAT_ID',
          text: '无所属客服粉丝'
        }
      ], // 所属客服
      qrcodeVisible: false,
      posterVisible: false
    }
  },
  computed: {
    ...mapGetters({
      curPublic: "publicAccount/curPublic", // 当前公众号信息
      // validPublicAList: "fans/validPublicAList"
    })
  },
  mounted() {
    this.getFansGroup()
    this.getService()
    // if (JSON.stringify(this.filterCont) !== '{}') {
    // 其他组件进行过滤
    this.$root.Bus.$on('filter', () => {
      // 设置过滤参数
      // 搜索
      this.filterSearch()
    })
    // console.log(this.filterCont)
  },
  watch: {
    curPublic(newV) {
      this.getService()
    },
    filterCont(newV,oldV) {
      this.selectConditions = newV
      this.onSelectCond(newV)
    },
    'selectConditions': {
      deep: true,
      handler(newV, oldV) {
        this.$emit('filtChange', 1)
      }
    }
  },
  methods: {
    tagsOK(ids) { // 确定选中按钮
      console.log('清空值+' + ids)
      this.selectConditions.tagValue = ids
    },

    getFansGroup() { // 获取粉丝分组数据
      queryKfGroupList()
      .then(res => {
        if (!res.data.groupInfoList || !res.data.groupInfoList.length) return
        res.data.groupInfoList.forEach(v => {
          if (v.fsGroupName === '未分组') {
            this.fansGroup.unshift({
              name: v.fsGroupId,
              text: v.fsGroupName
            })
          } else {
            this.fansGroup.push({
              name: v.fsGroupId,
              text: v.fsGroupName
            })
          }
        })
      })
    },
    getService() { // 获取坐席列表（客服列表）
      if (this.curPublic) {
        this.$get(this.Path.getSeatList, {
          limit: 100,
          appAccountId: this.curPublic.appAccountId // 公众号id
        }).then(dat => {
          if (dat.code === 1) {
            let list = dat.data.records
            list.forEach(v => {
              this.myServiceList.push({
                name: v.id,
                text: v.eeName
              })
            })
          } else {
            this.$Message.error(dat.message)
          }
        })
      }
    },
    onSelectCond(cond) { // 条件交互(已保存筛选条件回填)
      cond.appAccountId = this.curPublic.appAccountId
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
    clearSourceChangeValue() {
      this.clearQrcodeValue()
      this.clearPosterValue()
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

    async filterSearch() { // 去筛选
      const params = this.formatParams()
      this.getAllList(params)
    },
    async exportCsv() {
      this.$root.Bus.$emit('exportCsv')
    },
    async refresh() {
      this.filterSearch()
    },
    changeSetting(value) {
      this.$emit("onChangeField", value)
    },
    getOriginValue() { // 获取原始数据
      return this.selectConditions
    },
    getValue() { // 获取值
      return this.formatParams()
    },
    clearValue() { // 清空值
      this.selectConditions = selectConditions
      this.clearQrcodeValue()
      this.clearPosterValue()
    },
    formatContactWay(key, value) { // 处理联系方式函数
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
    formatZeroTime(day) { // 处理时间函数
      day = day || 0
      return dayjs(
        dayjs()
          .subtract(day, "day")
          .format("YYYY-MM-DD")
      ).format("YYYY-MM-DD HH:mm:ss")
    },
    formatParams() { // 对状态过滤
      const params = {}
      const {
        appAccountId,
        fsGroupId,
        kfSeatId,
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
      if (appAccountId && appAccountId.length) {
        params.appAccountId = appAccountId[0]
      }
      if (this.radioVal === 0) { // 选中 我的所属粉丝
        if (fsGroupId && fsGroupId.length) { // 分组id
          params.fsGroupId = fsGroupId
        }
      } else { // 选中 全部粉丝
        if (kfSeatId && kfSeatId.length) { // 所属客服
          let dex = kfSeatId.indexOf('NO_KF_SEAT_ID')
          if (dex >= 0) {
            params.existKfSeatId = 'NO_KF_SEAT_ID'
          }
          kfSeatId.filter(v => v)
          params.kfSeatId = kfSeatId
        }
      }
      if (tagValue) {
        if (tagValue === "NO_TAGS") {
          params.existTags = "NO_TAGS"
        } else {
          params.tagIdList = tagValue
        }
      }
      if (fansOrigin && fansOrigin.length) {
        params.subscribeScene = fansOrigin
      }
      // 联系方式
      if (contactWay && contactWay.type === 1 && Object.keys(contactWay.value).length) {
        params.contactWay = []
        for (let key in contactWay.value) {
          let val = this.formatContactWay(key, contactWay.value[key])
          if (val) { params.contactWay.push(val) }
        }
      }
      // 所在地区
      if (fansArea && fansArea.type === 1) {
        params.fansArea = []
        if (Object.keys(fansArea.value).length) {
          for (let key in fansArea.value) {
            if (fansArea.value[key].length) {
              const areaList = fansArea.value[key].map(item => {
                return key + ',' + item
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
      // 互动时间
      if (time) {
        if (typeof time === 'string') {
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
        } else {
          params.convStartTime = dayjs(time[0]).format("YYYY-MM-DD HH:mm:ss")
          params.convEndTime = dayjs(time[1]).format("YYYY-MM-DD HH:mm:ss")
        }
      }
      // 性别
      if (sex === 1) {
        params.sex = 'MALE'
      } else if (sex === 2) {
        params.sex = 'FEMALE'
      } else if (sex === 0) {
        params.sex = 'UNKNOW'
      }
      // 关注状态
      if (status === 1) {
        params.subscribe = 'SUBSCRIBE'
      } else if (status === 0) {
        params.subscribe = 'UN_SUBSCRIBE'
      }
      // 互动次数
      if (conversation.vertical) {
        if (conversation.min) {
          params.conversationMinNum = conversation.min
        }
        if (conversation.max) {
          params.conversationMaxNum = conversation.max
        }
      }
      // 年龄
      if (age.vertical) {
        if (age.min) {
          params.minAge = age.min
        }
        if (age.max) {
          params.maxAge = age.max
        }
      }
      // 裂变海报
      if (posterObj && posterObj.poster.length) {
        params.fansPosterTemplateIds = posterObj.poster
      }
      // 渠道二维码
      if (qrcodeObj && (qrcodeObj.theme.qrCodeThemeId || qrcodeObj.qrcode.length)) {
        if (qrcodeObj.qrcode.length) {
          params.channelQrCodeIds = qrcodeObj.qrcode
        }
        params.channelQrThemeId = qrcodeObj.theme.qrCodeThemeId
      }
      // 若选择了裂变海报或渠道二维码，需要添加subscribeScene（扫描二维码）参数
      if (posterObj.poster.length || qrcodeObj.theme.qrCodeThemeId || qrcodeObj.qrcode.length) {
        if (params.subscribeScene) {
          params.subscribeScene = [...params.subscribeScene, "ADD_SCENE_QR_CODE"]
        } else {
          params.subscribeScene = ["ADD_SCENE_QR_CODE"]
        }
      }
      // console.log(params)
      return params
    },
    qrcodeOk(val) {
      this.$set(this.selectConditions, "qrcodeObj", val)
    },
    posterOk(val) {
      this.$set(this.selectConditions, "posterObj", val)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
.filter
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
    padding-top 10px
    position: relative
    .tag-field, .time-field
      margin-top: -12px
    .ivu-form-item
      margin-bottom: 20px
    i
      font-size:14px
    .fold
        color: #409eff
        font-size: 12px
        line-height: 1
        cursor: pointer
        position: absolute
        bottom: 0
        right: 0
  .formItem
    display flex
    // align-items center
    .formItemLabel
      width 70px
      text-align left
      // margin-right: 60px
      .ivu-poptip-inner
        white-space normal
        .ivu-poptip-body
          padding 16px
          color #606366
          line-height 24px
          letter-spacing 1px
    .formItemControl,.formItemCont
      flex 1
      margin-left 60px
  // .filterAction
  //   margin-right 10px
  //   font-size 12px
  //   color #409eff

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
    border: 1px solid transparent
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
