<template>
<div class="create-poster-temp-1">
  <!-- <BScroll :offsetBottom="60"> -->
    <ScrollBar  v-setScrollBoxHeight.60>
    <div style="padding-bottom: 60px">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
        <PragraphTitle class="create-qrcode-title">基本信息设置</PragraphTitle>
        <Row class="row" style="margin-top:40px;">
          <Col class="label" span="16">
            <FormItem label="模板名称" prop="posterTemplateName">
              <Input
                v-model="formValidate.posterTemplateName"
                style="width: 360px"
                placeholder="必填，不能超过20个字"
              ></Input>
            </FormItem>
            <FormItem label="模板分组" prop="groupIde" style="margin-top:40px;">
              <Select v-model="formValidate.groupId" style="width: 360px">
                <Option
                  v-for="(item, index) in getposterGroupList.slice(1)"
                  :key="index"
                  :value="item.groupId"
                >{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="活动所需关注数" prop="activityNeedFollowers" style="margin-top:40px;">
              <Input
                v-if="!loading"
                v-model="formValidate.activityNeedFollowers"
                v-limitNumber="formValidate.activityNeedFollowers"
                style="width: 90px;"
              ></Input>
              <RemindText>粉丝通过生成的裂变海报引导其他微信用户关注公众号，达到设置的关注数后，可以给予一点奖励，奖励自主设置。</RemindText>
            </FormItem>
            <FormItem label="活动有效期" prop="activityValidityPeriod" style="margin-top:40px;">
              <DatePicker
                style="width: 200px"
                :options="options"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="formValidate.activityValidityPeriod"
                type="datetime"
                placeholder="选择到期时间"
              ></DatePicker>
              <RemindText>活动到期后无法再生成裂变海报，无法回复内容。生成裂变海报的有效期如果超出活动时间的话以活动时间为准。</RemindText>
            </FormItem>
            <FormItem label="裂变海报有效期" prop="fansPosterValidityTime" style="margin-top:40px;">
              <Input
                v-model="formValidate.fansPosterValidityTime"
                v-limitNumber.2="formValidate.fansPosterValidityTime"
                v-if="!loading"
                style="width: 70px"
              ></Input>天
              <RemindText>粉丝可领取和可用裂变海报的有效时间。</RemindText>
            </FormItem>
            <FormItem
              label="二维码尺寸"
              prop="qrCodeSize"
              class="reset-error-tip"
              style="margin-top:81px;"
            >
              <Select v-model="formValidate.qrCodeSize" style="width: 120px">
                <Option
                  v-for="(item, index) in qrCodeSizeList"
                  :key="index"
                  :value="item"
                >{{item}}</Option>
              </Select>
              <RemindText>单位：px，点击二维码拖动到最佳位置。</RemindText>
            </FormItem>
            <FormItem
              label="粉丝头像"
              prop="fanAvatarIsShow"
              class="reset-error-tip"
              style="margin-top:40px;"
            >
              <div>
                <i-switch
                  v-model="formValidate.fanAvatarIsShow"
                  trueValue="SHOW"
                  falseValue="NOT_SHOW"
                ></i-switch>
                <RemindText style="margin-left:20px;">开启状态下，生成的裂变海报可以显示头像，同时在右侧海报视图中可点击头像拖动到最佳位置。</RemindText>
              </div>
              <Row style="margin-top:24px;">
                <Col span="6" style="width:21%;">形状
                  <Select
                    v-model="formValidate.fanAvatarType"
                    style="width: 90px;margin-left:20px;"
                  >
                    <Option value="ROUND">圆形</Option>
                    <Option value="FILLET">圆角</Option>
                  </Select>
                </Col>
                <Col span="6">尺寸
                  <Select
                    v-model="formValidate.fanAvatarSize"
                    style="width: 90px;margin-left:20px;"
                  >
                    <Option
                      v-for="(item, index) in avatarSizeList"
                      :key="index"
                      :value="item"
                    >{{item}}</Option>
                  </Select>
                  <RemindText>单位：px</RemindText>
                </Col>
              </Row>
            </FormItem>
            <FormItem
              label="粉丝昵称"
              prop="fanNickNameIsShow"
              class="reset-error-tip"
              style="margin-top:40px;"
            >
              <div>
                <i-switch
                  v-model="formValidate.fanNickNameIsShow"
                  trueValue="SHOW"
                  falseValue="NOT_SHOW"
                ></i-switch>
                <RemindText style="margin-left:20px;">开启状态下，生成的裂变海报可以显示昵称，同时在右侧海报视图中可点击头像拖动到最佳位置。</RemindText>
              </div>
              <Row style="margin-top:24px;">
                <Col span="6" style="width:21%;">颜色
                  <ColorPicker v-model="formValidate.fanNickNameColor" recommend></ColorPicker>
                </Col>
                <Col span="6">字号
                  <Select
                    v-model="formValidate.fanNickNameFontSize"
                    style="width: 90px;margin-left:20px;"
                  >
                    <Option
                      v-for="(item, index) in nameFontSizeList"
                      :key="index"
                      :value="item"
                    >{{item}}</Option>
                  </Select>
                  <RemindText>单位：px</RemindText>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <!-- 设置海报组件 -->
          <Col class="label" span="8">
          <!-- v-model="positions" -->
            <settingPoster
              @input="setPositon"
              :canvasInfo="canvasInfo"
              :initFile="file"
              :initBgImg="formValidate.backgroundImage"
              @onSuccess="getBackgroudImg"
            ></settingPoster>
          </Col>
        </Row>

        <PragraphTitle class="create-qrcode-title">扫码关注设置</PragraphTitle>
        <!-- 根据权限判断显示 -->
        <template  v-if="showAutoTag">

        <FormItem
          label="自动打标签"
          prop="receiveTagIds"
          :class="{'unshow-error-tip': !hasNoReceiveTagsSelect}"
          style="margin-top:40px;"
        >
          <div>
            <span>领取海报打标签</span>
            <i-switch
              v-model="formValidate.receiveTagType"
              style="margin-left:20px;"
              trueValue="AUTO"
              falseValue="NOT_AUTO"
            ></i-switch>
            <RemindText style="margin-left:20px;">开启状态下，领取裂变海报的粉丝将自动打上标签，不影响粉丝已有标签。</RemindText>
            <div v-show="formValidate.receiveTagType === 'AUTO'" style="paddingTop: 23px;">
              <Button type="ghost" style="width: 110px;" @click="selectReceiveTagIds">
                <span v-if="!formValidate.receiveTagIds.length">选择标签</span>
                <span v-else>选择标签({{formValidate.receiveTagIds.length}})</span>
              </Button>
            </div>
          </div>
        </FormItem>

        <FormItem
          prop="activeTagIds"
          :class="{'unshow-error-tip': !hasNoActiveTagsSelect}"
          style="margin-top:40px;"
        >
          <div>
            <span>完成任务打标签</span>
            <i-switch
              v-model="formValidate.activeTagType"
              style="margin-left:20px;"
              trueValue="AUTO"
              falseValue="NOT_AUTO"
            ></i-switch>
            <RemindText style="margin-left:20px;">开启状态下，粉丝即分享者完成活动所需关注数的任务后将自动打上标签，不影响粉丝已有标签。</RemindText>
            <div v-show="formValidate.activeTagType === 'AUTO'" style="paddingTop: 23px;">
              <Button type="ghost" style="width: 110px;" @click="selectActiveTagIds">
                <span v-if="!formValidate.activeTagIds.length">选择标签</span>
                <span v-else>选择标签({{formValidate.activeTagIds.length}})</span>
              </Button>
            </div>
          </div>
        </FormItem>
        </template>
        <FormItem label="回复内容" prop="fansPosterTemplateReplyDtoList" style="margin-top:40px;">
          <i-switch
            v-model="formValidate.isReply"
            size="default"
            trueValue="REPLAY"
            falseValue="NO_REPLAY"
          ></i-switch>
          <RemindText style="margin-left:20px;">开启状态下，粉丝扫码关注或扫码进入公众号后将自动回复设置的回复内容。</RemindText>
          <Replay
            ref="replay"
            style="paddingTop: 20px;"
            v-show="formValidate.isReply === 'REPLAY'"
            :replayList="filtReplyList(formValidate.fansPosterTemplateReplyDtoList)"
          ></Replay>
        </FormItem>
      </Form>
    </div>
    </ScrollBar>
  <!-- </BScroll> -->
  <div class="step-1-footer-btn">
    <Button type="primary" @click="saveAndNext">保存并下一步</Button>
    <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
  </div>
  <!-- 领取裂变海报自动打标签列表 -->
  <Tag
    v-model="receiveTagIdsVisible"
    :params="{selectedTag: formValidate.receiveTagIds}"
    @on-success="getReceiveTagIds"
  ></Tag>
  <!-- 完成活动任务的粉丝自动打标签列表 -->
  <Tag
    v-model="activeTagIdsVisible"
    :params="{selectedTag: formValidate.activeTagIds}"
    @on-success="getActiveTagIds"
  ></Tag>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import formMixin from "./formMixin.js"
import Tag from "./tag"
export default {
  name: "create-poster-temp-1",
  components: {
    PragraphTitle: () => import("@/components/pageStyle/pragraphTitle.vue"),
    PageMain: () => import("@/components/pageStyle/pageMain.vue"),
    RemindText: () => import("@/components/pageStyle/remindText.vue"),
    dayTimeSelect: () => import("@/components/dayTimeSelect.vue"),
    Replay: () => import("@/components/mediaTemplate/replay"),
    settingPoster: () => import("../../components/settingPoster"),
    Tag
  },
  mixins: [formMixin],
  props: {
    file: {
      // 图片对象
      type: [Object, File],
      default: () => {}
    },
    form: {
      // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showAutoTag: true,
      loading: false,
      timer: null,
      currentGroupId: null,
      currentStep: 0,
      qrCodeThemeName: null,
      qrCodeThemeId: null,
      treeData: [],
      preReceiveSelectTags: false,
      receiveTagIdsVisible: false,
      preActiveSelectTags: false,
      activeTagIdsVisible: false,
      autoTags: false,
      nameFontSizeList: [20, 24, 28, 30, 36, 42, 48, 54, 72],
      avatarSizeList: [56, 66, 88, 98, 120, 144, 150, 180, 216],
      qrCodeSizeList: [90, 120, 140, 160, 180, 200, 240, 300, 360],
      positions: {
        name: {},
        avatar: {},
        qrCode: {}
      }, // 裂变海报上二维码， 粉丝头像， 粉丝昵称 位置
      backgroudImgFile: null
    }
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getposterGroupList: "poster/getposterGroupList"
    }),
    hasNoReceiveTagsSelect() {
      return (
        !this.formValidate.receiveTagIds.length &&
        this.preReceiveSelectTags &&
        this.formValidate.receiveTagType === "AUTO"
      )
    },
    hasNoActiveTagsSelect() {
      return (
        !this.formValidate.activeTagIds.length &&
        this.preActiveSelectTags &&
        this.formValidate.activeTagType === "AUTO"
      )
    },
    canvasInfo() {
      let form = this.formValidate
      return {
        name: {
          show: form.fanNickNameIsShow === "SHOW",
          namePositionX: form.fanNickNamePositionX,
          namePositionY: form.fanNickNamePositionY,
          fontSize: form.fanNickNameFontSize,
          color: form.fanNickNameColor
        },
        avatar: {
          show: form.fanAvatarIsShow === "SHOW",
          avatarPositionX: form.fanAvatarPositionX,
          avatarPositionY: form.fanAvatarPositionY,
          shape: form.fanAvatarType,
          size: form.fanAvatarSize
        },
        qrCode: {
          show: true,
          posterQrCodePositionX: form.fanPosterQrCodePositionX,
          posterQrCodePositionY: form.fanPosterQrCodePositionY,
          size: form.qrCodeSize
        },
        backgroundImage: form.backgroundImage
      }
    }
  },
  created() {
    this.judgeSelectTags()
    // 默认分组
    this.formValidate.groupId = parseInt(this.$route.params.groupId)
    if (this.form.groupId) {
      this.formValidate = { ...this.formValidate, ...this.form }
      this.formValidate.fansPosterValidityTime =
        this.formValidate.fansPosterValidityTime / 60 / 60 / 24 + ""
    } else {
      this.getModifyPosterTemp()
    }
  },
  mounted() {
    this.getTagsByWx({ appAccountIds: [this.currPublic.appAccountId] })
    this.getGroupList()
  },
  methods: {
    ...mapActions({
      getTagsByWx: "fans/getTagsByWx",
      queryCssGroup: "poster/queryCssGroup",
      getPosterTemplate: "poster/getPosterTemplate"
    }),
    judgeSelectTags() {
      this.showAutoTag = this.localStorageSaveOrRead("menuTree").includes('粉丝海报打标签')
    },
    // 获取要修改的海报模板
    async getModifyPosterTemp() {
      if (this.$route.query.posterId) {
        this.loading = true
        let param = {
          id: this.$route.query.posterId,
          appAccountId: this.currPublic.appAccountId
        }
        let res = await this.getPosterTemplate(param)
        if (res.code === 1) {
          this.formValidate = {
            ...this.formValidate,
            ...res.data,
            isReply: res.data.isAttentionReply ? "REPLAY" : "NO_REPLAY",
            fansPosterTemplateReplyDtoList: res.data.replyDetailDtoList || [],
            fanNickNameIsShow:
              res.data.fanNickNameIsShow === 1 ? "SHOW" : "NOT_SHOW",
            receiveTagType: res.data.receiveTagtype === 1 ? "AUTO" : "NOT_AUTO",
            activeTagType: res.data.activeTagType === 1 ? "AUTO" : "NOT_AUTO",
            fanAvatarIsShow:
              res.data.fanAvatarIsShow === 1 ? "SHOW" : "NOT_SHOW",
            fansPosterValidityTime:
              res.data.fansPosterValidityTime / 60 / 60 / 24 + "",
            activeTagIds: res.data.activeTagList
              ? res.data.activeTagList.map(item => item.tagId)
              : [],
            receiveTagIds: res.data.receiveTagList
              ? res.data.receiveTagList.map(item => item.tagId)
              : []
          }
          this.loading = false
        } else {
          this.$Message.error("海报模板不存在！")
        }
      }
    },
    // 加载分组
    getGroupList() {
      this.timer = setInterval(() => {
        if (!this.getposterGroupList.length) {
          this.queryCssGroup({
            appAccountId: this.currPublic.appAccountId,
            type: "posterTemplate"
          })
        } else {
          clearInterval(this.timer)
        }
      }, 500)
    },
    // 保存并下一步
    saveAndNext() {
      if (!this.backgroudImgFile && !this.formValidate.backgroundimage) {
        this.$Message.error("请选择海报背景图")
      } else {
        this.handleSubmit("formValidate")
      }
    },
    // 选择标签弹框
    selectReceiveTagIds() {
      this.preReceiveSelectTags = true
      this.receiveTagIdsVisible = true
    },
    getReceiveTagIds(data) {
      this.formValidate.receiveTagIds = data
    },
    // 完成任务打标签弹框
    selectActiveTagIds() {
      this.preActiveSelectTags = true
      this.activeTagIdsVisible = true
    },
    getActiveTagIds(data) {
      this.formValidate.activeTagIds = data
    },
    selectTags() {},
    getBackgroudImg(data, scale) {
      this.backgroudImgFile = data
    },
    setPositon(nv) {
      this.formValidate.fanNickNamePositionX = nv.name.x || this.formValidate.fanNickNamePositionX
      this.formValidate.fanNickNamePositionY = nv.name.y || this.formValidate.fanNickNamePositionY
      this.formValidate.fanAvatarPositionX = nv.avatar.x || this.formValidate.fanAvatarPositionX
      this.formValidate.fanAvatarPositionY = nv.avatar.y || this.formValidate.fanAvatarPositionY
      this.formValidate.fanPosterQrCodePositionX = nv.qrCode.x || this.formValidate.fanPosterQrCodePositionX
      this.formValidate.fanPosterQrCodePositionY = nv.qrCode.y || this.formValidate.fanPosterQrCodePositionY
    },
    // 转化回复内容数据格式
    filtReplyList(cont) {
      let list = [];
      (cont || []).forEach((v,i) => {
        list.push({
          key: v.msgType,
          [v.msgType]: v.content,
          contentOrder: v.contentOrder,
        })
      })
      return list
    }
  }
}
</script>

<style lang="stylus">
.create-poster-temp-1
  .create-qrcode-title
    margin 40px 0
    &:first-child
      margin-top 0
  .ivu-form-item-required .ivu-form-item-label:before
    display none
  .ivu-form-item-label
    text-align left !important
    padding-left 20px !important
  .ivu-radio-wrapper
    display block !important
    margin-bottom 15px
  .form-item-indent
    padding-left 24px
  .reset-error-tip
    .ivu-form-item-error-tip
      top -19px
  .unshow-error-tip
    .ivu-form-item-error-tip
      visibility hidden
  .step-1-footer-btn
    position fixed
    bottom 0
    right 0
    text-align center
    width calc(100% - 260px)
    background #fff
    height 60px
    line-height 60px
    border-top 1px solid #fafafa
    background #fff
    z-index: 20;
</style>
