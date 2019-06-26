<template>
  <div>
    <DataLoading v-show="uploadingStatusMixin" remindText="上传中..." :dataSatau="1" style="position: absolute"> </DataLoading>
    <!-- 素材弹框 -->
    <component
      v-if="showMedia"
      :type="type"
      :messageContent="messageContent"
      :is="mediaType[metarialType][0]"
      v-model="showMedia"
      @submit="getMaterial" ></component>

    <div class="placement-container">
      <div v-if="getMuneMaterial" class="material-placement">
        <ScrollBar>
          <div class="material-box"
          :style="{width: 'posterTemplate'.includes(metarialType) ? '333px': '210px' }"
          ref="materialBox">
              <!-- 素材模板 -->
              <component @hook:updated="materialBoxMounted"
              :is="mediaType[metarialType][3]"
              :media="getMuneMaterial"
              size="small"
              ></component>
              <div ref="materialAction" class="material-action" slot="content">
                  <span class="icon edit" @click="edit">&#xe61d;</span>
                  <span class="icon delete" @click="del">&#xe652;</span>
              </div>
          </div>
        </ScrollBar>
      </div>
      <template v-else>
        <div class="placement">
            <div class="row1"><span class="icon" @click="selectFromMaterial">&#xe601;</span></div>
            <div class="row2">{{mediaType[metarialType][1]}}</div>
        </div>
        <div class="placement" v-if="mediaType[metarialType][2]">
          <div class="row1" >
            <NewUploadImg v-model="file"
                ref="upload"
                :limitSize="mediaType[metarialType][5]"
                :action="uploadAction"
                @onSuccess="uploadSuccess"
                :accept="mediaType[metarialType][7]"
                :corTokenUrl="corTokenUrl">
                <span class="icon">&#xe601;</span>
            </NewUploadImg>
          </div>
          <div class="row2">{{mediaType[metarialType][2]}}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js"
import { mapState, mapGetters, mapActions } from 'vuex'
import { localSaveOrRead } from "@/utils/util.js"
import Poster from "../poster/"
import PosterTemp from "@/components/mediaTemplate/posterTemp.vue"
export default {
  name: 'marktingContent',
  components: {
    Poster,
    PosterTemp,
    NewUploadImg: () => import('@/components/NewUploadImg.vue')
  },
  data() {
    return {
      showMedia: false, // 显示选择素材弹框
      typeIndex: 0,
      mediaType: {
        posterTemplate: ["Poster", "从裂变海报中选择", null, "PosterTemp", {}, 10, null, '']
      },
      menuId: 0,
      material: null,
    }
  },
  props: {
    keyType: {
      default: '',
      type: String
    },
    messageContent: {
      default: () => {},
      type: Object
    },
    type: {
      default: '',
      type: String
    }
  },
  watch: {
    messageContent: {
      immediate: true,
      handler(nv, ov) {
        this.menuId = nv.menuId
        if (nv.key === "posterTemplate" && nv.value) {
          this.getModifyPosterTemp(nv.value || nv[nv.key])
        }
      },
      deep: true
    }
  },
  computed: {
    metarialType() {
      let currentComponentTypes = 'posterTemplate'
      return currentComponentTypes.includes(this.messageContent.key) ? this.messageContent.key : 'posterTemplate'
    },
    groupId() {
      return this.mediaType[this.metarialType][6]
    },
    getMuneMaterial() {
      return this.mediaType[this.metarialType][4][this.menuId] || ''
    },
    ...mapState('poster', {
      newCreatedPoster: state => state.newCreatedPoster
    }),
    ...mapGetters({
      currPublic: "publicAccount/curPublic"
    })
  },
  mixins: [mixin],
  mounted() {
    if (localSaveOrRead('fromPage') === "createPoster") {
      this.getModifyPosterTemp(this.newCreatedPoster)
    }
  },
  methods: {
    ...mapActions({
      getPosterTemplate: "poster/getPosterTemplate"
    }),
    selectFromMaterial() {
      this.showMedia = true
    },
    // 拿到选中的媒体
    getMaterial(material, type) {
      this.showMedia = false
      this.setMuneMaterial(material)
    },
    // 设置菜单媒体 以及对应的 内容
    setMuneMaterial(material) {
      let muneMaterial = this.mediaType[this.metarialType][4]
      muneMaterial[this.menuId] = material
      this.mediaType[this.metarialType].splice(4, 1, muneMaterial)
      // 提交到微信菜单
      if (material) this.updateMessageContent(material)
    },
    updateMessageContent(material) {
      let type = "markting"
      if (material) {
        let mediaId = material.id
        let type = "markting"
        this.$root.Bus.$emit('messageChange', mediaId, this.metarialType, type, material)
      } else {
        this.$root.Bus.$emit('messageChange', '', this.metarialType, type, {})
      }
    },
    // 编辑选中的媒体
    edit() {
      this.showMedia = true
    },
    // 删除选中的媒体
    del() {
      this.material = null
      this.setMuneMaterial(null)
      this.$root.Bus.$emit('material')
      this.updateMessageContent()
    },
    materialBoxMounted() {
      let materialAction = this.$refs.materialAction
      let xpos = this.$refs.materialBox.getBoundingClientRect()
      let height = xpos.bottom - xpos.top
      materialAction.style.top = (height <= 240 ? height : 240) - 30 + 'px'
    },
    // 获取海报模板
    async getModifyPosterTemp(id) {
      let param = {
        id: id,
        appAccountId: this.currPublic.appAccountId
      }
      let res = await this.getPosterTemplate(param)
      if (res.code === 1) {
        this.setMuneMaterial(res.data)
      }
    },
    // 上传文件成功
    uploadSuccess(path) {
      let params = {
          metarialType: this.metarialType,
          groupId: this.groupId,
          busiType: 1,
          appAccountId: this.currPublic.appAccountId,
          fileOnlinePath: path,
          fileSourceType: 1,
        }
      if (this.metarialType === 'file') {
        params.busiType = 3
      }
      this.saveMedia(params)
    },
    // 上传文件成功
    afterSaveMedia(data) {
      this.setMuneMaterial()
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/stylus/mixin'
  .placement-container
    width 100%
    height 300px
    padding 30px 0
    .material-placement
      height 100%
    .material-box
      position relative
      margin-left 30px
      border-radius: 3px;
      border: solid 1px #e3e4e5;
      width: 210px;
      &:hover
        color: #333333
        .edit, .delete
          cursor pointer
          display inline
      .edit, .delete
          display none

      .user_detail
        display none !important
      .picCard
        padding 0

      .material-action
        height 40px
        line-height 40px
        width: 60px;
        position: absolute;
        bottom: 0px;
        right: -60px;
        text-align: right;
    .ivu-poptip-inner
      width: 100%;
      background-color none !important
      box-shadow: none !important

  .placement
    float left
    padding-top 88px
    text-align center
    width: calc(50% - 45px);
    height: 240px;
    margin-left 30px
    border: solid 1px #e3e4e5;
    .row1
      height 40px
      color: #cacbcc;
      .icon
        font-size 40px
        cursor pointer
    .row2
      padding-top 10px
      color: #979899;
</style>


