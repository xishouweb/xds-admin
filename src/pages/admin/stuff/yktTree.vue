<template>
  <div class="ykt-suff-tree" @mouseleave="showBulletBox = false">
    <treeList
    ref="ykttree"
    :datas="TreeData"
    @tree-action="treeAction"
    @tree-selected="treeSelected"
    @node-hover="treeHoverChange"
    :selectedId="selectedId"
    ></treeList>

    <BulletBox :position="position" v-if="showBulletBox">
      <ul @mouseleave="showBulletBox = false" class="actionWrap">
        <li class="actionWrap-item"
            v-for="(_item, _index) in treeOperations" :key="_index"
            @click.stop="treeCurrentNodeOperations(_item.type)">{{_item.title}}</li>
      </ul>
    </BulletBox>

    <Modal :title="modal.title" v-model="modal.show" class-name="self-center-modal">
      <div v-html="modal.content"></div>
      <div slot="footer">
        <Button type="primary" @click.stop="modalConfirm">{{modal.ok}}</Button>
        <Button @click.stop="modal.show = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import BulletBox from '@/components/BulletBox.vue'
import treeList from './components/treeList'

export default {
  components: {BulletBox, treeList},
  data () {
      return {
          treeOperations: [
              { title: '添加子部门', type: "addChild" },
              { title: '修改', type: "modify" },
              { title: '删除', type: "delete" },
              { title: '上移', type: "moveup" },
              { title: '下移', type: "movedown" }
          ],
          modal: {
            show: false,
            title: '',
            ok: '确定',
            content: ''
          },
          currVal: {},
          TreeData: this.datas,
          treeOperationsNode: null,
          showBulletBox: false,
          noTag: false,
          position: {x: 0, y: 0},
          selectedId: null
      }
  },
  props: ['width', 'noOperation', 'datas'],
  watch: {
    datas(nv) {
      this.getSelectedId ? (this.selectedId = this.getSelectedId) : (this.selectedId = nv[0].id)
    },
    totalTree(nv) {
      this.TreeData = this.deepCopy(nv)
      this.$nextTick(() => {
        this.getSelectedId ? (this.selectedId = this.getSelectedId) : (this.selectedId = nv[0].id)
      })
    }
  },
  computed: {
    ...mapState({
      totalTree: state => state.stuff.totalTree
    }),
    ...mapGetters({
      getSelectedId: 'stuff/getSelectedId'
    })
  },
  methods: {
    ...mapMutations({
      setCurrentNode: 'stuff/SET_CUR_TREE_NODE',
      setTotalTree: 'stuff/SET_TOTAL_TREE'
    }),
    setVuexData(data) {
      data && this.setCurrentNode(this.deepCopy(data))
    },
    // 点击选择
    treeSelected(data, prarm) {
      this.setVuexData(data)
      this.treeOperationsNode = prarm
    },
    // 操作 气泡位置
    treeAction(position) {
      this.showBulletBox = true // 显示操作
      this.position = {
          x: position.x + position.w + 18,
          y: position.y - 8
      }
    },
    treeCurrentNodeOperations(type) {
        this.showBulletBox = false
        if (type === 'addChild') {
            this.addTreeNode(this.treeOperationsNode)
        } else if (type === 'modify') {
            this.modifyTreeNode(this.treeOperationsNode)
        } else if (type === 'delete') {
            this.deleteTreeNode(this.treeOperationsNode)
        } else if (type === 'moveup') {
            this.moveupTreeNode(this.treeOperationsNode)
        } else if (type === 'movedown') {
            this.movedownTreeNode(this.treeOperationsNode)
        }
    },
    treeHoverChange(val) {
      if (this.treeOperationsNode.currentNode && val.id === this.treeOperationsNode.currentNode.id) {
        this.showBulletBox = false
      }
    },
    treeSelection(val) {
        this.currVal = val
        this.$emit("getCurrentNode", val)
    },
    addTreeNode(val) {
      this.$emit('tree-action', {
        type: "add",
        label: val.currentNode.label,
        id: val.currentNode.id,
        afterAdd: (param) => { // 接口后调用
          let newNode = {
              acEmployeeDtos: null,
              children: [],
              deptOrder: null,
              eeNum: 0,
              copyeeNum: 0,
              extItem: null,
              expend: false,
              selected: true,
              id: param.id,
              label: param.label
          }
          this.selectedId = param.id
          val.currentNode.expend = true
          val.currentNode.selected = false
          // if (!val.current.children) {
          //   val.currentNode.children.push(newNode)
          // }
          val.currentNode.children.push(newNode)
        }
      })
    },
    modifyTreeNode(val) {
      let parentId = val.parent.id
      let id = val.currentNode.id
      if (parentId === id) {
        this.$Message.error('根部门不能修改！')
      } else {
        this.$emit('tree-action', {
          type: "modify",
          parentLabel: val.parent.label,
          parentId: val.parent.id,
          label: val.currentNode.label,
          id: val.currentNode.id,
          afterAdd: (param) => { // 接口后调用
            val.currentNode.label = param.label
            val.currentNode.selected = true
            this.setVuexData()
          }
        })
      }
    },
    // delete
    deleteTreeNode(val) {
      let { parent, currentNode, currentIndex, brothers } = val
      if (parent.id === currentNode.id) {
        this.$Message.error('根部门不能删除！')
      } else if (currentNode.children.length) {
        this.$Message.error('请先删除子部门！')
      } else if (currentNode.eeNum) {
        this.$Message.error('请先删除部门下员工！')
      } else {
        this.modal = {
            show: true,
            type: 'delApart',
            title: '删除',
            ok: '确定',
            id: currentNode.id,
            content: `确定删除${currentNode.label}吗？`,
            afterDel: () => {
              parent.selected = true
              brothers.splice(currentIndex, 1)
              this.selectedId = parent.id
            }
          }
      }
    },
    modalConfirm() {
      if (this.modal.type === 'delApart') {
        this.delCurApart()
      }
    },
    delCurApart() {
      this.delApart({id: this.modal.id}).then((res) => {
        if (res.code === 1) {
          this.modal.afterDel()
          this.modal = {
            show: false
          }
          this.$Message.success('删除成功')
        } else {
          this.$Message.success(res.message)
        }
      })
    },
    // 上移
    moveupTreeNode(val) {
      let { currentIndex, brothers, currentNode } = val
      if (!currentIndex) {
        this.$Message.error('此部门无法上移!')
      } else {
        this.$get(this.Path.moveApart, {upDeptId: currentNode.id, downDeptId: brothers[currentIndex - 1].id}).then((res) => {
          if (res.code === 1) {
            brothers.splice(currentIndex - 1, 0, brothers.splice(currentIndex, 1)[0])
            this.setVuexData()
          } else {
            this.$Message.error('部门移动失败！')
          }
        })
      }
    },
    // 下移
    movedownTreeNode(val) {
      let { currentIndex, brothers, currentNode } = val
      if (currentIndex === brothers.length - 1) {
        this.$Message.error('此部门无法下移!')
      } else {
        this.$get(this.Path.moveApart, {upDeptId: currentNode.id, downDeptId: brothers[currentIndex + 1].id}).then((res) => {
            if (res.code === 1) {
                brothers.splice(currentIndex + 1, 0, brothers.splice(currentIndex, 1)[0])
                this.setVuexData()
            } else {
                this.$Message.error('部门移动失败！')
            }
        })
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
