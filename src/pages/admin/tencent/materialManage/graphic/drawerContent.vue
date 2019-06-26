<template>
  <div class="drawer-grahpic">
    <div style="padding: 50px" v-if="drawer.type == 'create'">
      <Form ref="formGroupName" :model="drawer.currentGroup" :rules="ruleGroupName" :label-width="90">
        <FormItem label="分组名称" :model="drawer.currentGroup" prop="name">
          <Input v-model="drawer.currentGroup.name" placeholder="请填写分组名称，不超过10个字" style="width: 330px" />
        </FormItem>
      </Form>
    </div>

    <div v-else-if="drawer.type == 'combiner' ">
      <div v-if="!picText.length" class="pic-text-noImg">
          <img src="@/assets/images/admin/noTencent.png" alt>
          <br>
          <span>暂无图文素材</span>
      </div>
      <div v-else style="padding: 30px">
        <PicText  size="move" :news="picText" width="270px"></PicText>
      </div>
    </div>

    <div class="drawer-footer" v-if="drawer.type === 'combiner'">
      <Button style="width: 70px; margin-right: 15px" type="primary" @click="composeCombiner" :disabled="update">组合</Button>
      <Button style="width: 70px; margin-right: 15px" @click="clearCombiner">清空</Button>
      <Button style="width: 70px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
    <div class="drawer-footer" v-else>
      <Button style="width: 120px; margin-right: 15px" type="primary" @click="saveNew" :disabled="update">保存</Button>
      <Button style="width: 120px; margin-right: 15px" @click="cancleDrawer">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'drawerContent',
  components: {
    PicText: () => import("../Frame/linkList/PicText")
  },
  props: ['labelList', 'drawer', 'metarialType', 'picText'],
  data() {
    return {
        newLabelName: '',
        uploadUrl: '',
        formValidate: {
            title: '',
            url: '',
            desc: '',
            picUrl: '',
            groupId: ''
        },
        grouplist: [],
        ruleValidate: {
            title: [
                { required: true, message: 'The name cannot be empty', trigger: 'blur' }
            ],
            picUrl: [
                { required: true, message: 'Please select gender', trigger: 'change' }
            ]
        },
        ruleGroupName: {
          name: [
            { required: true, message: '分组名称不可为空', trigger: 'blur' },
            { required: true, max: 10, message: '不能超过10个汉字', trigger: 'change' }
          ]
        },
        update: false
    }
  },
  computed: {
    ...mapGetters({
      currPublic: 'publicAccount/curPublic',
      getGraphicGroupList: 'tencent/getGraphicGroupList'
    })
  },
  methods: {
    handleSubmit () {
        this.$refs.formValidate.validate((valid) => {
            if (valid) {
                this.saveMedia()
            } else {
                this.$Message.error('Fail!')
            }
        })
    },
    saveNew() {
      this.update = true
      if (this.drawer.type === 'create') {
        this.createNewGroup()
      } else {
        this.saveMedia()
      }
    },
    async createNewGroup() {
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
          if (this.getGraphicGroupList.length > 50 && !this.drawer.currentGroup.groupId) {
            this.$Message.info('最多可新建50个分组')
            return
          }
          let res = await this.$post(this.Path.saveOrUpdateGroup, param)
          this.update = false
          res = res.data
          if (res.code === 1) {
            this.$Message.success('保存成功！')
            this.drawer.show = false
            this.$emit('refreshLabelList')
          } else {
            this.$Message.error(res.message || '保存失败！')
          }
       }
      })
    },
    saveMedia() {
      this.handleSubmit()
      this.drawer.show = false
    },
    cancleDrawer() {
      this.$refs.formGroupName.resetFields()
      this.drawer.show = false
      this.$emit('refreshGroupList')
    },
    async composeCombiner() {
      let param = {
          groupId: this.drawer.currentGroup.groupId || this.getunGroupedId(),
          appAccountId: this.currPublic.appAccountId,
          articles: this.picText.articles.map(item => { return {detailId: item.id} })
      }
      this.update = true
      let res = await this.$post(this.Path.saveMediaNews, param)
      this.update = false
      res = res.data
      if (res.code === 1) {
        this.$Message.success('组合成功！')
        this.drawer.show = false
        this.picText.articles = []
        this.clearCombiner()
        this.$emit('refreshGroupList')
      } else {
        this.$Message.error('组合失败!')
      }
    },
    clearCombiner() {
      this.picText.length = 0
      this.picText.articles = []
      // this.drawer.show = false
    },
    getunGroupedId() {
      let ungrouped = this.labelList.find((item) => {
          return item.groupType === 0
      })
      return ungrouped.groupId
    }
  }
}
</script>
<style lang="stylus">
  .drawer-grahpic
    .pic-text-noImg
      position absolute
      width 100%
      text-align center
      top 30%
      span
        line-height 66px
        font-size 16px;
        color: #979899;
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
