<template>
  <div class="create-new-qrcode-group">
    <div style="padding: 50px">
      <Form ref="formGroupName" :model="drawer.current" :rules="ruleGroupName" :label-width="100">
        <FormItem label="二维码主题" prop="themeName">
          <Input v-model="drawer.current.themeName" placeholder="请填写分组名称，不超过20个字" style="width: 330px" />
        </FormItem>

        <FormItem label="主题分组" >
          <Select v-model="select.groupId">
              <Option v-for="(item, index) in groupList" :key="index" v-if="index > 0" :value="item.groupId">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </div>
    <div class="drawer-footer">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveNew">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { saveOrUpdateGchannelQrCodeTheme } from '@/api/markting'
export default {
  name: 'drawerContentCreate',
  props: ['labelList', 'drawer', 'metarialType', 'picText'],
  data() {
    return {
        ruleGroupName: {
          themeName: [
            { required: true, message: '二维码主题不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过20个汉字', trigger: 'change' }
          ]
        },
        select: {
          groupId: this.qrcodeDefaultGroupId
        },
        groupList: []
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      qrcodeDefaultGroupId: 'markting/qrcodeDefaultGroupId',
      getQrcodeGroupList: 'markting/getQrcodeGroupList',
    })
  },
  mounted() {
    this.groupList = this.getQrcodeGroupList
    if (this.drawer.current.groupId) {
      this.select.groupId = this.drawer.current.groupId
    }
  },
  methods: {
    async saveNew() {
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid) {
          let param = {
              groupId: this.select.groupId || this.drawer.current.groupId || this.qrcodeDefaultGroupId,
              appAccountId: this.currPublic.appAccountId,
              themeName: this.drawer.current.themeName
          }
          // if (this.getQrcodeGroupList.length > 50) {
          //   this.$Message.info('最多可新建50个分组')
          //   return
          // }
          let res = await saveOrUpdateGchannelQrCodeTheme(param)
          if (res.code === 1) {
            this.$Message.success('保存成功！')
            this.drawer.show = false
            this.$emit('on-success')
          } else {
            this.$Message.error(res.message)
          }
       }
      })
    },
    cancleDrawer() {
      this.drawer.show = false
    },
  }
}
</script>
<style lang="stylus">
.create-new-qrcode-group
  .drawer-footer
      border-top: solid 1px #edeff0;
      position: absolute;
      background-color: #fff;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      z-index 12
</style>
