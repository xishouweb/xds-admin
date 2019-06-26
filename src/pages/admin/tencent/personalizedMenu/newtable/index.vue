<template>
  <div id="newtable-container">
    <BScroll :offsetBottom="100" :data="data">
    <table id="records-table" cellspacing="0" >
      <thead class="new-table-header">
        <tr>
          <td class="td1">个性化标题</td>
          <td class="td2">地区</td>
          <td class="td3">性别</td>
          <td class="td4">手机操作系统</td>
          <td class="td5">语言</td>
          <td class="td6">用户标签</td>
          <td class="td7">菜单状态</td>
          <td class="td8">操作</td>
        </tr>
      </thead>
      <tbody class="new-table-body" v-if="data.length > 0" >
            <tr class="new-table-tr" v-for="(item, index) of data" :key="index">
                <td class="td1"><div class="td-container">
                  {{item.matchRuleName}}
                </div></td>
                <td class="td2"><div class="td-container">
                  {{item.city}}
                </div></td>
                <td class="td3"><div class="td-container">
                  <div>{{item.sex | sex}}</div>
                </div></td>
                <td class="td4"><div class="td-container">
                  {{item.clientPlatformType}}
                </div></td>
                <td class="td5"><div class="td-container">
                  {{item.language | language}}
                </div></td>
                <td class="td6"><div class="td-container">
                  <Tags v-if="item.tagList" :tags="item.tagList" @showAll="getcurrent(item, 'showAll')"></Tags>
                </div></td>
                <td class="td7"><div class="td-container">
                    <div>{{item.status | status}}</div>
                </div></td>
                <td class="td8"><div class="td-container">
                    <Button type="primary" size="small" @click="getcurrent(item, 'edit')">编辑</Button>
                    <Button size="small" v-if="item.status === 2" @click="getcurrent(item, 'active')">启用</Button>
                    <Button size="small" v-if="item.status === 1" @click="getcurrent(item, 'stop')">停用</Button>
                    <Button size="small" @click="getcurrent(item, 'delete')">删除</Button>
                </div></td>
            </tr>
      </tbody>
    </table >
    <div v-if="data.length === 0" style="height: 120px; line-height: 120px; color:#787c80;borderBottom:1px solid #e3e8ee; text-align: center">暂无个性化菜单</div>
    </BScroll>
  </div>
</template>

<script>
// import Tags from './tags'
import languageTable from '../languageTable.js'
  export default {
    name: "newTable",
    // components: { Tags },
    props: {
        datas: {
            type: Array,
            default: function () { return [] }
        }
    },
    filters: {
      status: (val) => {
        if (!val) {
          return '--'
        }
        return val === 1 ? "正常" : "停用"
      },
      sex: (val) => {
        if (!val) {
          return '--'
        }
        return val === 1 ? '男' : '女'
      },
      language: (val) => {
        let lang = languageTable
        return lang[val] || '--'
      },
      clientPlatformType: (val) => {
        let type = {
          1: "IOS",
          2: "Android",
          3: "Others"
        }
        return type[val] || '--'
      }
    },
    data() {
        return {
          data: this.datas
        }
    },
    watch: {
      datas(newVal) {
        this.data = newVal
      }
    },
    methods: {
      getcurrent(item, type) {
        this.$emit("getcurrent", item, type)
      }
    }
  }
</script>

<style lang="stylus">
height1 = 40px
#newtable-container
  background-color #fff
  width 100%
  overflow-x auto
#records-table
  position relative
  border-collapse separate
  border-spacing 0px 10px
  width 100%
  td:first-child
    padding-left 20px
  .new-table-header
      background #f7f9fa
      td
        height 45px
        line-height 45px
        font-weight: 700
        color #606366
  .new-table-body
    margin-top 10px
    td
      color: #303133
      vertical-align middle
      border-bottom 1px solid #e3e4e6;
      .td-container
        padding 10px 0
  .td1, .td2, .td3, .td4, .td5, .td6, .td7, .td8
    min-width 100px
  .td1
    min-width 150px
  .td3
    text-align center
  .td5
    .td-container
      display flex
      align-items center
      .avatar
        width 40px
        height 40px
  .detail:hover
    cursor pointer
    color #0099CC
  .td6
    width 260px
  .td8
    text-align left
    .ivu-btn
      width 60px
      margin-right 5px
  .cancle
    cursor pointer
    font-size 12px


</style>
