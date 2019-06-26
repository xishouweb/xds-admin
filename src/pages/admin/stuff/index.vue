<template>
  <div id="createUnit">
    <div class="wrapper">
        <div class="left">
            <div class="title">
              <p><span class="icon fn14" style="color:  #909499">&#xe685;</span>组织架构</p>
            </div>
            <div class="tree_wrap">
                <BScroll>
                    <div class="unit">
                        <data-loading :dataSatau="dataSatau" >
                            <YktTree ref="yktTree" :datas="datas" @tree-action="treeAction"></YktTree>
                        </data-loading>
                    </div>
                </BScroll>
            </div>
        </div>

        <div class="right">
          <StuffData :treeNode="componentsTree"></StuffData>
        </div>
    </div>

    <Drawer v-model="drawer.show" :titleTips="drawer.title" :isScroll="false" :showFooter="false" ref="Drawer" >
      <div slot="content" v-if="drawer.show">
        <addApart v-if="drawer.type === 'add' || drawer.type === 'modify'" :param="drawer.params" @close="closeDrawer"></addApart>
        <addUser v-if="drawer.type === 'addUser'"  @close="closeDrawer"></addUser>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import YktTree from './yktTree.vue'
import StuffData from './StuffData'
import addApart from './components/drawerContent/addApart'
import addUser from './components/drawerContent/addUser'
export default {
    name: "stuff",
    data () {
        return {
            componentsTree: null,
            treeLoading: false,
            buttonProps: {
                type: 'default',
                size: 'small'
            },
            dataSatau: 1,
            datas: [],
            curNodeObj: null,
            stateArr: [],
            drawer: {
              show: false,
              title: '',
              type: '',
              params: {}
            }
        }
    },
    components: {
        StuffData,
        YktTree,
        addApart,
        addUser
    },
    computed: {
      ...mapState({
          corInfo: 'survey/getSaveloginCompany'
      })
    },
    created() {
        this._BUS.$on('getDatas', () => {
            this._BUS.$emit('reciveDatas', this.datas)
        })
        this._BUS.$on('treeUserNumDel', (depthIdList) => {
            for (let val of depthIdList) {
                this.treeUserDel(val)
            }
        })

        this._BUS.$on('addUser', () => {
            this.drawer = {
              show: true,
              type: 'addUser',
              title: '添加员工'
            }
        })
        this.setCurrentNode({})
    },
    mounted() {
      this.componentsTree = this.$refs.yktTree
      this.getTreeData()
    },
    methods: {
      ...mapActions({
        getTree: 'stuff/getTree'
      }),
      ...mapMutations({
            setCurrentNode: 'stuff/SET_CUR_TREE_NODE'
        }),
      async getTreeData() {
        let res = await this.getTree()
        if (res.code === 1) {
          this.datas = this.deepCopy(res.data)
          this.dataSatau = 2
        } else {
          this.dataSatau = 3
        }
      },
      // 打开抽屉
      treeAction(param) {
        if (param.type === 'add') {
          this.drawer = {
            show: true,
            type: param.type,
            title: '添加子部门',
            params: param
          }
        } else if (param.type === 'modify') {
          this.drawer = {
            show: true,
            type: param.type,
            title: '修改部门',
            params: param
          }
        }
      },
      closeDrawer() {
        this.drawer = {
            show: false,
            title: '',
            type: '',
            params: {}
          }
      },

      getUser(key) {
        this._BUS.$emit('getUsers')
      },
      iterateParentNode(val) {
          if (val.currentNode) {
              if (val.currentNode.currentNode.id !== undefined) {
                  return val
              } else if (val.currentNode.currentNode.currentNode) {
                  return this.iterateParentNode(val.currentNode)
              }
          } else {
              return false
          }
      },
      iterateDelNode(val) {
          if (val.currentNode) {
              if (val.currentNode.id !== undefined) {
                  return val
              } else if (val.currentNode.currentNode) {
                  return this.iterateDelNode(val.currentNode)
              }
          } else {
              return false
          }
      },
      iterateCurrNode(val) {
          if (val.currentNode) {
              return this.iterateCurrNode(val.currentNode)
          } else {
              return val
          }
      },
      iteraterDatas(arr, depthId) {
          let isAll = true
          for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === depthId) {
                  isAll = false
                  this.stateArr.push(i)
                  this.iteraterDatas(this.datas, arr[i].parentId)
                  return false
              }
          }
          if (isAll) {
              for (let i = 0; i < arr.length; i++) {
                  if (arr[i].children) {
                      this.iteraterDatas(arr[i].children, depthId)
                  }
              }
          }
      },
      treeUserDel(depthId) {
          this.stateArr = []
          this.iteraterDatas(this.datas, depthId)
          let arr = this.datas
          let idArr = this.stateArr
          for (let i = idArr.length - 1; i >= 0; i--) {
              this.delUserIterate(arr, idArr[i])
              arr = arr[idArr[i]].children
          }
      },
      delUserIterate(arr, idx) {
          this.$set(arr[idx], 'total', arr[idx].total - 1)
      },
      iterateObj(len) {
          let objs = this.curNodeObj
          for (let i = 0; i < len; i++) {
              objs = objs.currentNode
          }
          return objs
      },
      addTreeNode(name, depthId, isModify) {
          let val = this.iterateCurrNode(this.curNodeObj)
          if (!isModify) {
              let currentChildren = val.children || []
              // 取消当节点选中状态
              this.$set(val, 'selected', false)
              // 选中新建的节点
              this.$set(val, 'expand', true)
              let childNode = {
                  expand: false,
                  children: null,
                  number: 0,
                  parentId: val.id,
                  parentLabel: val.title,
                  title: name,
                  order: -1,
                  total: 0,
                  selected: true,
                  id: depthId,
                  value: name,
                  flag: val.flag + '-0'
              }
              currentChildren.push(childNode)
              this.$set(val, 'children', currentChildren)

              let obj = {
                  currentIndex: currentChildren.length - 1,
                  currentNode: childNode,
                  parentNode: currentChildren,
                  rootNode: false
              }
              let node = this.installCurNode(this.curNodeObj)
              this.$set(node, 'currentNode', obj)
              this.$set(this.curNodeObj, 'rootNode', false)
              this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(childNode))
              this._BUS.$emit('getUsers')
          } else {
              this.$set(val, 'title', name)
              this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(val))
              this.$emit("getCurrentNode", val)
          }
      },
      // 用于增加节点后重置curObj
      installCurNode(val) {
          if (val.currentNode && val.currentNode.currentNode) {
              return this.installCurNode(val.currentNode)
          } else {
              return val
          }
      },
      delTreeNode(value) {
          let val = this.iterateDelNode(value)
          let node = this.iterateParentNode(value)
          let curId = val.currentNode && val.currentNode.id
          let key = 0
          for (let i = val.parentNode.length - 1; i >= 0; i--) {
              if (val.parentNode[i] && (val.parentNode[i].id === curId)) {
                  key = i
              }
          }
          val.parentNode.splice(key, 1)
          let parentId = node.currentNode.currentNode.parentId
          for (let item of node.parentNode) {
              if (item.id === parentId) {
                  this.$set(item, 'selected', true)
                  this.$set(node, 'currentNode', item)
                  parentId === 32 && (this.$set(node, 'rootNode', true))
                  this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(item))
              }
          }
      },
      getCurrentNode(val) {
          this.curNodeObj = val
          this.$store.commit('stuff/SET_FILTE_OPT', null)
          this.$store.commit('stuff/SET_Filter_DATA', null)
          let node = this.iterateCurrNode(val)
          node.isRoot = val.rootNode = true && !val.currentNode.currentNode
          val && this.$store.commit('stuff/SET_CUR_APART', this.deepCopy(node))
          this.getUser()
      }
    },
    beforeDestroy() {
      this._BUS.$off('getDatas')
      this._BUS.$off('treeUserNumDel')
      this._BUS.$off('getTreeData')
      this._BUS.$off('addAparts')
      this._BUS.$off('delAparts')
    }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/fun'
#createUnit
    height 100%
    .wrapper
        display flex
        height 100%
        overflow:hidden
        .left
            fl()
            inline()
            width 14%
            height 100%
            min-width:200px
            bgColor()
            .title
                vertical(56px)
                padding: 0 10px
                margin-bottom: 18px
                .icon
                    padr(10px)
                >p
                  border-bottom: 1px solid #edeff0
            .tree_wrap
                height: calc(100% - 57px)
        .right
            fr()
            height 100%
            width: 85%
            ml(10px)
            bgColor()
            padding 20px 10px 10px 20px
</style>
