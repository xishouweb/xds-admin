<template>
  <div id="picture" v-if="showMedia">
    <DataLoading v-show="uploadingStatusMixin" remindText="上传中..." :dataSatau="1" style="position: absolute"> </DataLoading>

    <slot name="modalheader"></slot>
    <slot name="content"></slot>

    <modelFrame
    v-show="!$slots.content"
    :totalPage="totalPage"
        :pageSize="pageSize"
        :currPage="currPage"
        placeholder="搜索图片名称"
        @changeKeyword="getKeyWord"
        @pageChange="pageChange">
      <template slot="header">
        <span class="title">选择图片</span>
        <span class="close" @click="close"><i class="icon" style="color: #606366;">&#xe674;</i></span>
      </template>

      <template slot="label">
        <labelList :labelList="labelList" @selectGroup="selectGroup"></labelList>
      </template>

      <template slot="action">
          <NewUploadImg v-model="file"
            ref="upload"
            :action="uploadAction"
            @onSuccess="uploadSuccess"
            :corTokenUrl="corTokenUrl">
            <Button size="small" type="primary">上传图片</Button>
          </NewUploadImg>
      </template>

      <template slot="main">
        <Loading v-show="!groupList.length" :loading="loading">暂无图片</Loading>

        <linkList v-show="groupList.length" @on-change="getPicText" :list="groupList"></linkList>
      </template>
      <template slot="footer">
        <div v-if="next">
          <Button style="width: 80px" size="small" type="primary" @click="submit">下一步</Button>
        </div>
        <div v-else>
          <Button size="small" type="primary" @click="submit">确定</Button>
          <Button class="cancel" size="small" @click="cancel">取消</Button>
        </div>
      </template>

    </modelFrame>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import modelFrame from '../modelFrame/index'
import linkList from './linkList'
import labelList from '../modelFrame/labelList'
import mixin from "../mixin.js"
  export default {
    name: 'picturecard',
    components: {
      modelFrame,
      linkList,
      labelList,
      NewUploadImg: () => import('@/components/NewUploadImg.vue'),
      Loading: () => import("@/pages/admin/tencent/components/Loading.vue")
    },
    mixins: [mixin],
    model: {
      prop: "showMedia",
      event: "close"
    },
    props: ['showMedia', 'next', "preScanType"],
    data() {
      return {
        loading: false,
        activeIndex: -1,
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        picture: {},
        labelList: [],
        title: null,
        groupId: null,
        groupList: [],
        metarialType: 'image'
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic',
        imageDefaultGroupId: 'publicAccount/imageDefaultGroupId',
      })
    },
    mounted() {
      this.init()
      document.body.appendChild(this.$el)
    },
    methods: {
      async init() {
        // 获取标签
        let param = {
          appAccountId: this.currPublic.appAccountId,
          type: 'image'
        }
        let res = await this.$post(this.Path.queryCssGroup, param)
        let total = 0
        res.data.data.forEach(item => { total += item.count || 0 })
        res.data.data.sort((item1, item2) => { return item1.groupOrder - item2.groupOrder })
        this.groupId = res.data.data[0].groupId
        this.labelList = [{name: "全部", count: total}, ...res.data.data] || []
        this.getGroupList()
      },
      async getGroupList(arg) {
        this.loading = true
        // 获取列表
        let param = {
          groupId: this.groupId,
          title: this.title,
          appAccountId: this.currPublic.appAccountId,
          offset: (this.currPage - 1) * this.pageSize,
          limit: this.pageSize
        }
        let res = await this.$post(this.Path.queryCssMediaImgList, param)
        this.loading = false
        if (res.data.code === 1) {
          res = res.data.data
          this.groupList = res.records || []
          this.totalPage = res.totalCount
          this.currPage = parseInt(res.offset / res.limit) + 1
          this.pageSize = res.limit
        } else {
          this.$Message.error(res.data.mmessage)
        }
      },
      getKeyWord(keyword) {
        // 根据数据获取列表
        this.pageSize = 10
        this.currPage = 1
        this.title = keyword
        this.getGroupList()
      },
      pageChange(param) {
        // 翻页获取列表
        this.pageSize = param.size
        this.currPage = param.page
        this.getGroupList()
      },
      selectGroup(item, index) {
        // 切换标签获取列表
        this.pageSize = 10
        this.currPage = 1
        this.activeIndex = index
        this.groupId = this.labelList[index].groupId || ''
        this.getGroupList()
      },
      close() {
        this.$emit('close', false)
      },
      submit() {
        if (this.picture.mediaId) {
          this.$emit('submit', this.picture, 'media_id')
        } else {
          this.$Message.error('请选择图片')
        }
      },
      cancel() {
        this.close()
      },
      getPicText(picText) {
        // 得到选中的图文
        this.picture = picText
      },
      uploadSuccess(path) {
        let params = {
            metarialType: this.metarialType,
            groupId: this.groupId || this.imageDefaultGroupId,
            busiType: 1,
            appAccountId: this.currPublic.appAccountId,
            fileOnlinePath: path
          }
        this.saveMedia(params)
      },
      afterSaveMedia(data) {
        this.getGroupList()
      }
    }
  }
</script>
<style lang="stylus">
</style>

