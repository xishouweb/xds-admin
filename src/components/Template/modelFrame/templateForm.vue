<template>
  <Form
    ref="formValidate"
    class="tempForm"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="80"
    label-position="left"
    @click.native="closeMoreInsert"
  >
    <!-- 模板ID -->
    <FormItem label="模板ID" prop="id">
      <div class="control">
        <span class="txt">{{templateId}}</span>
        <div class="control-extra">
          <Poptip placement="bottom">
            <a class="control-title">内容示例</a>
            <div slot="content" class="control-cont">
              <div class="msgCard">
                <div class="body">
                  <p class="txt" v-html="exampleTxt"></p>
                </div>
                <div class="footer">
                  <div class="txt">详情</div>
                </div>
              </div>
            </div>
          </Poptip>
        </div>
      </div>
    </FormItem>
    <!-- <FormItem label="模板名称" prop="name">
      <Input v-model="formValidate.name" placeholder="请填写模板名称，不超过20个字"/>
    </FormItem>
    <FormItem label="模板分组">
      <Select v-model="formValidate.groupId" placeholder="请选择分组">
        <Option :value="item.groupId" v-for="item in groupList" :key="item.groupId">{{item.name}}</Option>
      </Select>
    </FormItem> -->
    <!-- 标题 -->
    <FormItem label="标题" prop="title">
      <div class="control">{{template.title}}</div>
    </FormItem>
    <!-- 详细内容 -->
    <FormItem label="详细内容">
      <Row v-for="(item, index) in formValidate.templateDateList" :key="index">
        <template v-if="index === 0">
          <Col span="24" v-if="!item.label">
            <div
              class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-append ivu-input-hide-icon"
              style="color: rgb(255, 0, 0);"
            >
              <i
                class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"
              ></i>
              <textarea
                id="contTop"
                class="ivu-input"
                rows="4"
                wrap="hard"
                spellcheck="false"
                autocomplete="off"
                v-model="item.value"
                placeholder="请填写开场白"
                :style="{color: item.color}"
                @keydown.8="delInsert($event,'back', item)"
                @keydown.46="delInsert($event,'del', item)"
              ></textarea>
              <div class="ivu-input-group-append">
                <ColorPicker
                  v-model="item.color"
                  :colors="colors"
                  recommend
                  slot="append"
                  size="small"
                />
              </div>
            </div>
            <!-- <Input v-model="item.value" placeholder="请填写开场白" :style="{color: '#ff0000'}">
              <ColorPicker v-model="item.color" :colors="colors" recommend slot="append" size="small"/>
            </Input>-->
            <div class="contOther" v-if="!item.label">
              <i>快捷插入</i>
              <!-- <span @click="addFuns(1)">[粉丝昵称]</span> -->
              <template v-for="(v, i) in insertCont">
                <span :key="i" v-if="i < 5" @click="addFuns(1, v)">{{v}}</span>
              </template>
              <Poptip v-model="showMoreInsert1" placement="bottom-end" v-if="insertCont.length > 5" @click.native.stop>
                <i class="icon moreInsertIcon" @click="closeMoreInsert">&#xe608;</i>
                <ul class="moreInsert" slot="content">
                  <template v-for="(v, i) in insertCont">
                    <li :key="i" v-if="i >= 5" @click="addFuns(1, v)">{{v}}</li>
                  </template>
                </ul>
              </Poptip>
            </div>
          </Col>
          <div v-if="item.label">{{item.label}}</div>
        </template>
        <!-- label和value均为变量时的结构 -->
        <template v-else-if="varsDex > -1 && index >= varsDex && index <= (varsDex + 1)">
          <template v-if="index === varsDex">
            <Col span="7">
              <div
                class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-append ivu-input-hide-icon"
                style="color: rgb(255, 0, 0);"
              >
                <i
                  class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"
                ></i>
                <input
                  autocomplete="off"
                  :style="{color: item.color}"
                  spellcheck="false"
                  v-model="item.value"
                  type="text"
                  class="ivu-input"
                >
                <div class="ivu-input-group-append">
                  <ColorPicker
                    v-model="item.color"
                    :colors="colors"
                    recommend
                    slot="append"
                    size="small"
                    @on-change="(val) => { resetColor(val, item)}"
                  />
                </div>
              </div>
            </Col>
            <Col span="1"><div style="text-align: center"> : </div></Col>
            <Col span="16">
              <div
                class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-append ivu-input-hide-icon"
                style="color: rgb(255, 0, 0);"
              >
                <i
                  class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"
                ></i>
                <input
                  autocomplete="off"
                  :style="{color: formValidate.templateDateList[index + 1].color}"
                  spellcheck="false"
                  v-model="formValidate.templateDateList[index + 1].value"
                  type="text"
                  class="ivu-input"
                >
                <div class="ivu-input-group-append">
                  <ColorPicker
                    v-model="formValidate.templateDateList[index + 1].color"
                    :colors="colors"
                    recommend
                    slot="append"
                    size="small"
                    @on-change="(val) => { resetColor(val, formValidate.templateDateList[index + 1])}"
                  />
                </div>
              </div>
            </Col>
          </template>
        </template>

        <template v-else-if="index !== formValidate.templateDateList.length - 1">
          <Col span="8">
            <div>{{item.label}}</div>
          </Col>
          <Col span="16">
            <div
              class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-append ivu-input-hide-icon"
              style="color: rgb(255, 0, 0);"
            >
              <i
                class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"
              ></i>
              <input
                autocomplete="off"
                :style="{color: item.color}"
                spellcheck="false"
                v-model="item.value"
                type="text"
                class="ivu-input"
              >
              <div class="ivu-input-group-append">
                <ColorPicker
                  v-model="item.color"
                  :colors="colors"
                  recommend
                  slot="append"
                  size="small"
                  @on-change="(val) => { resetColor(val, item)}"
                />
              </div>
            </div>
          </Col>
        </template>
        <template v-else>
          <Col span="24">
            <div
              class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-append ivu-input-hide-icon"
            >
              <textarea
                id="contBottom"
                wrap="hard"
                autocomplete="off"
                v-model="item.value"
                spellcheck="false"
                placeholder="请输入结束语"
                rows="4"
                class="ivu-input"
                :style="{color: item.color}"
                @keydown.8="delInsert($event,'back', item)"
                @keydown.46="delInsert($event,'del', item)"
              ></textarea>
              <div class="ivu-input-group-append">
                <ColorPicker v-model="item.color" size="small" recommend @on-change="resetColor"/>
              </div>
            </div>
            <div class="contOther" v-if="!item.label">
              <i>快捷插入</i>
              <!-- <span @click="addFuns(2)">[粉丝昵称]</span> -->
              <template v-for="(v, i) in insertCont">
                <span :key="i" v-if="i < 5" @click="addFuns(2, v)">{{v}}</span>
              </template>
              <Poptip v-model="showMoreInsert2" placement="top-end" v-if="insertCont.length > 5" @click.native.stop>
                <i class="icon moreInsertIcon" @click="closeMoreInsert">&#xe608;</i>
                <ul class="moreInsert" slot="content">
                  <template v-for="(v, i) in insertCont">
                    <li :key="i" v-if="i >= 5" @click="addFuns(2, v)">{{v}}</li>
                  </template>
                </ul>
              </Poptip>
            </div>
          </Col>
        </template>
      </Row>
    </FormItem>
    <FormItem label="跳转地址">

      <RadioGroup class="link-radio" v-model="formValidate.jumpType">
        <Radio :label="0">无</Radio>
        <Radio :label="1">跳转网页</Radio>
        <Radio :label="2">跳转小程序</Radio>
      </RadioGroup>

      <FormItem v-if="formValidate.jumpType === 1" prop="linkAddress" label="链接地址：" :label-width="136">
        <div class="skip-web flexB">
          <Input class="skip-input" ref="link" v-model="formValidate.linkAddress" placeholder="请输入带http://的完整链接地址"></Input>
        </div>
      </FormItem>

      <div v-if="formValidate.jumpType === 2">
        <template v-for="(v, k) in mp">
          <FormItem :key="k" :label="v.label" :label-width="136" :prop="v.key">
            <div class="mp-item flexB">
              <Input :ref="k" :placeholder="v.holder" v-model="formValidate[v.key]" ></Input>
              <Poptip class="mp-pop" width="200" :content="v.pop" trigger="hover" placement="left-start">
                <i class="icon">&#xe635;</i>
              </Poptip>
            </div>
          </FormItem>
        </template>
      </div>

    </FormItem>
  </Form>
</template>

<script>
import { mapState } from "vuex"
import { tempFilterTags, tempAddTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
export default {
  name: 'templateForm',
  props: {
    templateId: String,
    templateData: Object, // 模板消息id及内容
    insert: [String, Array] // 需要的快速插入按钮，默认为所有
  },
  data() {
    return {
      varsDex: null, // 模板消息多变量项的索引
      exampleTxt: '', // 格式化后的模板内容
      formValidate: {
        linkAddress: null, // 链接
        templateDateList: [],
        jumpType: 0, // 跳转地址类型：0：无，1：跳转网页，2：跳转小程序
        mpAppId: '',
        mpUrl: '',
        spareUrl: ''
      },
      template: {}, // 根据模板id获取到的模板信息
      colors: ["#000000", "#673AB7", "#9575CD", "#D1C4E9"],
      showMoreInsert1: false, // 控制更多插入内容的显示
      showMoreInsert2: false, // 控制更多插入内容的显示
      insertCont: [ // 快捷插入内容
        '[粉丝昵称]', '[分享者昵称]', '[客服名称]', '[海报名称]',
        '[需要关注数]', '[已邀请数量]', '[已取关数]', '[还需关注数]',
        '[累计关注数]', '[活动有效期]', '[裂变海报有效期]'
      ],
      mp: [ // 跳转小程序相关数据
        {
          key: 'mpAppId',
          label: '小程序appid：',
          holder: '请填写正确的appid',
          pop: '粉丝点击模板消息会跳到该小程序，该小程序必须与当前公众号是绑定关联关系，暂不支持小游戏。'
        },
        {
          key: 'mpUrl',
          label: '小程序页面路径：',
          holder: '请填写正确的路径',
          pop: '所需跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar），要求该小程序已发布，暂不支持小游戏。'
        },
        {
          key: 'spareUrl',
          label: '备用页面url：',
          holder: '请填写完整的url',
          pop: '旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页，不超过1024字节。'
        }
      ],
      ruleValidate: {
        linkAddress: [
          { required: true, message: "请输入带http://的完整链接地址", trigger: "blur" },
          {
            type: "string",
            pattern: /^https?:\/\/.+$/,
            message: "请输入带http://的完整链接地址",
            trigger: "blur"
          }
        ],
        mpAppId: [
          { required: true, message: "请输入小程序appid", trigger: "blur" },
        ],
        mpUrl: [
          { required: true, message: "请输入小程序页面路径", trigger: "blur" },
        ]
      },
    }
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  watch: {
    templateId(newV) { // 模板切换时id变化
      this.getWxTemplate(newV)
    },
    templateData: { // 根据模板消息详情，进行数据格式转换
      deep: true,
      handler(nv) {
        this.getWxTemplate()
        this.getVarsDex(nv)
        if (nv) {
          let list = this.deepCopy(nv.templateDateList || nv.templateDataList)
          list.forEach(v => {
            v.value = tempAddTags(v.value)
          })
          this.formValidate.templateDateList = list
        }
      }
    },
    'formValidate': { // 当表单内容发生变化时，将变化抛出
      deep: true,
      handler(nv) {
        this.returnData(nv)
      }
    },
  },
  created() {
    if (this.insert && this.insert !== 'all') {
      this.insertCont = this.insertCont.filter((v, i) => {
        return this.insert.indexOf(v) >= 0
      })
    }
    this.on(document.body, 'click', this.closeMoreInsert)
  },
  mounted() {
    this.getWxTemplate()
    if (this.templateData) { // 渲染表单
      let list = this.templateData.templateDateList || this.templateData.templateDataList
      list.forEach(v => {
        v.value = tempAddTags(v.value)
      })
      this.formValidate.templateDateList = list
      this.formValidate.linkAddress = this.templateData.linkAddress
      this.formValidate.jumpType = this.templateData.jumpType
      this.formValidate.mpAppId = this.templateData.mpAppId
      this.formValidate.mpUrl = this.templateData.mpUrl
      this.formValidate.spareUrl = this.templateData.spareUrl

      this.getVarsDex(this.templateData)
      this.returnData(this.templateData)
    }
  },
  methods: {
    filtForm(obj) { // 过滤表单数据
      const type = obj.jumpType
      switch (type) {
        case 0:
          obj.linkAddress = ''
          obj.mpAppId = ''
          obj.mpUrl = ''
          obj.spareUrl = ''
          break
        case 1:
          obj.mpAppId = ''
          obj.mpUrl = ''
          obj.spareUrl = ''
          break
        case 2:
          obj.linkAddress = ''
      }
      return obj
    },
    returnData(obj) { // 将数据抛到tempEdit组件
      obj = obj || Object.assign({}, this.template, this.formValidate)
      let cloneObj = this.deepCopy(obj)
      cloneObj = this.filtForm(cloneObj)
      // console.log(cloneObj)
      const list = cloneObj.templateDateList || cloneObj.templataDateList
      if (list) {
        list.forEach(item => {
          item.value && (item.value = tempFilterTags(item.value))
        })
      }

      this.$root.Bus.$emit('formChange', cloneObj)
    },
    async getWxTemplate(id) { // 获取模板详细内容
      if (this.templateId) {
        let urlPath = this.Path.getWechatTemplate
        let params = {
          appAccountId: this.appAccountId,
          templateId: id || this.templateId
        }
        const response = await this.post(urlPath, params)
        const { code, data } = response
        if (code === 1) {
          this.template = data // 模板内容
          this.exampleTxt = (data.example || '').replace(/\n/g, "<br/>") // 格式化

          if (!this.templateData || JSON.stringify(!this.templateData) === '{}') {
            this.$set(
              this.formValidate,
              "templateDateList",
              this.handleContentData(data.content)
            ) // 格式化
          }
          this.formValidate = Object.assign({}, this.formValidate, this.template)
        }
      }
    },
    resetColor(val, item) { // 颜色清空重设
      if (!val) {
        item.color = '#000000'
      }
    },
    handleContentData(temCont) { // 格式化模板内容
      temCont = (temCont || '').replace(/\n/g, "<br/>")
      let arr0 = temCont.split('<br/>').filter(item => item !== '') // 空格进行分组
      arr0 = arr0.reduce((init, next, dex) => {
        if ((next.match(/.*?{{.+?}}/g))) {
          const arr = next.match(/.*?{{.+?}}/g) // 再分组
          init = [...init, ...arr]
        } else {
          init = [...init, next]
        }
        return init
      },[]) // 再对每一项对key进行分组
      const jsonArr = arr0.map(item => {
        let itemArr = []
        if (item.match(/(.*?){{(.+?).DATA}}/)) {
          itemArr = item.match(/(.*?){{(.+?).DATA}}/)
        } else { // 不包含key信息
          itemArr = ["", item, "none"]
        }
        return {
          label: itemArr[1],
          key: itemArr[2],
          value: "",
          color: "#000000"
        }
      })
      this.getVarsDex(jsonArr)
      return jsonArr
    },
    getVarsDex(obj) { // 获取多变量项的索引
      this.varsDex = -1 // 为-1则表示没有多变量项
      if (!obj) { return }
      let list
      if (obj instanceof Array) {
        list = obj
      } else {
        list = obj.templateDataList || obj.templateDateList
      }
      if (!list) { return }
      list.forEach((v, i) => {
        let next = list[i + 1]
        if (next && v.key !== 'none' && v.label === '' && next.label === '：') {
          this.varsDex = i
        }
      })
    },
    addFuns(flag, tex) { // 插入粉丝昵称效果
      this.closeMoreInsert()
      if (flag === 1) { // 开场白快捷插入
        const firstCont = this.formValidate.templateDateList[0]
        const index = this.getPostion(document.querySelector("#contTop"))
        const valArr = firstCont.value.split("")
        valArr.splice(index, 0, tex)
        firstCont.value = valArr.join('')
      } else { // 结束语快捷插入
        const lastCont = this.formValidate.templateDateList[this.formValidate.templateDateList.length - 1]
        const index = this.getPostion(document.querySelector("#contBottom"))
        const valArr = lastCont.value.split("")
        valArr.splice(index, 0, tex)
        lastCont.value = valArr.join('')
      }
    },
    delInsert(ev, typ, item) { // 整体删除插入内容
      let position = this.getPostion(ev.target) // 光标位置
      let reg = /\[[\u4e00-\u9fa5\w]+\]/g
      let val = item.value
      let insert = item.value.match(reg) // 匹配插入的内容
      let interval = [] // 区间
      if (!insert.length) { return }
      // 计算不允许光标插入的区间
      insert.forEach((v, i) => {
        let len = v.length
        let dex
        if (i > 0) {
          let prevDex = interval[i - 1][1]
          let val2 = val.slice(prevDex)
          dex = val2.indexOf(v) + prevDex
        } else {
          dex = val.indexOf(v)
        }
        interval.push([dex, dex + len])
      })

      if (typ === 'del') { // 删除键
        interval.forEach(v => {
          if (position >= v[0] && position < v[1]) {
            ev.preventDefault()
            val = val.split('')
            val.splice(v[0], v[1] - v[0])
            item.value = val.join('')
          }
        })
      } else if (typ === 'back') { // 退格键
        interval.forEach(v => {
          if (position > v[0] && position <= v[1]) {
            ev.preventDefault()
            val = val.split('')
            val.splice(v[0], v[1] - v[0])
            item.value = val.join('')
          }
        })
      }
    },
    getPostion(el) { // 获取光标位置
      if (el.selectionStart) {
        return el.selectionStart
      } else if (document.selection) {
        el.focus()
        var r = document.selection.createRange()
        var sr = r.duplicate()
        sr.moveToElementText(el)
        sr.setEndPoint("EndToEnd", r)
        return sr.text.length - r.text.length
      }
      return 0
    },
    linkBlur() { // 触发表单验证事件
      let bool = null
      this.$refs.formValidate.validate(valid => { bool = valid })
      return bool
    },
    closeMoreInsert() { // 关闭更多快捷插入
      this.showMoreInsert1 = false
      this.showMoreInsert2 = false
    }
    // setPosition(el, pos) { // 设置光标位置
    //   if (el.setSelectionRange) {
    //     // IE Support
    //     el.focus()
    //     el.setSelectionRange(pos, pos)
    //   } else if (el.createTextRange) {
    //       // Firefox support
    //       let range = el.createTextRange()
    //       range.collapse(true)
    //       range.moveEnd('character', pos)
    //       range.moveStart('character', pos)
    //       range.select()
    //   }
    // }
    // async getGroupData() { // 获取分组信息
    //   let params = {
    //     appAccountId: this.appAccountId,
    //     type: "template"
    //   }
    //   const response = await this.post(this.Path.queryTemplateCssGroup, params)
    //   const { code, data } = response
    //   if (code === 1) {
    //     const newData = data
    //       .sort((a, b) => {
    //         return a.groupOrder - b.groupOrder
    //       })
    //     this.groupList = newData.slice(1)
    //     // this.firstGroup = newData[0]
    //   }
    // },
    // async submitForm() { // 保存
    //   const valid = await this.$refs["formValidate"].validate()
    //   if (valid) {
    //     let params = {
    //       appAccountId: this.appAccountId,
    //       templateId: this.templateId,
    //       ...this.formValidate
    //     }
    //     // if (this.isModity) {
    //     // // 编辑状态
    //     //   params.id = this.$route.query.id
    //     // }
    //     // params.groupId = this.formValidate.groupId || this.firstGroup.groupId
    //     // const response = await this.post(
    //     //   this.Path.saveOrUpdateCssCustomTemplate,
    //     //   params
    //     // )
    //     const { code, data } = response
    //     this.setNewTemplateMsgId(data.id)
    //     if (code === 1) {
    //       // const content = this.isModity ? "模板消息修改成功" : "模板消息添加成功"
    //       this.$Message.success({
    //         content: '模板消息添加成功',
    //         duration: 2,
    //       })
    //       //  this.$router.push({ name: "messageTemplate" })
    //     } else {
    //       this.$Message.error("保存失败,重新试试")
    //     }
    //   }
    // },
  }
}
</script>

<style lang="stylus" scope>
  // .temp-label
  //   width: 156px
  //   position: absolute
  //   top: 50px
  //   left: 0px
.tempForm
  width 550px
  margin 0 auto
  // margin-left: 60px
  .control
    &-extra
      position relative
      display inline-block
      margin-left 18px
      .ivu-poptip-inner
        white-space normal
        box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35)
        border solid 1px #e3e4e5
      .control-title
        color #409eff
        cursor pointer
      .boxWrapper
        position absolute
        top -8px
        right -286px
        width 280px
        padding 15px 15px 0
        background-color #ffffff
        box-shadow 0px 2px 6px 0px rgba(0, 0, 0, 0.35)
        border solid 1px #e3e4e5
        z-index 99
        .triangle_border_left
          position absolute
          left -10px
          width 0
          height 0
          border-top 5px solid transparent
          border-bottom 5px solid transparent
          border-right 10px solid #e3e4e5
  .ivu-row
    margin-bottom 18px
    &:last-of-type
      margin-bottom 0
  .specialField
    display flex
    .formControl
      flex 1
  .link-radio
    margin-bottom: 10px
  .skip-web
    >span
      flex: none
      width: 126px
    .skip-input
      flex: 1
  .mp-item
    position: relative
    margin-bottom: 30px
    .mp-pop
      flex: none
      cursor: pointer
      position: absolute
      right: -24px
      .ivu-poptip-body-content-inner
        white-space: normal
      .icon
        color: #979899
        font-size: 14px
  .contOther
    display: flex
    height: 30px
    font-size: 12px
    // color: #979899
    color: #606366
    i
      flex: none
      margin-right: 10px
    span
      white-space nowrap
      margin-right: 8px
      cursor pointer
      &:hover
        color #409eff
    .ivu-poptip-body-content
      overflow: visible
    .ivu-poptip-rel
      height: 30px
    .moreInsert
      margin: 0 -16px
      >li
        height: 30px
        line-height: 30px
        cursor: pointer
        padding: 0 16px
        &:hover
          color: #409eff
          background-color: #f2f4f5
    .moreInsertIcon
      color: #409fff
      font-size: 28px
      cursor: pointer
  .txt
    min-width: 180px
    white-space normal
</style>
