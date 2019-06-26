<template>
  <!-- 选择标签组件（多选） -->
  <div class="tag-select">
    <Collapse v-if="tagData">
      <Panel v-for="(v, i) in tagData" :key="i">
        <!-- 分组名 -->
        <div class="flexB tag-type">
          <p>{{v.name}}
            <span>{{v.checked.length}}/{{v.count}}</span>
          </p>
          <template v-if="!isRadio && !v.isRadio">
            <p v-if="!v.count" class="gray_color">全选</p>
            <p v-else-if="v.checked.length < v.count" class="check-all" @click.stop="checkAll(i, 1)">全选</p>
            <p v-else class="cancel-all text_color" @click.stop="checkAll(i, 0)">取消全选</p>
          </template>
        </div>
        <!-- 标签名 -->
        <div slot="content" class="tags">
          <Tag
            v-for="(k, j) in v.tags"
            :key="j"
            class="tag"
            type="border"
            :color="k.checked ? '#409fff' : ''"
            @click.native="tagTap(i, j)"
          >{{k.name}}</Tag>
        </div>
      </Panel>
    </Collapse>
    <!-- 当前选中标签 -->
    <div class="select-box flex" v-if="showSelect">
      <p>已选择标签</p>
      <div class="select-tags">
        <span v-for="(v, i) in selectTag" :key="i">{{v.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      appAccountId: Number,
      tagData: Array,
      isRadio: { // 是否全部单选
        type: Boolean,
        default: false
      },
      showSelect: { // 是否显示已选标签
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectTag: []
      }
    },
    mounted() {},
    computed: {},
    watch: {
      tagData: { // 监听选中标签变化，返回选中标签
        handler(newV, oldV) {
          let tagId = []
          this.selectTag.length = 0
          newV.forEach(v => {
            v.checked.forEach(k => {
              if (k.checked) {
                this.selectTag.push(k)
                tagId.push(k.tagId)
              }
            })
          })
          this.$emit('on-change', this.selectTag, tagId)
          // newV为完整的分组及标签数据，selectTag为选中标签的完整数据，tagId为选中标签id数组
        },
        deep: true
      }
    },
    methods: {
      checkAll(i, typ) { // 全选、取消全选
        if (typ) { // 全选
          this.tagData[i].tags.forEach(v => {
            v.checked = true
          })
          this.tagData[i].checked = this.tagData[i].tags
        } else { // 取消全选
          this.tagData[i].tags.forEach(v => {
            v.checked = false
          })
          this.tagData[i].checked = []
        }
      },
      tagTap(i, j) { // 点击标签
        let group = this.tagData[i]
        let tag = group.tags[j]
        if (this.isRadio || group.isRadio) { // 单选
          group.checked.length = 0
          group.tags.forEach(v => {
            if (v.id !== tag.id) {
              v.checked = false
            }
          })
        }
        tag.checked = !tag.checked
        group.checked = group.tags.filter(v => v.checked)
      }
    },
  }
</script>

<style lang="stylus">
.tag-select
  margin-top: 20px
  .ivu-collapse
    border: none
    background-color: transparent
    .ivu-collapse-item
      border-top: none !important
    .ivu-collapse-header
      padding-left: 0 !important
    .tags
      .tag
        height: 30px
        font-size: 14px
        line-height: 30px
        padding: 0 15px
        &:hover
          border-color: #409eff
          opacity: 1
          >span
            color: #409eff

    .tag-type
      width: 100%
      height: 100%
      color: #303133
      padding-left: 20px
      position: absolute
      top: 0
      left: 0
      p
        padding: 0 6px
      span
        color: #606366
        padding-left: 10px
  .select-box
    margin-top: 10px
    >p
      color: #606366
      width: 100px
      height: 32px
      line-height: 32px
      margin-right: 2px
    .select-tags
      >span
        padding: 0 10px
</style>
