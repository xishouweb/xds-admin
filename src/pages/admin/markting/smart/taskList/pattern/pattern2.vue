<template>
  <!-- 模式二：互动场景模式 -->
  <div id="pattern2">
    <!-- 提示信息 -->
    <page-remind class="remind-box">
      <p>
        1、根据粉丝与公众号不同的互动场景，各场景可分别设置智能接待的任务消息并定时发送，单个场景的任务消息最多可创建5条。<br>
        2、粉丝触发了不同互动场景后，以粉丝第一次触发的场景对应任务消息发送，其他互动场景则不发送任务消息。<br>
        3、当客服给粉丝主动回复消息或粉丝主动发送消息后，不发送智能接待任务消息。<br>
        4、在设置的发送频率范围内粉丝触发相同互动场景对应的任务消息只发送一次，发送频率范围内触发相同互动场景不重复发送任务消息。<br>
      </p>
      <!-- 频率 -->
      <div class="send-hz-box">
        <select-hz v-model="hz" :text="'发送频率'" :list="hzList"></select-hz>
      </div>
    </page-remind>
    <!-- 列表部分 -->
    <div class="mod-table flex">
      <group :groupList="groups" @cut="cut" style="flex: none"></group>
      <div class="table-box">
        <div class="table-head flexB" v-if="nowGroup">
          <div>
            <h4>{{nowGroup.name}}</h4>
            <p class="gray_color">{{nowGroup.hint}}</p>
          </div>
          <i-switch v-model="nowGroup.checked" @click.native="switchTap()"></i-switch>
        </div>
        <tables :datas="datas" @create="creat" @hand="hand"></tables>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './patternMixin.js'
  export default {
    mixins: [mixin],
    data() {
      return {
        nowGroupDex: [0, 'no'], // 当前查看场景索引
        nowGroup: null, // 当前查看场景对象
        groups: null, // [显示值]类型(分组)数据
        groupList: [ // [初始值]类型(分组)数据
          {
            key: 'ORDINARY_ATTENTION_SCENE',
            needIsService: false,
            name: '普通关注场景',
            hint: '开启后，粉丝触发普通关注场景后将会逐条发送设置的任务消息。普通关注事件包含：搜索公众号关注、扫公众号二维码关注、名片分享关注、图文页内名称点击关注、图文页右上角菜单关注、其他。关闭后不自动发送任务消息。',
            num: 0,
            checked: false,
          },
          {
            key: 'SCAN_CHANNEL_QR_CODE_SCENE',
            needIsService: true,
            name: '扫渠道二维码场景',
            hint: '开启后，粉丝扫渠道二维码关注和老用户再次扫描渠道二维码后将会逐条发送设置的任务消息。关闭后不自动发送任务消息。',
            num: 0,
            checked: false,
          },
          {
            key: 'SCAN_FANS_POSTER_SCENE',
            needIsService: true,
            name: '扫裂变海报场景',
            hint: '开启后，粉丝扫裂变海报关注和老用户再次扫描裂变海报后将会逐条发送设置的任务消息。关闭后不自动发送任务消息。',
            num: 0,
            checked: false,
          },
          {
            name: '粉丝来访场景',
            needIsService: false,
            child: [
              {
                key: 'CLICK_MENU_SCENE',
                needIsService: false,
                name: '点击菜单场景',
                hint: '开启后，粉丝点击公众号菜单后将会逐条发送设置的任务消息。关闭后不自动发送任务消息。',
                num: 0,
                checked: false,
              },
              // {
              //   key: 'GET_LOCATION_SCENE',
              //   needIsService: true,
              //   name: '获取地理位置场景',
              //   hint: '开启后，公众号获取到粉丝地理位置后将会逐条发送设置的任务消息。关闭后不自动发送任务消息。',
              //   num: 0,
              //   checked: false,
              // },
            ]
          },
          {
            key: 'PAYMENT_SUCCESS_SCENE',
            needIsService: true,
            name: '支付后关注场景',
            hint: '开启后，公众号开通微信支付且用户支付成功后关注公众号将会逐条发送设置的任务消息。关闭后不自动发送任务消息。',
            num: 0,
            checked: false,
          },
        ],
      }
    },
    components: {
      pageRemind: () => import('@/components/pageStyle/headerRemind.vue'),
      tables: () => import('../components/tables/tables.vue'),
      selectHz: () => import('../components/selectHz.vue'),
      group: () => import('../components/groups.vue')
    },
    watch: {
      'curPublic.appAccountId': {
        handler() {
          sessionStorage.setItem('scene', '[0, "no"]')
          this.nowGroupDex = [0, 'no']
          this.init()
        }
      },
      config() {
        this.init()
      }
    },
    computed: {
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.initHz()
        if (!this.curPublic.appAccountId || !this.config) { return }
        this.filtGroups()
        this.dataDict(this.keys.scene, dat => { // 获取场景数据
          // 渲染场景对应的任务数量及开关状态
          let list = this.config.sceneslist
          if (list && list.length) {
            list.forEach(v => {
              this.groups.forEach((k, i) => {
                let child = k.child
                if (child && child.length) {
                  child.forEach((s, j) => {
                    if (s.key === v.scenes) {
                      s.num = v.num
                    }
                  })
                } else if (k.key === v.scenes) {
                  k.num = v.num
                }
              })
            })
          }
          this.getNowGroup() // 获取当前场景对象
          this.queryTasks() // 获取任务列表
        })
      },
      filtGroups() { // 过滤场景（部分场景只能在服务号下使用）
        this.groups = this.deepCopy(this.groupList)
        if (this.curPublic.serviceTypeInfo !== 2) {
          this.groups = this.groups.filter(v => {
            if (v.child) { // 有二级分组
              v.child = v.child.filter(k => !k.needIsService)
              return v
            } else {
              return !v.needIsService
            }
          })
        }
      },
      queryTasks(nv) { // 获取当前场景的任务列表
        let scene = this.nowGroup.key
        if (nv) { scene = nv.key }
        this.getTaskList({
          scenesMode: this.patternKey[1],
          // scenesMode: this.scenesMode,
          scenes: scene
        }, dat => {
          this.datas = dat
        })
      },
      creat(id) { // 点击新建任务按钮
        let params = {
          // scenesMode: this.scenesMode,
          scenesMode: this.patternKey[1],
          scenes: this.nowGroup.key,
          text: this.nowGroup.name
        }
        if (id) { params.id = id }
        this.go(params)
      },
      cut(i, j) { // 场景切换函数
        this.nowGroupDex = [i, j]
        sessionStorage.setItem('scene', JSON.stringify(this.nowGroupDex))
        this.getNowGroup()
        this.queryTasks(this.nowGroup)
      },
      getNowGroup() { // 获取当前查看场景对象
        this.clearCheck()
        let [i, j] = this.nowGroupDex
        if (j !== 'no') {
          this.nowGroup = this.groups[i].child[j]
        } else {
          this.nowGroup = this.groups[i]
        }
        this.nowGroup.checked = true
      },
      clearCheck() { // 清除选中状态
        this.groups.forEach(v => {
          const child = v.child
          if (child) {
            child.forEach(k => {
              k.checked = false
            })
          } else {
            v.checked = false
          }
        })
      },
      switchTap() { // 点击场景状态切换按钮
        setTimeout(() => {
          this.nowGroup.checked = !this.nowGroup.checked
        }, 60)
        this.$emit('mutual', 'patStatus', !this.nowGroup.checked, this.nowGroup)
      },
    },
  }
</script>

<style lang="stylus">
#pattern2
  .remind-box
    color: #606366
    font-size: 12px
    position: relative
  .send-hz-box
    position: absolute
    right: 20px
    bottom: 10px
  .mod-table
    padding-top: 30px
    .table-box
      width: calc(100% - 210px)
      min-height: 500px
      margin-left: 20px
      .table-head
        border-bottom: 1px solid #e3e4e6
        h4
          font-size: 24px
          font-weight: normal
        p
          font-size: 12px
          line-height: 1.5
          padding: 10px 0 16px
</style>
