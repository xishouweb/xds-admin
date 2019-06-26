<template>
  <div class="fans-label-drawer">
    <CreateAndMondifygroup :drawer="drawer" :groupData="groupData" v-if="drawer.type === 'create' || drawer.type === 'modifyGroup'"></CreateAndMondifygroup>
    <AddAndModifyTags :drawer="drawer" :groupData="groupData" v-if="drawer.type === 'addTags' || drawer.type === 'modifyTag'"></AddAndModifyTags>
    <Copy v-if="drawer.show && (drawer.type === 'copyGroup' || drawer.type === 'copyTags')" :groupData="groupData" :drawer="drawer"></Copy>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'drawerContent',
  components: {
    CreateAndMondifygroup: () => import('./createAndMondifygroup'),
    Copy: () => import('./copy'),
    AddAndModifyTags: () => import('./addAndModifyTags'),
  },
  props: {
    groupData: {
      type: Object,
      default: () => {}
    },
    drawer: {
      type: Object,
      default: () => {}
    }
  },
}
</script>
<style lang="stylus">
  .fans-label-drawer
    height 100%
    .fans-label-drawer-footer
      border-top: solid 1px #edeff0;
      position: absolute;
      background-color: #fff;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      z-index 12
</style>
