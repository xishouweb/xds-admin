<template>
  <div id="cloud-newtable-container">
    <ScrollBar :style="tableHeight">
    <table class="records-table" cellspacing="0">
       <thead class="new-table-header">
        <tr>
          <td v-if="selectType === 'mulite'"><Checkbox v-model="checkedGroup.all" @on-change="checkAll"></Checkbox></td>
          <td class="td1">名称</td>
          <td class="td2">{{theaderText[type]}}</td>
          <td class="td3">更新时间</td>
          <td class="td4">操作</td>
        </tr>
      </thead>
      <tbody class="new-table-body" v-if="data.length > 0" >
            <tr class="new-table-tr" :class="{active: true}" v-for="(item, index) of data" :key="index">
              <td v-if="selectType === 'mulite'"><Checkbox v-model="item.checked" @on-change="checkItem(item)"></Checkbox></td>
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
                {{(item.updateTime || item.createTime) | timeFilter}}
              </div></td>
              <td class="td4"><div class="td-container">
                  <!-- <Button type="primary" size="small" @click.stop="download(item, 'download')"><i class="icon">&#xe62f;</i>下载</Button> -->
                  <Button size="small" @click.stop="remove(item, 'delete')"><i class="icon">&#xe652;</i>删除</Button>
              </div></td>
            </tr>
      </tbody>
    </table>
    </ScrollBar>

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
import { mapGetters } from 'vuex'
  export default {
    name: "cloudnewTable",
    components: {
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
          this.data = this.deepCopy(newVal.map(i => {
            return {
              ...i,
              checked: false,
            }
          }))
          this.checkedGroup.all = false
        }
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
      async download(item, type) {
        if (this.type === 'voice') {
          this.downloadFile(item)
        } else if (this.type === 'video') {
          this.downloadFile(item)
        } else if (this.type === 'file') {
          this.downloadFile(item)
        }
      },
      downloadFile(item) {
        if (!item.cloudUrl) return this.$Message.error('资源路径丢失！')
        let url = 'https://' + item.cloudUrl
        let filename = item.cloudUrl.substring(item.cloudUrl.lastIndexOf('/') + 1)
        this.downloadFn(url, filename)
      },
      downloadFn(url, filename) {
        const a = document.createElement('a') // 创建a标签
        a.setAttribute('download', filename)// download属性
        a.setAttribute('href', url)// href链接
        document.getElementById('app').appendChild(a)
        a.click()// 自执行点击事件
        a.remove()
      },
      async downloadVoice(item) {
          let param = {
            mediaId: item.mediaId,
            appAccountId: this.currPublic.appAccountId
          }
          let res = await this.$post(this.Path.downWxMediaVoice, param)
          res = res.data
          if (res.code === 1) {
            const blob = new Blob([res.data.bytes])
            var reader = new FileReader(blob)
            reader.readAsDataURL(res.data.bytes)
            reader.onload = (e) => {
              this.downloadFn(e.target.result, item.title)
            }
          } else {
            this.$Message.error(res.data.message)
          }
      },
      remove(item, type) {
        // this.showModal = true
        this.currentItem = item
        this.$emit('on-change', [item], 'remove')
      },
      async modalConfirm() {
        let res = null
        let item = this.currentItem
        let param = {
            idList: [item.id],
            seatId: item.seatId,
            type: this.type,
            appAccountId: this.currPublic.appAccountId
          }
        res = await this.$post(this.Path.deleteCssTmpMedia, param)
        if (res.data.code === 1) {
          this.$Message.success("删除成功！")
          this.showModal = false
          this.$emit('getcurrent', "", 'remove')
        } else {
          this.$Message.error(res.data.message)
        }
      },
      chooseIdx(idx) {
        this.activeIdx = idx
        let selectedItem = this.data[idx]
        if (this.checkedType === 'mulite') {
          this.$set(selectedItem , "checked", !selectedItem.checked)
          this.$emit('on-change', selectedItem)
        } else {
          this.$emit('on-change', selectedItem)
        }
      },
      // 选择框
      checkAll() {
        if (this.checkedGroup.all) {
          this.data.forEach(element => {
            this.$set(element , "checked", true)
          })
        } else {
          this.data.forEach(element => {
            this.$set(element , "checked", false)
          })
        }
        this.$emit('on-change', this.data.filter(i => i.checked))
      },
      checkItem(data) {
        let seleted = this.data.filter(item => item.checked)
        this.checkedGroup.all = (seleted.length === this.data.length)
        // this.$emit('on-change', data, 'one')
        this.$emit('on-change', this.data.filter(i => i.checked))
      }
    }
  }
</script>

<style lang="stylus">
height1 = 40px
#cloud-newtable-container
  background-color #fff
  width 100%
  overflow-x auto
  .records-table
    position relative
    border-collapse separate
    border-spacing 0px 10px
    width 100%
    td:first-child
      padding-left 20px

    .new-table-header
        background #f7f9fa
        td
          height 45px
          line-height 45px
          font-weight: 700
    .new-table-body
      margin-top 10px
      td
        color: #606366;
        vertical-align middle
        .td-container
          padding 10px 0
          button
            margin 5px
            width 77px
            height 32px
            i
              font-size 14px
    .td1, .td2, .td3, .td4, .td5, .td6, .td7, .td8
      min-width 100px
    .td1
      min-width 150px
    .td3
      text-align center
    .td5
      .td-container
        display flex
        align-items center
        .avatar
          width 40px
          height 40px
    .detail:hover
      cursor pointer
      color #0099CC
    .td6
      width 260px
    .td8
      text-align center
    .cancle
      cursor pointer
      font-size 12px
    .td4
      width 200px
</style>
