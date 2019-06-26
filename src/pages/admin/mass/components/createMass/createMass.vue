<template>
  <!-- 新建、修改标准、高级、客服群发消息 -->
  <div>
    <BScroll :offsetBottom="0">
      <div style="padding-right: 20px;">
        <div class="title_public">新建{{pageTit[pageDex]}}</div>
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
              <menuContentType
                :messageContent="content"
                :errNoData="editStatus"
                :errText="errText"
                :noType="noType"
                @sendType="setType"
              ></menuContentType>
            </FormItem>
            <!-- 选择群发对象 -->
            <FormItem class="createMass-item" label="选择群发对象">
              <!-- 标准群发 -->
              <template v-if="pageDex === 0">
                <RadioGroup v-model="radio.val0" class="obj-radio flex">
                  <Radio v-for="(v,i) in radio.list0" :label="i" :key="i">{{v}}</Radio>
                  <Poptip trigger="hover" placement="right">
                    <a><i class="icon" style="font-size: 14px; margin-left: -24px;">&#xe635;</i></a>
                    <p slot="content" style="font-size: 14px">
                      标签可多选，选择多个标签后，<br>
                      按照标签选择的顺序分多次发送给粉丝，<br>
                      选择几个标签即代表消耗几条次数。
                    </p>
                  </Poptip>
                </RadioGroup>
                <tag-select v-if="radio.val0" :tagData="tagData" :isRadio="curPublic.serviceTypeInfo !== 2" @on-change="tagsChange"></tag-select>
              </template>
              <!-- 其它群发 -->
              <template v-else>
                <RadioGroup v-model="radio.val" class="obj-radio">
                  <template v-for="(v,i) in radio.list">
                    <Radio :label="i" :key="i" :disabled="!seatId && i === 0">{{v}}</Radio>
                  </template>
                </RadioGroup>
                <filt
                  ref="filt"
                  :radioVal="radio.val"
                  :filterCont="filterCont"
                  @filtChange="filtChange"
                ></filt>
              </template>
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
                <template v-if="showLookNum && lookNum === null">
                  <div class="lookOver" @click="look">点击查看</div>
                </template>
              </div>
            </FormItem>
            <!-- 定时发送 -->
            <FormItem class="createMass-item timer" prop="" label="定时发送">
              <!-- <div class="switch-box flex"> -->
                <i-switch true-value="ON" false-value="OFF" v-model="isTimer"></i-switch>
              <!-- </div> -->
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
              <div class="timeNote">
                <p>实际发送到粉丝微信时间因群发排队时间等原因，可能会与设定的时间有延迟。</p>
                <p v-if="isTimer === 'ON'">你可设置最低10分钟之后的发送时间，在设定的时间之前可修改群发消息，取消后不占用群发条数。</p>
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
  import { mapGetters } from 'vuex'
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
        pageDex: null, // 当前页面索引
        pageTit: ['标准群发','高级群发','客服消息群发','模板消息群发'], // 页面标题
        // 群发类型     高级群发 客服消息群发  模板消息群发
        massType: ['STANDARD_GROUP','SENIOR_GROUP','CUSTOMER_SERVICE_GROUP','TEMPLATE_GROUP'],
        // massType放到mixin中混入时创建、修改群发消息可以成功，但是群发列表中会失去该条信息，原因不明
        // 表单部分数据
        form: {name: '', valid: false}, // 群发名称,表单验证结果
        rule: [ {trigger: 'blur',validator: nameValid} ], // 表单验证规则
        // 编辑器部分数据
        noType: ['template', 'poster'], // 不需要的编辑类型
        editStatus: 1, // 编辑器状态 1：正常，2：内容为空，3：内容超出限制
        errText: ['请设置当前内容','不能超过600个字符'], // 编辑器警告信息
        content: {key: 'text', text: ''}, // 编辑器内容数据
        // 群发对象部分数据
        filterCont: null, // 群发对象数据(用于渲染)
        massObject: null, // 群发对象数据(用于交互)
        lookNum: null, // 预估人数
        radio: { // 单选按钮组
          val0: 0,
          list0: ['全部粉丝', '按标签选择'],
          val: 0,
          list: ['我的所属粉丝','全部粉丝']
        },
        tagData: [], // 标签数据
        selectTag: null, // 选中标签
      }
    },
    components: {
      menuContentType: () => import('../../../tencent/components/WechatContent/menuContentType'), // 编辑器组件
      filt: () => import('../filter/index.vue')
    },
    computed: {
      showLookNum() { // 控制“查看预估人数”的显示
        let bool = this.pageDex || this.radio.val0 === 0 || (this.selectTag && this.selectTag.length)
        return bool
      },
      ...mapGetters({
        curPublic: 'publicAccount/curPublic'
      })
    },
    created() {
      // this.judgeRadioList()
      this.pageDex = this.$route.meta.dex
      if (this.pageDex === 0) {
        this.getFansTagGroup()
      }
    },
    mounted() {
      this.init()
      this.$root.Bus.$on('messageChange', (dat, typ, type, len) => { // 获取编辑器内容
        this.content[typ] = dat
        if (len) { this.content.len = len }
        this.editStatus = 1
        // this.audit()
      })
    },
    methods: {
      init() {
        this.getMassNum()
        this.getSeatId()
        if (this.pageDex < 2) {
          this.noType.push('file')
        }
        if (this.query && this.query.id !== undefined) {
          this.getMassInfo()
        }
      },
      audit() { // 编辑器内容验证
        if (this.content.key === 'text' && this.content.len < 0) {
          this.editStatus = 3
          return false
        } else {
          let cont = this.content[this.content.key]
          if (cont === '') {
            this.editStatus = 2
            return false
          } else {
            this.editStatus = 1
            return true
          }
        }
      },
      setType(typ) { // 编辑类型切换
        this.content.key = typ
        this.content[typ] = this.content[typ] || ''
        this.editStatus = 1
      },
      look(callback) { // 点击查看（预估人数）
        let params = {
          appAccountId: this.appAccountId
        }
        if (this.pageDex) {
          console.log(this.massObject)
          console.log(this.getFilterVal())
          params.objectContent = this.massObject || this.getFilterVal()
          // 当选择我的所属客服时，添加当前用户坐席id字段
          if (this.radio.val === 0) {
            params.objectContent.kfSeatId = [this.seatId]
          }
        } else { // 标准群发
          if (this.radio.val0 === 1) {
            params.objectContent = {
              tagIdList: this.selectTag
            }
          } else {
            params.objectContent = {}
          }
        }
        this.post(this.Path.getFansCount, params).then(res => {
          if (res.code === 1) {
            this.lookNum = res.data.count
            if (callback && typeof callback === 'function') { callback() }
          } else {
            this.$Message.error(res.code)
          }
        })
      },
      send() { // 点击发送按钮
        if (this.pageDex === 0 && !this.showLookNum) {
          this.$Message.error('请先选择标签！')
          return
        }
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
            if (this.query.type === 'updata') { // 修改
              this.upServiceMass()
            } else { // 新增、复制
              this.addServiceMass()
            }
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
        if (this.mod.type === 'short') { // 群发次数不足
          if (this.query.type === 'updata') { // 修改
            this.upServiceMass()
          } else { // 新增、复制
            this.addServiceMass()
          }
        } else if (this.mod.type === 'without') { // 没有群发次数
          this.close()
        }
      },
      getFansTagGroup() { // 获取粉丝标签分组及标签
        this.post(this.Path.getWxGroupAndTagList, {
          appAccountId: this.appAccountId
        }).then(res => {
          if (res.code === 1) {
            let dat = res.data.fansGroupAndTagDtos || []
            dat.sort((a, b) => a.groupOrder - b.groupOrder) // 分组排序
            let dex = null
            dat.forEach((v,i) => {
              // 单个标签数据
              let tagList = []
              let tags = v.fansWxTagDtos || []
              tags.sort((a, b) => a.tagOrder - b.tagOrder) // 标签排序
              tags.forEach(k => {
                tagList.push({
                  id: k.id,
                  tagId: k.tagId, // 微信标签id
                  name: k.tagName,
                  groupId: k.groupId, // 分组id
                  count: k.count || 0, // 该标签下粉丝总数
                  status: k.status, // 状态
                  checked: false, // 是否被选中
                })
              })
              // 标签组数据
              if (v.name === '微信标签') { dex = i }
              this.tagData.push({
                id: v.id,
                name: v.name,
                status: v.status,
                groupOrder: v.groupOrder,
                count: v.fansWxTagCount || 0, // 当前分组下的标签总数
                isRadio: false, // 是否单选
                checked: [], // 选中标签列表
                tags: tagList, // 标签列表
              })
            })
            let wx = this.tagData.splice(dex, 1)
            this.tagData.sort(this.sortBy('groupOrder', 'max'))
            this.tagData.unshift(wx[0])
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      filtSelectTag(ids) { // 过滤出选中标签（标准群发）
        if (!ids || !ids.length) { return }
        this.selectTag = ids
        this.tagData.forEach(k => {
          let tags = k.tags
          tags.forEach(v => {
            if (ids.indexOf(v.tagId) >= 0) {
              v.checked = true
              k.checked.push(v)
            }
          })
        })
      },
      tagsChange(dat, ids) { // 选中标签变化事件
        this.selectTag = ids
        this.lookNum = null
      },
      getFilterVal() { // 获取选择的群发对象数据并进行预处理
        if (this.pageDex) {
          let val = this.$refs.filt.getValue()
          console.log(val)
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
        } else {
          this.massObject = { tagIdList: this.selectTag }
          return { tagIdList: this.selectTag }
        }
      },
      getMassInfo() { // 获取群发消息详情
        if (this.appAccountId) {
          this.post(this.Path.getMassInfo, {
            id: this.query.id,
            appAccountId: this.appAccountId
          }).then(res => {
            if (res.code === 1) {
              let dat = this.massDetail = res.data
              this.form.name = dat.msgName
              this.filtSelectTag(dat.objectContent.tagIdList)

              this.content.key = dat.msgType || 'text'
              let cont = dat.msgContent
              this.content[this.content.key] = cont || ''

              let val = dat.groupObjects - 2
              if (!this.pageDex) { // 标准群发
                this.radio.val0 = val < 0 ? 1 : 0
              } else { // 高级、客服群发
                this.radio.val = val
              }

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
      getParams(id) { // 处理新建、修改群发消息参数
        let sendTime = this.date ? dayjs(this.date).format('YYYY-MM-DD') + ' ' + this.time + ':00' : null
        let text = this.content[this.content.key]
        let groupObjects
        if (this.pageDex === 0) { // 标准群发
          groupObjects = this.massObj[this.radio.val0 + 1]
        } else {
          groupObjects = this.massObj[this.radio.val]
        }
        let params = {
          id: this.query.id || null,
          appAccountId: this.appAccountId,
          estimateNumber: this.lookNum, // 预估人数
          groupObjects: groupObjects, // 群发对象
          groupType: this.massType[this.pageDex], // 群发类型
          msgContent: text, // 群发内容
          msgName: this.form.name.alltrim(), // 群发名称
          msgType: this.content.key, // 消息类型
          timeSwitch: this.isTimer, // 定时开关
          sendTime: sendTime, // 发送时间
          objectContent: this.massObject || this.getFilterVal() // 群发对象内容
        }
        return params
      },
      addServiceMass() { // 新增 标准/高级/客服消息
        if (this.sending) { return }
        this.sending = true
        this.post(this.Path.addServiceMass,
          this.getParams()
        ).then(res => {
          if (res.code === 1) {
            if (this.isTimer === 'ON') {
              this.$Message.success('定时群发保存成功')
            }
            this.$router.back()
          } else {
            this.sending = false
            this.$Message.error(res.message.msgName || res.message)
          }
        })
      },
      upServiceMass() { // 修改 高级/客服消息
        if (this.sending) { return }
        this.sending = true
        this.post(this.Path.upServiceMass,
          this.getParams()
        ).then(res => {
          if (res.code === 1) {
            if (this.isTimer === 'ON') {
              this.$Message.success('定时群发保存成功')
            }
            this.$router.back()
          } else {
            this.sending = false
            this.$Message.error(res.message.msgName || res.message)
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
        width: 712px
        .hand-box
          width: 200px
          height: 122px
          color: #cacbcc
          cursor: pointer
          margin-right: 10px
          border: 1px dashed #e3e4e5
          flex-direction: column
          .icon
            color: #cacbcc
            font-size: 40px
            margin: 10px 0
        .msg-temp-box
          width: 230px
      .obj-radio
        >label
          margin-right: 30px
      .notes
        color: #979899
        font-size: 12px
        padding-left: 20px
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
  margin-top: 10px
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
