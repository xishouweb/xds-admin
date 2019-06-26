import dayjs from 'dayjs'
export default {
  props: ['appAccountId'],
  data() {
    return {
      seatId: null, // 当前用户坐席id
      sending: false, // 是否正在发送,用于防止连续点击发送按钮
      // 群发对象     标签 所属粉丝  全部粉丝
      massObj: ['SUBORDINATE_FANS','ALL_FANS','LABEL'],
      massNum: null, // 群发数量集
      massDetail: null, // 群发消息详情
      // 定时发送部分数据
      isTimer: 'OFF', // 是否定时发送
      date: null, // 日期
      time: null, // 时间
      dateOptions: { // 时间选择器设置不可选日期
        disabledDate(date) {
          return date && date.valueOf() < dayjs().subtract(1,'day').toDate()
        }
      },
      mod: { // 对话框相关数据
        show: true,
        text: null, // 标题、对话信息、确定按钮文本
        type: null, // 操作类型
      },
      modText: [ // 标题与对话信息
        ['提示', '当前预估人数大于剩余条数。你可修改群发对象后再发送，或者选择继续发送，继续发送将根据实际发送人数发送并消耗条数。', '继续发送'],
        ['提示', '当前群发剩余条数为0，不可群发。', '确定'],
      ],
      contactWay: ['mobile', 'wx', 'qq', 'email'],
      // contactWay: ['HAS_PHONE', 'NO_PHONE', 'HAS_WX', 'NO_WX', 'HAS_QQ', 'NO_QQ', 'HAS_EMAIL', 'NO_EMAIL']
    }
  },
  computed: {
    query() {
      return this.$route.query
    }
  },
  watch: {
    appAccountId() { // 公众号变化
      this.$router.back()
    },
    isTimer() { // 定时开关变化
      this.timeInit()
      this.$root.Bus.$emit('calcScrollHeight') // 重新计算页面高度并设置滚动条高度
    },
    radio: { // 监听单选的变化
      deep: true,
      handler() {
        this.lookNum = null
        this.massObject = null
      }
    }
  },
  methods: {
    cancel() { // 点击取消
      this.$router.back()
    },
    close() { // 点击对话框取消、关闭按钮
      this.mod.show = false
    },
    timeInit() { // 初始化时间选项
      if (!this.date) {
        if (this.isTimer === 'ON') {
          this.date = dayjs().format('YYYY-MM-DD')
          this.time = dayjs().add(10, 'minute').format('HH:mm')
        } else {
          this.date = null
          this.time = null
        }
      }
    },
    filtChange() { // 筛选条件变化
      this.massObject = null
      this.lookNum = null // 预估人数不可见
    },
    toFilter(dat) { // 将群发详情数据转换成filter组件需要的数据
      let time // 互动时间所需数据 1~7
      if (dat.convStartTime) {
        let start = dat.convStartTime.replace(' ', 'T')
        let end = dat.convEndTime.replace(' ', 'T')
        let difDay = dayjs(end).diff(dayjs(start), 'day')
        let difNow = dayjs(dayjs()).diff(dayjs(start), 'day')
        switch (difNow) {
          case 0:
            time = '1'
            break
          case 1:
            time = '2'
            break
          case 2:
            time = difDay === 2 ? '3' : '7'
            break
          case 7:
            time = difDay === 7 ? '4' : '7'
            break
          case 15:
            time = difDay === 15 ? '5' : '7'
            break
          case 30:
            time = difDay === 30 ? '6' : '7'
            break
          default:
            time = '7'
        }
        const startDate = dat.convStartTime.slice(0, 10)
        const endDate = dat.convEndTime.slice(0, 10)
        time = time === '7' ? [startDate, endDate] : time
      }
      let contact = null // 联系方式
      if (dat.contactWay && dat.contactWay.length) {
        contact = {type: 1, value: {}}
        dat.contactWay.forEach(v => {
          let key = this.contactWay[Math.ceil(v / 2) - 1]
          let val = (v % 2 === 0) ? 0 : 1
          contact.value[key] = val
        })
      }
      let area = null // 地区
      if (dat.fansArea && dat.fansArea.length) {
        area = {type: 1, value: {}}
        let a = dat.fansArea
        a.forEach(v => {
          let b = v.split(',')
          if (area.value[b[0]]) {
            area.value[b[0]].push(b[1])
          } else {
            area.value[b[0]] = [b[1]]
          }
        })
      }

      let qrcode = { // 渠道二维码
        public: this.curPublic,
        group: {},
        theme: {},
        qrcode: []
      }
      if (dat.channelQrThemeId) {
        qrcode.group.groupId = dat.channelQrThemeId.groupId
        qrcode.theme.qrCodeThemeId = dat.channelQrThemeId.channelQrThemeId
      }
      if (dat.channelQrCodeIds) {
        dat.channelQrCodeIds.forEach(v => {
          qrcode.qrcode.push(v.channelQrCodeId)
        })
      }

      let poster = { // 裂变海报
        public: this.curPublic,
        group: {},
        poster: []
      }
      if (dat.fansPosterTemplateIds) {
        poster.group.groupId = dat.fansPosterTemplateIds[0].groupId
        dat.fansPosterTemplateIds.forEach(v => {
          poster.poster.push(v.fansPosterTemplateId)
        })
      }

      this.filterCont = {
        tagValue: dat.existTags === 2 ? 'NO_TAGS' : dat.tagIdList || '',
        kfSeatId: dat.kfSeatId || [] ,
        fansOrigin: dat.subscribeScene || [], // 来源
        time: time,
        status: dat.subscribe || '*', // 关注状态
        sex: dat.sex || '*',
        conversation: { // 互动次数
          vertical: dat.conversationMinNum || dat.conversationMaxNum ? 'rangeValue' : '',
          min: dat.conversationMinNum,
          max: dat.conversationMaxNum
        },
        age: { // 年龄
          vertical: dat.minAge || dat.maxAge ? 'rangeValue' : '',
          min: dat.minAge,
          max: dat.maxAge
        },
        contactWay: contact, // 联系方式
        fansArea: area, // 地区
        fsGroupId: dat.fsGroupId || [], // 分组
        qrcodeObj: qrcode, // 渠道二维码
        posterObj: poster, // 裂变海报
      }
      if (dat.existKfSeatId === 2) {
        this.filterCont.kfSeatId.unshift("NO_KF_SEAT_ID")
      }
    },
    getMassNum() { // 获取剩余群发次数
      this.post(this.Path.getMassNum, {
        appAccountId: this.appAccountId,
        groupType: this.massType[this.pageDex]
      }).then(res => {
        if (res.code === 1) {
          let countNum = res.data.countNum || 0
          let sendNum = res.data.sendNum || 0
          this.massNum = [countNum, sendNum, countNum - sendNum]
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    getSeatId() { // 获取当前用户的坐席id
      this.post(this.Path.getSeatId).then(res => {
        if (res.code === 1) {
          this.seatId = res.data.seatId
          if (!this.seatId) { this.radio.val = 1 } // 当没有分配坐席时，默认选中全部粉丝
        } else {
          this.seatId = null
          this.radio.val = 1
          this.$Message.error(res.message)
        }
      })
    },
  }
}
