
export default {
  data() {
    return {
      tableParam: {
        pageSize: 10,
        currPage: 1,
        keyword: null,
        groupId: null
      }
    }
  },
  methods: {
    // table相关操作
    async getTableData() {
      // 重置状态
      this.batchOperation = false
      // 表单参数
      let _param = this.tableParam
      let param = {
        groupId: _param.groupId,
        posterTemplateName: _param.keyword,
        appAccountId: this.currPublic.appAccountId,
        offset: (_param.currPage - 1) * _param.pageSize,
        limit: _param.pageSize
      }
      let res = await this.getPosterTemplateByPage(param)
      if (res.code !== 1) {
        this.$Message.error("海报模板加载失败！")
      }
    },
    resetTableParam() {
      this.tableParam.pageSize = 10
      this.tableParam.currPage = 1
    },
    // 列表交互
    pageChange(param) {
      if (typeof param === "string") {
        this.resetTableParam()
        this.tableParam.keyword = param
      } else if (param.size) {
        this.tableParam.pageSize = param.size
        this.tableParam.currPage = param.page
      }
      this.getTableData()
    },

    // table 操作， 列表的相关操作
    tableListAction(typ, data) {
      // type: show 详情， modify 修改， delete 删除
      switch (typ) {
        case "show": {
          this.$router.push({
            name: "posterList",
            query: {
              id: data.id,
              name: data.posterTemplateName,
              time: data.createTime
            }
          })
          break
        }
        case "modify": {
          this.$router.push({
              name: "createPoster",
              params: {groupId: this.tableParam.groupId || this.posterDefaultGroupId},
              query: {posterId: data.id}
             })
          break
        }
        case "remove": {
          this.delete(data)
          break
        }
      }
    },
    // 修改分组
    modify(data) {
      this.drawer = { show: true, title: '修改分组', type: 'theme', current: data }
    },
    // 删除
    delete(data) {
      const deleteFn = async () => {
        let data = this.modal.data
        let ids = Array.isArray(data) ? data.map(item => item.id) : [data.id]
        let param = {
          appAccountId: this.currPublic.appAccountId,
          idList: ids
        }
        let res = await this.deletePosterTemplate(param)
        if (res.code === 1) {
          this.$Message.success("删除成功！")
          this.getTableData()
          this.getGroupList() // index.vue
          this.modal = {}
        } else {
          this.$Message.error("删除失败！")
        }
      }
      this.modal = {
        show: true,
        header: "删除",
        message: "删除后，海报模板和对应的裂变海报全部被删除，确定要删除吗？",
        data: data,
        ok: deleteFn
      }
    }
  }
}
