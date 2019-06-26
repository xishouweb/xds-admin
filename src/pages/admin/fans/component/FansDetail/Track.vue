<template>
  <div id="track">
    <ul class="track_wrap" v-if="fansRecord.length > 0">
      <li v-for="(item, index) in fansRecord" :key="index">
        <span class="dot"></span>
        <div class="track_type">
          <EventTrack :item="item"></EventTrack>
        </div>
        <div class="track_title" v-if="item.code !== 'LOCATION'">
          <TrackInfo :item="item"></TrackInfo>
        </div>
        <div class="track_cont" v-if="item.code === 'LOCATION'">
          <TMap
            :id="item.createTime"
            :data="item"
            :isShowTitle="false"
            :styles="{width:'100%', height: '100px'}"
          ></TMap>
        </div>
        <p class="track_time">{{item.createTime | chatFilterDate('content')}}</p>
      </li>
    </ul>
    <div v-else class="no-track">
      <span>暂无粉丝轨迹</span>
    </div>
  </div>
</template>
<script>
import TrackInfo from "./TrackInfo"
import EventTrack from "./EventType"
import TMap from "@/components/TMap"
export default {
  components: {
    TrackInfo,
    EventTrack,
    TMap
  },
  props: {
    fansRecord: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    fansRecord(val) {}
  }
}
</script>
<style lang="stylus">
#track
  .track_wrap
    .track_type
      margin-bottom 10px
    .track_title
      font-size 12px
      line-height 16px
      color #979899 !important
    .track_time
      color #979899
      font-size 12px
  .no-track
    position absolute
    width 100%
    height 100%
    left 0
    top 0
    display flex
    justify-content center
    align-items center
</style>

