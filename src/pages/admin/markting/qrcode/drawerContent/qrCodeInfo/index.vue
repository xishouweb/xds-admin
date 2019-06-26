<template>
  <div class="qr-code-information">
    <div style="padding: 20px">
      <Tabs value="info">
        <TabPane label="二维码详细" name="info">
          <scroll-bar v-setScrollBoxHeight.75>
            <Info :drawer="drawer.current" :param="drawer.title"></Info>
          </scroll-bar>
        </TabPane>
        <TabPane label="数据统计" name="data">
          <scroll-bar v-setScrollBoxHeight.75>
            <Statis :showFooter="false"
              :params="drawer.current"
              :curPublic="currPublic" >
            </Statis>
          </scroll-bar>
        </TabPane>
      </Tabs>
    </div>
    <div class="drawer-footer">
      <Button style="width: 100px; margin-right: 15px" type="primary" @click="download">下载二维码</Button>
      <Button style="width: 110px; margin-right: 15px" @click="prettyQrCode">美化二维码</Button>
      <Button style="width: 70px; margin-right: 15px" @click="modify">修改</Button>
      <Button style="width: 70px; margin-right: 15px" @click="remove">删除</Button>
      <Button style="width: 70px; margin-right: 15px" @click="cancleDrawer">返回</Button>
    </div>
    <downloadQrCode :param="downloadQrCode" />
    <prettyQrCode :param="prettyCode" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Info from './info'
import Data from './data'
export default {
  name: 'qrcode-info',
  props: ['labelList', 'drawer', 'metarialType', 'picText'],
  components: {
    Info,
    Data,
    downloadQrCode: () => import('./downloadQrCode'),
    prettyQrCode: () => import('./prettyQrCode'),
    Statis: () => import('../Statis/QrStatis'),
  },
  data() {
    return {
        ruleGroupName: {
          name: [
            { required: true, message: '分组名称不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ]
        },
        downloadQrCode: {
          show: false,
          url: ''
        },
        prettyCode: {
          show: false
        }
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      qrcodeDefaultGroupId: 'markting/qrcodeDefaultGroupId',
    })
  },
  methods: {
    download() {
      this.downloadQrCode = {
        show: true,
        name: this.drawer.title,
        url: this.drawer.current.qrCodeUrl
      }
    },
    prettyQrCode() {
      this.prettyCode.show = true
    },
    remove() {
      this.drawer.deleteFn()
    },
    modify() {
      this.drawer.modifyFn()
    },
    cancleDrawer() {
      this.drawer.show = false
    },
  }
}
</script>
<style lang="stylus">
  .qr-code-information
    .drawer-footer
        border-top: solid 1px #edeff0
        position: absolute
        background-color: #fff
        left: 0
        bottom: 0
        width: 100%
        height: 60px
        line-height: 60px
        text-align: center
        z-index 12
</style>
