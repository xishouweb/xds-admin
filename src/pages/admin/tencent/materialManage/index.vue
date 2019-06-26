<template>
  <layout>
    <div v-if="$route.name === 'newgraphic'">
      <router-view></router-view>
    </div>
    <div id="material" v-else>
      <div class="tabs">
        <Tabs :value="mediaType" @on-click="selectTabs">
          <TabPane class="tabtitle" v-for="(item, index) in mediaList" :key="index" :label="item.label" :name="item.name"></TabPane>
        </Tabs>
        <div class="server-size">
          <span>云服务空间</span>
          <div class="slider-bar">
            <div class="slider-bar-inner" :style="{width: usedSpace + 'px'}"></div>
          </div>
          <span class="size">{{useCloudSize |cloudSizeFilter}}M/{{cloudSize |cloudSizeFilter}}M</span>
        </div>
      </div>
      <component :is="mediaType"></component>
    </div>
  </layout>
</template>
<script>
import layout from '@/components/pageStyle/layout.vue'
import { mapGetters, mapMutations } from 'vuex'
import { sessionStorageSaveOrRead } from '@/utils/util.js'
export default {
  name: 'meterial',
  components: {
    layout,
    Graphic: () => import("./graphic/"),
    Pic: () => import("./picture/"),
    Audio: () => import("./audio/"),
    Vidoe: () => import("./vidoe/"),
    File: () => import("./file/"),
  },
  data() {
    return {
      size: 20,
      mediaList: [
        {label: "图文消息", name: "Graphic"},
        {label: "图片", name: "Pic"},
        {label: "语音", name: "Audio"},
        {label: "视频", name: "Vidoe"},
        {label: "文件", name: "File"}
      ],
      mediaType: typeof sessionStorageSaveOrRead("MEDIA_TYPE_TAB") === 'string' ? sessionStorageSaveOrRead("MEDIA_TYPE_TAB") : "Graphic",
      usedSpace: 0,
      useCloudSize: 0,
      cloudSize: 0.01,
    }
  },
  filters: {
    cloudSizeFilter(val) {
      return parseInt(val / 1024 / 1024)
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      fileGroupList: state => state.tencent.fileGroupList
    })
  },
  watch: {
    currPublic(nv) {
      this.getMediaCount()
    }
  },
  mounted() {
    this.getMediaCount()
    this.$root.Bus.$on("recountCloudSize", () => {
      this.getMediaCount()
    })
  },
  methods: {
    ...mapMutations({
      setCloudMediaCount: "tencent/SET_CLOUD_MEDIA_COUNT"
    }),
    selectTabs(name) {
      this.mediaType = name
      sessionStorageSaveOrRead("MEDIA_TYPE_TAB", name)
    },
    async getMediaCount() {
      if (!this.currPublic) return
      let param = { appAccountId: this.currPublic.appAccountId }
      let res = await this.$post(this.Path.queryCssMediaCount, param)
      let data = res.data
      if (data.code === 1) {
        this.useCloudSize = data.data.useCloudSize
        this.cloudSize = data.data.cloudSize
        this.usedSpace = parseInt(data.data.useCloudSize / data.data.cloudSize * 200)
        // 保存到vuex
        this.setCloudMediaCount(data.data)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    sessionStorageSaveOrRead("MEDIA_TYPE_TAB", null)
    this.$root.Bus.$off('graphicPerScanAction')
    next()
  }
}
</script>
<style lang="stylus">
#material
  margin-top 10px
  background-color #ffffff
  border-radius 3px
  .tabs
    position relative
    padding 0 20px
    .ivu-tabs-bar
      margin-bottom: 0 !important
    .ivu-tabs-tab
      height 70px
      line-height 60px
    .server-size
      position absolute
      font-size 14px
      top 32px
      right 20px
      vertical-align top
      .slider-bar
        margin 0 5px
        width 200px
        height 6px
        display inline-block
        background-color #e3e4e6;
        border-radius 3px
        .slider-bar-inner
          height 6px
          border-radius 3px
          background-color  #409eff;
      .ivu-tooltip
        display none !important
      .size
        font-size: 12px;
        color: #303133;
  .ivu-tabs-tab
    width: 110px;
    height: 18px;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 2px;
    text-align center
    color: #606366;
  .ivu-tabs-tab-active
    color: #409eff;
</style>
