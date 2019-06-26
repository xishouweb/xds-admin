<template>
  <div v-if="!changePage" class="add-repository">
    <div class="form">
      <Form ref="formRepository" :model="formRepository" :rules="ruleInline" :label-width="99">
        <FormItem prop="title" label="标题">
          <Input v-model.trim="formRepository.title" clearable placeholder="请填写知识库标题，不超过30个字" style="width: 35%"></Input>
        </FormItem>
        <FormItem prop="group" label="分组">
          <Select v-model="formRepository.group" placeholder="请选择分组" style="width: 15.5%">
            <Option v-for="(item, index) in groupList" :key="index" :value="item.id">{{item.groupName}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="textarea" label="详细内容">
          <Input class="textarea" v-model.trim="formRepository.textarea" :rows="15" type="textarea" style="width: 61.5%" placeholder="请填写详细内容"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formRepository')">确定</Button>
            <Button type="ghost" @click="handleCancel" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  model: {
    prop: 'changePage',
    event: 'close'
  },
  props: {
    changePage: {
      default: true,
      type: Boolean
    },
    itemParams: {
      default: () => {},
      type: Object
    },
  },
  data() {
    // const validateGroup = (rule, value, callback) => {
    //   if (!value) {
    //       callback(new Error('请选择分组！'))
    //   } else {
    //       callback()
    //   }
    // }
    return {
      formRepository: {
        title: this.itemParams.title || '',
        group: this.itemParams.groupId,
        textarea: this.itemParams.content || ''
      },
      ruleInline: {
        title: [
          { required: true, message: '请填写知识库标题!', trigger: 'blur' },
          { type: 'string', max: 30, message: '知识库标题不能超过30个字', trigger: 'blur' }
        ],
        // group: { validator: validateGroup, trigger: 'blur' },
        textarea: { required: true, message: '请填写详细内容!', trigger: 'blur' }
      },
      updataOrSaveParams: {},
      groupList: []
    }
  },
  computed: {
    ...mapGetters({
      saveloginCompany: 'survey/getSaveloginCompany'
    })
  },
  created() {
    this.queryKnowledgeBaseGroupListInfo()
  },
  mounted() {
  },
  methods: {
    // 知识库更新或者保存
    updateOrSaveCorpKnowledgeBase(params) {
      this.post(this.fylPath.updateOrSaveCorpKnowledgeBase, params).then(data => {
        if (data.code === 1) {
          this.$Message.success('添加成功！')
          this.$emit('close', true)
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 知识库分组列表以及总条数
    queryKnowledgeBaseGroupListInfo() {
      let params = {
        companyId: this.localStorageSaveOrRead('currentCorp').applyId
      }
      this.post(this.fylPath.queryKnowledgeBaseGroupListInfo, params).then(data => {
        if (data.code === 1) {
          let groupData = data.data.sort(this.sortBy('groupSort', 'min'))
          groupData = groupData.sort(this.sortBy('groupType', 'max'))
          this.formRepository.group = groupData[0].id
          this.groupList = groupData
          // this.formRepository.group = this.itemParams.groupId
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updataOrSaveParams = {
            id: this.itemParams.id || null,
            companyId: this.localStorageSaveOrRead('currentCorp').applyId,
            groupId: this.formRepository.group,
            title: this.formRepository.title,
            content: this.formRepository.textarea,
            createId: this.saveloginCompany.createId,
            updateId: this.saveloginCompany.employeeData.eeId,
            createTime: this.formatDateTime(new Date()),
            updateTime: this.formatDateTime(new Date()),
          }
          this.updateOrSaveCorpKnowledgeBase(this.updataOrSaveParams)
        } else {
        }
      })
    },
    handleCancel() {
      this.$emit('close', true)
    }
  }
}
</script>
<style lang="stylus">
.add-repository
  padding-top 50px
  padding-bottom 20px
  .form
    .ivu-form
      .ivu-form-item
        margin-bottom 36px
        .ivu-form-item-label
          text-align left
          padding-left 10px
          position relative
          &:before
            position absolute
            left 0
            top 10px
        .ivu-form-item-content
          .textarea
            .ivu-input
              resize none
              line-height 21px
</style>


