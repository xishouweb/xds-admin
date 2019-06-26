<template>
    <div class="file-temp">
      <div class="file-temp-file_wrap" v-if="file.name">
        <div class="file-temp-tabel-cell wrap play" >
          <fileTypeIcon :type="file.format | fileType" :size="31"></fileTypeIcon>
        </div>

        <div class="file-temp-tabel-cell file-temp-discription">
          <p class="file-temp--type-title">{{file.name}}</p>
          <p class="file-temp--type-title">{{file.size | fileSizeFilter}}</p>
        </div>

        <div class="file-temp-tabel-cell file-temp-user_detail" v-if="size !== 'small'">
          <i>{{file.updateTime | timeLen}}</i>
        </div>
      </div>
    </div>
</template>
<script>
import fileTypeIcon from '@/components/fileTypeIcon'
export default {
  name: 'filesType',
  data() {
      return {}
  },
  components: {
    fileTypeIcon
  },
  props: {
    file: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: String,
      default: () => {
        return 'default'
      }
    }
  },
  filters: {
    fileType(val) {
      // doc/xls/ppt/txt/docx/xlsx/pptx/pdf/rar/zip
      let _val = val ? val.substring(0, 3) : "zip"
      return _val
    },
    timeLen(val) {
      return val.replace(/^(.{0,16}).*/, "$1")
    }
  },
  methods: {
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'

.file-temp
  cursor()
  relative()
  height 80px
  width 100%
  padding 22px 30px
  .file-temp-file_wrap
    display table-row
    &.file-temp-active
      border 1px solid text_color
    .file-temp-tabel-cell
      display table-cell
      vertical-align top
    .file-temp-discription
      width 390px
      padding 0 10px
      .file-temp--type-title
        height 14px
        line-height 14px
        margin-bottom 5px
        overflow hidden
        white-space nowrap
        text-overflow:ellipsis
        width: 230px
    .file-temp-wrap
      margin 0 10px
      radius(50%)
      color(#ac8ce0)
      mr(10px)
      cursor()
      i
        fn(36px)
    .file-temp-user_detail
      width 200px
      text-align right
      color #979899
</style>
