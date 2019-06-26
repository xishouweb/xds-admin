
/*
* treeData:     树的数据,
* root          标识树的最顶层,
* noRootBorder  树DOM的最顶层是否需要显示边框,
* noOperation   判断是否显示操作功能,
* operations    操作功能列表 [{ title: 功能名, type: 功能类型 }],
* children      子节点属性名,
* title         当前节点的title,
* noTag         判断是否显示标签,
* tagName       标签的属性名称,
* width         树DOM样式宽度,
* sparkLine     在当前节点无子节点时的样式,
* allTree       做循环内部使用, 方便任何子节点都何以找到整个树的数据, 不需要外部传入
*/
<template>
    <ul class="owly-tree-content">
        <li class="owly-parent-node"
            v-for="(item, index) in currNode" :key="index" v-if="item"
            @mouseenter.prevent.stop="mouseEnterFn(index, true)"
            :class="{'owly-node-has-border' : item[children] && !noRootBorder,
                    'owly-last-node': currNode.length <= (index + 1),
                    'owly-tree-root': root,
                    'owly-no-child': !item[children]
                    }">
            <div @hover="handleHover" @click.stop="getCurrentNode(item, index, 'true')" class="owly-title"
                :class="{'owly-select': item.selected}">
                <span v-if="item[children] && item[children].length > 0"
                    class="display-children-node"
                    :class="{'owly-child-node-opened' : item.expand}"
                    @click.stop="showChildrenNode(item, index)"></span>

                <span v-else class="no-child-node"
                :style="{'width': sparkLine.width+'px',
                        'height': sparkLine.height+'px',
                        'top': sparkLine.top+'px',
                        'left': sparkLine.left+'px',
                        }"></span>

                <span class="owly-title-text">{{item[title]}}
                    <span v-if="!noTag">({{item[tagName]}})</span>
                </span>

                <div v-if="!noOperation" class="owly-operation">
                    <!-- <Poptip placement="right-start" width="94" trigger="click" @mouseleave.native="closePoptip" > -->
                        <Icon class="owly-operation-btn" type="android-more-vertical" @click.native="operation($event, item, index, true)"></Icon>
                        <!-- <div slot="content">
                           <div class="owly-operation-item"
                            v-for="(_item, _index) in operations" :key="_index"
                           @click.stop="operation(item, index, _item.type)">{{_item.title}}</div>
                        </div>
                    </Poptip> -->
                </div>
                <div class="owly-title-bg" :style="{width: initWidth+'px'}"></div>
            </div>
            <ul v-show="item.expand" v-if="item[children]" class="owly-child-node">
                <TreeList
                    :treeData="item[children]"
                    @select="getCurrentNode"
                    @hoverChange="mouseEnterFn"
                    @operation="operation"
                    :noRootBorder="noRootBorder"
                    :noOperation="noOperation"
                    :noTag="noTag"
                    :operations="operations"
                    :width="initWidth"
                    :children="children"
                    :title="title"
                    :tagName="tagName"
                    :sparkLine="sparkLine"
                    :allTree="AllTreeDate"></TreeList>
            </ul>
        </li>
    </ul>
</template>

<script>

export default {
    name: 'TreeList',
    props: {
        treeData: {
            type: Array,
            default() { return [] }
        },
        root: {
            type: Boolean,
            default: false
        },
        noRootBorder: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'title'
        },
        operations: {
            type: Array,
            default() { return [] }
        },
        noOperation: {
            type: Boolean,
            default: false
        },
        noTag: {
            type: Boolean,
            default: false
        },
        tagName: {
            type: String,
            default: 'number'
        },
        children: {
            type: String,
            default: 'children'
        },
        width: {
            type: Number,
            default() { return 0 }
        },
        sparkLine: {
            type: Object,
            default() { return {height: 10, width: 10, top: 11, left: -18} }
        },
        allTree: {
            type: Array,
            default() { return [] }
        },
        expandAll: {
          type: Boolean,
          default: false
        }
    },
    data() {
        let self = this
        return {
            currNode: self.treeData,
            allTreeData: self.allTree,
            initWidth: self.width,
            showChildren: false,
            currNodeIndex: null,
            showTitleBg: 'none',
            unselected: true
        }
    },
    mounted() {
        if (!this.initWidth) {
            this.initWidth = 1000
        }
    },
    computed: {
        AllTreeDate() {
            if (this.root) {
                return this.currNode
            } else {
                return this.allTreeData
            }
        },
        CurrNode() {
            return this.currNode
        }
    },
    watch: {
        treeData: {
            handler(newVal, oldVal) {
                this.$set(this, "currNode", newVal)
                this.init()
            }
        }
    },
    methods: {
        init() {
            if (this.root && this.unselected) {
                this.$set(this.currNode[0], 'selected', true)
                let param = {
                    currentNode: this.currNode[0],
                    currentIndex: 0,
                    parentNode: this.currNode,
                    rootNode: this.root
                }
                this.$emit('select', param)
            }
        },
        getCurrentNode(item, index, flag) {
            if (flag === 'true') {
                this.currentIndex = index
                this.unselected = false
                this.cancelSelected(this.AllTreeDate)
                this.$set(item, 'selected', true)
            }
            let param = {
                currentNode: item,
                currentIndex: index,
                parentNode: this.currNode,
                rootNode: this.root
            }
            this.$emit('select', param, index)
        },
        cancelSelected(arr) {
            arr.forEach(item => {
                if (item.selected) {
                    this.$set(item, 'selected', false)
                }
                if (Array.isArray(item[this.children])) {
                    this.cancelSelected(item.children)
                }
            })
        },
        showChildrenNode(item, index) {
            this.$set(item, "expand", !item.expand)
            this.showChildren = !this.showChildren
        },
        handleHover() {

        },
        mouseEnterFn(index, flag) {
          if (flag) {
            this.$emit('hoverChange', (index === this.currentIndex))
          } else {
            this.$emit('hoverChange', index)
          }
        },
        operation(_event, item, index, flag) {
          if (flag) {
            let clientRect = _event.target.getBoundingClientRect()
            let position = {
                x: Math.round(clientRect.left),
                y: Math.round(clientRect.top),
                w: Math.round(clientRect.width),
                h: Math.round(clientRect.height)
            }
            let param = {
                currentNode: item,
                currentIndex: index,
                parentNode: this.currNode,
                position: position
            }
            this.$emit('operation', param)
          } else {
            this.$emit('operation', _event)
          }
        }
    }
}
</script>

<style lang="stylus">
owly-tree-title-height = 40px
owly-border-before-left = 9px
owly-title-before-left = -30px
owly-title-before-top = 11px
owly-title-after-left = -26px
owly-title-after-top = 18px
owly-nochild-before-left = -29px
owly-nochild-before-top = -6px

owly-parent-node-bg = #ffffff
hover-color = #e6f0f5
selected-color = #409eff
line-color = #d8dfe6
.owly-parent-node
    padding-left 30px
    font-size 14px
    background-color owly-parent-node-bg
.owly-no-child
    padding-left 20px
.owly-current-node, .owly-node-has-border
    position relative
.owly-title
    position relative
    z-index 9
    height owly-tree-title-height
    line-height owly-tree-title-height
    .owly-title-bg
        display none
        position absolute
        top 0
        right 0
        z-index -1
        cursor:pointer
        height owly-tree-title-height
        width 999px
    .owly-title-text
        display inline-block
        overflow:hidden
        white-space:nowrap
        text-overflow:ellipsis
        &:hover
            cursor: pointer
    .owly-operation
        display none
        position absolute
        right 10px
        top 0
        font-size 24px
        cursor pointer
        .owly-operation-btn
            width 20px
            text-align center
        .owly-operation-item
            height 30px
            line-height 30px
            text-align center
            color #222
            &:hover
                // color #303133
                background-color hover-color
.owly-title:hover
    // color #ffffff
    .owly-title-bg
        display block
        background hover-color
    .owly-operation
        display block
.owly-select
    color #ffffff !important
    .owly-title-bg
        display block
        background selected-color !important
    .owly-title-bg
        background selected-color !important
.owly-node-has-border:before
    display block
    position absolute
    left owly-border-before-left
    top -10px
    z-index 10
    width 1px
    height 100%
    content ''
    border-left 1px solid line-color
.owly-last-node:before
        height 24px
.owly-tree-root:before
    border-left 1px solid rgba(0,0,0,0)
.display-children-node
    color rgba(0,0,0,0)
    cursor pointer
    &:before
        display block
        position absolute
        left owly-title-before-left
        top owly-title-before-top
        width 16px
        height 16px
        content ''
        background url('./plus_n.png') no-repeat
        background-position 2px 1px
        background-color owly-parent-node-bg
        z-index 20
    &:after
        display block
        position absolute
        content ''
        width 20px
        height 1px
        left owly-title-after-left
        top owly-title-after-top
        border-top 1px solid line-color
        z-index 10
.owly-select .display-children-node:before
    background-color selected-color !important
    background url('./plus.png') no-repeat
.owly-title:hover .display-children-node:before
    background-color hover-color
.owly-child-node-opened.display-children-node:before
    background-position 2px 1px
    background-color owly-parent-node-bg
    background url('./minus_n.png') no-repeat
    margin-left: 3px
.owly-select .owly-child-node-opened.display-children-node:before{
    background url('./minus.png') no-repeat
}
.no-child-node
    display block
    position absolute
    z-index 10
    left owly-nochild-before-left
    top owly-nochild-before-top
    width 17px
    height 27px
    content ''
    border 1px solid line-color
    border-top none
    border-right none
.owly-tree-root.owly-no-child
    padding-left 30px
    .no-child-node
        display block
        position absolute
        z-index 10
        left owly-nochild-before-left
        top owly-nochild-before-top
        width 17px
        height 27px
        content ''
        border-bottom 1px solid line-color
.owly-operation .ivu-poptip-body
    padding 8px 0px !important
</style>
