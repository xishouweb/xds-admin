<template>
  <div class="create-new-qrcode-group">
    <div style="padding: 50px">
      <Form ref="formGroupName" :model="drawer.currentGroup" :rules="ruleGroupName" :label-width="90">
        <FormItem label="分组名称" :model="drawer.currentGroup" prop="name">
          <Input v-model="drawer.currentGroup.name" placeholder="请填写分组名称，不超过10个字" style="width: 330px" />
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
import { filterWhiteSpace } from '@/utils/util'
export default {
  name: 'drawerContentCreate',
  props: ['labelList', 'drawer', 'metarialType', 'picText'],
  data() {
    return {
        ruleGroupName: {
          name: [
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'blur' }
          ]
        },
        saving: false // 保存中
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      qrcodeDefaultGroupId: 'markting/qrcodeDefaultGroupId',
      getQrcodeGroupList: "markting/getQrcodeGroupList"
    })
  },
  mounted() {
    this.groupList = this.getQrcodeGroupList
  },
  methods: {
    async saveNew() {
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid && !this.saving) {
          this.saving = true
          let param = {
              groupId: this.drawer.currentGroup.groupId,
              appAccountId: this.currPublic.appAccountId,
              name: filterWhiteSpace(this.drawer.currentGroup.name),
              type: this.metarialType
          }
          if (!this.drawer.currentGroup.name.trim()) {
            this.$Message.info('请输入分组名称')
            return
          }
          if (this.getQrcodeGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
            this.$Message.info('最多可新建50个分组')
            return
          }
          let res = await this.$post(this.Path.saveOrUpdateGroup, param)
          this.saving = false
          res = res.data
          if (res.code === 1) {
            this.$Message.success('保存成功！')
            this.drawer.show = false
            this.$emit('on-success', res.data)
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
