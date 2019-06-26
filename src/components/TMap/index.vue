<template>
  <div class="t_map">
    <div class="location" v-if="isShowTitle" :style="{maxWidth: styles.width}">
      <div class="name" >
        {{simpleName}}
      </div>
      <div class="address">
        {{detailName}}
      </div>
    </div>
    <div :id="this.mapContainer" :style="styles"></div>
    <div class="clickLook" @click="goBigMap" v-if="showClick">点击查看</div>
  </div>
</template>
<script>
import {uuid} from '@/utils/util'
export default {
  name: 't-map',
  props: {
    id: {
      default: '0'
    },
    isShowTitle: {
      default: true,
      type: Boolean
    },
    styles: {
      type: Object,
      default: () => {
        return {
          width: '260px',
          height: '116px'
        }
      }
    },
    showClick: {
      default: true,
      type: Boolean
    },
    data: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      mapContainer: `mapContainer${uuid()}`
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    simpleName() {
      if (this.data.contextMap.EVENT_LOCATION) {
        let nameArr = this.data.contextMap.EVENT_LOCATION.split(',')
        return nameArr[nameArr.length - 1]
      } else {
        return ''
      }
    },
    detailName() {
      if (this.data.contextMap.EVENT_LOCATION) {
        return this.data.contextMap.EVENT_LOCATION.replace(/,/g, '')
      } else {
        return ''
      }
    }
  },
  methods: {
    init() {
      /* eslint-disable */
      let EVENT_LOCATION_LATITUDE = this.data.contextMap.EVENT_LOCATION_LATITUDE // 地理位置纬度
      let EVENT_LOCATION_LONGITUDE = this.data.contextMap.EVENT_LOCATION_LONGITUDE // 地理位置精度
      let map = new qq.maps.Map(document.getElementById(this.mapContainer), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(EVENT_LOCATION_LATITUDE, EVENT_LOCATION_LONGITUDE),
        zoom: 8,
        mapTypeControl: false,
        //设置平移控件的位置
        panControlOptions: {
            //设置平移控件的位置为相对右方中间位置对齐.
            position: qq.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
            //设置缩放控件的位置为相对左方中间位置对齐.
            position: qq.maps.ControlPosition.RIGHT_BOTTOM,
            //设置缩放控件样式为仅包含放大缩小两个按钮
            style: qq.maps.ZoomControlStyle.SMALL
        }
      })
      qq.maps.event.addListener(map, 'tilesloaded', function(e) {
        console.log(e + '1111')
      })
      //根据经纬度获取详细地址
      // let geocoder = new qq.maps.Geocoder()
      // geocoder.setComplete(function(result) {
      //   map.setCenter(result.detail.location)
      //   console.log(result)
      // })
      // let latLng = new qq.maps.LatLng(39.916527, 116.397128)
      // geocoder.getAddress(latLng)
      // qq.maps.event.addListener(map, 'click', () => {
      //   this.goBigMap()
      // })
      /* eslint-enable */
    },
    goBigMap() {
      window.open(
        `https://apis.map.qq.com/uri/v1/marker?marker=coord:${this.data.contextMap.EVENT_LOCATION_LATITUDE},${this.data.contextMap.EVENT_LOCATION_LONGITUDE};title:${this.simpleName};addr:${this.detailName}&referer=LM5BZ-HMNWP-QJEDT-VJIRJ-RQ2ST-ZVB5Q`
      )
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index.styl'

.t_map
  position relative
  text-align left
  z-index 2
  .location
    cursor pointer
    line-height 20px
    background-color #f5f6f7
    padding 2px 0 2px 10px
    .name
      font-size 14px
      font-weight bold
      color #303133
      ellipsis()
    .address
      ellipsis()
      color #979899
  .clickLook
    font-size 12px
    color text_color_active
    margin-top 10px
    cursor pointer
</style>
