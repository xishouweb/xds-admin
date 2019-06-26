<template>
  <!-- 会话设置 -->
  <div class="chatSet-page" v-if="list">
    <div class="title_public">会话设置</div>
    <BScroll class="chatSet-scroll" :data="list" :offsetBottom="20">
      <div class="chatSet-cont-box">
        <div v-for="(item,index) in list" :key="index">
          <!-- 结构类型一 -->
          <div class="item-box" v-if="index < 3 && index !== 1">
            <div class="fans_news">
              <p style="margin-right: 20px;">{{item.json.name}}</p>
              <i-switch
                true-value='1'
                false-value='0'
                v-model="item.value"
                @on-change="switchChange(index)"
              ></i-switch>
            </div>
            <p class="desc">{{item.json.desc}}</p>
          </div>

          <!-- 结构类型二 -->
          <div class="item-box" v-if="index === 3">
            <div class="fans_news">{{item.json.name}}</div>
            <p class="desc">{{item.json.desc}}</p>

            <div class="edit">
              <p class="padding-r20">超时时间</p>
              <template v-if="!item.setEdit">
                <span class="show-val">{{item.value}}小时</span>
                <!-- <span class="minu">小时</span> -->
                <button class="butEdit" @click="editTap(index)">编辑</button>
              </template>
              <template v-else>
                <!-- <input type="text" v-model="list[3].value"> -->
                <Select v-model="hour.val" class="chatSet-select">
                  <template v-for="v in hour.list">
                    <Option v-if="v < 25" :value="v" :key="v" class="chatSet-option">{{ v }}</Option>
                  </template>
                </Select>

                <span class="minu">小时</span>
                <button class="butEdit" @click="save(index)">保存</button>
                <button class="butEdit" @click="cancel(index)">取消</button>
              </template>
            </div>
          </div>

          <!-- 结构类型三(暂时去掉，等新版本) -->
          <div class="block" v-if="index > 3 && index < 6 && !index">
            <div class="fans_news">{{item.json.name}}</div>
            <p class="a desc">{{item.json.desc}}</p>
            <template v-if="item.items && item.items.length > 0">
              <!-- 超时时间 -->
              <div class="switch">
                <!-- {{item.items[0].json.name || ''}} -->
                <p>超时时间</p>
                <i-switch
                  true-value='1'
                  false-value='0'
                  v-model="item.items[0].value"
                  @on-change="switchChange(index, 0)"
                ></i-switch>
              </div>

              <div class="edit">
                <template v-if="!item.items[1].setEdit">
                  <span class="show-val">{{item.items[1].value | filtTime}}</span>
                  <!-- <span class="minu">分钟</span> -->
                  <button class="butEdit" @click="editTap(index, 1)">编辑</button>
                </template>
                <template v-else>
                  <!-- <input type="text" v-model="item.items[1].value"> -->
                  <Select v-model="hour.val" class="chatSet-select">
                    <Option v-for="v in hour.list" :value="v" :key="v" class="chatSet-option">{{ v }}</Option>
                  </Select>
                  <span class="minu">小时</span>
                  <Select v-model="min.val" class="chatSet-select" :disabled="min.disabled">
                    <Option v-for="v in min.list" :value="v" :key="v" class="chatSet-option">{{ v }}</Option>
                  </Select>
                  <span class="minu">分钟</span>

                  <button class="butEdit" @click="save(index, 1)">保存</button>
                  <button class="butEdit" @click="cancel(index, 1)">取消</button>
                </template>
              </div>
              <!-- 回复内容 -->
              <div class="switch">
                <!-- {{item.items[2].json.name || ''}} -->
                <p>回复内容</p>
                <i-switch
                  true-value='1'
                  false-value='0'
                  v-model="item.items[2].value"
                  @on-change="switchChange(index, 2)"
                ></i-switch>
              </div>

              <div class="set">
                <template v-if="!item.items[3].setEdit">
                  {{item.items[3].value}}
                  <button class="butEdit" @click="editTap(index, 3)">编辑</button>
                </template>
                <template v-else>
                  <div>
                    <input type="text" v-model="item.items[3].value" maxlength="200">
                    <span>{{item.items[3].value.length || 0}}/200</span>
                  </div>
                  <div class="cancel">
                    <button class="butEdit" @click="save(index, 3)">保存</button>
                    <button class="butEdit" @click="cancel(index, 3)">取消</button>
                  </div>
                </template>

              </div>
            </template>
          </div>

          <!-- 结构类型四（客服接待粉丝量） -->
          <div class="block" v-if="index === 6">
            <p class="fans_news">{{item.json.name}}</p>
            <div class="fans_num" v-for="(v, i) in item.items" :key="i">
              <div class="flexIC padding-b20">
                <p class="padding-r20">{{v.json.name}}</p>

                <template v-if="!v.setEdit">
                  <span class="show-val">{{v.value}}人</span>
                  <button class="butEdit" @click="editTap(index, i)">编辑</button>
                </template>

                <template v-else>
                  <Select v-model="quorum.val" class="chatSet-select" style="width: 90px;">
                    <template v-for="k in quorum.list">
                      <Option :value="k" :key="k" class="chatSet-option">{{ k + '人' }}</Option>
                    </template>
                  </Select>
                  <button class="butEdit" @click="save(index, i)">保存</button>
                  <button class="butEdit" @click="cancel(index, i)">取消</button>
                </template>

              </div>
              <p class="desc">{{v.json.desc}}</p>
            </div>
          </div>

        </div>
      </div>
    </BScroll>
  </div>
</template>
<script>
import mixin from './chatMixin'
export default {
  mixins: [mixin],
  data() {
    return {
      defineKey: 'XDS_SESSION_SETING', // 当前页获取数据对应的key
      nowData: null, // 当前操作数据
      text: '', // 当前编辑文本的初始状态
      hour: { // 小时选项数据
        list: [],
        val: 1
      },
      min: { // 分钟选项数据
        list: [],
        val: 0,
        disabled: false
      },
      quorum: { // 人数
        list: ['20', '50', '100', '150', '200'],
        val: '100'
      }
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    'hour.val'(newV) {
      if (newV >= 48) {
        this.min.val = 0
        this.min.disabled = true
      } else {
        this.min.disabled = false
      }
    }
  },
  filters: {
    filtTime: v => { // 将 '10,30' 类型转换成 10小时30分钟 类型
      if (!v) { return '' }
      let time = v.split(',')
      let val = (time[0] && time[0] > 0) ? time[0] + '小时' : ''
      val += (time[1] && time[1] > 0) ? time[1] + '分钟' : ''
      return val
    }
  },
  methods: {
    init() {
      this.getSetting()
      this.timeDataInit()
    },
    timeDataInit() { // 时间选项数据初始化
      for (let i = 0; i < 60; i++) {
        this.min.list.push(i)
        if (i > 0 && i <= 48) {
          this.hour.list.push(i)
        }
      }
    },
    getSetting() { // 获取当前设置信息，并进行数据初始化
      this.post(this.Path.getSetting, {
        key: this.defineKey
      }).then(res => {
        if (res.code !== 1) {
          this.$Message.error(res.message)
          return
        }
        let dat = res.data
        dat.forEach(v => { // 数据初始化
          this.list.forEach(k => {
            let items = k.items
            if (items) {
              items.forEach(s => {
                if (s.key === v.key) {
                  s.value = v.value
                }
              })
            } else {
              if (k.key === v.key) {
                k.value = v.value
              }
            }
          })
        })
        // console.log(this.list)
      })
    },
    setSetting(key, val, msg) { // 修改设置信息
      this.post(this.Path.setSetting, {
        defineKey: this.defineKey,
        key: key,
        value: val
      }).then(res => {
        console.log(res)
        if (res.code === 1) {
          if (!msg) { return }
          this.$Message.success(msg)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    setNowData(i, j) { // 获取当前设置对象
      if (j !== undefined) {
        this.nowData = this.list[i].items[j]
        return this.list[i].items[j]
      } else {
        this.nowData = this.list[i]
        return this.list[i]
      }
    },
    switchChange(i, j, relate) { // 开关状态改变
      this.setNowData(i, j)
      // this.nowData.key === 'XDS_RESPONSE_CONTEXT_CHECK'
      if (j === 2) { // 变更回复内容的开关时
        let prev = this.list[i].items[0]

        if (prev.value === '1' || prev.value === true) { // 判断超时时间的开关是否开启
          this.doSet()
        } else {
          if (this.nowData.value === '1') {
            setTimeout(() => {
              this.nowData.value = '0'
              this.doSet()
            },0)
            if (!relate) {
              this.$Message.error(this.list[i].json.name + '请打开超时时间')
            }
          }
        }
      } else {
        this.doSet()
        // this.nowData.key === 'XDS_TIMEOUT_CHECK'
        if (j === 0) { // 变更超时时间开关
          if (this.nowData.value === '0' || this.nowData.value === false) {
            this.nowData = this.list[i].items[2]
            this.switchChange(i, 2, 'relate') // 当超时时间开关关闭时，回复内容开关也需关闭
          }
        }
      }
    },
    doSet() { // 执行设置(设置开关、时间、回复内容)（发送请求）
      this.setSetting(this.nowData.key, this.nowData.value)
    },
    editTap(i, j) { // 点击编辑按钮
      if (this.nowData && this.nowData.setEdit) {
        this.cancel(i, j)
      }
      this.setNowData(i, j)
      this.nowData.setEdit = true
      // 编辑回复内容时将初始内容保存在text中
      if (j === 3) {
        this.text = this.nowData.value
      }
      // 默认选中相应的时间值
      if (j !== undefined) {
        let time = this.nowData.value.split(',')
        this.hour.val = Number(time[0]) || 48
        this.min.val = Number(time[1]) || 0
      } else { // 抢单池
        this.hour.val = Number(this.nowData.value) || 24
      }
    },
    save(i, j) { // 点击保存按钮
      if (i === 6) { // 客服接待粉丝量设置
        this.nowData.value = this.quorum.val
      } else {
        if (j === 1) { // 修改超时时间 (需对时间数据进行处理)
          this.nowData.value = this.hour.val + ',' + this.min.val
        } else if (!j) {
          this.nowData.value = this.hour.val
        }
      }
      this.nowData.setEdit = false
      this.doSet()
    },
    cancel(i, j) { // 点击取消按钮
      this.nowData.setEdit = false
      // 将回复内容恢复成初始内容
      if (j === 3) {
        this.nowData.value = this.text
        this.text = ''
      }
      if (i === 6) {
        this.quorum.val = this.nowData.value
      }
      this.nowData = null
    },
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index.styl';
.chatSet-page>>>.chatSet-scroll>div:first-child
  border-top: 1px solid transparent
.chatSet-cont-box
  padding-bottom: 110px
  .butEdit
    color: #409eff
    cursor: pointer
    font-size: 14px
    margin: 0 10px
    background-color: transparent
  .cancel
    position: absolute;
    top: 70px;
    right: 0;
  .chatSet-select
    width: 70px
    margin-right: 10px
    .chatSet-option
      height: 24px
      line-height: 24px
      text-align: center
  .item-box
    margin-left:20px;
    margin-top:60px;
  .fans_news
    display:flex;
    align-items: center
    padding-bottom: 11px
    font-size:24px;
    color: #303133;
    // >p
    //   font-size: 24px;
    //   color: #303133;
    //   margin-right: 20px
  .desc
    font-size:12px;
    color:#979899;
  .show-val
    font-size: 14px;
  .padding-r20
    padding-right: 20px
  .padding-b20
    padding-bottom: 20px
  .block
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 20px;
    padding-top: 60px;
    span
      color: #303133;
      display: flex;
      align-items: center;
    // .a
    //   font-size: 12px;
    //   color: #979899;
    //   margin-top: 7px;
    .close
      margin-left: 20px;
  .switch
    display: flex;
    align-items: center;
    padding-top: 25px;
    p
      font-size: 14px;
      color: #303133;
      margin-right: 20px
  .edit
    display: flex;
    align-items: center;
    padding-top: 20px;
    input
      color: #606366;
      width: 56px;
      height: 40px;
      background-color: #ffffff;
      border-radius: 3px;
      border: solid 1px #e3e4e5;
      text-align: center;
      margin-right: 10px;
      font-size: 14px;
    .minu
      margin-right: 15px;
  .fans_num
    padding-top: 7px
  .set
    font-size: 14px;
    color: #606366;
    padding-top: 20px;
    position: relative;
    width: 100%;
    text-align: left;
    line-height:22px;
    input
      width: 100%;
      height: 40px;
      background-color: #ffffff;
      border-radius: 3px;
      border: solid 1px #e3e4e5;
      position: absolute;
      padding-right: 65px;
      padding-left: 10px;
    span
      text-align: right;
      padding-right: 10px;
      position: absolute;
      right: 0;
      font-size: 12px;
      color: #cacbcc;
      line-height: 40px;
</style>
