import {
  queryTaskList, // 获取接待任务列表
  updateIntelligentReceptionTask, // 修改智能接待任务
  deleteIntelligentReceptionTask, // 删除智能接待任务
} from '@/api/markting.js'

export default {
  props: ['curPublic', 'scenesMode', 'config'],
  data() {
    return {
      keys: {
        hz: 'XDS_INTELLIGENT_RECEPTION_RATE', // 频率
        pattern: 'XDS_INTELLIGENT_RECEPTION_MODE', // 模式
        scene: 'XDS_INTELLIGENT_RECEPTION_SCENES', // 场景
        switch: 'XDS_INTELLIGENT_RECEPTION_SWITCH', // 场景开关
      },
      patternKey: ['GENERAL_MODE', 'INTERACTIVE_SCENE_MODEL'], // 模式对应的key
      hz: null, // 发送频率
      hzList: null, // 频率选项组
      nowDex: null, // 当前操作项索引
      datas: [], // 任务列表
    }
  },
  computed: {
    nowData() { // 当前操作项
      return this.datas[this.nowDex]
    }
  },
  watch: {
    config(nv) {
      this.hz = nv.rate
    }
  },
  methods: {
    dataDict(key, callback) { // 数据字典
      this.queryTItemValueByPager({
        itemKey: key
      }).then(res => {
        if (res.code === 1) {
          callback(res.data)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    initHz() {
      this.dataDict(this.keys.hz, dat => {
        this.hzList = dat.sort((a, b) => { // 排序
          return a.itemIdx - b.itemIdx
        })
      })
      if (this.config) {
        this.hz = this.config.rate
      }
    },
    getTaskList(params, callback) { // 获取任务列表函数
      queryTaskList({
        appAccountId: this.curPublic.appAccountId,
        ...params
      }).then(res => {
        if (res.code === 1) {
          let dat = res.data
          dat.forEach(v => {
            v.status = v.status === 'ACTIVE'
          })
          dat = dat.sort((a, b) => {
            return a.sequenceNumber - b.sequenceNumber
          })
          callback(dat)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    delTask(id) { // 删除任务
      deleteIntelligentReceptionTask({
        appAccountId: this.curPublic.appAccountId,
        id: id
      }).then(res => {
        if (res.code === 1) {
          this.$Message.success('删除任务成功')
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    upStatus(status) { // 修改任务开启状态
      let arr = ['GENERAL_MODE', 'INTERACTIVE_SCENE_MODEL']
      updateIntelligentReceptionTask({
        id: this.nowData.id,
        appAccountId: this.nowData.appAccountId,
        scenesMode: arr[this.nowData.scenesMode - 1],
        scenes: this.config.scenesMode === 2 ? this.nowData.scenes : null,
        intervals: this.nowData.intervals,
        status: status ? 'ACTIVE' : 'DISABLED',
        msgType: this.nowData.msgType,
        content: this.nowData.content
      }).then(res => {
        if (res.code === 1) {
          this.$Message.success('修改任务成功')
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    hand(typ, dex) { // 列表项操作函数
      this.nowDex = dex
      switch (typ) {
        case 'updata': // 修改
          this.creat(this.nowData.id)
          break
        case 'status': // 状态变更
          this.$emit('mutual', typ, !this.nowData.status, this.upStatus)
          break
        case 'delete': // 删除
          this.$emit('mutual', typ, this.datas[dex].id, this.delTask)
          break
      }
    },
    go(query) { // 点击新建任务按钮
      if (!query.id && query.id !== 0) {
        if (this.datas.length >= 10) {
          this.$Message.error('新建失败，最多只能新建10条')
          return
        }
      }
      let obj = { path: 'createTask' }
      if (query) { obj.query = query }
      this.$router.push(obj)
    }
  }
}
