<template>
  <div id="picture" v-if="showMedia">
    <DataLoading v-show="uploadingStatusMixin" remindText="上传中..." :dataSatau="1" style="position: absolute"> </DataLoading>
    <modelFrame
      :totalPage="totalPage"
      :pageSize="pageSize"
      :currPage="currPage"
      placeholder="搜索视频标题"
      @changeKeyword="getKeyWord"
      @pageChange="pageChange">
      <template slot="header">
        <span class="title">选择视频</span>
        <span class="close" @click="close"><i class="icon">&#xe674;</i></span>
      </template>

      <template slot="label">
        <labelList :labelList="labelList" @selectGroup="selectGroup"></labelList>
      </template>

      <template slot="action">
          <NewUploadImg v-model="file"
          ref="upload"
          accept="video/*"
          :action="uploadAction"
          @onSuccess="uploadSuccess"
          :slice="true"
          :corTokenUrl="corTokenUrl">
            <Button size="small" type="primary">上传视频</Button>
          </NewUploadImg>
      </template>

      <template slot="main">
        <Loading v-show="!groupList.length" :loading="loading">暂无视频</Loading>
        <linkList v-show="groupList.length" @on-change="getPicText" :list="groupList"></linkList>
      </template>

      <template slot="footer">
        <Button size="small" type="primary" @click="submit">确定</Button>
        <Button class="cancel" size="small" @click="cancel">取消</Button>
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
    props: ['showMedia'],
    data() {
      return {
        loading: false,
        activeIndex: 0,
        totalPage: 0,
        pageSize: 10,
        currPage: 1,
        video: {},
        labelList: [],
        title: null,
        groupId: null,
        groupList: [],
        metarialType: 'video',
      }
    },
    computed: {
      ...mapGetters({
        currPublic: 'publicAccount/curPublic',
        getVideoGroupList: 'tencent/getVideoGroupList',
        videoDefaultGroupId: 'tencent/videoDefaultGroupId'
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
          type: this.metarialType
        }
        let res = await this.$post(this.Path.queryCssGroup, param)
        let total = 0
        res.data.data.forEach(item => { total += item.count || 0 })
        this.groupId = this.videoDefaultGroupId || null
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
        let res = await this.$post(this.Path.queryCssMediaVideoList, param)
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
        this.pageSize = 10
        this.currPage = 1
        // 根据数据获取列表
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
        this.pageSize = 10
        this.currPage = 1
        // 切换标签获取列表
        this.activeIndex = index
        this.groupId = this.labelList[index].groupId || ''
        this.getGroupList()
      },
      close() {
        this.$emit('close', false)
      },
      submit() {
        if (this.video.mediaId) {
          this.$emit('submit', this.video, 'media_id')
        } else {
          this.$Message.error('请选择视频')
        }
      },
      cancel() {
        this.close()
      },
      getPicText(picText) {
        // 得到选中的图文
        this.video = picText
      },
      uploadSuccess(path) {
        let params = {
            metarialType: this.metarialType,
            groupId: this.groupId,
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
// @import "~@/assets/stylus/index.styl"
// #picture
//   width: 885px;
//   height: 740px;
//   background-color: #ffffff;
//   box-shadow: 1px 0px 6px 0px rgba(0, 0, 0, 0.2);
//   border-radius: 3px;
//   border: solid 1px #cacbcc;
//   padding 20px
//   css3Middle()
</style>

