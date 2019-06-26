<template>
  <!-- 模板编辑器（选择、新建模板消息） -->
  <div class="tempEdit">
    <div class="tempEdit-box flexB" v-show="!selectTemp">
      <div class="hand-box flexC" @click="creatTemp(0)">
        <i class="icon">&#xe623;</i>
        <p>选择模板消息</p>
      </div>
      <div class="hand-box flexC" @click="creatTemp(1)">
        <i class="icon">&#xe623;</i>
        <p>新建模板消息</p>
      </div>
      <p class="warn-text">{{warn[status]}}</p>
    </div>
    <!-- 模板消息 -->
    <div class="temp-box" v-if="selectTemp">
      <scroll-bar>
        <div class="temp">
          <message-temp
            :template="selectTemp"
            :showHand="(true)"
            @updata="tempHand(1)"
            @delete="tempHand(2)"
          ></message-temp>
        </div>
      </scroll-bar>
    </div>
    <!-- 选择、创建模板消息模态框 -->
    <temp-m
      v-model="showTemp"
      :insert="insert"
      :navDex="navDex"
      :tempData="selectTemp"
      @navChange="navChange"
      @cutTemp="cutTemp"
      @submit="submit"
      @close="close"
    ></temp-m>
  </div>
</template>

<script>
  export default {
    props: {
      warn: { // 警告信息
        type: [Array],
        default() {
          return ['', '请设置当前内容']
        }
      },
      status: { // 状态，与警告信息对应
        type: Number,
        default: 0
      },
      insert: { // 需要的快捷插入按钮，默认为所有
        type: [String, Array],
        default: 'all'
      },
      temp: Object // 模板消息对象（修改时传）
    },
    data() {
      return {
        showTemp: false, // 控制模态框的显示
        navDex: 0, // 模态框导航索引
        selectTemp: null, // 选中模板信息(选中并确认或编辑并确认的模板消息数据)
        tempData: null // 模板消息内容(编辑但未确认的模板消息数据)
      }
    },
    components: {
      tempM: () => import('./index.vue'), // 选择模板组件
      messageTemp: () => import('./MessageTemplate.vue'), // 模板组件
    },
    watch: {
      temp: {
        deep: true,
        handler(nv) {
          this.selectTemp = this.deepCopy(nv)
          this.tempData = this.deepCopy(nv)
        }
      }
    },
    mounted() {
      this.$root.Bus.$on('formChange', dat => { // 获取新建模板消息时的编辑内容
        this.tempData = dat
      })
      if (this.temp) {
        this.selectTemp = this.deepCopy(this.temp)
        this.tempData = this.deepCopy(this.temp)
      }
    },
    methods: {
      cutTemp() { // 切换模板
        this.selectTemp = null
        this.tempData = null
      },
      creatTemp(v) { // 点击选择、新建模板消息
        this.showTemp = true
        this.navDex = v
      },
      tempHand(v) { // 模板消息操作按钮
        if (v === 1) { // 修改
          this.navDex = 1
          this.showTemp = true
          this.tempData = this.deepCopy(this.selectTemp)
        } else if (v === 2) { // 删除
          this.selectTemp = null
          this.tempData = null
          this.$emit('submit', this.selectTemp)
        }
      },
      navChange(v) { // 模态框导航切换
        this.navDex = v
      },
      submit(dat) { // 选择、创建模板消息后的提交
        this.showTemp = false
        this.selectTemp = this.deepCopy(dat || this.tempData)
        this.$emit('submit', this.deepCopy(this.selectTemp))
      },
      close() {
        this.tempData = null
        this.showTemp = false
      }
    },
  }
</script>

<style lang="stylus">
.tempEdit
  height: 100%
  // 选择、新建栏
  .tempEdit-box
    width: 100%
    height: 100%
    // padding-bottom: 24px
    position: relative
    .hand-box
      width: 49%
      height: 100%
      min-height: 140px
      color: #cacbcc
      cursor: pointer
      // margin-right: 10px
      border: 1px dashed #e3e4e5
      flex-direction: column
      .icon
        color: #cacbcc
        font-size: 40px
        margin: 10px 0
    .warn-text
      position: absolute
      bottom: -24px
      height: 24px
      line-height: 24px
      font-size: 12px
      color: #f56c6c
  // 模板消息
  .temp-box
    width: 300px
    // height: 100%
    height:320px
    .temp
      width: 290px
      padding: 10px 60px 10px 10px
</style>
