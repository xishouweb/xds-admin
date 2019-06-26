<template>
  <div id="survey">
    <data-loading v-show="corpInfoData.loadingDataStatu===1" :data-satau="corpInfoData.loadingDataStatu">
    </data-loading>
    <BScroll :offsetBottom="0" :data="corpInfoData">
      <div class="scroll-common">
        <div class="tip-wrapper" v-show="showTips&&!tipCondition">
          <div v-for="(item, index) in tipsData" :key="index" class="tip-item">
            <div class="numImg">
              <img class="img" :src="item.tipsNum" alt="">
            </div>
            <div class="tip-text">
              <div class="text">{{item.text}}</div>
              <div class="link" @click="toSteps(index)">
                {{item.link}}
                <Icon type="ios-arrow-right"></Icon>
              </div>
            </div>
            <Icon class="tip-icon" type="ios-arrow-right" v-show="index!=4"></Icon>
          </div>
          <div class="close">
            <Icon class="hover-color" size="19" @click="closeTips" type="android-close"></Icon>
          </div>
        </div>
        <div class="survey-wrapper">
          <div class="survey-main">
            <card1></card1>
            <card2></card2>
          </div>
          <div class="left">
            <div class="left-wrapper info">
              <div class="name">{{saveloginCompany.corpName}}</div>
              <div class="date">
                <div :title="saveloginCompany.packageName">{{saveloginCompany.packageName}}</div>
                <div>{{saveloginCompany.endDate}} 到期</div>
              </div>
              <div class="statistics">
                <div class="stati-part stati-part-1">
                  <div class="stati-name">
                    公众号
                  </div>
                  <div class="stati-info">
                    <span class="use">{{corpInfoData.appidNum || 0}}</span>/<span class="all">{{corpInfoData.packAppidNum || 0}}</span>
                  </div>
                </div>
                <div class="stati-part stati-part-2">
                  <div class="stati-name">
                    员工
                  </div>
                  <div class="stati-info">
                    <span class="use">{{corpInfoData.eeNum || 0}}</span>/<span class="all">{{corpInfoData.packEeNum || 0}}</span>
                  </div>
                </div>
                <div class="stati-part stati-part-3">
                  <div class="stati-name">
                    坐席
                  </div>
                  <div class="stati-info">
                    <span class="use">{{corpInfoData.seatNum || 0}}</span>/<span class="all">{{corpInfoData.packSeatNum || 0}}</span>
                  </div>
                </div>
              </div>
              <!-- <div class="tips-info" v-show="corpPackageData.packageName=='免费'">
                当前为免费试用版，升级套餐，享更多特权服务
              </div> -->
              <div class="tips-info">
                当前套餐为{{saveloginCompany.packageName}}，升级套餐，享更多特权服务
              </div>
              <div class="butn" @click="upgrade">
                立即升级
              </div>
            </div>
            <div class="left-wrapper">
              <div class="tit">
                <div class="tit-left">公告通知</div>
                <div class="tit-right" @click="go('inform')">更多</div>
              </div>
              <div class="con">
                <template v-for="(v, i) in inform">
                  <div class="con-item" :key="i" @click="go('inform', i)">
                    <div class="item-left text_over">{{v.title}}</div>
                    <div class="item-right" v-if="v.time">{{v.time}}</div>
                  </div>
                </template>
              </div>
            </div>
            <div class="left-wrapper">
              <div class="tit">
                <div class="tit-left">使用帮助</div>
                <div class="tit-right" @click="go('help')">更多</div>
              </div>
              <div class="con">
                <template v-for="(v, i) in help">
                  <div class="con-item" :key="i" @click="go('help', i)">
                    <div class="item-left text_over">{{v.title}}</div>
                    <div class="item-right" v-if="v.time">{{v.time}}</div>
                  </div>
                </template>
              </div>
            </div>
            <div class="left-wrapper">
              <div class="tit">
                <div class="tit-left">在线客服</div>
              </div>
              <div class="con">
                <div class="concent">
                  <div class="code">
                    <img src="@/assets/images/survey/erweima.png" alt="">
                  </div>
                  <div class="end">
                    <div>微信扫码在线咨询</div>
                    <div>咨询电话：400-1622-800</div>
                    <div>在线时间：周一到周六 9:00-21:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <common-modal ref="addTencent" header="套餐不足" confrim="立即升级" :content="content" @ok="upgrade" ></common-modal>
      </div>
    </BScroll>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { getKeyIndicators, checkAppIdNum, getAuthUrl, getCorpStatisticsInfo } from '@/api/query'
import card1 from './card1.vue'
import card2 from './card2.vue'
import mixin from '../mixin.js'

export default {
  name: 'survey',
  mixins: [mixin],
  components: {
    card1,
    card2
  },
  data() {
    return {
      tipsData: [
        {
          tipsNum: require('@/assets/images/survey/step1.png'),
          text: '添加公众号并授权企业',
          link: '去添加'
        },
        {
          tipsNum: require('@/assets/images/survey/step2.png'),
          text: '为企业添加员工',
          link: '去添加'
        },
        {
          tipsNum: require('@/assets/images/survey/step3.png'),
          text: '邀请已添加员工',
          link: '去邀请'
        },
        {
          tipsNum: require('@/assets/images/survey/step4.png'),
          text: '为企业添加坐席',
          link: '去添加'
        },
        {
          tipsNum: require('@/assets/images/survey/step5.png'),
          text: '完成并使用销大师',
          link: '使用帮助'
        }
      ],
      userInfo: this.getToken() || null,
      selectTime: 0,
      showTips: true,
      fansNum: '',
      content: '',
      thirdplatUrl: '',
      isAddTencent: false
    }
  },
  computed: {
    tipCondition() {
      return (
        this.corpInfoData.appidNum > 0
      )
    },
    ...mapGetters({
      corpInfoData: 'survey/getCorpInfo',
      keyIndicatorsData: 'survey/getKeyIndicators',
      saveloginCompany: 'survey/getSaveloginCompany'
    })
  },
  created() {
    this.$root.Bus.$on('changeCurrentCorp', value => {
      this.selectTime = 0
    })
    this.getCorpStatisticsInfo()
  },
  mounted() {},
  methods: {
    go(typ, i) { // 跳转函数
      let path = ''
      let query = { type: typ }
      if (typ === 'help' || typ === 'inform') {
        path = '/admin/survey/help'
        if (i !== undefined) {
          path = '/admin/survey/detail'
          query.id = i
        }
      }
      this.$router.push({
        path: path,
        query: query
      })
    },
    // 获取公司统计信息
    getCorpStatisticsInfo() {
      let obj = {
        corpId: this.localStorageSaveOrRead('currentCorp').applyId
      }
      getCorpStatisticsInfo(obj).then(data => {
        let corpInfoData = data.data || {}
        if (data.code === 1) {
          corpInfoData.loadingDataStatu = 2
          this.setCorpInfo(Object.assign({}, this.corpInfoData, corpInfoData))
        } else {
          corpInfoData.loadingDataStatu = 3
          this.setCorpInfo(Object.assign({}, this.corpInfoData, corpInfoData))
        }
      }).catch(() => {
        this.setCorpInfo({ loadingDataStatu: 3 })
      })
    },
    // 获得关键指标
    getKeyIndicators(date) {
      let obj = {
        time: date,
        appAccountId: null
      }
      this.setKeyIndicators({loadingDataStatu: 1})
      getKeyIndicators(obj).then(data => {
        let keyIndicatorsData = data.data || {}
        if (data.code === 1) {
          keyIndicatorsData.loadingDataStatu = 2
          this.setKeyIndicators(Object.assign({}, this.keyIndicatorsData, keyIndicatorsData))
        } else {
          keyIndicatorsData.loadingDataStatu = 3
          this.setKeyIndicators(Object.assign({}, this.keyIndicatorsData, keyIndicatorsData))
        }
      }).catch(() => {
        this.setKeyIndicators({loadingDataStatu: 3})
      })
    },
    reload() {
      // this.getKeyIndicators(this.selectTime)
    },
    getAuthUrl() {
      let params = {
        redirectUrl: this.constRedirectUrl,
        reqType: 0,
        authType: 3
      }
      getAuthUrl(params).then(data => {
        if (data.code === 1) {
          this.thirdplatUrl = data.data.url
          // location.href = this.thirdplatUrl
          this.skipUrl(this.thirdplatUrl)
          this.localStorageSaveOrRead('preAuthCode', data.data.preAuthCode)
        } else {
          this.$Message.error('获取授权url失败')
        }
      }).catch(() => {
        this.$Message.error('获取授权url失败')
      })
    },
    checkAppIdNum() {
      checkAppIdNum().then(data => {
        switch (data.code) {
          case 1:
            if (data.data) {
              // this.isAddTencent = true
              this.getAuthUrl()
            } else {
              // this.isAddTencent = false
              this.content = `当前套餐版本最多支持${this.corpInfoData.packAppidNum}个公众号，如需更多服务请升级。`
              this.$refs.addTencent.showModal()
            }
            break
          case 3503:
            break
          default:
            break
        }
      })
    },
    toSteps(index) {
      switch (index) {
        case 0:
          this.addTencent()
          break
        case 1:
          this.$router.push({name: 'stuff'})
          break
        case 2:
          this.$router.push({name: 'stuff'})
          break
        case 3:
          this.$router.push({name: 'seats'})
          break
        case 4:
          this.$router.push({name: 'home'})
          break
        default:
          break
      }
    },
    addTencent() {
      this.checkAppIdNum()
      // if (this.isAddTencent) {
        // let newLink = document.createElement('a')
        // newLink.href = this.thirdplatUrl
        // newLink.target = '_blank'
        // document.body.appendChild(newLink)
        // newLink.click()
        // document.body.removeChild(newLink)
      // } else {
        // this.content = `当前套餐版本最多支持${this.corpInfoData.packAppidNum}个公众号，如需更多服务请升级。`
        // this.$refs.addTencent.showModal()
      // }
    },
    upgrade() {
      let corpId = this.localStorageSaveOrRead('currentCorp').applyId
      let corpName = this.localStorageSaveOrRead('currentCorp').corpName
      let obj = {
        corpId: corpId,
        corpName: corpName
      }
      this.setPayStatu(obj)
    },
    changeDate(val) {
      if (this.selectTime === val) {
        return
      }
      this.selectTime = val
      // this.getKeyIndicators(val)
    },
    closeTips() {
      this.showTips = false
    },
    ...mapActions({
      setKeyIndicators: 'survey/setKeyIndicators',
      setPayStatu: 'pay/setPayStatu',
      setCorpInfo: 'survey/setCorpInfo'
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('changeCurrentCorp')
    // this.$root.Bus.$off('hideFullPageDrawer')
  }
}
</script>
<style lang="stylus">
@import './index.styl'
</style>


