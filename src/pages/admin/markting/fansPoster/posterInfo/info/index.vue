<template>
  <div class="create-poster-temp-1" v-if="list">
    <BScroll>
      <div>
        <div style="width:100%">
          <PragraphTitle class="create-qrcode-title" style="margin-top:40px;">基本信息</PragraphTitle>
          <Row style="margin-left:10px;margin-top:81px;">
            <Col span="20" style="width:76.333333%">
              <Row>
                <Col span="4">模板名称</Col>
                <Col>{{list.posterTemplateName}}</Col>
              </Row>
              <Row style="margin-top:38px;">
                <Col span="4">模板分组</Col>
                <Col>{{groupName}}</Col>
              </Row>
              <Row style="margin-top:38px;">
                <Col span="4">活动所需关注数</Col>
                <Col>
                  {{list.activityNeedFollowers}}
                  <RemindText
                    style="margin-left:20px;"
                  >粉丝通过生成的裂变海报引导其他微信用户关注公众号，达到设置的关注数后，可以给予一点奖励，奖励自主设置。</RemindText>
                </Col>
              </Row>
              <Row style="margin-top:38px;">
                <Col span="4">活动有效期</Col>
                <Col>
                  {{activeTime.slice(0, -3)}}
                  <RemindText
                    style="margin-left:20px;"
                  >活动到期后无法再生成裂变海报，无法回复内容，生成裂变海报的有效期如果超出活动时间的话以活动时间为准。</RemindText>
                </Col>
              </Row>
              <Row style="margin-top:38px;">
                <Col span="4">裂变海报有效期</Col>
                <Col>
                  {{timed.slice(0, -3)}}
                  <RemindText style="margin-left:20px;">裂变海报领取和可用裂变海报的有效时间。</RemindText>
                </Col>
              </Row>
              <Row style="margin-top:77px;">
                <Col span="4">二维码尺寸</Col>
                <Col>{{list.qrCodeSize}}px</Col>
              </Row>
              <Row style="margin-top:38px;">
                <Col span="4">粉丝头像</Col>
                <Col>
                  <template v-if="list.fanAvatarIsShow">
                    形状：{{type[list.fanAvatarType]}}
                    <RemindText class="headSize">尺寸：{{list.fanAvatarSize}}px</RemindText>
                  </template>
                  <template v-else>
                    无
                  </template>
                </Col>
              </Row>
              <Row style="margin-top:38px;">
                <Col span="4">粉丝昵称</Col>
                <Col>
                  <template v-if="list.fanNickNameIsShow">
                    颜色：
                    <span :style="{backgroundColor:list.fanNickNameColor}" class="span_color"></span>
                    {{strcolor}}
                    <RemindText class="headSize">字号：{{list.fanNickNameFontSize}}px</RemindText>
                  </template>
                  <template v-else>
                    无
                  </template>

                </Col>
              </Row>
            </Col>

            <!-- 显示海报 -->
            <Col span="4" style="width:20.666667%">
              <settingPoster disabled :canvasInfo="canvasInfo" :initBgImg="list.backgroundImage"></settingPoster>
            </Col>
          </Row>

          <PragraphTitle class="create-qrcode-title" style="margin-top:81px;">扫码关注</PragraphTitle>
          <Row style="margin-top:47px;margin-left:10px">
            <Col span="20">
              <Row>
                <Col span="4">自动打标签</Col>
                <Col>领取海报打标签</Col>
              </Row>
            </Col>
          </Row>
          <div class="tips">
            <div v-if="!list.receiveTagList">暂无标签</div>
            <span v-for="(item,index) in list.receiveTagList" :key="index">{{item.tagName}}</span>
          </div>
          <Row style="margin-top:33px;margin-left:233px;">
            <Col span="4">完成任务打标签</Col>
          </Row>
          <div class="tips">
            <div v-if="!list.activeTagList">暂无标签</div>
            <span v-for="(item,index) in list.activeTagList" :key="index">{{item.tagName}}</span>
          </div>
          <p class="more" v-show="isShow">查看更多</p>
          <div class="replayContent" style="margin-top:40px">
            <span style="margin-left:15px">回复内容</span>
            <template v-if="list.replyDetailDtoList && list.replyDetailDtoList.length">
              <div class="replay" v-for="(item, index) in list.replyDetailDtoList" :key="index">
                <div class="label-text" style="padding-bottom:10px">{{contTit[index]}} :</div>
                <mediaTemplate :media="item"></mediaTemplate>
              </div>
            </template>
            <div v-else class="replay">无</div>

            <PragraphTitle class="create-qrcode-title">活动通知</PragraphTitle>
            <div class="createPosterReply">
              <Row style="margin-top:47px;">
                <Col span="20">
                  <Row>
                    <Col span="4">生成海报回复</Col>
                    <div v-if="!list.isGeneratePosterReply" class="posterReply">暂无回复</div>
                    <div v-else class="posterReply">
                      <TextView :text="list.generatePosterReplyContent"></TextView>
                    </div>
                  </Row>
                </Col>
              </Row>
              <Row style="margin-top:47px;">
                <Col span="20">
                  <Row>
                    <Col span="4" style="color:#606366">活动进展通知</Col>
                    <Col style="margin-left:217px; width: 278px">
                      <MessageTemplate status :template="list.activityProgressReply"></MessageTemplate>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style="margin-top:47px;">
                <Col span="20">
                  <Row>
                    <Col span="4" style="color:#606366">活动完成通知</Col>
                    <Col style="margin-left:217px; width: 278px">
                      <MessageTemplate status :template="list.activityCompletionReply"></MessageTemplate>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div class="qrcode-footer-btn">
          <Button type="primary" @click="modify" style="margin-left:50%">修改</Button>
        </div>
      </div>
    </BScroll>
  </div>
</template>

<script>
import { getPosterTemplate } from "@/api/poster"
import { mapGetters, mapActions } from "vuex"
export default {
  name: "poster-info",
  components: {
    PragraphTitle: () => import("@/components/pageStyle/pragraphTitle.vue"),
    RemindText: () => import("@/components/pageStyle/remindText.vue"),
    mediaTemplate: () => import("@/components/mediaTemplate"),
    MessageTemplate: () =>
      import("@/components/mediaTemplate/MessageTemplate.vue"),
    settingPoster: () => import("../../components/settingPoster"),
    TextView: () => import("@/components/mediaTemplate/text.vue")
  },

  data() {
    return {
      contTit: [
        "回复内容一",
        "回复内容二",
        "回复内容三",
        "回复内容四",
        "回复内容五"
      ],
      // 回复的消息类型text:文本 news：图文 image：图片 voice：语音 video：视频 file：文件 template：模板消息
      isShow: false,
      strcolor: null,
      activeTime: null, // 有效期
      timed: null,
      type: {
        FILLET: "圆角",
        ROUND: "圆形"
      },
      wh: {
        width: 40,
        height: 40,
        paddingleft: 10,
        paddingtop: 10
      },
      tableParam: {
        totalPage: 20,
        pageSize: 10,
        currPage: 1,
        keyword: null,
        groupId: null,
        id: null
      },
      fansPosterBase64: "",
      list: null
    }
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getposterGroupList: "poster/getposterGroupList"
    }),
    groupName() {
      return (
        (this.getposterGroupList || []).find(
          item => item.groupId === this.list.groupId
        ) || {}
      ).name
    },
    canvasInfo() {
      let form = this.list
      return {
        name: {
          show: form.fanNickNameIsShow === 1,
          namePositionX: form.fanNickNamePositionX,
          namePositionY: form.fanNickNamePositionY,
          fontSize: form.fanNickNameFontSize,
          color: form.fanNickNameColor
        },
        avatar: {
          show: form.fanAvatarIsShow === 1,
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
  mounted() {
    this.getPoster()
    this.getGroupList()
  },
  methods: {
    ...mapActions({
      getFansPosterImageById: "poster/getFansPosterImageById",
      queryCssGroup: "poster/queryCssGroup"
    }),
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
    async getFansPosterImageBase() {
      let param = {
        appAccountId: this.currPublic.appAccountId,
        fansPosterId: this.list.id
      }
      let res = await this.getFansPosterImageById(param)
      if (res.code === 1) {
        this.fansPosterBase64 = `data:image/${res.data.imageType};base64,${
          res.data.base64StrImage
        }`
      }
    },
    getPoster() {
      let _param = this.tableParam
      _param.id = this.$route.query.id
      let params = {
        id: _param.id,
        appAccountId: this.currPublic.appAccountId
      }
      getPosterTemplate(params).then(res => {
        if (res.code === 1) {
          this.list = res.data
          this.sortReplayList(this.list.replyDetailDtoList)
          this.activeTime = this.list.activityValidityPeriod
            .split("-")
            .join("/")
          this.SecondToDate(this.list.fansPosterValidityTime)
          var strColor = this.list.fanNickNameColor.substring(
            1,
            this.list.fanNickNameColor.length - 1
          )
          this.strcolor = strColor
        } else {
          this.$Message.error("数据加载失败！")
        }
      })
    },
    SecondToDate(msd) {
      var time = msd
      if (time != null) {
        if (time > 60 && time < 60 * 60) {
          this.timed =
            parseInt(time / 60.0) +
            "分钟" +
            parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) +
            "秒"
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          this.timed =
            parseInt(time / 3600.0) +
            "小时" +
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
            ) +
            "分钟" +
            parseInt(
              (parseFloat(
                (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
              ) -
                parseInt(
                  (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
                )) *
                60
            ) +
            "秒"
        } else if (time >= 60 * 60 * 24) {
          this.timed =
            parseInt(time / 3600.0 / 24) +
            "天" +
            parseInt(
              (parseFloat(time / 3600.0 / 24) - parseInt(time / 3600.0 / 24)) *
                24
            ) +
            "小时" +
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
            ) +
            "分钟" +
            parseInt(
              (parseFloat(
                (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
              ) -
                parseInt(
                  (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
                )) *
                60
            ) +
            "秒"
        } else {
          this.timed = parseInt(time) + "秒"
        }
      }
      return this.timed
    },
    modify() {
      this.$router.push({
        name: "createPoster",
        params: { groupId: this.list.groupId },
        query: { posterId: this.list.id }
      })
    },
    sortReplayList(val) {
      (val || []).sort((item1, item2) => {
        return item1.contentSort - item2.contentSort
      })
      return val
    }
  }
}
</script>

<style lang="stylus" scoped>
// .create-poster-temp-1
.headSize
  margin-left 49px
  font-family MicrosoftYaHei
  font-size 14px
  font-weight normal
  font-stretch normal
  line-height 28px
  letter-spacing 0px
  color #606366
// .create-qrcode-title
// margin-top 81px;
.tips
  margin-left 233px
  margin-top 18px
  span
    padding 6px 11px
    margin 5px 8px
    background-color #f2f4f5
    border-radius 3px
.more
  font-family MicrosoftYaHei
  font-size 12px
  font-weight normal
  font-stretch normal
  line-height 28px
  letter-spacing 0px
  color #409eff
  margin 22px 233px
  cursor pointer
.replay
  margin-left 233px
  margin-top -15px
  padding-bottom 47px
.material-box
  margin-top 11px
.span_color
  padding-left 19px
.createPosterReply
  margin 43px 20px
  font-family MicrosoftYaHei
  font-family MicrosoftYaHei
  font-size 14px
  font-weight normal
  font-stretch normal
  line-height 28px
  letter-spacing 0px
  color #606366
  .li-list
    font-family MicrosoftYaHei
    font-size 16px
    font-weight normal
    color #000000
.list-info
  height 40px
  line-height 40px
  border-top 1px solid #e3e4e6
  margin-top 20px
  display flex
  justify-content space-between
.posterReply
  margin-left 217px
  // margin-top 20px
</style>
