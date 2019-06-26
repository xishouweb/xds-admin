<template>
  <div id="newtable-container-m">
    <table class="records-table" cellspacing="0">
       <thead class="new-table-header">
        <tr>
          <th v-if="selectType === 'mulite'"><Checkbox v-model="checkedGroup.all" @on-change="checkAll"></Checkbox></th>
          <th class="td1">名称</th>
          <th class="td2">{{theaderText[type]}}</th>
          <th class="td3">更新时间</th>
          <th class="td4">操作</th>
        </tr>
      </thead>
      <tbody class="new-table-body" v-if="data.length > 0" >
        <tr class="new-table-tr" :class="{active: true}" v-for="(item, index) of data" :key="index" @click.stop="chooseIdx(index)">
          <td v-if="selectType === 'mulite'"><Checkbox v-model="item.checked" @on-change="checkItem"></Checkbox></td>
          <td class="td1"><div class="td-container">
            <component :is="mediaType[type]"
            :audio="item"
            :file="item"
            :video="item"></component>
          </div></td>
          <td class="td2" v-if="type === 'voice'"><div class="td-container">
            {{item.timeLength | filterTimelength}}
          </div></td>
          <td class="td2" v-else><div class="td-container">
            {{item.size | fileSizeFilter}}
          </div></td>
          <td class="td3"><div class="td-container">
            {{item.updateTime | timeFilter}}
          </div></td>
          <td class="td4"><div class="td-container">
              <!-- <Button type="primary" size="small" @click.stop="download(item, 'download')"><i class="icon">&#xe62f;</i> 下载</Button> -->
              <Button size="small" @click.stop="getcurrent(item, 'edit')"><i class="icon">&#xe61d;</i> 编辑</Button>
              <Button size="small" @click.stop="remove(item, 'delete')"><i class="icon">&#xe652;</i> 删除</Button>
          </div></td>
        </tr>
      </tbody>
    </table>

    <Modal title="删除提示" v-model="showModal" class-name="self-center-modal">
      <div>确定要删除吗?</div>
      <div slot="footer">
        <Button type="primary" @click.stop="modalConfirm">确定</Button>
        <Button type="ghost" @click.stop="showModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import download from 'downloadjs'
import { mapGetters } from 'vuex'
  export default {
    name: "newTable",
    components: {
      Loading: () => import("@/pages/admin/tencent/components/Loading.vue"),
      AudioTemp: () => import("./AudioTemp"),
      VidoeTemp: () => import("./vidoeTemp"),
      FileTemp: () => import("./FileTemp")
    },
    props: {
      datas: {
        type: Array,
        default: function () { return [] }
      },
      type: {
        type: String,
        default: function () { return '' }
      },
      selectType: {
        type: String,
        default: function () { return '' }
      }
    },
    filters: {
      status: (val) => {
        return val
      },
      timeFilter: (val) => {
        return val ? val.substring(0, 10) : ''
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic'
      }),
      tableHeight() {
        return { height: (this.screenH - 450) + 'px' }
      },
    },
    mounted() {
      window.onresize = () => {
        this.screenH = document.body.clientHeight || document.documentElement.clientHeight
      }
    },
    data() {
        return {
          showModal: false,
          currentItem: {},
          activeIdx: null,
          data: this.datas,
          mediaType: {
            voice: "AudioTemp",
            video: "VidoeTemp",
            file: "FileTemp",
          },
          theaderText: {
            voice: "时长",
            video: "大小",
            file: "大小",
          },
          checkedType: this.selectType,
          checkedGroup: {
            all: false,
            checkedlist: []
          },
          selectedList: [],
          screenH: document.body.clientHeight || document.documentElement.clientHeight,
        }
    },
    watch: {
      datas: {
        handler(newVal) {
          this.data = newVal
          this.checkItem()
        },
        deep: true
      },
      selectType(nv) {
        this.checkedType = nv
        if (nv === 'mulite') {
          if (this.type) { this.coverType = true }
        } else {
          this.coverType = false
        }
      }
    },
    methods: {
      getcurrent(item, type) {
        this.$emit("getcurrent", item, type)
      },
      async download(item, type) {
        if (this.type === 'voice') {
          this.downloadVideo(item.cloudUrl, item.tile)
        } else if (this.type === 'video') {
          this.downloadVideo(item.cloudUrl, item.tile)
        } else if (this.type === 'file') {
          this.ajaxFile(item.url, item.name)
        }
      },
      ajaxFile(url, filename) {
        if (!url) return this.$Message.error('资源路径丢失！')
        let _url = 'http://' + url

        var x = new XMLHttpRequest()
        x.open("GET", _url , true)
        x.responseType = "blob"
        x.onload = (e) => {
          this.$Message.success('下载成功！')
          download(e.target.response, filename)
        }
        x.onerror = (e) => {
          this.$Message.error('下载失败！')
        }
        x.send()
      },
      downloadVideo(url, filename) {
        if (!url) return this.$Message.error('资源路径丢失！')
        let _url = 'http://' + url
        download(_url, filename)
      },
      async downloadVoice(item) {
          let param = {
            mediaId: item.mediaId,
            appAccountId: this.currPublic.appAccountId
          }
          let res = await this.$post(this.Path.downWxMediaVoice, param)
          res = res.data
          if (res.code === 1) {
            // data:audio/amr;base64,
            download(res.data.bytes, '111.mp3')
            // const blob = new Blob(res.data.bytes)
            // var reader = new FileReader(blob)
            // reader.readAsDataURL(res.data.bytes)
            // reader.onload = (e) => {
            //   this.downloadFn(e.target.result, item.title)
            // }
          } else {
            this.$Message.error(res.data.message)
          }
      },
      remove(item, type) {
        this.showModal = true
        this.currentItem = item
      },
      async modalConfirm() {
        let res = null
        if (this.type === 'voice') {
          let param = {
            mediaId: this.currentItem.mediaId,
            appAccountId: this.currPublic.appAccountId,
            type: this.type
          }
          res = await this.$post(this.Path.deleteMedia, param)
        } else if (this.type === 'video') {
          let param = {
            mediaId: this.currentItem.mediaId,
            appAccountId: this.currPublic.appAccountId,
            type: this.type
          }
          res = await this.$post(this.Path.deleteMedia, param)
        } else if (this.type === 'file') {
          let param = {
            id: this.currentItem.id,
            appAccountId: this.currPublic.appAccountId
          }
          res = await this.$post(this.Path.deleteCssFile, param)
        }
        if (res.data.code === 1) {
          this.$Message.success("删除成功！")
          this.showModal = false
          this.$emit('getcurrent', "", 'remove')
        } else {
          this.$Message.error("删除失败！")
        }
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        let selectedItem = this.datas[idx]
        if (this.checkedType === 'mulite') {
          if (!selectedItem.checked) {
            this.$set(selectedItem , "checked", true)
            this.selectedList.push(selectedItem)
          } else {
            let index = this.selectedList.indexOf(selectedItem)
            this.$set(selectedItem , "checked", false)
            this.selectedList.splice(index, 1)
          }
          this.$emit('on-change', this.selectedList)
        } else {
          this.$emit('on-change', selectedItem)
        }
      },
      // 选择框
      checkAll() {
        if (this.checkedGroup.all) {
          this.datas.forEach(element => {
            this.$set(element , "checked", true)
          })
          this.$emit('on-change', this.datas)
        } else {
          this.datas.forEach(element => {
            this.$set(element , "checked", false)
          })
        }
      },
      checkItem() {
        let all = this.datas.every(element => element.checked)
        this.checkedGroup.all = all
      }
    }
  }
</script>

<style lang="stylus">
#newtable-container-m
  background-color #fff
  width 100%
  overflow-x auto
  padding-left 20px
  .records-table
    position relative
    border-collapse separate
    border-spacing 0px 10px
    width 100%

    .new-table-header
      background #f7f9fa
      th
        text-align left
        height 50px
        line-height 50px
        font-weight: 700
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #606366;
    .new-table-body
      margin-top 10px

      td
        color: #303133;
        font-size: 14px;
        vertical-align middle
        .td-container
          padding 10px 0
          button
            margin 5px
            width 77px
            height 32px
            i
              font-size 14px
              margin-left 2px
    .td1, .td2, .td3, .td4, .td5, .td6, .td7, .td8
      min-width 100px
    .td1
      padding-left 50px
      min-width 150px

    .td5
      .td-container
        display flex
        align-items center
        .avatar
          width 40px
          height 40px

    .td4
      width 280px
</style>
