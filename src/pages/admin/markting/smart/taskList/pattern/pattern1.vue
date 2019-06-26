<template>
  <!-- 模式一：通用模式 -->
  <div id="pattern1">
    <!-- 提示信息 -->
    <page-remind class="remind-box">
      <p>
        1、粉丝与公众号产生的所有互动事件场景（包含各种关注事件场景，点击菜单事件场景，获取到粉丝地理位置事件场景，支付成功事件场景，不包含粉丝发消息场景），都统一设置智能接待任务消息并定时发送。任务消息最多可创建5条。<br>
        2、当客服给粉丝主动回复消息或粉丝主动发送消息后，不发送智能接待任务消息。<br>
        3、在设置的发送频率范围内粉丝触发互动场景对应的任务消息只发送一次，发送频率范围内触发互动场景不重复发送任务消息。<br>
      </p>
      <!-- 频率 -->
      <div class="send-hz-box">
        <select-hz v-model="hz" :text="'发送频率'" :list="hzList"></select-hz>
      </div>
    </page-remind>
    <!-- 列表部分 -->
    <div class="table-box">
      <tables :datas="datas" @create="creat" @hand="hand"></tables>
    </div>
  </div>
</template>

<script>
  import mixin from './patternMixin.js'
  export default {
    mixins: [mixin],
    data() {
      return {}
    },
    components: {
      pageRemind: () => import('@/components/pageStyle/headerRemind.vue'),
      tables: () => import('../components/tables/tables.vue'),
      selectHz: () => import('../components/selectHz.vue')
    },
    watch: {
      config() {
        this.init()
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.initHz()
        this.queryTasks()
      },
      creat(id) { // 点击新建任务按钮
        let params = {
          scenesMode: this.patternKey[0]
          // scenesMode: this.scenesMode,
          // scenes: this.nowGroup.key
        }
        if (id) { params.id = id }
        this.go(params)
      },
      queryTasks() { // 获取当前任务列表
        this.getTaskList({
          scenesMode: this.patternKey[0]
          // scenesMode: this.scenesMode,
          // scenes: this.nowGroup.key
        }, dat => {
          this.datas = dat
        })
      }
    },
  }
</script>

<style lang="stylus">
  .send-hz-box
    position: absolute
    right: 20px
    bottom: 10px
  #pattern1
    .remind-box
      color: #606366
      font-size: 12px
      position: relative
    .table-box
      height: 400px
      min-height: 500px
      padding-top: 20px
</style>
