<template>
  <!-- 智能接待》任务列表 -->
  <div class="smart-page">
    <header-title class="smart-title">智能接待</header-title>
    <BScroll class="smart-scroll" :offsetBottom="100">
      <!-- 单选按钮组 -->
      <div class="task-radio">
        <RadioGroup v-model="pattern">
          <template v-for="(v, i) in radios">
            <Radio :key="i" :label="i" @click.native.prevent="radioTap(i)">
              <span>{{v.itemName}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </div>
      <!-- 列表部分 -->
      <template v-if="radios && pattern === 0">
        <pattern1
          :curPublic="curPublic"
          :scenesMode="radios[0].itemKey"
          :config="config"
          @mutual="mutual"
          @updataHz="updataHz"
        ></pattern1>
      </template>
      <template v-if="radios && pattern === 1">
        <pattern2
          :curPublic="curPublic"
          :scenesMode="radios[1].itemKey"
          :config="config"
          @mutual="mutual"
          @updataHz="updataHz"
        ></pattern2>
      </template>
    </BScroll>
    <!-- 对话框 -->
    <new-modal
      v-model="modal.show"
      :header="modal.header"
      :content="modal.content"
      :confrim="modal.okText"
      @ok="ok"
    ></new-modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import {
    updateQueryIntelligentReception, // 获取智能接待配置信息
    updateScenesSet, // 修改智能接待配置信息
  } from '@/api/markting.js'
  export default {
    data() {
      return {
        radios: null, // 单选按钮组数据（接待模式）
        pattern: 0, // 当前选中模式（索引）
        modal: { // 对话框相关数据
          show: false,
          header: null, // 对话框标题
          content: null, // 对话框内容
          okText: null, // 确定按钮文本
          type: null, // 当前操作类型
          bool: null, // 参数暂存
          fn: null, // 确定函数
        },
        text: { // 对话框文本集合
          pattern: { // 模式切换
            tit: '操作提示',
            cont: [
              '您正在将智能接待的模式切换为通用模式，切换后将根据通用模式下的任务发送任务消息。确定要这样做吗？',
              '您正在将智能接待的模式切换为互动场景模式，切换后将根据互动场景模式下的任务发送任务消息。确定要这样做吗？'
            ]
          },
          patternNo: { // 模式切换(套餐功能不足)
            tit: '套餐功能不足',
            cont: ['当前套餐暂无互动场景模式功能，您可升级当前套餐。']
          },
          status: { // 单条任务的状态切换
            tit: '任务状态提示',
            cont: [
              '关闭后不发送此条任务消息，确定关闭吗？',
              '开启后将根据规则发送此条任务消息，确定开启吗？'
            ]
          },
          delete: { // 单条任务的删除
            tit: '删除提示',
            cont: ['删除后不发送此条任务消息，确定删除吗？']
          },
          patStatus: { // 场景状态切换
            tit: '场景状态提示',
            cont: [
              '关闭后不发送此场景下的任务消息，确定关闭吗？',
              '开启后将根据规则发送此场景下的任务消息，确定启用吗？'
            ]
          }
        },
        keys: {
          hz: 'XDS_INTELLIGENT_RECEPTION_RATE', // 频率
          pattern: 'XDS_INTELLIGENT_RECEPTION_MODE', // 模式
          scene: 'XDS_INTELLIGENT_RECEPTION_SCENES', // 场景
          switch: 'XDS_INTELLIGENT_RECEPTION_SWITCH', // 场景开关
        },
        // hzList: { // 频率对应的后端所需值
        //   '2天': 'TWO',
        //   '7天': 'SEVEN',
        //   '15天': 'FIFTEEN',
        //   '30天': 'THIRTY',
        //   '60天': 'SIXTY',
        //   '90天': 'NINETY',
        //   '不限': 'UNLIMITED',
        // },
        hz: null, // 频率
        config: null, // 配置信息
      }
    },
    components: {
      HeaderTitle: () => import('@/components/pageStyle/headerTitle.vue'),
      pattern1: () => import('./pattern/pattern1'),
      pattern2: () => import('./pattern/pattern2'),
    },
    mounted() {
      this.$root.Bus.$on('hzChange', this.updataHz)
      this.init()
    },
    beforeDestroy() {
      this.$root.Bus.$off('hzChange', this.updataHz)
    },
    computed: {
      ...mapGetters({
        curPublic: 'publicAccount/curPublic'
      })
    },
    watch: {
      curPublic(v) {
        this.init()
      }
    },
    methods: {
      ...mapActions({
        setPayStatu: 'pay/setPayStatu'
      }),
      init() {
        this.getConfig()
        this.dataDict(this.keys.pattern, dat => { // 获取模式
          if (dat[0].itemName === '通用模式') {
            this.radios = dat
          } else {
            this.radios = dat.reverse()
          }
          // console.log(this.radios)
        })
      },
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
      updataHz(hz) { // 修改发送频率
        this.hz = hz
        this.upConfig(this.keys.hz, hz)
        // this.upConfig(this.keys.hz, this.hzList[hz])
      },
      getConfig() { // 获取配置信息
        updateQueryIntelligentReception({
          appAccountId: this.curPublic.appAccountId
        }).then(res => {
          let dat = res.data
          this.pattern = dat.scenesMode ? dat.scenesMode - 1 : 0
          let capacity = dat.corpPackageIntelligentReceptionMode
          if (capacity === 1 && this.pattern !== 0) { // 权限判断(模式矫正)
            this.pattern = 0
            this.upConfig(this.keys.pattern, 1, this.getConfig)
          } else if (capacity === 2 && this.pattern !== 1) {
            this.pattern = 1
            this.upConfig(this.keys.pattern, 2, this.getConfig)
          }
          dat.rate = dat.rate + ''
          this.hz = dat.rate
          this.config = dat
        })
      },
      upConfig(type, val, callback) { // 修改配置信息
        let params = {
          appAccountId: this.curPublic.appAccountId,
          type: type,
        }
        let msg = ''
        if (type === this.keys.hz) {
        //   params.rate = val
          msg = '发送频率修改成功'
        } else {
          // params.value = val
        }
          params.value = val
        updateScenesSet(params).then(res => {
          if (res.code === 1) {
            if (callback) { callback() }
            if (msg) { this.$Message.success(msg) }
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      radioTap(i) { // 点击单选按钮
        if (this.pattern !== i) {
          if (this.config.corpPackageIntelligentReceptionMode === 3) {
            this.mutual('pattern', i)
          } else {
            this.mutual('patternNo', 0)
          }
        }
      },
      mutual(typ, bool, fn) { // 对话框交互函数
        let dex = bool ? 1 : 0
        this.modal.bool = bool
        this.modal.fn = fn
        this.modal.type = typ
        this.modal.show = true
        this.modal.okText = typ === 'patternNo' ? '立即升级' : '确定'
        this.modal.header = this.text[typ].tit
        this.modal.content = this.text[typ].cont[dex]
      },
      ok() { // 点击对话框确定按钮
        let typ = this.modal.type
        switch (typ) {
          case 'pattern': // 模式切换
            this.pattern = this.modal.bool
            this.upConfig(this.keys.pattern, this.modal.bool + 1, this.getConfig)
            break
          case 'patternNo': // 模式切换(套餐功能不足)
            this.upgrade()
            break
          case 'status': // 单条任务状态切换
          case 'delete': // 单条任务的删除
            this.modal.fn(this.modal.bool)
            setTimeout(() => {
              this.getConfig()
            }, 500)
            break
          case 'patStatus': // 场景的状态切换
            this.modal.fn.checked = !this.modal.fn.checked
            this.upConfig(this.modal.fn.key, Number(!this.modal.bool))
            //  + 1
            break
        }
      },
      upgrade() { // 跳转到立即升级页面
        let corpId = this.localStorageSaveOrRead('currentCorp').applyId
        let corpName = this.localStorageSaveOrRead('currentCorp').corpName
        let obj = {
          corpId: corpId,
          corpName: corpName
        }
        this.setPayStatu(obj)
      },
    },
  }
</script>

<style lang="stylus">
  .smart-title
    border-bottom: 1px solid #edeff0
  .task-radio
    padding: 30px 0 20px
</style>
