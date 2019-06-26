<template>
  <div class="qr-code-information">
    <div style="padding: 20px">
      <Tabs value="name1">
        <TabPane label="二维码详细" name="name1">

        </TabPane>
        <TabPane label="数据统计" name="name2">

        </TabPane>
      </Tabs>
    </div>
    <div class="drawer-footer">
      <Button style="width: 100px; margin-right: 15px" type="primary" @click="saveNew">下载二维码</Button>
      <Button style="width: 110px; margin-right: 15px" @click="cancleDrawer">美化二维码</Button>
      <Button style="width: 70px; margin-right: 15px" @click="cancleDrawer">修改</Button>
      <Button style="width: 70px; margin-right: 15px" @click="cancleDrawer">删除</Button>
      <Button style="width: 70px; margin-right: 15px" @click="cancleDrawer">返回</Button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'qr-code-data',
  props: ['labelList', 'drawer', 'metarialType', 'picText'],
  data() {
    return {
        ruleGroupName: {
          name: [
            { required: true, message: '分组名称不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ]
        }
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      qrcodeDefaultGroupId: 'markting/qrcodeDefaultGroupId',
    })
  },
  mounted() {
    this.groupList = this.getQrcodeGroupList
    // if (this.drawer.currentGroup.groupId) {
    //   this.select.groupId = this.drawer.currentGroup.groupId
    // }
  },
  methods: {
    async saveNew() {

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
