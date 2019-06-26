<template>
  <div class="addTags">
    <div class="form">
      <Form ref="addTagsParams" :model="addTagsParams" :rules="rules" :label-width="80">
        <FormItem prop="tagNameList" label="标签名称">
          <Input v-if="drawer.type==='addTags'" v-model.trim="addTagsParams.tagNameList" type="textarea" class="textarea" :rows="8" placeholder="请输入标签名称"></Input>
          <Input v-else v-model.trim="addTagsParams.tagNameList" type="text" placeholder="请输入标签名称"></Input>
          <p class="tips" v-if="drawer.type==='addTags'">单个标签不能超过10个字，标签与标签之间用英文分号隔开</p>
          <p class="tips" v-else>标签名称不能超过10个字</p>
        </FormItem>
      </Form>
    </div>
    <div class="fans-label-drawer-footer copy-fans-label-group">
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveAddTags">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'addTags',
  props: {
    drawer: {
      type: Object,
      default: () => {}
    },
    groupData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      addTagsParams: {
        tagNameList: this.drawer.name
      },
      rules: {
        tagNameList: [
          { required: true, message: '标签名称不能为空!', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    drawer: {
      handler(val) {
        this.$refs.addTagsParams.resetFields()
        this.addTagsParams.tagNameList = val.name
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  methods: {
    // 添加或修改标签
    async addOrUpdateWxTag(params) {
      params.appAccountId = this.appAccountId
      const response = await this.post(this.fylPath.addOrUpdateWxTag, params)
      const { code, message } = response
      if (code === 1) {
        this.$root.Bus.$emit('refreshList')
        if (this.drawer.type === 'addTags') {
          this.$Message.success('添加标签成功')
        } else {
          this.$Message.success('修改标签成功')
        }
      } else {
        switch (code) {
          case 6821:
            this.$Message.error('标签名称不能重复')
            break
          default:
            this.$Message.error(message)
            break
        }
      }
    },
    async saveAddTags() {
      const valid = await this.$refs.addTagsParams.validate()
      if (valid) {
        let tagNameList = this.addTagsParams.tagNameList
        if (this.drawer.type === 'addTags') {
          tagNameList = this.addTagsParams.tagNameList.split(';')
          let lenBoolean = tagNameList.some((item) => {
            return item.length > 10
          })
          if (lenBoolean) {
            this.$Message.error('每个标签的长度不能超过10个')
            return
          }
          tagNameList = tagNameList.filter((item) => {
            return item !== ''
          })
        }
        this.drawer.show = false
        let params = {
          id: this.drawer.type === 'addTags' ? null : this.drawer.editTagId,
          tagNameList: this.drawer.type === 'addTags' ? tagNameList : [tagNameList],
          groupId: this.drawer.id
        }
        this.addOrUpdateWxTag(params)
      }
    },
    cancleDrawer() {
      this.drawer.show = false
    }
  }
}
</script>
<style lang="stylus">
.addTags
  .form
    padding 50px 20px 0 20px
    .ivu-form
      .ivu-form-item
        .ivu-form-item-label
          line-height 40px
          height 40px
          padding 0
          text-align left
        .ivu-form-item-content
          .textarea
            .ivu-input
              resize none
              line-height 21px
          .tips
            font-size 12px
            color #979899
            margin-top 10px
</style>


