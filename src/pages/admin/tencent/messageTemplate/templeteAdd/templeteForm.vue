<template>
  <div>
    <BScroll :offsetBottom="80">
      <Form
        ref="formValidate"
        id="tempForm"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80"
        label-position="left"
      >
        <FormItem label="模板ID" prop="id">
          <div class="control">
            <span class="txt">{{templateId}}</span>
            <div class="control-extra">
              <Poptip v-model="showCase" placement="right-start">
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
        <FormItem label="模板名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请填写模板名称，不超过20个字"/>
        </FormItem>
        <FormItem label="模板分组">
          <Select v-model="formValidate.groupId" placeholder="请选择分组">
            <Option
              :value="item.groupId"
              v-for="item in groupList"
              :key="item.groupId"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="标题" prop="title">
          <div class="control">{{template.title}}</div>
        </FormItem>
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
                  <!-- <div
                    contenteditable="true"
                    @input="getDesc(index,item,$event)"
                    class="ivu-input"
                  >{{item.value}}</div>-->
                  <!-- <input
                    autocomplete="off"
                    :style="{color: item.color}"
                    spellcheck="false"
                    v-model="item.value"
                    id="contTop"
                    type="text"
                    placeholder="请填写开场白"
                    class="ivu-input"
                  > -->
                  <textarea
                    id="contTop"
                    wrap="hard"
                    autocomplete="off"
                    v-model="item.value"
                    spellcheck="false"
                    placeholder="请填写开场白"
                    rows="4"
                    class="ivu-input"
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
                      @on-change="(val) => { resetColor(val, item)}"
                    />
                  </div>
                </div>
                <!-- <Input v-model="item.value" placeholder="请填写开场白" :style="{color: '#ff0000'}">
                  <ColorPicker v-model="item.color" :colors="colors" recommend slot="append" size="small"/>
                </Input>-->
              </Col>
              <div class="contOther" v-if="!item.label">
                <span @click="addFuns(1)">[粉丝昵称]</span>
              </div>
              <div v-if="item.label">{{item.label}}</div>
            </template>

            <template v-else-if="varsDex && index >= varsDex && index <= (varsDex + 1)">
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
                <Col span="1">
                  <div style="text-align: center">:</div>
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
            <!-- <template v-if="item.label && index === 0">
              {{item.label}}
            </template>-->
            <template v-else-if="index !== formValidate.templateDateList.length - 1">
              <Col span="4">
                <div>{{item.label}}</div>
              </Col>
              <Col span="20">
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
                    <ColorPicker
                      v-model="item.color"
                      size="small"
                      recommend
                      @on-change="(val) => { resetColor(val, item)}"
                    />
                  </div>
                </div>
              </Col>
              <div class="contOther">
                <span @click="addFuns(2)">[粉丝昵称]</span>
              </div>
            </template>
          </Row>
        </FormItem>
        <!-- <FormItem label="链接地址" prop="linkAddress">
          <Input v-model="formValidate.linkAddress" placeholder="请输入带http://的完整链接地址"></Input>
        </FormItem> -->
        <FormItem label="跳转地址">

          <RadioGroup class="link-radio" v-model="formValidate.jumpType">
            <Radio :label="0">无</Radio>
            <Radio :label="1">跳转网页</Radio>
            <Radio :label="2">跳转小程序</Radio>
          </RadioGroup>

          <FormItem v-if="formValidate.jumpType === 1" prop="linkAddress" label="链接地址：" :label-width="136">
            <div class="skip-web flexB">
              <!-- <span>链接地址：</span> -->
              <Input class="skip-input" ref="link" v-model="formValidate.linkAddress" placeholder="请输入带http://的完整链接地址"></Input>
            </div>
          </FormItem>

          <div v-if="formValidate.jumpType === 2">
            <template v-for="(v, k) in mp">
              <FormItem :key="k" :label="v.label" :label-width="136" :prop="v.key">
                <div class="mp-item flexB">
                  <Input :ref="k" :placeholder="v.holder" v-model="formValidate[v.key]" ></Input>
                  <Poptip class="mp-pop" width="200" :content="v.pop" trigger="hover" placement="right-start">
                    <i class="icon">&#xe635;</i>
                  </Poptip>
                </div>
              </FormItem>
            </template>
          </div>

        </FormItem>
      </Form>
    </BScroll>
    <div class="actionFooter">
      <div>
        <Button type="primary" @click="submitForm">保存</Button>
        <Button
          class="white"
          @click="$router.push({name: 'messageTAdd', params: {step: 0}})"
          v-if="!isModity"
        >上一步</Button>
        <Button class="white" @click="cancle">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
// import { filterTags, addTags } from "@/utils/textHtmlChange"
import { filterTags, addTags } from '@/pages/admin/tencent/components/text/textHtmlChange.js'
export default {
  props: {
    templateId: String
  },
  mounted() {
    this.getGroupData()
    this.getWxTemplate()
    if (this.templateData) {
      // 渲染表单
      this.getVarsDex(this.templateData)
    }
    this.on(document.body, 'click', () => {
      this.showCase = false
    })
  },
  computed: {
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === "" || value.length > 20) {
        callback(new Error("最多20个字"))
      } else {
        callback()
      }
    }
    return {
      showCase: false, // 控制内容示例的显示
      varsDex: null, // 模板消息多变量项的索引
      exampleTxt: "",
      formValidate: {
        name: "",
        groupId: "",
        linkAddress: "",
        templateDateList: [],
        jumpType: 0, // 链接地址类型0：无，1:跳转网页，2:跳转小程序
        mpAppId: '',
        mpUrl: '',
        spareUrl: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          {
            validator: validateName,
            message: "最多20个字",
            trigger: "blur"
          }
        ],
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
      groupList: [],
      firstGroup: {},
      template: {},
      colors: ["#000000", "#673AB7", "#9575CD", "#D1C4E9"],
      isModity: !!this.$route.query.id
    }
  },
  methods: {
    ...mapMutations({
      setNewTemplateMsgId: "tencent/SET_CREATED_TEMPLATE_MSG_ID"
    }),
    async getWxTemplate() {
      let urlPath = this.Path.getWechatTemplate
      let params = {
        appAccountId: this.appAccountId
      }
      if (this.isModity) {
        // 编辑状态
        params.id = this.$route.query.id
        urlPath = this.Path.getCssCustomTemplateInfo
      } else {
        params.templateId = this.templateId
      }
      const response = await this.post(urlPath, params)
      const { code, data } = response
      if (code === 1) {
        (data.templateDateList || []).forEach(item => {
          item.value = addTags(item.value, 'text')
        })
        this.template = data // 模板内容
        this.exampleTxt = (data.example || "").replace(/\n/g, "<br/>") // 格式化

        this.$set(
          this.formValidate,
          "templateDateList",
          this.handleContentData(data.content)
        ) // 格式化
        if (this.isModity) {
          this.formValidate = {
            name: data.name,
            groupId: data.groupId,
            linkAddress: data.linkAddress,
            templateDateList: data.templateDateList,
            jumpType: data.jumpType,
            mpAppId: data.mpAppId,
            mpUrl: data.mpUrl,
            spareUrl: data.spareUrl
          }
        }
      } else {
      }
    },
    async getGroupData() {
      let params = {
        appAccountId: this.appAccountId,
        type: "template"
      }
      const response = await this.post(this.Path.queryTemplateCssGroup, params)
      const { code, data } = response
      if (code === 1) {
        const newData = data.sort((a, b) => {
          return a.groupOrder - b.groupOrder
        })
        this.groupList = newData.slice(0)
        this.firstGroup = newData[0]
        // 设置默认选中的分组
        const groupId = sessionStorage.getItem("messageTemplateGroupId")
        this.formValidate = {
          ...this.formValidate,
          groupId: Number(groupId) || newData[0].groupId
        }
      }
    },
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
    async submitForm() {
      const valid = await this.$refs["formValidate"].validate()
      if (valid) {
        this.formValidate.templateDateList.forEach(item => {
          item.value = filterTags(item.value)
        })
        let params = {
          appAccountId: this.appAccountId,
          templateId: this.templateId,
          ...this.formValidate
        }
        params = this.filtForm(params)
        if (this.isModity) {
          // 编辑状态
          params.id = this.$route.query.id
        }
        params.groupId = this.formValidate.groupId || this.firstGroup.groupId
        const response = await this.post(
          this.Path.saveOrUpdateCssCustomTemplate,
          params
        )
        const { code, data } = response
        if (code === 1) {
          this.setNewTemplateMsgId(data.id)
          const content = this.isModity
            ? "模板消息修改成功"
            : "模板消息添加成功"
          this.$Message.success({
            content: content,
            duration: 2
          })
          if (this.$store.state.publicAccount.urlAppAccountId) {
            window.close()
          } else {
            this.$router.push({ name: "messageTemplate" })
          }
        } else {
          this.$Message.error("保存失败,重新试试")
        }
      }
    },
    cancle() {
      if (this.$store.state.publicAccount.urlAppAccountId) {
        window.close()
      } else {
        this.$router.push({ name: "messageTemplate" })
      }
    },
    resetColor(val, item) {
      // 颜色清空重设
      if (!val) {
        item.color = "#000000"
      }
    },
    getVarsDex(list) {
      // 获取多变量项的索引
      list.forEach((v, i) => {
        let next = list[i + 1]
        if (next && v.key !== "none" && v.label === "" && next.label === "：") {
          this.varsDex = i
        }
      })
    },
    handleContentData(temCont) {
      temCont = (temCont || "").replace(/\n/g, "<br/>")
      let arr0 = temCont.split("<br/>").filter(item => item !== "") // 空格进行分组
      arr0 = arr0.reduce((init, next) => {
        if (next.match(/.*?{{.+?}}/g)) {
          const arr = next.match(/.*?{{.+?}}/g) // 再分组
          init = [...init, ...arr]
        } else {
          init = [...init, next]
        }
        return init
      }, []) // 再对每一项对key进行分组
      const jsonArr = arr0.map(item => {
        let itemArr = []
        if (item.match(/(.*?){{(.+?).DATA}}/)) {
          itemArr = item.match(/(.*?){{(.+?).DATA}}/)
        } else {
          // 不包含key信息
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
    addFuns(flag) { // 插入粉丝昵称
      if (flag === 1) {
        // 内容头插入粉丝
        const firstCont = this.formValidate.templateDateList[0]
        const index = this.getPostion(document.querySelector("#contTop"))
        const valArr = firstCont.value.split("")
        valArr.splice(index, 0, "[粉丝昵称]")
        firstCont.value = valArr.join("")
      } else {
        const lastCont = this.formValidate.templateDateList[
          this.formValidate.templateDateList.length - 1
        ]
        const index = this.getPostion(document.querySelector("#contBottom"))
        const valArr = lastCont.value.split("")
        valArr.splice(index, 0, "[粉丝昵称]")
        lastCont.value = valArr.join("")
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
        let dex
        if (i > 0) {
          let prevDex = interval[i - 1][1]
          let val2 = val.slice(prevDex)
          dex = val2.indexOf(v) + prevDex
        } else {
          dex = val.indexOf(v)
        }
        interval.push([dex, dex + v.length])
      })
      ev.preventDefault() // 阻止默认的删除/退格事件
      if (typ === 'del') { // 删除键
        interval.forEach(v => {
          if (position >= v[0] && position < v[1]) {
            val = val.split('')
            val.splice(v[0], v[1] - v[0])
            item.value = val.join('')
          }
        })
      } else if (typ === 'back') { // 退格键
        interval.forEach(v => {
          if (position > v[0] && position <= v[1]) {
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
    }
  }
}
</script>

<style lang="stylus">
#tempForm
  width 550px
  margin 0 auto
  padding-bottom 110px
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
  .contOther
    color #606366
    span
      cursor pointer
      &:hover
        color: #409fff

  .link-radio
    margin-bottom: 10px
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
</style>
