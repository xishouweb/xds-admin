<template>
  <div class="curr-operate">
    <div class="operate-left">
      <div class="operate-item">
        <Button type="primary" size="small" @click="operate('addTags')">添加标签</Button>
      </div>
      <div class="operate-item">
        <Button type="ghost" size="small" @click="operate('copyTags')">复制标签</Button>
      </div>
    </div>
    <div class="operate-right" v-if="!value">
      <div class="operate-item">
        <Button type="ghost" size="small" @click="$emit('input', true)">批量操作</Button>
      </div>
    </div>
    <div class="operate-right" v-if="value">
      <div class="operate-item">
        <Checkbox v-model="allSelect" :disabled="!groupData.currentTagGroup.fansWxTagDtos" @on-change="changeAll">全选</Checkbox>
      </div>
      <div class="operate-item" @click.stop>
        <Button type="ghost" size="small" @click.stop="operate('showPopGroup')">设置分组</Button>
        <PoptipCustom v-model="showMoveGroup" width="272px" top="42px">
          <div class="group">
            <div class="group-main">
              <scroll-bar :isAbsolute="true">
                <RadioGroup v-model="group" vertical>
                  <Radio v-for="(item) in groupData.allTagGroup" :key="item.id" :label="item.id"><span class="noWrap">{{item.name}}</span></Radio>
                </RadioGroup>
              </scroll-bar>
            </div>
            <div class="group-operation">
              <Button type="primary" style="float:left" @click="operate('groupOk')">确定</Button>
              <Button type="ghost" style="float:left" @click="operate('groupCancel')">取消</Button>
            </div>
          </div>
        </PoptipCustom>
      </div>
      <div class="operate-item">
        <Button type="ghost" size="small" @click="operate('delTags')">删除标签</Button>
      </div>
      <div class="operate-item">
        <Button type="ghost" size="small" @click="$emit('input', false)">取消批量</Button>
      </div>
    </div>
  </div>
</template>
<script>
import PoptipCustom from '@/components/poptipCustom'
export default {
  name: 'fanOperate',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    groupData: {
      type: Object,
      default: () => {}
    },
    drawer: {
      type: Object,
      default: () => {}
    },
    usablePublicNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      group: '',
      showMoveGroup: false
    }
  },
  computed: {
    allSelect: {
      set() {},
      get() {
        if (this.groupData.currentTagGroup.fansWxTagDtos) {
          return this.groupData.currentTagGroup.fansWxTagDtos.every(item => {
            if (item.tagId !== 2) {
              return item.flag
            } else {
              return true
            }
          })
        } else {
          return false
        }
      }
    }
  },
  methods: {
    operate(type) {
      if (type === 'showPopGroup' || type === 'delTags') {
        let arr = (this.groupData.currentTagGroup.fansWxTagDtos && this.$parent.filterArr(this.groupData.currentTagGroup.fansWxTagDtos)) || []
        if (arr.length > 0) {
          if (type === 'showPopGroup') {
            this.showMoveGroup = true
          } else {
            this.$emit('transmitEvent', 'delTags')
          }
        } else {
          this.$Message.warning('至少选择一项')
        }
      }
      switch (type) {
        case 'addTags':
          this.$root.Bus.$emit('checkTagAndTagGroup', 'ADD_TAG')
          this.drawer.title = '添加标签'
          this.drawer.type = type
          this.drawer.name = ''
          this.drawer.id = this.groupData.currentTagGroup.id
          break
        case 'copyTags':
          this.$root.Bus.$emit('checkTagAndTagGroup', 'COPY_TAG')
          this.showMoveGroup = false
          this.drawer.title = '复制标签'
          this.drawer.type = type
          break  
        case 'groupOk':
          this.showMoveGroup = false
          this.$emit('transmitEvent', type, this.group)
          break
        case 'groupCancel':
          this.showMoveGroup = false
          break
        default:
          break
      }
    },
    changeAll(val) {
      this.$emit('transmitEvent', 'selectAll', val)
    }
  },
  components: {
    PoptipCustom
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
.curr-operate
  padding-top 30px
  clear()
  .operate-left
    float left
    clear()
  .operate-right
    float right
    clear()
  .operate-left, .operate-right
    .operate-item
      position relative
      float left
      line-height 32px
      margin-right 17px
      &:last-of-type
        margin-right 0
      .ivu-btn
        padding-left 12px
        padding-right 12px
      .group
        .group-main
          position relative
          margin 15px 5px 20px 20px
          min-height 300px
          .ivu-radio-wrapper
            .noWrap
              display inline-block
              line-height 16px
              vertical-align middle
              max-width 220px 
              no-wrap()
        .group-operation
          clear()
          padding 20px 20px
          border-top solid 1px #e3e5e6
          .ivu-btn
            width 70px
            &:nth-of-type(1)
              margin-right 10px  
</style>


