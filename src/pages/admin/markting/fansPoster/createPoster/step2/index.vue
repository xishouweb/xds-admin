<template>
    <div class="create-poster-temp-2">
      <!-- <PageMain> -->
      <BScroll :offsetBottom="60">
      <div style="padding-bottom: 60px">
        <Form ref="formValidate" :model="formValidate" :label-width="140">
          <PragraphTitle class="panel">
            生成海报回复
            <i-switch :true-value=1 :false-value=0 v-model="autoTags[0]"></i-switch>
            <RemindText v-if="autoTags[0]">粉丝生成裂变海报时回复的内容</RemindText>
            <RemindText v-else>关闭后，粉丝生成裂变海报时不回复内容</RemindText>
          </PragraphTitle>
          <div v-show="autoTags[0]">
            <!-- <div class="sub-remind-title">生成海报回复</div> -->
            <div class="template-content text-edit">
              <menuContentType
                insertTags="ALL"
                :showType="(false)"
                :messageContent="beforeActive"
                :errNoData="editStatus"
                :errText="['请设置当前内容','不能超过600个字符']"
              ></menuContentType>
            </div>
          </div>

          <PragraphTitle class="panel">
            活动进展通知
            <i-switch :true-value=1 :false-value=0 v-model="autoTags[1]"></i-switch>
            <RemindText v-if="autoTags[1]">粉丝扫描分享者生成的二维码关注公众号时给该分享者的通知</RemindText>
            <RemindText v-else>粉丝扫描分享者生成的二维码关注公众号时不给该分享者发送通知</RemindText>
          </PragraphTitle>
          <div v-show="autoTags[1]">
            <div class="sub-remind-title">
              <Poptip placement="right-start" trigger="hover">
                活动进展通知参考内容
                <div slot="content">
                  <div><span class="sub-remind-title-title">活动名称</span> [海报名称]</div>
                  <div><span class="sub-remind-title-title">活动目标</span> [需要关注数]</div>
                  <div><span class="sub-remind-title-title">已邀请数量</span> [已关注数]</div>
                  <br>
                  <div>
                    <span class="sub-remind-title-title">您还需要邀请 </span>
                    [还需关注数]<span class="sub-remind-title-title"> 个小伙伴关</span><br>
                    <span class="sub-remind-title-title">注公众号后即可领取奖励哦。活动期间</span><br>
                    <span class="sub-remind-title-title">多与公众号互动哦，否则可能收不到进</span><br>
                    <span class="sub-remind-title-title">展通知。如有疑问请联系在线客服。</span></div>
                </div>
              </Poptip>
            </div>
            <div class="template-content">
              <temp-edit :status="activing.status" :temp="activing.temp" @submit="submit1"></temp-edit>
            </div>
          </div>

          <PragraphTitle class="panel">
            活动完成通知
            <i-switch :true-value=1 :false-value=0 v-model="autoTags[2]"></i-switch>
            <RemindText v-if="autoTags[2]">分享者完成活动任务时给该分享者的通知</RemindText>
            <RemindText v-else>活动完成时不给该分享者发送通知</RemindText>
          </PragraphTitle>
          <div v-show="autoTags[2]">
            <div class="sub-remind-title">
              <Poptip placement="right-start" trigger="hover">
                活动完成通知参考内容
                <div slot="content">
                  <div><span class="sub-remind-title-title">活动名称</span> [海报名称]</div>
                  <div><span class="sub-remind-title-title">活动目标</span> [需要关注数]</div>
                  <div><span class="sub-remind-title-title">已邀请数量</span> [已关注数]</div>
                  <br>
                  <div>
                    <span class="sub-remind-title-title">恭喜您已经完成活动目标，可以领取奖</span><br>
                    <span class="sub-remind-title-title">品啦~。如有疑问请联系在线客服。</span>
                  </div>
                </div>
              </Poptip>
            </div>
            <div class="template-content">
              <temp-edit :status="afterActive.status" :temp="afterActive.temp" @submit="submit2"></temp-edit>
            </div>
          </div>
        </Form>
      </div>
      </BScroll>
      <div class="step-2-footer-btn" slot="footer">
          <Button type="primary"  @click="handleSubmit('formValidate')">确定</Button>
          <Button @click="prevStep" style="margin-left: 8px">上一步</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </div>

    <!-- </PageMain> -->
    </div>
</template>

<script>
import formMixin from './formMixin.js'
import menuContentType from '@/pages/admin/tencent/components/WechatContent/menuContentType'
import CloudUpload from "@/utils/cloudUpload.js"
import { mapActions, mapState, mapMutations } from 'vuex'
import { filterTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
// let baseSrc = '//static/images/material/'
export default{
  name: "create-poster-temp-2",
  components: {
    PragraphTitle: () => import('@/components/pageStyle/pragraphTitle.vue'),
    PageMain: () => import('@/components/pageStyle/pageMain.vue'),
    RemindText: () => import('@/components/pageStyle/remindText.vue'),
    menuContentType,
    tempEdit: () => import('@/components/Template/tempEdit.vue')
  },
  mixins: [formMixin],
  data() {
    return {
      wxUpload: null,
      corTokenUrl: {
        url: '/api/posterTemplate/updateGetPosterCloudToken',
        params: {
          appAccountId: 25
        }
      },
      selectTags: false,
      editStatus: 1, // 编辑器状态，1：正常，2：为空，3：超过600字
      beforeActive: {
        key: 'text',
        text: '',
        contentOrder: 0,
        len: 0
      },
      // 不要手动输入换行
      beforeActiveText:
          `<p>活动名称：<span style="color:#409fff">[海报名称]</span></p><br><p>活动目标：<span style="color:#409fff">[需要关注数]</span></p><br><p>您需要邀请：<span style="color:#409fff">[需要关注数]</span>个小伙伴关注公众号后即可领取奖励哦，活动有效期为<span style="color:#409fff">[活动有效期]</span>，当前裂变海报有效期为<span style="color:#409fff">[裂变海报有效期]</span>。活动期间多与公众号互动哦，否则可能收不到进展通知。如有疑问请联系在线客服。</p>`,
      // beforeActiveText:
      //     `<p>活动名称：<img src="${baseSrc}[海报名称].png"></p><br><p>活动目标：<img src="${baseSrc}[需要关注数].png"></p><br><p>您需要邀请：<img src="${baseSrc}[需要关注数].png">个小伙伴关注公众号后即可领取奖励哦，活动有效期为<img src="${baseSrc}[活动有效期].png">，当前裂变海报有效期为<img src="${baseSrc}[裂变海报有效期].png">。活动期间多与公众号互动哦，否则可能收不到进展通知。如有疑问请联系在线客服。</p>`,
      activing: { status: 0, temp: null },
      afterActive: { status: 0, temp: null }
    }
  },
  props: {
    file: { // 图片对象
      type: [Object, File],
      default: () => {}
    },
    form: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState({
      curPublic: state => state.publicAccount.curPublic
    })
  },
  watch: {
    file(nv) {
      this.wxUpload = CloudUpload(this.corTokenUrl, nv)
    },
    // form(nv) {
    //   this.initForm()
    //   this.formValidate = {...this.formValidate, ...nv}
    // }
  },
  created() {
    this.corTokenUrl.params.appAccountId = this.curPublic.appAccountId
    this.wxUpload = CloudUpload(this.corTokenUrl, this.file)
    this.formValidate = {...this.formValidate, ...this.form}
  },
  mounted() {
    this.$root.Bus.$emit('calcScrollHeight') // 重新计算页面高度并设置滚动条高度
    this.$root.Bus.$on('messageChange', (dat, typ, type, len) => { // 获取文本编辑器内容
      this.beforeActive.text = dat
      this.beforeActive.len = len
      this.formValidate.generatePosterReplyContent = dat
      this.saveFormData()
      this.audit()
    })
    this.initForm()
  },
  methods: {
    ...mapMutations({
      setNewCreatedPoster: 'poster/SET_NEW_CREATED_POSTER'
    }),
    ...mapActions({
      saveOrUpdatePostertTemplate: 'poster/saveOrUpdatePostertTemplate'
    }),
    async initForm() { // 过滤表单数据,并初始化第二步页面
      let res = this.form
      // 初始化开关
      let arr = ['isGeneratePosterReply', 'isActivityProgressReply', 'isActivityCompletionReply']
      arr.forEach((v, i) => {
        let k = res[v]
        this.formValidate[v] = k === 0 ? 'NO_REPLAY' : 'REPLAY'
        this.autoTags[i] = k === 0 ? 0 : 1
      })
      // 初始化通知内容
      let d = 'generatePosterReplyContent'
      let e = 'activityProgressReplyContent'
      let f = 'activityCompletionReplyContent'
      this.formValidate[d] = res.generatePosterReplyContent || this.formValidate[d] || filterTags(this.beforeActiveText)

      this.formValidate[e] = res.activityProgressReply || this.formValidate[e] || null
      this.formValidate[f] = res.activityCompletionReply || this.formValidate[f] || null
      // beforeActive
      if (this.formValidate[d]) {
        this.beforeActive = {...this.beforeActive, text: this.formValidate[d]}
      } else {
        this.beforeActive = {...this.beforeActive, text: this.beforeActiveText}
      }
      // 活动进展通知
      if (this.formValidate[e] && this.formValidate[e].templateId) {
        this.activing.temp = {
          content: this.formValidate[e].content,
          createTime: this.formValidate[e].createTime,
          templateId: this.formValidate[e].templateId,
          name: this.formValidate[e].name,
          title: this.formValidate[e].title,
          linkAddress: this.formValidate[e].linkAddress,
          templateDateList: this.formValidate[e].templateDataList,
          jumpType: this.formValidate[e].jumpType,
          mpAppId: this.formValidate[e].mpAppId,
          mpUrl: this.formValidate[e].mpUrl,
          spareUrl: this.formValidate[e].spareUrl,
        }
      }
      // 活动完成通知
      if (this.formValidate[f] && this.formValidate[f].templateId) {
        this.afterActive.temp = {
          content: this.formValidate[f].content,
          createTime: this.formValidate[f].createTime,
          templateId: this.formValidate[f].templateId,
          name: this.formValidate[f].name,
          title: this.formValidate[f].title,
          linkAddress: this.formValidate[f].linkAddress,
          templateDateList: this.formValidate[f].templateDataList,
          jumpType: this.formValidate[f].jumpType,
          mpAppId: this.formValidate[f].mpAppId,
          mpUrl: this.formValidate[f].mpUrl,
          spareUrl: this.formValidate[f].spareUrl,
        }
      }
    },
    prevStep() { // 上一步
      this.$emit('changeStep')
      this.saveFormData()
    },
    setTempCont(temp) { // 设置模板内容
      return {
        content: temp.content,
        createTime: temp.createTime,
        templateId: temp.templateId,
        name: temp.name,
        title: temp.title,
        linkAddress: temp.linkAddress,
        templateDataList: temp.templateDateList,
        jumpType: temp.jumpType,
        mpAppId: temp.mpAppId,
        mpUrl: temp.mpUrl,
        spareUrl: temp.spareUrl,
      }
    },
    submit1(temp) { // 确定模板消息(活动进展)
      this.activing.temp = temp
      this.formValidate.activityProgressReplyContent = temp ? this.setTempCont(temp) : temp
      // this.saveFormData()
    },
    submit2(temp) { // 确定模板消息(活动完成)
      this.afterActive.temp = temp
      this.formValidate.activityCompletionReplyContent = temp ? this.setTempCont(temp) : temp
      // this.saveFormData()
    },
    audit() { // 检测编辑区是否为空
      let cont = this.beforeActive.text || ''
      cont = cont.replace(/(<\/?[a-z]+\/?>)|(&nbsp;)/g,'')
      if (cont === '' || cont === null) {
        this.editStatus = 2
        return false
      } else if (this.beforeActive.len < 0) {
        this.editStatus = 3
        return false
      } else {
        this.editStatus = 1
        return true
      }
    },
    async getMediaIdDetailData(arg) {
      let param = {
          mediaId: arg.mediaId,
          type: arg.type
        }
      if (param.mediaId && !this.getMuneMaterial) {
        let res = await this.$post(this.Path.getMediaIdDetailData, param)
        res = res.data
        if (res.code === 1) {
          return res.data
        }
      }
    },
    saveFormData() {
      this.$emit('saveFormData', this.formValidate)
    }
  }
}
</script>

<style lang="stylus">
.create-poster-temp-2
  .sub-remind-title
    padding-left 134px
    color: #409eff;
    cursor pointer
    margin 20px 0
    .sub-remind-title-title
      color: #000000;
  .template-content
    height: 340px
    padding-left 134px
    overflow hidden
    margin 20px 0
  .text-edit
    height: auto
  .panel
    margin-top: 40px
    .ivu-switch
      margin: 0 20px 0 30px
  .step-2-footer-btn
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
