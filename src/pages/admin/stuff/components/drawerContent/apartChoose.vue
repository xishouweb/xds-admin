<template>
    <Modal class="valuevalue" :title="title" v-model="showModal" class-name='modal-apart-modal'>
        <div class="tree_wrap">
          <scroll-bar style="height: 340px">
            <!-- 弹窗关闭时一定要注销treelist 组件 -->
          <treeList v-if="showModal" :datas="datas"
            :expendDeep='0'
            @tree-selected="treeSelected"
            :firstSelected="false"
            :selectedId="selectedId"
            noaction
            ></treeList>
          </scroll-bar>
        </div>
        <div slot="footer">
            <div class="footer_wrap">
                <div class='chooseVal'>
                    <p>当前选中部门</p>
                    <span>{{selectApart.label}}</span>
                </div>
                <div class="btns">
                    <i-button type="primary" size="large" @click='chooseApart'>确定</i-button>
                    <i-button size="large" @click="cancel">取消</i-button>
                </div>
            </div>
        </div>
    </Modal>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import treeList from '../treeList'
export default {
    name: 'apartChoose',
    components: {treeList},
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(nv) {
        this.showModal = nv
      },
      showModal(nv) {
        if (!nv) {
          this.$emit('input', false)
        }
      },
      totalTree: {
        handler() {
          this.datas = this.deepCopy(this.totalTree) || []
        },
        immediate: true
      }
    },

    data() {
        return {
            title: '部门',
            showModal: false,
            selectApart: {},
            stateArr: [],
            curDeptId: null,
            trueExist: false,
            currentApart: null,
            datas: []
        }
    },
    computed: {
      ...mapState({
        totalTree: state => state.stuff.totalTree
      }),
      ...mapGetters({
          currApart: 'stuff/getCurrApart',
          curUser: 'stuff/getCurUser'
      }),
      // datas() {
      //   return this.deepCopy(this.totalTree) || []
      // },
      selectedId() {
        return this.curUser.deptId
      }
    },
    created() {
      this._BUS.$on('showApart', () => {
        this.showModal = true
      })
    },
    methods: {
        // 点击选择
        treeSelected(data) {
          !this.currentApart && (this.currentApart = data) // 缓存原先的所在部门信息
          this.selectApart = data
        },
        chooseApart() {
          if (this.selectApart) {
              this.showModal = false
              this.$emit('on-selected', this.selectApart, this.currentApart)
          } else {
              this.$Message.error('请选择至少一个部门')
          }
        },
        cancel() {
          this.$emit('input', false)
        }
    }
}
</script>
<style>
  .modal-apart-modal.ivu-modal-wrap{
    height: 550px;
    overflow:hidden;
    top:50%;
    transform: translateY(-50%)
  }
  .ivu-modal-footer .footer_wrap{
    display:flex;
    justify-content: space-between
  }
  .ivu-modal-footer .footer_wrap .chooseVal{
    float:left;
    justify-content: flex-start;
  }
  .ivu-modal-footer .footer_wrap .chooseVal p, .ivu-modal-footer .footer_wrap .chooseVal span{
    margin-top:10px;
    float:left;
  }
  .ivu-modal-footer .footer_wrap .chooseVal span{
    color: #409eff;
    margin-left:10px;
    max-width: 200px;
    text-align: left;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
</style>
<style lang="stylus">
@import '~@/assets/stylus/index'
  .tree_wrap
    height:300px
</style>
