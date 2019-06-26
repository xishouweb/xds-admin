<template>
  <div>
    <p ref="tags" class="tags">
      <span class="tag" v-for="(tag, index) in initCopyTags" :key="'tag'+ index">
        <i>{{tag.tagName}}</i>
      </span>
      <Poptip v-model="showAllTags" v-if="isOver" transfer placement="bottom-end" width="460">
        <span ref="all" class="tag tag-all">
          <i>全部</i>
        </span>
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
  name: "tags",
  props: {
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    rows: {
      type: Number,
      default() {
        return 2
      }
    }
  },
  data() {
    return {
      initTags: this.tags,
      initCopyTags: this.tags,
      tagsWidth: 0,
      isOver: false,
      showAllTags: false, // 控制全部标签气泡的显示
    }
  },
  watch: {
    tags(val) {
      this.initTags = val
      this.initCopyTags = val
    }
  },
  mounted() {
    this.init()
    this.on(document.body, 'click', () => {
      this.showAllTags = false
    })
  },
  methods: {
    init() {
      // 挂载后
      this.tagsWidth = this.$refs.tags.offsetWidth // 总宽度
      // 拿到挂载后节点重新计算列表
      let length = this.calaTags()
      this.initCopyTags = this.initTags.slice(0, length)
    },
    calaTags() {
      let spanTotalWidth = 0
      const spanDomList = this.$refs.tags.getElementsByTagName("span")
      for (let i = 0; i < spanDomList.length; i++) {
        spanTotalWidth += spanDomList[i].offsetWidth
        if (spanTotalWidth > this.tagsWidth * this.rows) { // 超出
          this.isOver = true
          if (spanTotalWidth - spanDomList[i].offsetWidth + 50) {
            return i - 1
          } else {
            return i
          }
        }
      }
      return spanDomList.length
    },
    clickAll() {
      this.$emit("showAll")
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index.styl'
.tags
  .tag
    display inline-block
    padding 5px 10px 5px 0
    i
      display inline-block
      min-width 50px
      height 30px
      line-height 30px
      text-align center
      background-color #f2f4f5
      border-radius 15px
      padding 0 10px
  .tag-all
    i
      cursor pointer
      color #fff
      background-color #409eff
.tags-modal
  white-space normal
  height 300px
</style>
