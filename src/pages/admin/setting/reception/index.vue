<template>
  <!-- 接待组设置 -->
  <div class="relative reception">
    <!-- 公众号切换 -->
    <div class="public-box" v-if="publicStatus !== 1 && publicStatus!== 2">
      <publicCut></publicCut>
    </div>
    <!-- 公众号状态验证 -->
    <!-- <public-verify v-model="publicStatus"></public-verify> -->
    <!-- 主体 -->
      <template v-if="publicStatus === 0">
        <div class="reception-box">
          <BScroll class="reception-scroll">
            <div class="title-box">
              <div class="title_public">接待组设置</div>
            </div>
            <!-- 页头 -->
            <div class="reception-tit">
              <i-switch
                class="witch fr"
                v-model="witch"
                true-value="1"
                false-value="0"
                @on-change="switchChange"
              ></i-switch>
              <h3>接待组客服</h3>
              <p class="lightGray_color">用于接待无所属客服的粉丝。接待组关闭后，表示无论是派单还是抢单模式都分配给在线的客服。
                开启后在派单模式下平均分配给接待组客服，在抢单模式下，给所有在线的客服抢单。
              </p>
            </div>
            <!-- 客服设置 -->
            <setServices
              :tit="tit"
              :cont="cont"
              :selec="selec"
              :showRadio="showRadio"
              @change="change"
              @send="send"
            ></setServices>
          </BScroll>
        </div>
      </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default{
    data() {
      return {
        defineKey: 'XDS_RECEPTION_GROUP', // 当前大类key值
        keyArr: [
          'XDS_RECEPTION_GROUP_APPID',
          'XDS_CORP_RECEPTION_GROUP_SWITCH', // 开关
          'XDS_CORP_RECEPTION_GROUP_APPOINT_KF', // 选项
          'XDS_CORP_RECEPTION_GROUP_APPOINT_KF_LIST' // 指定客服
        ],
        publicStatus: 0,
        status: [], // 当前设置信息
        witch: null, // 开关状态
        num: 100, // 获取坐席数量，应该获取全部客服，但不知道数量，因此暂设为100
        selec: null, // 已选中客服编码
        showRadio: [ // 是否显示单选按钮组,单选按钮组内容及选中状态
          {
            name: '所有客服',
            value: 0,
            check: true,
          },
          {
            name: '指定客服',
            value: 1,
            check: false,
          },
        ],
        tit: [ // 表格标题
          {
            tit: '待选客服',
            note: '只显示坐席状态为正常且有当前公众号权限的坐席，如需更多，请在坐席管理中设置坐席状态。',
          },
          {
            tit: '接待组客服',
            note: ''
          }
        ],
        cont: [], // 所有客服列表
      }
    },
    components: {
      setServices: () => import("./setServices"),
      publicVerify: () => import('@/pages/admin/error/publicVerify.vue')
    },
    computed: {
      ...mapGetters({
        currPublic: "publicAccount/curPublic", // 当前公众号信息
        hasAccount: "publicAccount/hasAccount",
      })
    },
    watch: {
      currPublic() { // 当前公众号切换时重新获取坐席及选中状态
        this.init()
      }
    },
    created() {},
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getSeat()
        this.getSetting()
        // this.setSetting(this.keyArr[0], this.currPublic.appAccountId, this.getSetting)
      },
      getSeat() { // 获取坐席列表（客服列表）
        this.$get(this.Path.getSeatList, {
          limit: this.num, // 数量
          appAccountId: this.currPublic.appAccountId // 公众号id
        }).then(dat => {
          this.cont = []
          if (dat.code === 1) {
            let list = dat.data.records
            list.reverse()
            list.forEach(v => {
              if (v.status === 1) { // 取出其中坐席状态为正常的数据
                this.cont.push({
                  id: v.id, // 坐席id
                  val: true, // 是否选中
                  disabled: true, // 是否可选
                  name: v.eeName, // 姓名
                  code: v.seatNo, // 编号
                  notes: v.remark, // 备注
                  department: v.deptName, // 部门
                })
              }
            })
          } else {
            this.$Message.error(dat.message)
          }
        })
      },
      initSelect() { // 初始化单选按钮、开关及选中客服
        // console.log(this.status)
        this.witch = this.status[1].value
        if (this.status[2].value === '1') { // 指定客服
          this.showRadio[0].check = false
          this.showRadio[1].check = true
          this.selec = this.status[3].value
        } else { // 所有客服
          this.showRadio[0].check = true
          this.showRadio[1].check = false
          this.selec = ''
        }
        // console.log(this.showRadio)
      },
      getSetting() { // 获取当前设置并按keyArr的顺序进行排序
        this.post(this.Path.getReception, {
          key: this.defineKey,
          appAccountId: this.currPublic.appAccountId
        }).then(res => {
          let dat = res.data
          dat.forEach((v, i) => {
            v.key = v.key.replace(/\d+/g, '')
            let dex = this.keyArr.indexOf(v.key)
            this.status[dex] = v
          })
          this.initSelect()
        })
      },
      setSetting(key, val, msg) { // 修改设置信息
        this.post(this.Path.setReception, {
          defineKey: this.defineKey,
          appAccountId: this.currPublic.appAccountId,
          key: key,
          value: val
        }).then(res => {
          if (res.code === 1) {
            if (typeof msg === 'string') {
              this.$Message.success(msg)
            } if (typeof msg === 'function') {
              msg()
            }
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      switchChange() { // 修改启用状态
        let str = this.witch === '1' ? '启用成功' : '关闭成功'
        this.setSetting(this.status[1].key, this.witch, str)
      },
      change(val, typ) { // 单选状态改变
        // 修改选中状态
        let value = val === 1 ? ['0', '1'] : ['1', '0']
        this.showRadio.forEach((v,i) => {
          v.check = !!Number(value[i])
        })
        // this.setSetting(this.status[2].key, value[0])
        this.setSetting(this.status[2].key, val + '', this.getSetting)

        // 设置指定客服
        // if (val === 1) {
        //   this.selec = this.status[3].value
        // } else {
        //   this.selec = ''
        // }
      },
      send(list, msg) { // 进行数据交互设置接待组客服
        let val = []
        list.forEach(v => {
          val.push(v.id)
          // { id: v.id, seatNo: v.code }
        })
        // val = JSON.stringify(val)
        val = val.join(',')
        this.setSetting(this.status[3].key, val, msg)
      },
    },
  }
</script>

<style lang="stylus">
  .reception
    margin-top: 30px
    .public-box
      position: absolute
      top: 0
      left: 0
      right: 0
      padding: 10px 0
      background-color: #f2f4f5
    .reception-box
      margin-right: -20px
      position: relative
      z-index: 1
      // top: 44px
      top: 14px
      background-color: #fff
      border-radius: 3px
      .reception-scroll>div:first-child
        padding-right: 20px
      .title-box
        padding: 20px 20px 0
    .reception-tit
      padding:30px 20px
      >h3
        font-size:24px
        font-weight:normal
      >p
        font-size:14px
        margin-top:14px
      .witch
        margin-top:18px
</style>
