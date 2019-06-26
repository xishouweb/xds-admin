<template>
  <!-- 互动场景模式》分组组件 -->
  <div id="groups-smart" :style="'width:' + width + 'px;'">
    <div class="groups-box">
      <template v-for="(v, i) in groupList">
        <!-- 有二级分组的结构 -->
        <Collapse v-if="v.child && v.child.length" v-model='sign' :key='i'>
          <Panel name='0'>
              {{v.name}}
              <div class="groups-box" slot="content">
                <template v-for="(k, j) in v.child">
                  <p
                    :key="j"
                    @click="cut(i, j)"
                    class="text_over"
                    :class="{active: k.checked}"
                  >
                    {{k.name}}
                    <span>({{k.num || 0}})</span>
                  </p>
                </template>
              </div>
          </Panel>
        </Collapse>
        <!-- 只有一级分组的结构 -->
        <p
          v-else
          :key="i"
          class="text_over"
          :class="{active: v.checked}"
          @click="cut(i)"
        >
          {{v.name}}
          <span>({{v.num || 0}})</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      groupList: {
        type: Array,
        default() {
          return []
        }
      },
      width: {
        type: Number,
        default: 190
      }
    },
    data() {
      return {
        sign: '0', // 折叠面板选中标识
        nowDex: [0, 'no']
      }
    },
    mounted() {
      const scene = JSON.parse(sessionStorage.getItem('scene'))
      if (scene) {
        this.nowDex = scene
        this.$emit('cut', ...scene)
      }
    },
    watch: {},
    computed: {},
    methods: {
      cut(i, j) { // 分组切换函数
        j = j === undefined ? 'no' : j
        // console.log(i + ':' + j)
        this.$set(this, 'nowDex', [i, j])
        this.$emit('cut', i, j)
      }
    },
  }
</script>

<style lang="stylus">
#groups-smart
  .ivu-collapse
    border: none
    background-color: transparent
    .ivu-collapse-header
      color: inherit
      padding-left: 10px
      i
        color: #909499
        margin-right: 4px
    .ivu-collapse-content-box
      padding-top: 0
      padding-bottom: 0
    .ivu-collapse-content
      padding-right: 0
  .groups-box
    >p
      width: 100%
      height: 40px
      line-height: 40px
      padding-left: 20px
      font-size: 14px
      cursor: pointer
    .active
      color: #fff
      background-color: #409eff
</style>
