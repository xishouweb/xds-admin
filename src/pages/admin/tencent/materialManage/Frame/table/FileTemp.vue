<template>
    <div class="file-temp">
      <div class="file_wrap" v-if="file.name || file.title">
        <div class="tabel-cell wrap play" @click="play()">
          <!-- ppt -->
          <!-- <i class="icon" style="color: #ff8939" v-if="file.name.includes('.ppt')">&#xe763;</i> -->
          <!-- word -->
          <!-- <i class="icon" style="color: #2c96ff" v-else-if="file.name.includes('.doc')">&#xe764;</i> -->
          <!-- pdf -->
          <!-- <i class="icon" style="color: #fd5754" v-else-if="file.name.includes('.pdf')">&#xe766;</i> -->
          <!-- zip -->
          <!-- <i class="icon" style="color: #4856ff" v-else-if="file.name.includes('.zip')">&#xe768;</i> -->
          <!-- 未知格式 -->
          <!-- <i class="icon" style="color: " v-else>&#xeaac;</i> -->
          <fileTypeIcon :type="file.format | fileType" :size="22"></fileTypeIcon>
        </div>

        <div class="tabel-cell discription" v-if="showInfo">
          <p><span>{{(file.name || file.title) | name}} </span><br/> <span style="color: #979899;">{{file.size | fileSizeFilter}}</span></p>
        </div>
        <div class="tabel-cell only-name" v-else>
          <p>{{(file.name || file.title)| name}}</p>
        </div>
      </div>
    </div>
</template>
<script>
import fileTypeIcon from '@/components/fileTypeIcon'
import { fileSuffix } from "@/utils/util.js"
export default {
  name: 'videoType',
  data() {
      return {}
  },
  components: {fileTypeIcon},
  filters: {
    fileSize(val) {
      return (val / 1024).toFixed(4) + 'KB'
    },
    name(val) {
      let index = val.lastIndexOf('/')
      return index === -1 ? val : val.substring(index + 1)
    },
    fileType(val) {
      // doc/xls/ppt/txt/docx/xlsx/pptx/pdf/rar/zip
      let _val = val ? val.substring(0, 3) : "zip"
      return _val
    }
  },
  props: {
    file: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showInfo: {
      type: Boolean,
      default: () => { return false }
    }
  },
  methods: {
    play() {
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/index'
.file-temp
  cursor()
  relative()
  .file_wrap
    display flex
    align-items center
    &.active
      border 1px solid text_color
    .discription
          // width 390px
          padding 0 10px
          p
            margin-top -6px
            height 36px
            line-height 22px
        .only-title
          line-height 36px
    .wrap
      margin 0 10px
      radius(50%)
      color(#ac8ce0)
      mr(10px)
      cursor()
      i
        fn(36px)
    .user_detail
      width 200px
      text-align right
      color #979899
    .icon
      font-size 24px
      line-height 36px
  .only-name
    display flex
    align-items center
    height 37px
</style>
