<template>
  <div>
    <!-- 计算前展示 -->
    <p ref="tags" class="tags" v-if="!initCopyTags.length">
      <template v-for="(tag, index) in initTags">
        <span
          class="tag"
          :key="'tag'+ index"
          v-if="unmountedTag || tagPoslist[index] && (tagPoslist[index].bottom - tagPoslist[0].top  <= 80)"
        >
          <i>{{tag.tagName}}</i>
        </span>
      </template>
    </p>
    <!-- 计算后展示 -->
    <p v-else class="tags">
      <span class="tag" v-for="(tag, index) in initCopyTags" :key="'tag'+ index" >
        <i>{{tag.tagName}}</i>
      </span>
      <Poptip transfer placement="bottom-end" width="460">
        <span ref="all" class="tag tag-all"><i>全部</i></span>
        <p class="tags tags-modal" slot="content">
          <ScrollBar>
            <span class="tag" v-for="(tag, index) in initTags" :key="'tag'+ index">
              <i>{{tag.tagName}}</i>
            </span>
          </ScrollBar>
        </p>
      </Poptip>
    </p>
  </div>
</template>
<script>
export default {
  name: 'tags',
  props: {
    tags: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      initTags: this.tags,
      initCopyTags: [],
      tagsEle: null,
      tagPoslist: [], // tag标签位置列表
      unmountedTag: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 挂载后
      this.unmountedTag = false
      this.tagsEle = this.$refs.tags.getClientRects()[0]
      this.getTagPosition()

      // 拿到挂载后节点重新计算列表
      this.$nextTick(() => {
        let length = this.getTagPosition()
        this.initCopyTags = this.initTags.slice(0, length - 1)
      })
    },
    getTagPosition() {
      // 获取位置列表
      let list = this.$refs.tags.getElementsByTagName('i')
      list = [...list].map(item => {
        let position = item.getClientRects()[0]
        return position
      })
      this.tagPoslist = list
      return list.length
    },
    clickAll() {
      this.$emit("showAll")
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/stylus/index.styl"
.tags
  // max-height 80px
  // overflow hidden
  .tag
    display inline-block
    padding 5px 10px 5px 0
    i
      display inline-block
      min-width: 50px;
      height: 30px;
      line-height 30px
      text-align center
      background-color: #f2f4f5;
      border-radius: 15px;
      padding 0 10px
  .tag-all
    i
      cursor pointer
      color #fff
      background-color: #409eff;

.tags-modal
  white-space: normal;
  height: 300px;
</style>
