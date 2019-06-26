<template>
  <div >
    <div
    v-if="mediaType[keyType][0] !== 'text'"
    class="material-box"
    :style="{width: 'video,voice,file'.includes(keyType) ? '333px': '280px' }"
        ref="materialBox">
            <component :is="mediaType[keyType][0]"
            hiddenTime
            :width="280"
            :news="getMediaContent"
            :audio="getMediaContent"
            :file="getMediaContent"
            :picture="getMediaContent"
            :video="getMediaContent"
            :template="getMediaContent"
            size="small"
            ></component>
      </div>
      <div v-else>
        <TextView :text="getMediaContent.content"></TextView>
      </div>
  </div>
</template>

<script>
export default {
  name: "media-template",
  components: {
    PicText: () => import("@/pages/admin/tencent/components/graphic/PicText"),
    PicTemp: () => import("@/pages/admin/tencent/components/pictures/PicTemp"),
    AudioTemp: () => import("@/pages/admin/tencent/components/audio/AudioTemp"),
    VidoeTemp: () => import("@/pages/admin/tencent/components/video/vidoeTemp"),
    FileTemp: () => import("@/pages/admin/tencent/components/files/FileTemp"),
    Temp: () => import("./MessageTemplate"),
    TextView: () => import("./text"),
  },
  props: {
    media: {
      type: Object,
      default: () => {}
    },
    asyncData: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mediaType: {
        // 素材类：[素材模板组件, 素材内容]
        text: ["text", {}],
        news: ["PicText", {}],
        image: ["PicTemp", {}],
        voice: ["AudioTemp", {}],
        video: ["VidoeTemp", {}],
        file: ["FileTemp", {}],
        template: ["Temp", {}]
      },
      temp: null
    }
  },
  computed: {
    getMediaContent() {
      return this.keyType ? this.mediaType[this.keyType][1] : ''
    },
    keyType() {
      return this.media.msgType
    }
  },
  created() {
    if (this.asyncData && this.keyType !== 'text') {
      this.getMediaIdDetailData({
        mediaId: this.media.content,
        type: this.keyType === 'image' ? 'img' : this.keyType
      })
    } else { // text
      this.mediaType[this.keyType].splice(1, 1, this.media)
    }
  },
  methods: {
    ininTemp() {
      this.temp = this.mediaType[this.keyType][0]
    },
    async getMediaIdDetailData(arg) {
      let param = {
          mediaId: arg.mediaId,
          type: arg.type
        }
      if (this.keyType === 'template') {
        param.mediaId = parseInt(param.mediaId)
      }
      if (param.mediaId) {
        let res = await this.$post(this.Path.getMediaIdDetailData, param)
        res = res.data
        if (res.code === 1) {
          this.initMediaTemp(res.data)
        }
      }
    },
    initMediaTemp(data) {
      let initData = null
      if (this.keyType === 'news') {
        initData = {
          ...data.cssWxMediaNewsExtend,
          articles: data.detailList.map(item => Object.assign({}, item, {cloudThumbUrl: item.thumbUrl}))
        }
      } else if (this.keyType === 'template') {
        initData = {
          ...data,
          templateDateList: JSON.parse(data.contentValue)
        }
      } else {
        initData = data
      }
      // contentValue
      this.mediaType[this.keyType].splice(1,1,initData)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .material-box
      border-radius: 3px;
      border: solid 1px #e3e4e5;
      width: 210px;
</style>

