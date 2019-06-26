<template>
  <!-- 群发详情 -->
  <div>
    <!-- 发送状态 -->
    <div class="status-box" v-if="statusInfo">
      <div class="detailStatus">
        <i
          class="icon"
          :style="'color:' + statusInfo[massDetail.sendStatus].color"
          v-html="statusInfo[massDetail.sendStatus].icon"
        ></i>
        <p>{{statusInfo[massDetail.sendStatus].text}}</p>
      </div>
      <ul class="statusNum flexA">
        <li>
          <p>预估人数</p>
          <p>{{massDetail.estimateNumber || 0}}</p>
        </li>
        <li>
          <p>实际发送</p>
          <p>{{massDetail.actualNumber || 0}}</p>
        </li>
        <li>
          <p>发送成功</p>
          <p>{{massDetail.successNumber || 0}}</p>
        </li>
        <li>
          <p>发送失败</p>
          <p>{{massDetail.failNumber || 0}}</p>
        </li>
      </ul>
    </div>
    <!-- 主要内容 -->
    <div class="detail-list" v-if="massDetail">
      <div class="detail-item flex">
        <p>群发名称</p>
        <span>{{massDetail.msgName}}</span>
      </div>
      <div class="detail-item flex">
        <p>内容类型</p>
        <span>{{contType[massDetail.msgType]}}</span>
      </div>
      <div class="sendContent flex">
        <span>发送内容</span>
        <!-- 文本消息 -->
        <div class="textInfo" v-if="massDetail.msgType ==='text'" >
          <BScroll :data="massDetail" :offsetBottom="0" :maxHeight="450">
            <TextView :text="massDetail.msgContent"></TextView>
          </BScroll>
        </div>
        <!-- 模板消息 -->
        <Temp :template="massDetail.details" maxWidth="220" v-else-if="massDetail.msgType === 'template'"></Temp>
        <template v-else-if="massDetail.details === null">
          <div class="textInfo" style="padding: 16px;">该素材已被删除</div>
        </template>
        <!-- 其它类型消息 -->
        <div class="cont-border text_over" v-else>
          <PicText :news="massDetail.details" class="Card" v-if="massDetail.msgType==='news'"></PicText>
          <File :file="massDetail.details" size="small" v-if="massDetail.msgType === 'file'"></File>
          <Audio :audio="massDetail.details" :hiddenTime="true" v-if="massDetail.msgType ==='voice'"></Audio>
          <Video :video="massDetail.details" :hiddenTime="true" v-if="massDetail.msgType === 'video'"></Video>
          <PicTemp :picture="massDetail.details" v-if="massDetail.msgType ==='image'"></PicTemp>
        </div>
      </div>
      <!-- 群发对象 -->
      <div class="mass-object-box flex">
        <span>群发对象</span>
        <div class="mass-object">
          <p v-if="!pageDex">{{massDetail.groupObjects === 3 ? '全部粉丝' : '按标签选择'}}</p>
          <p v-else>{{massDetail.groupObjects === 3 ? '全部粉丝' : '我的所属粉丝'}}</p>
          <ul class="object-list" :class="{'fold': fold > 1}">
            <template v-if="!pageDex">
              <li v-if="massDetail.groupObjects === 1" ref='massObjDom'>
                <p>标签</p>
                <div>
                  <p v-if="massObj.existTags !== 2 && massObj.tagIdList === null">不限</p>
                  <p v-else-if="massObj.existTags === 2">无标签</p>
                  <p v-else v-for="(v, i) in myTags" :key="i">{{v}}</p>
                </div>
              </li>
            </template>
            <template v-else>
              <li v-if="massDetail.groupObjects === 2">
                <p>分组</p>
                <div>
                  <p v-if="!myFansGroup.length">不限</p>
                  <p v-else v-for="(v, i) in myFansGroup" :key="i">{{v}}</p>
                </div>
              </li>
              <li v-if="massDetail.groupObjects === 3">
                <p>所属客服</p>
                <div v-if="!myService.length && massObj.existKfSeatId !== 2"><p>不限</p></div>
                <div v-else>
                  <p v-if="massObj.existKfSeatId === 2">无所属客服粉丝</p>
                  <template v-for="(v, i) in myService">
                    <p :key="i" v-if="v">{{v}}</p>
                  </template>
                </div>
              </li>
              <li>
                <p>标签</p>
                <div>
                  <p v-if="massObj.existTags !== 2 && massObj.tagIdList === null">不限</p>
                  <p v-else-if="massObj.existTags === 2">无标签</p>
                  <p v-else v-for="(v, i) in myTags" :key="i">{{v}}</p>
                </div>
              </li>
              <li>
                <p>来源</p>
                <div>
                  <!-- 来源于渠道二维码 -->
                  <template v-if="objectCont.channelQrThemeId">
                    <Poptip trigger="hover" placement="top">
                        <template v-if="objectCont.channelQrCodeIds">
                          <p class="target-item">
                            渠道二维码（{{objectCont.channelQrCodeIds.length}}个二维码）
                          </p>
                          <div slot="content" class="qrcode-cont">
                            <h6 class="lightGray_color">
                              二维码（{{objectCont.channelQrCodeIds.length}}）
                            </h6>
                            <div v-for="(v, i) in objectCont.channelQrCodeIds" :key="i">
                              <p class="target-item qrname">
                                {{v.channelQrCodeName}}
                              </p>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <p class="target-item">
                            渠道二维码（1个主题）
                          </p>
                          <div slot="content" class="qrcode-cont">
                            <h6>二维码（1）
                            </h6>
                            <p class="target-item">{{objectCont.channelQrThemeId.channelQrThemeName}}</p>
                          </div>
                        </template>
                    </Poptip>
                  </template>
                  <!-- 来源于裂变海报 -->
                  <template v-if="objectCont.fansPosterTemplateIds">
                    <Poptip trigger="hover" placement="top">
                      <p class="target-item">
                        裂变海报（{{objectCont.fansPosterTemplateIds.length}}）
                      </p>
                      <div slot="content" class="qrcode-cont">
                        <h6 class="lightGray_color">
                          二维码（{{objectCont.fansPosterTemplateIds.length}}）
                        </h6>
                        <div v-for="(v, i) in objectCont.fansPosterTemplateIds" :key="i">
                          <p class="target-item qrname">
                            {{v.fansPosterTemplateName}}
                          </p>
                        </div>
                      </div>
                    </Poptip>
                  </template>
                  <!-- 其它来源 -->
                  <template v-if="massObj.subscribeScene && massObj.subscribeScene.length">
                    <p v-for="(v, i) in massObj.subscribeScene" :key="i">{{massTips[v]}}</p>
                  </template>
                  <p v-else>不限</p>
                </div>
              </li>
              <li>
                <p>互动时间</p>
                <div>
                  <p v-if="time">{{time}}</p>
                  <p v-else>不限</p>
                </div>
              </li>
              <li class="mass-obj-other">
                <p>其他</p>
                <div>
                  关注状态&nbsp;
                  <p v-if="!massObj.subscribe">不限</p>
                  <p v-else>{{massObj.subscribe === 0 ? '未关注' : '已关注'}}</p>
                  联系方式&nbsp;
                  <p v-if="!massObj.contactWay || !massObj.contactWay.length">不限</p>
                  <p v-else>{{massObj.contactWay | contact}}</p>
                  互动次数&nbsp;
                  <p>{{filtNum(massObj.conversationMinNum, massObj.conversationMaxNum)}}</p>
                  <!-- <p v-if="!massObj.conversationMinNum && !massObj.conversationMaxNum">不限</p>
                  <p v-else>{{massObj.conversationMinNum}}-{{massObj.conversationMaxNum}}</p> -->
                  年龄&nbsp;
                  <p>{{filtNum(massObj.minAge, massObj.maxAge)}}</p>
                  <!-- <p v-if="!massObj.minAge && !massObj.maxAge">不限</p>
                  <p v-else>{{massObj.minAge}}-{{massObj.maxAge}}</p> -->
                  性别&nbsp;
                  <p>{{massTips[massObj.sex] || '不限'}}</p>
                  所在地区&nbsp;
                  <p v-if="!massObj.fansArea || !massObj.fansArea.length">不限</p>
                  <p v-else>{{massObj.fansArea | area}}</p>
                </div>
              </li>
            </template>
          </ul>
          <p v-if="fold" class="more-obj text_color" @click="foldHand">
            {{fold === 1 ? '查看更多' : '收起更多'}}
          </p>
        </div>
      </div>
      <!-- 创建人 -->
      <div class="detail-item flex">
        <p>创建人</p>
        <span>{{massDetail.create | creater}}</span>
      </div>
      <!-- 创建时间 -->
      <div class="detail-item flex">
        <p>创建时间</p>
        <span>{{massDetail.createTime |filtTime}}</span>
      </div>
      <!-- 发送时间 -->
      <div class="detail-item flex">
        <p>发送时间</p>
        <span>{{massDetail.sendTime | filtTime}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      myFansGroup: {},
      massDetail: {},
      contType: {},
      massObj: {},
      time: {},
      myService: {},
      myTags: {}
    },
    data() {
      return {
        pageDex: this.$route.meta.dex,
        isUpdata: true, // 是否触发updata内的事件处理
        fold: 0, // 控制查看更多按钮的显示及显示状态，0：不显示，1：显示查看更多，2：显示收起更多
        statusInfo: [ // 发送状态对应数据
          { icon: '&#xe6b3;', color: '#f56c6c', text: '发送失败！' },
          { icon: '&#xe6ab;', color: '#ffbc58', text: '待发送' },
          { icon: '&#xe630;', color: '#409eff', text: '发送中...' },
          { icon: '&#xe671;', color: '#67c23a', text: '发送完成！' },
          { icon: '&#xe703;', color: '#979899', text: '取消发送' },
          { icon: '&#xe630;', color: '#409eff', text: '发送中...' }
        ],
        massTips: {
          'ADD_SCENE_SEARCH': '搜索公众号',
          'ADD_SCENE_ACCOUNT_MIGRATION': '公众号迁移',
          'ADD_SCENE_PROFILE_CARD': '名片分享',
          'ADD_SCENE_QR_CODE': '扫描二维码',
          'ADD_SCENE_PROFILE_ITEM': '图文页右上角菜单',
          'ADD_SCENE_PAID': '支付后关注',
          'ADD_SCENE_OTHERS': '其他',
          'ADD_SCENE_PROFILE_LINK': '图文页内名称点击',
          'conversationMinNum': '来访互动最小次数',
          '1': '男',
          '2': '女',
          '0': '未知',
          ADD_SCENE_SCAN_CHANNEL_QR_CODE: "扫描渠道二维码",
          ADD_SCENE_SCAN_FANS_POSTER: "扫描裂变海报二维码"
        },
      }
    },
    filters: {
      creater(val) { // 过滤创建人信息
        let nv = val.replace('<', '(').replace('>', ')')
        return nv
      },
      filtTime(val) { // 过滤创建、发送时间的秒值
        if (!val) { return '' }
        return val.slice(0, -3)
      },
      contact(arr) { // 过滤联系方式
        let contactText = ['有联系电话', '无联系电话', '有微信', '无微信', '有QQ', '无QQ', '有邮箱', '无邮箱']
        let textArr = []
        arr.forEach(v => {
          textArr.push(contactText[Math.ceil(v - 1)])
        })
        return textArr.join('/')
      },
      area(arr) { // 过滤所在地区
        let area = []
        arr.forEach(v => {
          v = v.replace(',', '/')
          v = v.replace('/undefined', '')
          area.push(v)
        })
        return area.join(',')
      }
    },
    components: {
      PicText: () => import('@/pages/admin/tencent/components/graphic/PicText.vue'),
      PicTemp: () => import('@/pages/admin/tencent/components/pictures/PicTemp.vue'),
      Audio: () => import('@/pages/admin/tencent/components/audio/AudioTemp.vue'),
      Video: () => import('@/pages/admin/tencent/components/video/vidoeTemp.vue'),
      File: () => import('@/pages/admin/tencent/components/files/FileTemp.vue'),
      Temp: () => import('@/components/Template/MessageTemplate.vue'),
      TextView: () => import('@/components/mediaTemplate/text.vue'),
    },
    computed: {
      objectCont() { // 群发对象信息
        return this.massDetail.objectContent
      }
    },
    created() {},
    watch: {},
    mounted() {
      this.computeHeight()
    },
    updated() {
      if (this.isUpdata) {
        this.computeHeight()
      }
    },
    destroyed() {
      this.isUpdata = true
    },
    methods: {
      computeHeight() { // 计算群发对象高度，并为flod赋值
        if (this.pageDex > 0) {
          this.fold = 1
          return
        }
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.massDetail.groupObjects === 3) { // 是否选择全部粉丝
              this.fold = 0
            } else {
              let height = this.$refs.massObjDom.offsetHeight
              this.fold = height > 76 ? 1 : 0
            }
          }, 500)
        })
      },
      foldHand() {
        this.isUpdata = false
        this.fold = this.fold === 1 ? 2 : 1
      },
      filtNum(a, b) { // 处理互动次数及年龄的显示
        if (a) {
          if (b) {
            return a + '~' + b
          } else {
            return '大于等于' + a
          }
        } else {
          if (b) {
            return '小于等于' + b
          } else {
            return '不限'
          }
        }
      }
    },
  }
</script>

<style lang="stylus">
  // 详情》群发对象
  .mass-object-box
    color: #606366
    margin-top: 30px
    >span
      width: 88px
      flex: none
    .mass-object
      flex: 1
      .object-list
        height: 76px
        overflow: hidden
        padding-top: 10px
        >li
          display: flex
          margin-top: 0px
          >p
            width: 68px
            line-height: 28px
            flex: none
          >div
            flex: 1
            display: flex
            flex-wrap: wrap
            line-height: 28px
            >p, .target-item
              height: 28px
              line-height: 28px
              padding: 0 10px
              margin: 0 10px 10px 0
              border-radius: 3px
              background-color: #f2f4f5
          .qrcode-cont
            font-size: 12px
            >h6
              padding: 12px 0 20px
            .qrname
              margin-right: 0
              display: inline-block
        .mass-obj-other>div
          padding-right: 40px
      .fold
        height: auto
      .more-obj
        padding-top: 10px
        cursor: pointer
  // 发送状态
  .status-box
    border-bottom: 1px solid #e3e4e6
    .statusNum
      li
        padding: 20px 0
        >p
          line-height: 24px
    .detailStatus
      display: flex
      align-items: center
      >i
        font-size: 20px
      >p
        margin-left: 10px
  // 群发详情
  .detail-item
    margin-top :30px;
    color :#606366;
    font-size:14px;
    >p
      width: 88px
      flex: none
    >span
      color: #606366
  .textInfo
    width: 290px;
    height:200px;
    border:solid 1px #e3e4e5;
    .media-text-view
      padding: 18px
      line-height: 1.4
  .sendContent
    margin-top 41px;
    >span
      width: 88px
      flex: none
  .cont-border
    border: solid 1px #e3e4e5
</style>
