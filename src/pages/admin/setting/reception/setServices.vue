
<template>
  <!-- 设置客服组件 -->
  <div class="setServices">

    <!-- 选项组 -->
    <RadioGroup v-if="showRadio" v-model="radio" @on-change="radioChange">
      <Radio v-for="(v,i) in showRadio" :label="v.value" :key="i">
        <span>{{v.name}}</span>
      </Radio>
    </RadioGroup>
    <div class="setBox">

      <!-- 待选列表 -->
      <div class="services1">
        <ScrollBar>
          <div class="tab-tit">
            <p>
              {{tit[0].tit}}
              <span>({{num[0]}})</span>
            </p>
            <!-- 提示 -->
            <Poptip class="services-tool" width=200 trigger="hover" transfer placement="bottom" v-if="tit[0].note">
              <Icon type="ios-help-outline"></Icon>
              <div slot="content" style="white-space: normal;">{{tit[0].note}}</div>
            </Poptip>
          </div>
          <!-- 列表组件 -->
          <services :cont="cont || []" :show="show[0]" :radio="radio" :noText="noText[0]" ></services>
        </ScrollBar>
      </div>

      <div class="toRight" :class="{disabled: !canSend}" @click="send">
        <Icon type="chevron-right" :size="20" style="color:#fff"></Icon>
      </div>

      <!-- 已选列表 -->
      <div class="services2">
        <ScrollBar>
          <div class="tab-tit">
            <p>
              {{tit[1].tit}}
              <span>({{num[1]}})</span>
            </p>
            <!-- 提示 -->
            <Poptip class="services-tool" width=200 trigger="hover" transfer placement="bottom" v-if="tit[1].note">
              <Icon type="ios-help-outline"></Icon>
              <div slot="content" style="white-space: normal;">{{tit[1].note}}</div>
            </Poptip>
          </div>
          <!-- 列表组件 -->
          <services :cont="checked" :show="show[1]" :noText="noText[1]" @hand="hand" ></services>
        </ScrollBar>
      </div>

    </div>
    <!-- 对话框 -->
    <new-modal v-model="showModal" :header="modText[0]" :content="modText[1]" @ok="ok"></new-modal>

  </div>
</template>

<script>
  export default{
    props: ['tit','cont','selec','showRadio'], // tit:列表标题，cont:待选列表内容，已选中客服编码，showRadio:是否需要单选按钮组
    data() {
      return {
        radio: 0, // 选中项
        show: [
          {
            showIndex: false,
            showCheck: true,
            showHand: false
          },
          {
            showIndex: true,
            showCheck: false,
            showHand: true
          },
        ],
        noText: ['当前公众号未设置坐席或没有正常状态的坐席，请前往坐席管理中设置','您还未添加接待组客服'],
        handDex: null, // 当前操作项索引
        checked: [], // 选中客服列表
        showModal: false, // 是否显示对话框
        modText: ['移除提示','移除后该客服不显示在接待组中，确定要移除吗?'], // 对话框内容
      }
    },
    components: {
      services: () => import('./services')
    },
    mounted() {
      this.initSelect()
    },
    watch: {
      selec(nv) {
        this.initSelect()
      },
      showRadio: {
        deep: true,
        handler(nv) {
          this.initSelect()
        }
      },
      cont(nv) {
        this.initSelect()
      }
    },
    computed: {
      num() { // 计算两个列表的长度
        return [this.cont.length, this.checked.length]
      },
      canSend() { // 计算当前是否允许发送
        if (this.showRadio[0].check) { // 选中所有客服
          return false
        }
        let num = 0
        this.cont.forEach((v,i) => {
          if (v.val === true) { num++ }
        })
        return num > this.checked.length
      },
    },
    methods: {
      initSelect() { // 初始化单选及选中客服
        if (this.selec === undefined || !this.showRadio || !this.cont) { return }
        this.showRadio.forEach(v => {
          if (v.check) {
            this.radio = v.value
          }
        })
        if (this.radio === 0) {
          this.noText[1] = ''
          this.setCheck(true)
          this.checked = []
        } else {
          this.noText[1] = '您还未添加接待组客服'
          this.setCheck(false)
          this.checked.length = 0
          // 将选中客服字符串转换为数组
          let list = this.selec.split(',')
          this.cont.forEach(v => {
            let id = v.id.toString()
            let dex = list.indexOf(id)
            if (dex >= 0) {
              v.val = true
              v.disabled = true
              this.$set(this.checked, dex, v)
            }
          })
          this.checked = this.checked.filter(v => v)
        }
      },
      setCheck(val) { // 统一设置选中状态及可用状态
        this.cont.forEach((v,i) => {
          v.val = v.disabled = val
        })
      },
      radioChange() { // 单选状态改变
        this.$emit('change',this.radio,'check')
      },
      send() { // 将选中客服数据拷贝到接待组客服
        if (this.canSend) {
          this.cont.forEach((v,i) => {
            if (v.val && !v.disabled) {
              v.disabled = true
              // if (!this.filt(this.checked, 'code', v.code)) {
                this.checked.push(v)
              // }
            }
          })
          this.$emit('send', this.checked, '设置接待组客服成功')
        }
      },
      hand (option) { // 选中列表的操作函数
        let {typ,dex} = option
        this.handDex = dex
        switch (typ) {
          case 1: { // 上移
            this.checked.splice(dex - 1, 0, this.checked[dex])
            this.checked.splice(dex + 1, 1)
            this.$emit('send', this.checked, '移动成功')
            break
          }
          case 2: { // 下移
            this.checked.splice(dex + 2, 0, this.checked[dex])
            this.checked.splice(dex, 1)
            this.$emit('send',this.checked, '移动成功')
            break
          }
          case 3: { // 移除
            this.showModal = true
            break
          }
        }
      },
      ok() { // 对话框点击确定事件处理
        this.checked.splice(this.handDex,1) // 移除选中客服
        this.setCheck(false)// 重置为未选中状态
        this.checked.forEach((val,k) => {
          let code = val.code
          this.cont.forEach((v,i) => {
            if (v.code === code) {
              v.val = v.disabled = true
            }
          })
        })
        this.$emit('send', this.checked)
      },
      // filt(arr, k, v) { // 判断arr中是否有 k 属性的值为 v 的对象
      //   let bul = false
      //   arr.forEach(val => {
      //     if (val[k] === v) {
      //       bul = true
      //     }
      //   })
      //   return bul
      // },
    },
  }
</script>

<style lang="stylus">
.setServices
  padding:0 20px 60px
.setBox
  padding-top:30px
  display:flex
  justify-content:space-between
  >div
    height:570px
    margin-bottom:30px
  .toRight
    width:50px
    height:40px
    min-height:0
    flex:none
    line-height:44px
    text-align:center
    margin:240px 12px 0
    background-color: #409eff
    border-radius: 3px
  .disabled
    background-color: #cacbcc
  .services1
    flex:4
    border: solid 1px #e3e4e5
    background-color: #f7f9fa
  .services2
    flex:6
    border: solid 1px #e3e4e5
    th
      background-color:transparent
  .main-wrapper
    padding-left: 20px
    padding-right: 20px
.tab-tit
  display:flex
  align-items:center
  padding: 30px 0 10px
  >p
    line-height:1.4
    margin-right:10px
    >span
      color:#979899
      position:relative
      top:-1px
</style>

