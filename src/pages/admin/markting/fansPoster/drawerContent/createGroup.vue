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
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'drawerContentCreate',
  props: ['labelList', 'drawer', 'metarialType', 'picText'],
  data() {
    return {
        ruleGroupName: {
          name: [
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ]
        }
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      getposterGroupList: "poster/getposterGroupList"
    })
  },
  // mounted() {
  //   this.groupList = this.getposterGroupList
  // },
  methods: {
    ...mapActions({
      queryCssGroup: 'poster/queryCssGroup',
      saveOrUpdateGroup: 'poster/saveOrUpdateGroup',
    }),
    async saveNew() {
      this.$refs.formGroupName.validate(async (valid) => {
        if (valid) {
          let param = {
              groupId: this.drawer.currentGroup.groupId,
              appAccountId: this.currPublic.appAccountId,
              name: this.drawer.currentGroup.name,
              type: this.metarialType
          }
          if (!this.drawer.currentGroup.name.trim()) {
            this.$Message.info('请输入分组名称')
            return
          }
          if (this.getposterGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
            this.$Message.info('最多可新建50个分组')
            return
          }
          const res = await this.saveOrUpdateGroup(param)
          if (res.code === 1) {
            this.$Message.success('保存成功！')
            this.drawer.show = false
            this.$emit('on-success')
          } else {
            this.$Message.error(res.message || '保存失败')
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
