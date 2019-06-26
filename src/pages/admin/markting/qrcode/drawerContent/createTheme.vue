<template>
  <div class="create-new-qrcode-group">
    <div style="padding: 50px">
      <Form ref="formGroupName" :model="drawer.current" :rules="ruleGroupName" :label-width="100">
        <FormItem label="二维码主题" prop="themeName">
          <Input v-model="drawer.current.themeName" placeholder="请填写二维码主题名称，不超过20个字" style="width: 330px" />
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
  name: 'createTheme',
  props: ['labelList', 'drawer'],
  data() {
    return {
        ruleGroupName: {
          themeName: [
            { required: true, message: '二维码主题不可为空', trigger: 'blur' },
            { required: true, max: 20, message: '不能超过20个汉字', trigger: 'change' }
          ]
        },
        select: {
          groupId: null
        },
        groupList: [],
        saving: false // 保存中
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
    if (this.drawer.current.groupId && this.drawer.current.groupId !== -1) {
      this.select.groupId = this.drawer.current.groupId
    } else {
      this.select = {groupId: this.qrcodeDefaultGroupId}
    }
  },
  methods: {
    async saveNew() {
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid && !this.saving) {
          this.saving = true
          let param = {
              groupId: this.select.groupId || this.drawer.current.groupId || this.qrcodeDefaultGroupId,
              appAccountId: this.currPublic.appAccountId,
              themeName: this.drawer.current.themeName,
              id: this.drawer.current.id || null
          }
          let res = await saveOrUpdateGchannelQrCodeTheme(param)
          this.saving = false
          if (res.code === 1) {
            const currGroupId = this.select.groupId || this.drawer.current.groupId || this.qrcodeDefaultGroupId
            this.$Message.success('保存成功！')
            this.drawer.show = false
            this.$emit('on-success', currGroupId)
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
