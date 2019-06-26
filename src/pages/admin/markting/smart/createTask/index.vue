<template>
  <!-- 智能接待》新建任务 -->
  <div id="createTask" class="smart-page">
    <BScroll class="smart-scroll">
    <!-- 页面标题与导航 -->
    <HeaderTitle>智能接待</HeaderTitle>
    <HeaderSubtitle>
      <p>
        <i @click="back" style="cursor: pointer">{{last}}</i> /
        <span>新建任务</span>
      </p>
    </HeaderSubtitle>
    <!-- 主体 -->
    <Form class="task-form" label-position="left" :label-width="85">

      <FormItem label="状态">
        <i-switch v-model="iSwitch"></i-switch>
        <span class="hint gray_color">开启后，粉丝触发互动事件后将会逐条发送设置的任务消息。关闭后不自动发送任务消息。</span>
      </FormItem>

      <FormItem label="间隔时间">
        <Select v-model="hour.value" style="width: 60px; text-align:center;">
          <Option v-for="v in hour.list" :value="v" :key="v">{{v}}</Option>
        </Select>
        <span>&nbsp;小时&nbsp;</span>
        <Select v-model="minute.value" :disabled="minute.disabled" style="width: 60px; text-align:center;">
          <Option v-for="v in minute.list" :value="v" :key="v">{{v}}</Option>
        </Select>
        <span>&nbsp;分</span>
        <span class="hint gray_color">根据系统任务排队发送等原因，粉丝实际收到的时间可能会有延迟。</span>
      </FormItem>

      <FormItem label="发送内容">
        <edit
          :messageContent="content"
          :errNoData="editStatus"
          :errText="errText"
          @sendType="setType"
        ></edit>
      </FormItem>

      <FormItem label="" class="task-btns">
        <Button type="primary" size="small" @click="save">保存</Button>
        <Button @click="cancel">取消</Button>
      </FormItem>
    </Form>
    </BScroll>
  </div>
</template>

<script>
  import {
    // deleteIntelligentReceptionTask, // 删除智能接待任务
    // updateQueryIntelligentReception, // 获取智能接待配置信息
    // updateScenesSet, // 修改智能接待配置信息
    queryTaskList, // 获取接待任务列表
    canSaveTask, // 判断是否能新建接待任务
    saveIntelligentReceptionTask, // 新建智能接待任务
    updateIntelligentReceptionTask, // 修改智能接待任务
  } from '@/api/markting.js'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        last: '', // 页面导航文本
        iSwitch: true, // 状态
        hour: { // 小时
          list: [],
          value: 0
        },
        minute: { // 分钟
          list: [],
          value: 10,
          disabled: false
        },
        content: {text: '', key: 'text'}, // 编辑器内容
        editStatus: 1, // 编辑器状态
        errText: ['请输入回复内容', '不能超过600个字符'], // 编辑器提示语
        nowTask: null, // 当前任务详情
      }
    },
    components: {
      HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
      HeaderSubtitle: () => import('@/components/pageStyle/headerSubtitle.vue'),
      edit: () => import('@/pages/admin/tencent/components/WechatContent/menuContentType.vue')
    },
    mounted() {
      this.init()
      this.$root.Bus.$on('messageChange', (dat, typ, type, len) => { // 获取编辑器内容
        this.content[typ] = dat
        this.content.len = len || null
        this.editStatus = 1
      })
    },
    watch: {
      hour: {
        deep: true,
        handler(nv) {
          if (nv.value >= 48) {
            this.minute.value = 0
            this.minute.disabled = true
          } else {
            this.minute.disabled = false
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        curPublic: 'publicAccount/curPublic'
      })
    },
    methods: {
      init() {
        this.canSave()
        this.initTime()
        if (this.$route.query.id) {
          this.getTask()
        }
        let text = this.$route.query.text
        this.last = text ? `互动场景模式(${text})` : '通用模式'
      },
      initTime() { // 初始化时间选择器数据
        for (let i = 0; i <= 50; i++) {
          if (i <= 48) {
            this.hour.list.push(i)
          }
          if (i % 10 === 0) {
            this.minute.list.push(i)
          }
        }
      },
      setType(typ) { // 编辑器类型切换
        this.content.key = typ
        this.content[typ] = this.content[typ] || ''
        this.editStatus = 1
      },
      audit() { // 编辑器输入验证
        let regExp = /(<\/?[a-z]+[^>]*\/?>)|(&nbsp;)|(\\n)/g
        if (this.content.key === 'text' && this.content.len < 0) {
          this.editStatus = 3 // 1: 正常 2：菜单内容为空 3：自定义text类型的文本超过设置长度
          return false
        } else {
          let cont = this.content[this.content.key] || ''
          if (typeof cont === 'string') {
            cont = cont.replace(regExp, '')
          }
          if (cont === '') {
            this.editStatus = 2
            return false
          } else {
            this.editStatus = 1
            return true
          }
        }
      },
      canSave() { // 判断能否新建任务
        if (this.$route.query.id !== undefined) { return true }
        canSaveTask({
          scenes: this.$route.query.scenes,
          scenesMode: this.$route.query.scenesMode,
          appAccountId: this.curPublic.appAccountId
        }).then(res => {
          //  && res.code !== 5205
          if (res.code !== 1) {
            this.$Message.error(res.message)
            // this.$Message.error('新建失败，最多只能新建5条')
          }
        })
      },
      getTask() { // 获取当前修改任务数据
        queryTaskList({
          appAccountId: this.curPublic.appAccountId,
          scenesMode: this.$route.query.scenesMode,
          scenes: this.$route.query.scenes || null
        }).then(res => {
          if (res.code === 1) {
            let list = res.data
            if (list && list.length) {
              this.nowTask = list.filter(v => v.id === Number(this.$route.query.id))[0]
              let cont = this.nowTask.content
              if (this.nowTask.msgType === 'text') {
                cont = cont.replace(/\\n/g, '<br>')
              }
              this.iSwitch = this.nowTask.status === 'ACTIVE'
              this.minute.value = this.nowTask.intervals % 60
              this.hour.value = Math.floor(this.nowTask.intervals / 60)
              this.content.key = this.nowTask.msgType
              this.content[this.nowTask.msgType] = cont
            }
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      doCreate(params) { // 新建任务
        saveIntelligentReceptionTask(params).then(res => {
          if (res.code === 1) {
            this.$Message.success('新建任务成功')
            this.back()
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      doUpdata(params) { // 修改任务
        updateIntelligentReceptionTask(params).then(res => {
          if (res.code === 1) {
            this.$Message.success('修改任务成功')
            this.back()
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      save() { // 点击保存
        if (!this.audit()) { return }
        let id = this.$route.query.id || null
        let cont = this.content[this.content.key]
        if (this.content.key === 'text') {
          cont = cont.replace(/<br>/g, '') // 过滤<br>
        }
        let params = {
          id: id,
          appAccountId: this.curPublic.appAccountId,
          scenesMode: this.$route.query.scenesMode,
          scenes: this.$route.query.scenes,
          intervals: this.hour.value * 60 + this.minute.value,
          status: this.iSwitch ? 'ACTIVE' : 'DISABLED',
          msgType: this.content.key,
          content: cont
        }
        console.log(cont)
        // return
        if (id) {
          this.doUpdata(params)
        } else {
          this.doCreate(params)
        }
      },
      cancel() { // 取消
        this.back()
      },
      back() { // 返回列表页并显示相应场景列表
        // let obj = { path: '/admin/markting/smart/taskList' }
        // const scenes = this.$route.query.scenes
        // if (scenes) {
        //   obj.query = { scenes: scenes }
        // }
        // this.$router.push(obj)
        window.history.back()
      }
    },
  }
</script>

<style lang="stylus">
#createTask
  .headerSubtitle>p
    >i
      color: #303133
      &:hover
        color: #409eff
    >span
      color: #606366
      font-weight: normal
  .task-form
    .hint
      font-size: 14px
      margin-left: 20px
    a
      color: #409eff
  .task-btns
    padding-top: 16px
    padding-bottom: 40px
    button
      width: 110px
      height: 40px
      margin-right: 28px
</style>
