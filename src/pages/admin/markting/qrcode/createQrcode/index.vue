<template>
  <div class="markting-create-qr-code">
    <div style="height: 124px">
      <HeaderTitle>{{!pageType ? '新建' : '修改'}}二维码</HeaderTitle>
      <HeaderSubtitle>
        <p>
          <i @click="$router.push({name: 'qrcodeTheme'})" style="cursor: pointer">主题列表</i> /
          <i @click="$router.back()" style="cursor: pointer">{{getQrCodeThemeName}}</i> /
          <span>{{!pageType ? '新建' : '修改'}}二维码</span>
        </p>
      </HeaderSubtitle>
    </div>

    <PageMain>
      <BScroll :offsetBottom="80">
      <div style="width:100%">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
          <PragraphTitle class="create-qrcode-title">渠道二维码基本信息</PragraphTitle>
          <FormItem label="名称" prop="qrCodeName">
            <Input v-model="formValidate.qrCodeName" style="width: 360px" placeholder="必填，不能超过20个字"></Input>
          </FormItem>
          <FormItem label="类型">
            <Row class="row">
              <Col class="label" span="4">
                <RadioGroup v-model="formValidate.qrCodeType">
                  <Radio label="QR_LIMIT_STR_SCENE" :disabled="isModify">永久二维码</Radio>
                  <Radio label="QR_STR_SCENE" :disabled="isModify">临时二维码
                    <br>
                    <RadioGroup
                      class="form-item-indent"
                      v-if="formValidate.qrCodeType === 'QR_STR_SCENE'"
                      v-model="validityPeriodType"
                    >
                      <Radio :label="0" :disabled="isModify">有效天数</Radio>
                      <Radio :label="1" :disabled="isModify">到期时间</Radio>
                    </RadioGroup>
                  </Radio>
                </RadioGroup>
              </Col>
              <Col span="8">
                <div>
                  <dayTimeSelect
                    style="paddingTop: 80px"
                    :disabled="isModify"
                    v-model="formValidate.qrCodeEffectiveDate"
                    v-if="formValidate.qrCodeType === 'QR_STR_SCENE' &&
                      validityPeriodType === 0"
                  ></dayTimeSelect>
                  <DatePicker
                    style="paddingTop: 125px; width: 200px"
                    :options="options"
                    v-if="formValidate.qrCodeType === 'QR_STR_SCENE' &&
                       validityPeriodType === 1"
                    @on-change="getSecond"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择到期时间"
                  ></DatePicker>
                </div>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="生成方式" prop="createNum" v-if="!pageType">
            <RadioGroup v-model="formValidate.qrCodeCreateType">
              <Radio label="NUM" :disabled="isModify">按数量批量生成
                <Input
                  :disabled="isModify"
                  v-if="formValidate.qrCodeCreateType == 'NUM'"
                  v-model="formValidate.createNum"
                  v-limitNumber="formValidate.createNum"
                  style="width: 60px"
                ></Input>个
                <RemindText>不填代表生成1个渠道二维码，单次最多可生成20个。</RemindText>
              </Radio>
              <Radio label="EMPLOYEE_ID_LIST" :disabled="isModify">按员工姓名批量生成
                <Poptip trigger="hover" transfer placement="right-start"  popper-class="poptip-text" >
                  <i class="icon" style="color: #979899;">&#xe635</i>
                  <div slot="content" style="width: 340px; whiteSpace: normal">
                    <p>按员工姓名批量生成后，渠道二维码名称为：自定义名称+选择的员工姓名，即每个员工生成一个对应的渠道二维码，单次最多可生成20个。</p>
                  </div>
                </Poptip>
                <StaffTree
                  v-show="formValidate.qrCodeCreateType == 'EMPLOYEE_ID_LIST'"
                  :defaultValue="{}"
                  mode="stuff"
                  :onSave="saveStuff"
                  :params="currPublic"
                >
                  <template>
                    <Button
                      v-if="!formValidate.employeeIdList.length"
                      style="width: 110px;"
                      type="ghost"
                      :disabled="isModify"
                    >选择员工</Button>
                    <Button
                      v-else
                      style="width: 110px;"
                      type="ghost"
                      :disabled="isModify"
                      :style="{color:'#57a3f3', background: '#fff', borderColor: '#57a3f3'}"
                    >选择员工({{formValidate.employeeIdList.length}})</Button>
                  </template>
                </StaffTree>
              </Radio>
              <FormItem prop="employeeIdList"></FormItem>
            </RadioGroup>
          </FormItem>

          <PragraphTitle class="create-qrcode-title">渠道二维码设置</PragraphTitle>
          <FormItem label="指定接待客服" class="reset-error-tip">
            <RadioGroup v-model="formValidate.customerServiceType">
              <Radio label="SEAT_OR_DEPT_SPECIFIED">指定客服/部门
                <StaffTree
                  v-show="formValidate.customerServiceType == 'SEAT_OR_DEPT_SPECIFIED'"
                  :onSave="saveStuffAndDept"
                  :params="currPublic"
                  :defaultValue="defaultServiceSeatList"
                  mode="department"
                >
                  <template>
                    <Button type="ghost" v-if="!selectDeptAndStuff">选择客服/部门</Button>
                    <Button
                      v-else
                      type="ghost"
                      :style="{color:'#57a3f3', background: '#fff', borderColor: '#57a3f3'}"
                    >已选客服/部门({{selectDeptAndStuff}})</Button>
                  </template>
                </StaffTree>
                <RemindText>粉丝扫码关注或扫码进入公众号后将分配给指定客服或部门。</RemindText>
              </Radio>
              <FormItem prop="customerServiceIdList"></FormItem>
              <Radio label="UMLIMITED">不限
                <RemindText>粉丝扫码关注或扫码进入公众号后将自动给所有的客服，再根据分配规则分配。</RemindText>
              </Radio>
              <Radio label="UNSPECIFIED">不指定客服
                <RemindText>粉丝扫码关注或扫码进入公众号后不分配给客服。</RemindText>
              </Radio>
            </RadioGroup>
          </FormItem>

          <FormItem v-if="showAutoTag" label="自动打标签">
            <i-switch v-model="autoTags"></i-switch>
            <RemindText>开启状态下，粉丝扫码关注或扫码进入公众号后将自动打上标签，不影响粉丝已有标签。</RemindText>
            <FormItem prop="tagIdList">
            <div v-show="autoTags" style="paddingTop: 20px;">
              <Button v-if="!formValidate.tagIdList.length" type="ghost" @click="selectTags">
                <span>选择标签</span>
              </Button>
              <Button
                v-else
                type="ghost"
                :style="{color:'#57a3f3', background: '#fff', borderColor: '#57a3f3'}"
                @click="selectTags"
              >
                <span>已选标签({{formValidate.tagIdList.length}})</span>
              </Button>
            </div>
            </FormItem>
          </FormItem>

          <FormItem label="回复内容" prop="qrCodeReplyList" style="paddingBottom: 60px;">
            <i-switch v-model="formValidate.isReply" size="default"></i-switch>
            <RemindText>开启状态下，粉丝扫码关注或扫码进入公众号后将自动回复设置的回复内容。</RemindText>
            <Replay
              ref="replay"
              style="paddingTop: 20px;"
              v-show="formValidate.isReply"
              :replayList="filtReplyList(formValidate.qrCodeReplyList)"></Replay>
          </FormItem>
        </Form>
      </div>
      </BScroll>
      <div class="qrcode-footer-btn" slot="footer">
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </div>
    </PageMain>

    <Tag
      v-model="tagVisible"
      :params="{selectedTag: formValidate.tagIdList}"
      @on-success="getSelectedTags"
    ></Tag>
    <Modal v-model="visible" title="保存提示" :mask-closable="false">
      <div class="actionWrapper">正在生成渠道二维码，该过程可能需要一定时间，您可在二维码列表中手动刷新查看已生成的二维码。</div>
      <div slot="footer" class="modal-footer">
        <Button type="primary" @click="onSaveOk">知道了</Button>
      </div>
    </Modal>
    <!-- 离开页面时的弹框提示 -->
    <exit-page-modal></exit-page-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex"
import formMixin from "./formMixin.js"
import StaffTree from "@/components/staffTree/treePicker"
import Tag from "./tag"
export default {
  name: "create-qr-code",
  components: {
    HeaderTitle: () => import("@/components/pageStyle/headerTitle.vue"),
    HeaderSubtitle: () => import("@/components/pageStyle/headerSubtitle.vue"),
    PragraphTitle: () => import("@/components/pageStyle/pragraphTitle.vue"),
    PageMain: () => import("@/components/pageStyle/pageMain.vue"),
    RemindText: () => import("@/components/pageStyle/remindText.vue"),
    dayTimeSelect: () => import("@/components/dayTimeSelect.vue"),
    Replay: () => import("@/components/mediaTemplate/replay"),
    StaffTree,
    Tag
  },
  computed: {
    ...mapGetters({
      currPublic: "publicAccount/curPublic",
      getQrCodeThemeName: "markting/getQrCodeThemeName",
      getQrcodeGroupList: "markting/getQrcodeGroupList",
      qrcodeDefaultGroupId: "markting/qrcodeDefaultGroupId",
      getCurrentQrCode: "markting/getCurrentQrCode" // 要修改的内容
    }),
    hasNoTagsSelect() {
      return (
        !this.formValidate.tagIdList.length &&
        this.preSelectTags &&
        this.autoTags
      )
    },
    isModify() {
      return this.pageType
    },
    selectDeptAndStuff() {
      return (
        this.formValidate.customerServiceDeptIdList.length +
        this.formValidate.customerServiceSeatIdList.length
      )
    }
  },
  watch: {
    currPublic() {
      this.$router.push({ name: "qrcodeTheme" })
    }
  },
  mixins: [formMixin],
  data() {
    return {
      showAutoTag: true,
      visible: false,
      qrCodeThemeId: null,
      tagVisible: false,
      preSelectTags: false,
      pageType: false, // false 创建
      qrCodeId: null,
      validityPeriodType: 0,
      defaultServiceSeatList: {
        department: [],
        stuff: [],
        stuffAndDept: []
      }
    }
  },
  created() {
    this.judgeSelectTags()
    // 获取二维码主题id
    this.qrCodeThemeId = parseInt(this.$route.params.themeId)
    this.pageType = !!this.$route.query.id
    this.qrCodeId = parseInt(this.$route.query.id)
    if (this.pageType) {
      this.renderContent()
    }
  },
  mounted() {
    this.getTagsByWx({ appAccountIds: [this.currPublic.appAccountId] })
  },
  methods: {
    ...mapMutations({
      setCurrentQrCode: "markting/SET_CURRENT_QR_CODE"
    }),
    ...mapActions({
      getTagsByWx: "fans/getTagsByWx",
      queryGchannelQrCodeById: "markting/queryGchannelQrCodeById",
      updateGchannelQrCode: "markting/updateGchannelQrCode"
    }),
    judgeSelectTags() {
      this.showAutoTag = this.localStorageSaveOrRead("menuTree").includes('二维码的自动打标签功')
    },
    // 修改时数据回填
    async renderContent() {
      // 获取数据
      let res = await this.queryGchannelQrCodeById({
        appAccountId: this.currPublic.appAccountId,
        id: this.qrCodeId
      })
      if (res.code === 1) {
        this.formatData(res.data)
      } else {
        this.$Message.error("修改数据加载失败！")
      }
    },

    // 选择员工
    saveStuff(data) {
      this.$set(
        this.formValidate,
        "employeeIdList",
        data.stuff.map(item => item.id)
      )
    },
    // 选择客服、部门
    saveStuffAndDept(data) {
      this.$set(
        this.formValidate,
        "customerServiceSeatIdList",
        data.stuff.map(item => item.id)
      )
      this.$set(
        this.formValidate,
        "customerServiceDeptIdList",
        data.department.map(item => item.id)
      )
      this.$set(
        this.formValidate,
        "customerServiceIdList",
        data.stuffAndDept.map(item => item.id)
      )
    },
    // 选择标签
    selectTags() {
      this.preSelectTags = true
      this.tagVisible = true
    },
    getSelectedTags(data) {
      this.formValidate.tagIdList = data
    },
    onSaveOk() {
      if (this.$route.meta.leaveIntercept !== undefined) {
        this.$route.meta.leaveIntercept = false
      }
      this.visible = false
      this.$router.push({
          name: 'qrcodeList',
          params: { id: this.qrCodeThemeId }
      })
    },
    // 清空缓存的二维码数据
    clearCurrentQrCode() {
      this.setCurrentQrCode({})
    },
    // 格式化二维码详情数据
    formatData(data) {
      const {
        customerServiceType,
        isReply,
        qrCodeEffectiveDate,
        qrCodeName,
        deptOrSeatDtos,
        fansTags,
        replyDate
      } = data
      const serviceType = {
        1: "SEAT_OR_DEPT_SPECIFIED",
        3: "UMLIMITED",
        4: "UNSPECIFIED"
      }
      let customerServiceIdList = []
      let customerServiceDeptIdList = []
      let customerServiceSeatIdList = []
      if (customerServiceType) {
        // 客服类型
        const customerServiceList = (deptOrSeatDtos || []).map(item => {
          return {
            id: item.id,
            title: item.name,
            type: item.type ? "stuff" : "department"
          }
        })
        const customerServiceDeptList = customerServiceList.filter(
          item => item.type === 'department'
        )
        const customerServiceSeatList = customerServiceList.filter(
          item => item.type === 'stuff'
        )
        this.defaultServiceSeatList = {
          department: customerServiceDeptList,
          stuff: customerServiceSeatList,
          stuffAndDept: customerServiceList
        }
        customerServiceIdList = customerServiceList.map(item => item.id)
        customerServiceDeptIdList = customerServiceDeptList.map(
          item => item.id
        )
        customerServiceSeatIdList = customerServiceSeatList.map(
          item => item.id
        )
      }
      this.formValidate = {
        qrCodeName,
        qrCodeType: qrCodeEffectiveDate ? "QR_STR_SCENE" : "QR_LIMIT_STR_SCENE",
        qrCodeEffectiveDate,
        qrCodeCreateType: "EMPLOYEE_ID_LIST",
        createNum: 1,
        employeeIdList: [],
        customerServiceType: serviceType[customerServiceType], // SEAT_OR_DEPT_SPECIFIED：指定客服 + 指定部门 UMLIMITED：不限 UNSPECIFIED：不指定
        customerServiceIdList, // 客服和部门集合
        customerServiceDeptIdList,
        customerServiceSeatIdList,
        tagIdList: fansTags || [],
        isReply: !!isReply, // 0, 1
        qrCodeReplyList: replyDate || []
      }
      this.autoTags = !!(fansTags && fansTags.length)
    },
    // 转化回复内容数据格式
    filtReplyList(cont) {
      let list = []
      cont.forEach((v,i) => {
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
.markting-create-qr-code
  padding-bottom 80px
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
</style>
