<template>
  <div class="drawer-group" slot="content">
    <Form ref="groupParams" :model="groupParams" :rules="ruleInline" :label-width="80">
      <FormItem prop="name" label="分组名称">
        <Input v-model.trim="groupParams.name" placeholder="请填写分组，不超过15个字"></Input>
      </FormItem>
      <FormItem prop="specialGroup" :label-width="0.001">
        <div class="specialGroup">
          <div class="specialGroup-input">
            <Checkbox v-model="groupParams.specialGroup" true-value="YES" false-value="NO"></Checkbox>
          </div>
          <div class="specialGroup-text">
            <div class="titles">设为互斥标签</div>
            <div class="tips">选中设为互斥标签后，粉丝在该分组内只能设置一个标签。不选中设为互斥标签，代表该标签分组内，允许给粉丝设置多个标签。</div>
          </div>
        </div>
      </FormItem>
    </Form>
    <div class="fans-label-drawer-footer create-fans-label-group">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveGroup">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'createAndMondifygroup',
  props: ['drawer'],
  data() {
    return {
      groupParams: {
        appAccountId: '',
        name: this.drawer.name,
        specialGroup: this.drawer.specialGroup,
        id: this.drawer.id
      },
      ruleInline: {
        name: [
          { required: true, message: '请填写分组名称!', trigger: 'blur' },
          { type: 'string', max: 15, message: '分组名称不能超过15个字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  watch: {
    drawer: {
      handler(val) {
        this.$refs.groupParams.resetFields()
        this.groupParams.name = val.name
        this.groupParams.specialGroup = val.specialGroup
        this.groupParams.id = val.id
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    // 添加或修改标签分组
    async addOrUpdateWxTagGroup(params) {
      params.appAccountId = this.appAccountId
      const response = await this.post(this.fylPath.addOrUpdateWxTagGroup, params)
      const { code, message } = response
      if (code === 1) {
        let str
        if (this.drawer.type === 'create') {
          str = '创建分组成功'
        } else {
          str = '修改分组成功'
        }
        this.$Message.success(str)
        this.$root.Bus.$emit('refreshList', this.drawer.type)
      } else {
        this.$Message.error(message)
      }
    },
    async saveGroup() {
      const valid = await this.$refs.groupParams.validate()
      if (valid) {
        this.drawer.show = false
        this.addOrUpdateWxTagGroup(this.groupParams)
      } else {}
    },
    cancleDrawer() {
      this.drawer.show = false
    }
  }
}
</script>
<style lang="stylus">
.drawer-group
  padding 50px 20px 0 20px
  .ivu-form
    .ivu-form-item
      .ivu-form-item-label
        line-height 40px
        height 40px
        padding 0
        text-align left
    .specialGroup
      display flex
      line-height 1
      margin-top 20px
      .specialGroup-input
        width 25px
      .specialGroup-text
        flex 1
        .titles
          font-weight bold
        .tips
          font-size 12px
          line-height 18px
          color: #979899
          margin-top 12px
</style>
