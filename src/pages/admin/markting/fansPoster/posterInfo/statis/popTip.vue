<template>
  <Poptip placement="left" width="410" transfer trigger="hover">
    <a><i class="icon">&#xe635;</i></a>
    <div class="poster-pop" slot="content">
      <div v-if="!type">
        <p>说明：统计数据每隔1小时统计一次。</p>
        <h4>累计裂变</h4>
        <p>通过该粉丝海报的一级、二级、三级生成的所有粉丝海报数据的总和。</p>
        <h4>一级裂变。</h4>
        <p>通过该用户的粉丝海报关注进来的粉丝数量统计</p>
        <h4>二级裂变</h4>
        <p>通过自己的一级粉丝的海报关注进来的粉丝数量统计。</p>
        <h4>三级裂变</h4>
        <p style="padding-bottom: 12px">通过自己的二级粉丝的海报关注进来的粉丝数量统计。</p>
      </div>
      <div v-else>
        <p>说明：统计数据每隔1小时统计一次。</p>
        <h4>累计统计</h4>
        <p>通过该模板生成的所有粉丝海报数据的总和。</p>
        <h4>一级裂变统计</h4>
        <p>粉丝在公众号内主动领取粉丝海报的数量统计。</p>
        <h4>二级裂变统计</h4>
        <p>通过一级粉丝海报关注公众号领取粉丝海报的数量统计。</p>
        <h4>三级裂变统计</h4>
        <p style="padding-bottom: 12px">通过二级粉丝海报关注公众号领取粉丝海报的数量统计。</p>
      </div>
      <!-- <h4>累计统计</h4>
      <p>通过该模板生成的所有裂变海报数据的总和。</p>
      <h4>一级裂变统计</h4>
      <p>粉丝在公众号内主动领取裂变海报的数量统计。</p>
      <h4>二级裂变统计</h4>
      <p>通过一级裂变海报关注公众号领取裂变海报的数量统计。</p>
      <h4>三级裂变统计</h4>
      <p style="padding-bottom: 12px">通过二级裂变海报关注公众号领取裂变海报的数量统计。</p> -->
    </div>
  </Poptip>
</template>
<script>
export default {
  props: ['type']
}
</script>
<style lang="stylus">
  .poster-pop
    padding-top: 12px
    white-space: normal
    h4
      padding-bottom: 10px
      line-height: 1
    p
      color: #606366
      padding-bottom: 15px
      line-height: 1.4
</style>
