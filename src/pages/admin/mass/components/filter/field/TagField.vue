<template>
  <FormItem>
    <div class="formItem">
      <div class="formItemLabel">
        <Poptip
          trigger="hover"
          placement="right"
          word-wrap
          width="214"
          content="公众号与公众号之间的标签选择为并集关系，标签分组内为并集，组与组之间为交集。并集即满足任意一个标签。交集即每个已选的分组，都有任意一个标签。"
        >
          <span>标签</span>
          <a><i class="icon">&#xe635;</i></a>
        </Poptip>
      </div>
      <div class="formItemControl">
        <RadioList v-model="selecTagData">
          <RadioItem name @click.native="empty(0)">
            <span>不限</span>
          </RadioItem>
          <RadioItem name="NO_TAGS">
            <span>无标签</span>
          </RadioItem>
        </RadioList>
        <!-- 指定标签 -->
        <SelectTag
          v-model="tagVisible"
          ref="selectTag"
          :tagData="tagData"
          @on-ok="tagsOk"
        >
          <template>
            <RadioItem @click="tagVisible = true" :value="selecTagData === 'HAS_TAGS'">
              <span>指定标签</span>
            </RadioItem>
            <div v-if="selecTagData !== 'NO_TAGS' && selecTagData && selecTagData.length" class="selectedRadio">
              <!-- 选中标签 -->
              <template v-for="(v, i) in selecTagData">
                <div class="condTag checked" :key="v.id" v-if="i < 3 && v.checked">
                  <span class="condTxt">{{v.tagName}}</span>
                  <span class="icon" @click.stop="deleteTag(v.tagId)">&#xe674;</span>
                </div>
              </template>
              <!-- 查看更多 -->
              <span class="look-all" v-if="selecTagData.length > 3" @click="tagVisible = true">查看全部{{selecTagData.length}}标签</span>
            </div>
          </template>
        </SelectTag>
      </div>
    </div>
  </FormItem>
</template>

<script>
import { mapState } from "vuex"
import RadioList from "../radio/radio-list"
import RadioItem from "../radio/radio-item"
import SelectTag from "../SelectTag"
export default {
  name: "tagField",
  components: { RadioList, RadioItem, SelectTag },
  props: {
    value: { // 选中标签情况
      type: [String, Array], // '', 'NO_TAGS', [ids]
      default() {
        return ""
      }
    },
  },
  data() {
    return {
      tagVisible: false, // 控制选择标签模态框的显示
      tagData: null, // 当前公众号下的标签分组及标签数据
      selecTagData: [], // 选中标签，'' 'NO_TAGS' [ids]
    }
  },
  watch: {
    value: {
      handler(val) {
        this.getTags()
        this.$emit("change", val)
      },
      deep: true
    },
    tagData: {
      handler(val) {
        this.filtTags()
      },
      deep: true
    },
    curPublic() {
      this.getTags()
    },
    selecTagData: { // 选中标签变化
      handler(val) {
        if (typeof val === 'object' && val.length) {
          this.syncTagData()
        } else if (val === 'NO_TAGS') {
          this.empty()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      curPublic: state => state.publicAccount.curPublic
    })
  },
  mounted() {
    this.getTags()
  },
  methods: {
    getTags() { // 获取标签数据
      if (!this.curPublic) { return }
      this.post(this.Path.getWxGroupAndTagList, {
        appAccountId: this.curPublic.appAccountId
      }).then(res => {
        if (res.code !== 1 || !res.data) {
          this.selecTagData = ''
          return
        }
        this.tagData = res.data.fansGroupAndTagDtos.sort(this.sortBy('groupOrder', 'max')) // 标签组排序
        let dex = null
        this.tagData.forEach((v, i) => {
          (v.fansWxTagDtos || []).sort(this.sortBy('tagOrder', 'max')) // 标签排序
          if (v.name === '微信标签') { dex = i }
        })
        this.tagData.unshift(this.tagData.splice(dex, 1)[0])
        this.filtTags()
      })
    },
    filtTags() { // 过滤标签，添加选中状态属性,根据id过滤出选中标签
      // init存在时根据id过滤
      let val = this.value
      let ids = typeof val !== 'object' ? [] : val
      this.selecTagData = typeof val !== 'object' ? val : []
      if (!this.tagData || !this.tagData.length) { return }
      this.tagData.forEach((k, i) => {
        let tags = k.fansWxTagDtos
        k.tags = tags
        if (tags && tags.length) {
          tags.forEach((v, j) => {
            v.isRadio = !!(v.specialGroup === 1)
            // v.checked = false
            if (typeof val === 'object') {
              let dex = ids.indexOf(v.tagId)
              v.checked = !!(dex >= 0)
              if (dex >= 0) {
                this.selecTagData.push(v)
              }
            }
          })
        }
      })
    },
    filtTagsId(groups, delId) { // 根据选中状态过滤出选中标签
      let dat = [[], []]
      groups.forEach(k => {
        let tags = k.fansWxTagDtos
        if (tags && tags.length) {
          tags.forEach(v => {
            if (delId) {
              if (delId.indexOf(v.tagId) >= 0) {
                v.checked = false
              }
            }
            if (v.checked) {
              dat[0].push(v)
              dat[1].push(v.tagId)
            }
          })
        }
      })
      return dat
    },
    syncTagData() { // 同步tagData的选中状态
      let ids = []
      this.selecTagData.forEach(v => {
        ids.push(v.tagId)
      })
      this.tagData.forEach(k => {
        let tags = k.fansWxTagDtos
        if (tags && tags.length) {
          tags.forEach(v => {
            let dex = ids.indexOf(v.tagId)
            v.checked = !!(dex >= 0)
          })
        }
      })
    },
    tagsOk(dat) { // 点击模态框确定按钮
      let arr = this.filtTagsId(dat)
      this.selecTagData = arr[0] // 选中标签详细数据
      let val = arr[1].length ? arr[1] : null // 选中标签id
      this.$emit('on-ok', val)
    },
    deleteTag(id) { // 删除标签
      let arr = this.filtTagsId(this.tagData, [id])
      this.selecTagData = arr[0] // 选中标签详细数据
      let val = arr[1].length ? arr[1] : '' // 选中标签id
      this.$emit('on-ok', val)
    },
    empty(type) { // 清空选中标签
      if (type === 0) { // 不限
        this.$emit('on-ok', "")
        console.log('清空')
      } else { // 无标签
        this.$emit('on-ok', "NO_TAGS")
      }
    }
  }
}
</script>
<style lang="stylus">
.look-all
  color #409fff
  cursor pointer
.selectedRadio
  display inline-block
// .condTag
  // margin-top 16px
</style>
