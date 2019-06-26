<template>
  <div>
    <PublicNo></PublicNo>
    <data-loading @reload="reload" :data-satau='loadingStatu'>
      <div id="fans" class="setHeight" ref="setHeight">
        <div class="left-content">
          <FansLeftPart :groupData="groupData" :usablePublicNum="usablePublicNum" :drawer.sync="drawer"></FansLeftPart>
        </div>
        <div class="right-content" >
          <FansRightPart :drawer="drawer" :usablePublicNum="usablePublicNum" :groupData="groupData"></FansRightPart>
        </div>
      </div>
      <Drawer v-model="drawer.show" :titleTips="drawer.title" :isScroll="false" width ="530px"  ref="Drawer">
        <div slot="content">
          <DrawerContent :groupData="groupData" :drawer="drawer"></DrawerContent>
        </div>
      </Drawer>
    </data-loading>
    <NewModal v-model="copyModal" :cancelBtn="false" :maskClosable="false" confrim="知道了" header="复制提示" :content="copyContent" @ok="copySuccess"></NewModal>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import PublicNo from '../components/currPublicNo'
import FansLeftPart from './fansLeftPart'
import FansRightPart from './fansRightPart'
import DrawerContent from './drawerContent/'

export default {
  name: 'fansLabel',
  // provide() {
  //   return {
  //     compareData: this.groupData
  //   }
  // },
  data() {
    return {
      copyContent: '',
      copyModal: false,
      groupData: {
        minHeight: '',
        currentIndex: 0,
        currentTagGroup: [],
        allTagGroup: []
      },
      copySuccessType: null,
      drawer: {
        show: false,
        title: '创建分组',
        type: 'create',
        currentGroup: {},
        id: null,
        name: '',
        specialGroup: 'NO',
        editTagId: ''
      },
      loadingStatu: 1
    }
  },
  computed: {
    ...mapState({
      publicList: state => state.tencent.publicAccountList,
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    }),
    // 可用公众号数量
    usablePublicNum() {
      let arr = []
      this.publicList.forEach(item => {
        if (item.appAccountId !== this.appAccountId && item.status === 1) {
          arr.push(item)
        }
      })
      return arr.length
    }
  },
  watch: {
    appAccountId(val) {
      this.loadingStatu = 1
      this.getWxGroupAndTagList('init')
    }
  },
  components: {
    PublicNo,
    FansLeftPart,
    FansRightPart,
    DrawerContent,
  },
  mounted() {
    this.init()
    this.$root.Bus.$on('refreshList', (val) => {
      this.getWxGroupAndTagList(val)
    })
    this.$root.Bus.$on('copyModal', (content, type) => {
      this.copyContent = content
      this.copyModal = true
      this.copySuccessType = type
    })
    this.$root.Bus.$on('checkTagAndTagGroup', (type) => {
      let params = {
        appAccountId: this.appAccountId,
        type: type
      }
      this.getAndCheckTagAndTagGroup(params)
    })
    this.$root.Bus.$on("createFanslabelGroup", (data) => {
      // 抽屉新建分组
    })
  },
  methods: {
    init(name) {
      this.getWxGroupAndTagList()
      // this.$nextTick(() => {
      //   let h = document.documentElement.clientHeight || document.body.clientHeight
      //   this.$refs[name].style.height = h - 124 + 'px'
      //   this.groupData.minHeight = h - 124 - 273.5 + 'px'
      //   window.addEventListener('resize', () => {
      //     h = document.documentElement.clientHeight || document.body.clientHeight
      //     this.$refs[name].style.height = h - 124 + 'px'
      //     this.groupData.minHeight = h - 124 - 273.5 + 'px'
      //   })
      // })
    },
    copySuccess() {
      this.getWxGroupAndTagList(this.copySuccessType)
    },
    async getAndCheckTagAndTagGroup(params) {
      const response = await this.post(this.fylPath.getAndCheckTagAndTagGroup, params)
      const {code, message} = response
      if (code === 1) {
        this.drawer.show = true
      } else {
        switch (code) {
          case 6802:
            this.$Message.error('最多可建50个分组')
            break
          default:
            this.$Message.error(message)
            break
        }
      }
    },
    async getWxGroupAndTagList(val) {
      let params = {
        appAccountId: this.appAccountId
      }
      const response = await this.post(this.fylPath.getWxGroupAndTagList, params)
      const { code, data, message } = response
      if (code === 1) {
        this.loadingStatu = 2
        if (data && data.fansGroupAndTagDtos) {
          let arrOrder = data.fansGroupAndTagDtos.sort(this.sortBy('groupOrder'))
          let whchatGroup = arrOrder.find((item) => item.name === '微信标签')
          if (whchatGroup) {
            let wechatIdxGroup = arrOrder.findIndex((item) => item.name === '微信标签')
            arrOrder.splice(wechatIdxGroup, 1)
            arrOrder.unshift(whchatGroup)
          }
          arrOrder = arrOrder.map((item) => {
            if (item.fansWxTagDtos) {
              item.fansWxTagDtos.sort(this.sortBy('tagOrder'))
              let whchatTag = item.fansWxTagDtos.find((item) => item.tagId === 2)
              if (whchatTag) {
                let wechatIdxTag = item.fansWxTagDtos.findIndex((item) => item.tagId === 2)
                item.fansWxTagDtos.splice(wechatIdxTag, 1)
                item.fansWxTagDtos.unshift(whchatTag)
              }
              item.fansWxTagDtos.map((_item) => {
                _item.flag = false
                return _item
              })
            }
            return item
          })
          switch (val) {
            case 'move':
              this.$root.Bus.$emit('againAdjust')
              break
            case 'create':
              this.groupData.currentIndex = data.fansGroupAndTagDtos.length - 1
              break
            case 'init':
              this.groupData.currentIndex = 0
              break
            case 'moveTags':
              this.$root.Bus.$emit('againAdjustTags')
              break
            case 'refresh':
              this.$Message.success('刷新成功')
            break
            default:
              break
          }
          this.groupData.allTagGroup = JSON.parse(JSON.stringify(arrOrder))
          this.groupData.currentTagGroup = this.groupData.allTagGroup[this.groupData.currentIndex]
        } else {
          this.groupData.currentIndex = 0
          this.groupData.currentTagGroup = []
          this.groupData.allTagGroup = []
        }
      } else {
        this.loadingStatu = 3
        this.$Message.error(message)
      }
    },
    reload() {
      this.groupData.currentIndex = 0
      this.getWxGroupAndTagList()
    }
  },
  destroyed() {
    this.$root.Bus.$off('copyModal')
    this.$root.Bus.$off('refreshList')
    this.$root.Bus.$off('checkTagAndTagGroup')
  }
}
</script>
<style lang="stylus">
#fans
  margin-top 10px
  border-radius 3px
  display flex
  .left-content
    width 230px
    border-radius 3px
    background-color #ffffff
    display flex
    flex-direction column
    .one
      height 100px
    .two
      flex 1
  .right-content
    margin-left 10px
    height 100%
    flex 1
    border-radius 3px
    background-color #ffffff
</style>
