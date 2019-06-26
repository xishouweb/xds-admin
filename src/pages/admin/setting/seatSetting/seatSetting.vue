<template>
  <div id="seatSetting">
    <div class="title_public">
      坐席设置
    </div>
    <div class="seat-switch">
      <div class="switch-item">
        <span class="ib-span ib-span1">默认坐席头像昵称</span>
        <span class="ib-span"><i-switch v-model="seatSwitch.defaultSwitch" @on-change="change"></i-switch></span>
        <p class="block-p">开启后管理员或运营人员可给每个坐席设置坐席昵称和头像</p>
      </div>
      <div class="switch-item">
        <span class="ib-span ib-span1">个性化坐席</span>
        <span class="ib-span"><i-switch v-model="seatSwitch.individuationSwitch" @on-change="change"></i-switch></span>
        <p class="block-p">开启后管理员或运营人员可给每个坐席设置坐席昵称和头像</p>
      </div>
      <div class="switch-item">
        <span class="ib-span ib-span1">坐席自定义</span>
        <span class="ib-span"><i-switch v-model="seatSwitch.curstomSwitch" @on-change="change"></i-switch></span>
        <p class="block-p">开启后坐席可在聊天系统中设置自己的个性化头像和昵称</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seatSwitch: {
        defaultSwitch: true,
        individuationSwitch: false,
        curstomSwitch: false
      },
    }
  },
  methods: {
    change(status) {
    }
  }
}
</script>
<style lang="stylus">
  #seatSetting
    .seat-switch
      padding-bottom 10px
      margin-left 20px
      .switch-item
        margin-top 53px
        .ib-span
          display inline-block
        .ib-span1
          width 115px
          margin-right 20px
        .block-p
          margin-top 15px
          font-size 12px
          color #979899
</style>


