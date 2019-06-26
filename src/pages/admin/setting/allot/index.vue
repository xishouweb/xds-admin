
<template>
  <!-- 分配规则 -->
  <div id="allot">
    <div class="title_public"> 分配规则 </div>
    <BScroll>
      <div class="pattern-row">
        <template v-for="(item,k) in title">
          <Card class="pattern-card" :class="{check:checkRadio===k}" :key="k">
            <!-- 卡片标题 -->
            <div class="pattern-tit" slot="title">
              <div>
                <h3>{{item.tit}}</h3>
                <p>{{item.cont}}</p>
              </div>
              <input
                class="pattern-radio"
                :id="'radio' + k"
                type="radio"
                name="pattern"
                :value="k"
                v-model="checkRadio"
              />
              <label @click.prevent="radioCheck(k)" :for="'radio' + k"></label>
            </div>
            <!-- 卡片内容 -->
            <ul class="pattern-cont">
              <template v-for="(v,i) in list[k]">
                <li v-if="i===3" :key="i" class="pattern-check">
                  <Checkbox
                    true-value="1"
                    false-value="0"
                    v-model="checkbox[k]"
                    @on-change="checkChange(k)"
                  ></Checkbox>
                  <div>
                    <h4>{{v.tit}}</h4>
                    <p>{{v.cont}}</p>
                  </div>
                </li>
                <li v-else :key="i">
                  <Icon type="checkmark"></Icon>
                  <div>
                    <h4>{{v.tit}}</h4>
                    <p>{{v.cont}}</p>
                  </div>
                </li>
              </template>
            </ul>
          </Card>
        </template>
      </div>
    </BScroll>
    <!-- 对话框 -->
    <NewModal
      class="allotModal"
      :modal="modal.show"
      :header="modal.title"
      :content="modal.cont"
      @close='close'
      @cancel='close'
      @ok='ok'
    ></NewModal>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        defineKey: 'XDS_DISTRIBUTION_RULE', // 当前页面key
        // 分配模式 派单上次接待优先 抢单上次接待优先
        keyArr: [
          'XDS_CORP_SEND_OR_SNATCH_ORDERS', 'XDS_CORP_SEND_ORDERS_RULE', 'XDS_CORP_SNATCH_ORDER_RULE'
        ],
        // 'XDS_CORP_SEND_OR_SNATCH_ORDERS', 'XDS_CORP_SEND_ORDERS_RULE', 'XDS_CORP_SNATCH_ORDER_RULE'
        status: [], // 当前设置状态
        // checkStatus: null, // 已保存到后端的选中模式 (当checkRadio为null时选择模式是否要弹窗提示,不太明确)
        checkRadio: null, // 当前选中模式
        checkbox: ['0','0'], // 上次接待优先选中状态
        modal: {
          show: false,
          title: '操作提示',
          cont: null,
          arr: [
            '当前为抢单模式，切换为派单模式后，当前抢单池的粉丝，继续保留在抢单池，客服可抢单，直到抢单池中无待抢粉丝时抢单池消失。确定要切换为派单模式吗？',
            '当前模式为派单模式，确定要切换为抢单模式吗？'
            ]
        },
        title: [
          {
            tit: '派单模式',
            cont: '开启后，系统根据以下优先级规则自动派单',
          },
          {
            tit: '抢单模式',
            cont: '开启后，系统根据以下优先级规则抢单',
          },
        ],
        list: [
          [
            {
              tit: '专属客服优先',
              cont: '客服手动设置粉丝为自己的专属粉丝，如果是专属粉丝，优先派单给专属粉丝对应的专属客服。',
            },
            {
              tit: '渠道二维码指定客服优先',
              cont: '渠道二维码指定1个客服或多个客服时，优先给指定的所有客服轮流派单。',
            },
            {
              tit: '所属客服优先',
              cont: '粉丝如果有所属客服并所属客服在线时，优先派单给所属客服。',
            },
            {
              tit: '上次接待优先',
              cont: '当所属客服不在线，优先派单给上一次接待的客服。',
            },
            {
              tit: '多个客服同时接待',
              cont: '如果有多个客服同时可接待，按照顺序轮流派单给多个客服。',
            },
            {
              tit: '留言给所属客服',
              cont: '以上条件都不满足则给所属客服留言。',
            },
          ],
          [
            {
              tit: '专属客服优先',
              cont: '客服手动设置粉丝为自己的专属粉丝，如果是专属粉丝，优先派单给专属粉丝对应的专属客服。',
            },
            {
              tit: '渠道二维码指定客服优先',
              cont: '渠道二维码指定1个客服或多个客服时，优先给指定的所有客服抢单。',
            },
            {
              tit: '所属客服优先',
              cont: '粉丝如果有所属客服并所属客服在线时，优先派单给所属客服。',
            },
            {
              tit: '上次接待优先',
              cont: '当所属客服不在线，优先派单给上一次接待的客服。',
            },
            {
              tit: '多个客服同时接待',
              cont: '如果有多个客服同时可接待，多个客服参与抢单。',
            },
            {
              tit: '留言给所属客服',
              cont: '以上条件都不满足则给所属客服留言。',
            },
          ],
        ]
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getSetting()
      },
      getSetting() { // 获取当前设置并渲染到页面
        this.post(this.Path.getSetting, {
          key: this.defineKey
        }).then(res => {
          if (res.code === 1) {
            let dat = res.data
            dat.forEach((v, i) => {
              let dex = this.keyArr.indexOf(v.key)
              this.status[dex] = v
            })
            this.checked = this.checkRadio = Number(!Number(this.status[0].value)) // 0与1互转
            this.$set(this.checkbox, 0, this.status[1].value)
            this.$set(this.checkbox, 1, this.status[2].value)
            // console.log(this.status)
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      setSetting(key, val) { // 修改设置交互
        return this.post(this.Path.setSetting, {
          defineKey: this.defineKey,
          key: key,
          value: val
        })
      },
      checkChange(i) { // 复选框状态改变(保持status的值与页面状态一致)
        if (i === this.checkRadio) { // 取消模式的选中
          this.checkRadio = null
          this.status[i + 1].value = '0'
        }
        this.status[i + 1].value = this.checkbox[i]
        console.log(this.status)
      },
      close() { // 对话框》关闭/取消
        this.modal.show = false
      },
      ok() { // 对话框》确定
        this.close()
        let val = Number(!!this.checkRadio) // 传给后端的val值与实际选中项索引相反，所以不用取反
        this.checkRadio = Number(!this.checkRadio) // checkRadio值取反
        this.status[0].value = val + ''
        this.radioChange()
      },
      radioCheck(i) { // 点击单选按钮
        if (this.checkRadio === null) {
          this.checkRadio = i
          this.status[0].value = Number(!i) + ''
          this.radioChange()
        } else if (this.checkRadio !== i) {
          this.modal.show = true
          this.modal.cont = this.modal.arr[i]
        }
      },
      radioChange() { // 变更分配模式
        let postArr = []
        this.status.forEach(v => {
          postArr.push(
            this.setSetting(v.key, v.value)
          )
        })
        axios.all(postArr).then(res => {
          // console.log(res)
          if (res[0].code === 1 && res[2].code === 1) {
            // this.checkStatus = this.checkRadio
            this.$Message.success(this.title[this.checkRadio].tit + '开启成功')
          } else {
            this.$Message.error(res[0].message || res[2].message)
          }
        })
      },
    },
  }
</script>

<style lang="stylus">
#allot
  .pattern-row
    display:flex
    justify-content :space-around
    padding:60px 30px
  .pattern-card
    width:590px
    &.check
      box-shadow 0px 3px 12px 0px rgba(0, 0, 0, 0.25)
    &:hover
      box-shadow 0px 3px 12px 0px rgba(0, 0, 0, 0.25)
  .pattern-tit
    padding: 16px 14px
    display:flex
    justify-content:space-between
    align-items:center
    h3
      font-size:24px
      line-height:28px
      font-weight:normal
    p
      color:#979899
      font-size:12px
      line-height:28px
  .pattern-radio
    height: 0
    width: 0
    opacity: 0
  .pattern-radio + label
    position: relative
    display: inline-block
    width: 36px
    height: 36px
    border-radius:50%
    border:2px solid #e3e4e5
  .pattern-radio:checked + label
    &:after
      content:''
      position:absolute
      width: 100%
      height: 100%
      background:url('~@/assets/images/check.png') no-repeat center
      background-size:cover

  .pattern-cont
    padding:14px
    >li
      display:flex
      margin-top:26px
      &:first-child
        margin-top:0
      >i
        margin-right:13px
      h4
        font-size:14px
        font-weight:normal
        color:#606366
      p
        font-size:12px
        margin-top:10px
        line-height:1.5
        color:#979899
    .pattern-check
      h4
        color:#303133
      input[type=checkbox]
        width:15px
        height:15px
        border:1px solid #979899
    .allotModal
      .ivu-modal
        margin: 0
</style>
