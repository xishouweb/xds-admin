<template>
  <!-- 新建、修改模板消息群发 -->
  <div>
    <BScroll :offsetBottom="80">
      <div style="padding-right: 20px;">
        <div class="title_public">新建模板消息群发</div>
        <div class="create-cont">
          <Form ref="form" :model="form" :label-width="114" label-position="left">
            <!-- 群发名称 -->
            <FormItem class="createMass-item flex-item" prop="name" label="群发名称" :rules="rule">
              <Input v-model="form.name" placeholder="请输入群发名称，不超过15个汉字" style="width: 360px"/>
              <!-- v-show="!form.valid" -->
              <p class="notes">群发名称仅用于本系统群发记录中标识显示，粉丝接收到的消息不显示群发名称，字数不超过15个汉字。</p>
            </FormItem>
            <!-- 发送内容 -->
            <FormItem class="createMass-item" label="发送内容">
              <div class="template-box" style="width: 420px">
                <temp-edit :status="editStatus" :temp="selectTemp" :insert="['[粉丝昵称]']" @submit="submit"></temp-edit>
              </div>
            </FormItem>
            <!-- 选择群发对象 -->
            <FormItem class="createMass-item" label="选择群发对象">
              <RadioGroup v-model="radio.val" class="obj-radio">
                <Radio v-for="(v,i) in radio.list" :label="i" :key="i" :disabled="!seatId && i === 0">{{v}}</Radio>
              </RadioGroup>

              <filt ref="filt" :radioVal="radio.val" :filterCont="filterCont" @filtChange="filtChange"></filt>
              <!-- 预估人数 -->
              <div class="predict-box">
                <p class="word">
                  <span>预估人数</span>
                  <Poptip trigger="hover" placement="right">
                    <a> <i class="icon">&#xe635;</i> </a>
                    <p slot="content" style="font-size: 14px">
                      目标人数与实际发送成功人数可能会不同，可能会是以下原因：<br>
                      1、群发时粉丝互动已超过48小时。<br>
                      2、粉丝已取消关注。<br>
                      3、公众号授权状态异常。<br>
                      4、群发时素材缺失（例如：群发图片已删除）<br>
                      5、公众号在其他第三方平台也设置了客服消息导致冲突。<br>
                      6、当日累计客服消息次数达到50万上限。
                    </p>
                  </Poptip>
                </p>
                <p v-show="lookNum !== null">{{lookNum}}</p>
                <div class="lookOver" v-show="lookNum === null" @click="look">点击查看</div>
              </div>
            </FormItem>
            <!-- 定时发送 -->
            <FormItem class="createMass-item timer" prop="" label="定时发送">
              <div class="switch-box flex">
                <i-switch true-value="ON" false-value="OFF" v-model="isTimer"></i-switch>
                <p>实际发送到粉丝微信时间因群发排队时间等原因，可能会与设定的时间有延迟。</p>
              </div>
              <div class="time" v-show="isTimer === 'ON'">
                <DatePicker
                  v-model="date"
                  :options="dateOptions"
                  format="yyyy/MM/dd"
                  type="date"
                  placement="top"
                  placeholder="选择日期"
                  style="width: 126px"
                ></DatePicker>
                <TimePicker
                  v-model="time"
                  format="HH:mm"
                  size="default"
                  placement="top"
                  placeholder="选择时间"
                  style="width: 110px"
                ></TimePicker>
              </div>
              <div class="timeNote" v-if="isTimer === 'ON'">
                <p>你可设置最低10分钟之后的发送时间，在设定的时间之前可修改群发消息，取消后不占用群发条数。</p>
              </div>
            </FormItem>
            <!-- 按钮 -->
            <FormItem class="createMass-item create-btn">
              <Button type="primary" @click="send">{{isTimer === 'ON' ? '定时群发' : '立即发送'}}</Button>
              <Button @click="cancel">取消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </BScroll>
    <!-- 对话框 -->
    <new-modal
      v-if="mod.text"
      v-model="mod.show"
      :header="mod.text[0]"
      :content="mod.text[1]"
      :confrim="mod.text[2]"
      @ok="ok"
      @close="close"
      @cancel="close"
    ></new-modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import mixin from './createMassMixin.js'
  // import { filterTags, addTags } from "@/utils/textHtmlChange"
import { filterTags, addTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
  export default {
    mixins: [mixin],
    data() {
      const nameValid = (rele, val, callback) => {
        if (val || val.length) {
          if (val.length > 15) {
            this.form.valid = true
            callback(new Error('不能超过15个字。'))
          } else {
            this.form.valid = false
            callback()
          }
        } else {
          this.form.valid = true
          callback(new Error('请输入群发名称。'))
        }
      }
      return {
        pageDex: 2, // 当前页面索引
        // 群发类型     高级群发 客服消息群发  模板消息群发
        massType: ['SENIOR_GROUP','CUSTOMER_SERVICE_GROUP','TEMPLATE_GROUP'],
        // 表单部分数据
        form: {name: ''}, // 群发名称
        rule: [ // 表单验证规则
          {trigger: 'blur',validator: nameValid}
        ],
        valid: false, // 表单验证结果
        selectTemp: null, // 选中的模板消息数据
        editStatus: 0, // 编辑器状态，0：正常，1：为空
        // 群发对象部分数据
        filterCont: null, // 群发对象数据(用于渲染)
        massObject: null, // 群发对象数据(用于交互)
        lookNum: null, // 预估人数
        radio: { // 单选按钮组
          val: 0,
          list: ['我的所属粉丝','全部粉丝']
        }
      }
    },
    components: {
      filt: () => import('../filter/index.vue'),
      temp: () => import('@/components/Template/index.vue'), // 选择模板组件
      messageTemp: () => import('@/components/Template/MessageTemplate.vue'), // 模板组件
      tempEdit: () => import('@/components/Template/tempEdit.vue')
    },
    computed: {
      templateId() { // 模板id
        if (this.selectTemp) {
          return this.selectTemp.templateId
        }
      },
      tempData() { // 模板消息详情
        if (this.selectTemp) {
          return this.selectTemp.templateDateList || this.selectTemp.templateDataList
        } else {
          return null
        }
      }
    },
    created() {
      // this.judgeRadioList()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getMassNum()
        this.getSeatId()
        if (this.query && this.query.id !== undefined) {
          this.getMassInfo()
        }
      },
      audit() { // 编辑器内容验证
        if (this.selectTemp) {
          this.editStatus = 0
          return true
        } else {
          this.editStatus = 1
          return false
        }
      },
      look(callback) { // 点击查看（预估人数）
        let massObject = this.massObject || this.getFilterVal()
        // 当选择我的所属客服时，添加当前用户坐席id字段
        if (this.radio.val === 0) {
          massObject.kfSeatId = [this.seatId]
        }
        this.post(this.Path.getFansCount, {
          appAccountId: this.appAccountId,
          objectContent: massObject
        }).then(res => {
          if (res.code === 1) {
            this.lookNum = res.data.count
            if (callback && typeof callback === 'function') { callback() }
          } else {
            this.$Message.error(res.code)
          }
        })
      },
      send() { // 点击发送按钮
        let val
        this.$refs['form'].validate(valid => {
          val = valid
        })
        let judge = () => {
          if (this.massNum[2] < this.lookNum) { // 次数不足
            this.mod.show = true
            this.mod.text = this.modText[0]
            this.mod.type = 'short'
          } else { // 次数足够
            this.addTemplateMass()
          }
        }
        if (this.audit() && val) {
          if (this.massNum[2] > 0) { // 剩余群发次数大于0
            if (!this.lookNum) { // 获取人数
              this.look(judge)
            } else {
              judge()
            }
          } else { // 次数为0
            this.mod.show = true
            this.mod.text = this.modText[1]
            this.mod.type = 'without'
          }
        }
      },
      ok() { // 点击对话框确定按钮
        if (this.mod.type === 'without') { // 没有群发次数
          this.close()
        } else if (this.mod.type === 'short') { // 群发次数不足
          this.addTemplateMass() // 继续发送
        }
      },
      submit(dat) { // 选择、创建模板消息后的提交模板消息后的提交
        this.selectTemp = dat
        this.audit()
      },
      getFilterVal() { // 获取选择的群发对象数据并进行预处理
        let val = this.$refs.filt.getValue()
        if (val.existKfSeatId) {
          let dex = val.kfSeatId.indexOf("NO_KF_SEAT_ID")
          if (dex >= 0) {
            val.kfSeatId.splice(dex, 1)
            val.existKfSeatId = "NO_KF_SEAT_ID"
          }
          if (!val.kfSeatId.length) {
            delete val.kfSeatId
          }
        }
        this.massObject = val
        return val
      },
      getMassInfo() { // 获取群发消息详情
        if (this.appAccountId) {
          this.post(this.Path.getMassInfo, {
            id: this.query.id,
            appAccountId: this.appAccountId
          }).then(res => {
            if (res.code === 1) {
              let dat = this.massDetail = res.data
              let list = dat.details.templateDateList || dat.details.templateDataList
              list.forEach(item => {
                item.value = addTags(item.value, 'img')
              })
              this.form.name = dat.msgName
              this.selectTemp = dat.details
              this.radio.val = dat.groupObjects - 2
              this.isTimer = dat.timeSwitch ? 'ON' : 'OFF'
              if (dat.sendTime) {
                let sendTime = dat.sendTime.split(' ')
                this.date = sendTime[0].replace('-','/')
                this.time = sendTime[1].slice(0,-3)
              }
              this.toFilter(dat.objectContent)
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      },
      addTemplateMass() { // 新增、修改模板消息
        if (this.sending) { return }
        this.sending = true
        let sendTime = this.date ? dayjs(this.date).format('YYYY-MM-DD') + ' ' + this.time + ':00' : null
        let params = {
          appAccountId: this.appAccountId,
          templateId: this.selectTemp.templateId, // 模板id
          templateName: this.selectTemp.title, // 模板名称
          linkAddress: this.selectTemp.linkAddress, // 链接地址
          msgName: this.form.name.alltrim(), // 群发名称
          groupObjects: this.massObj[this.radio.val], // 群发对象
          timeSwitch: this.isTimer, // 定时开关
          sendTime: sendTime, // 发送时间
          estimateNumber: this.lookNum || 1, // 预估人数
          groupType: this.massType[this.pageDex], // 群发类型
          objectContent: this.massObject || this.getFilterVal(), // 群发对象内容
          templateDataList: this.selectTemp.templateDateList || this.selectTemp.templateDataList,// 模板对应的值
          jumpType: this.selectTemp.jumpType,
          mpAppId: this.selectTemp.mpAppId,
          mpUrl: this.selectTemp.mpUrl,
          spareUrl: this.selectTemp.spareUrl
        }
        const list = params.templateDataList || params.templateDateList
        list.forEach(item => {
          item.value = filterTags(item.value)
        })
        if (this.query.type === 'updata') { // 修改
          params.id = this.query.id || null
        }
        this.post(this.Path.addTemplateMass, params).then(res => {
          if (res.code === 1) {
            if (this.isTimer === 'ON') {
              this.$Message.success('定时群发保存成功')
            }
            this.$router.back()
          } else {
            this.sending = false
            this.$Message.error(res.message)
          }
        })
      },
      judgeRadioList() { // 判断全部粉丝选择权限
      // 高级群发全部粉丝 客服消息群发全部粉丝 模板消息群发全部粉丝
        let pageName = this.$route.name
        let conditional = {
          createMass1: '高级群发全部粉丝',
          createMass2: '客服消息群发全部粉丝',
          createMass3: '模板消息群发全部粉丝',
        }
        console.log(pageName)
        let hasAuth = this.localStorageSaveOrRead("menuTree").includes(conditional[pageName])
        this.radio.list = hasAuth ? ['我的所属粉丝','全部粉丝'] : ['我的所属粉丝']
      }
    },
  }
</script>

<style lang="stylus">
  .create-cont
    .createMass-item
      margin-top 40px
      padding-left 20px
      .template-box
        position: relative
        border: 1px solid transparent
        width: 420px
        padding: 10px 0 0
      .obj-radio
        >label
          margin-right: 30px
      .notes
        color: #979899
        font-size: 12px
        padding-left: 20px
        // position: absolute
        // bottom: -30px
        // left: 0
      .time
        padding: 16px 0 0
        .ivu-date-picker
          margin-right: 10px
          input
            height: 32px
            text-align: center
          .ivu-input-icon
            height: 32px
            line-height: 32px
      .timeNote
        padding-top: 20px
        >p
          color: #979899
          line-height: 1
          padding-bottom:12px
    .create-btn
      margin-top: 20px
      padding-bottom: 40px
      button
        width: 110px
        margin-right: 18px
    .flex-item
      .ivu-form-item-content
        display: flex
        align-items: center
    .switch-box
      align-items: center
      >p
        color: #979899
        padding-left: 20px
// 选择群发对象部分
.predict-box
  display: flex
  align-items: center
  margin-top: 20px
  .word
    width: 100px
    margin-right: 12px
    font-size: 14px
    color: #606366
    .icon
      font-size: 14px
  .lookOver
    color: #409eff
    cursor: pointer
</style>
