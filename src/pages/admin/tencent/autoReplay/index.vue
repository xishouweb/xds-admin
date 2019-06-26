<template>
  <div>
    <PublicNo></PublicNo>
    <div class="clear" id="material-reply">
      <!-- 导航 -->
      <div class="wechat-title">
        <template  v-for="(v,i) in typ">
          <router-link
            :class="{'active': i==0 && now==3}"
            v-if="i<3 && i !== 1"
            tag="p"
            :key="i"
            :to="v.path"
            @click.native="cut(i)"
          >
            {{v.title}}
          </router-link>
        </template>
      </div>
      <div class="type-title flexB">
        <div>
          <h2 v-html="typ[now].title"></h2>
          <p v-html="typ[now].intro"></p>
        </div>
        <!-- 搜索框及添加回复按钮 -->
        <div class="type-hand flex" v-show="now == 0">
          <SearchBox
            v-model="keyWord"
            :holder="'输入关键词/规则名称'"
            :search="search"
          ></SearchBox>
          <Button class="addReply fl" @click="addReply" type="primary">添加回复</Button>
        </div>

        <!-- 开关 -->
        <template v-for="(v,i) in typ">
          <div class="type-hand" v-if="i>0" v-show="now == i" :key="i">
            <iSwitch class="switch" v-model="typ[i].check" @on-change="switchChange" />
          </div>
        </template>
      </div>

      <new-modal v-model="showModal" :header="modText[0]" :content="modText[1]" @ok="ok"></new-modal>

      <router-view ref="dom" @show="show" @cut="cut" :appAccountId="appAccountId" :check="typ[now].check"></router-view>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex"
import PublicNo from '../components/currPublicNo'

export default {
  name: 'autoReply',
  data(){
    return {
      now:0,            //当前编辑索引
      keyWord:'',       //搜索关键字
      showSwitch:true,  //是否显示搜索框

      showModal: false,   //控制对话框的显示
      modText:['删除回复','删除后，关注该公众号的用户将不再接收该回复，确定删除？'],         //对话框标题及内容

      typ:[             //自动回复类型
        {
          title:'关键词回复',
          intro:'通过编辑内容或关键词规则，快速进行自动回复设置。',
          path:'keyReply',
          check:'perch',  //占位，不起作用
        },
        {
          title:'来访欢迎语',
          intro:`通过编辑内容或关键词规则，快速进行自动回复设置，适用于以下场景：（1）点击公众号菜单。（2）获取粉丝地理位置信息。
            <br>关闭后，所有粉丝都将无法收到来访欢迎语内容。`,
          path:'greetReply',
          check: false,
        },
        {
          title:'被关注回复',
          intro:`通过编辑内容，快速进行自动回复设置。开启后适用于以下场景：1）搜索公众号和扫公众号二维码关注，2）名片分享关注，3）图文页名称点击关<br/>注，4）图文页右上角菜单关注，5）支付后关注。关闭后，粉丝通过以上方式关注公众号都无法收到被关注回复内容。`,
          path:'concernReply',
          check: false,
        },
        {
          title:'关键词回复',
          intro:'通过编辑内容或关键词规则，快速进行自动回复设置。关闭后，所有粉丝都将无法收到关键词回复内容。',
          path:'addReply',
          check: true,
        },
      ],
    }
  },
  components: {
    PublicNo
  },
  computed:{
    ...mapState({
      appAccountId: state => state.publicAccount.curPublic.appAccountId
    })
  },
  watch: {
    appAccountId() {
      this.getSwitch()
    }
  },
  mounted(){
    this.now = this.$route.meta.dex;
    this.cut(this.now)
  },
  methods:{
    cut(i){ // 切换自动回复类型
      this.now = i;
      this.getSwitch()
    },
    getSwitch(){ // 获取当前回复类型的状态
      if(this.now > 0 && this.now !== 3) {
        let a = this.now === 3 ? 0 : this.now
        this.post(this.Path.replyState, {
          appAccountId: this.appAccountId,
          autoreplyType: ++a
        }).then(dat => {
          if(dat.code === 1) {
            this.typ[this.now].check = dat.data
          } else {
            this.$Message.error(dat.message)
          }
        })
      }
    },
    switchChange(b){
      let msg = this.typ[this.now].title;
      //修改回复的开启/关闭状态
      this.post(this.Path.replyUpState,{
        sessionId:'',
        appAccountId: this.appAccountId,
        autoreplyType: this.now>2 ? 1 : this.now+1,
        status: b ? 1 : 0,
      }).then( dat => {
        if(b){
          this.$Message.success(msg+'开启成功。')
        }else{
          this.$Message.success(msg+'关闭成功。')
        }
      })
    },
    getNum() { // 获取关键词回复剩余可创建数量
      this.post(this.Path.replyNum, {
        appAccountId: this.appAccountId
      }).then(res => {
        if (res.code === 1) {
          let dat = res.data
          return dat.maxCount - dat.count // 返回剩余可创建数量（关键词回复）
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    addReply(){  //点击添加回复按钮
      this.now = 3;
      let num = this.getNum()
      if (num <= 0) {
        this.$Message.error('最多可添加10条关键词回复。')
        return
      }
      this.$router.push(this.typ[3].path);
      this.$store.commit('vipcn/SET_EDITTYPE','add');   //变更vipcn模块中editType的状态值
    },
    search(){    //搜索事件
      this.$refs.dom.search(this.keyWord);
      this.keyWord = '';
    },
    show(arr){   //显示对话框
      this.showModal = true;
    },
    ok(){
      this.$refs.dom.del();
    }
  }
}
</script>

<style lang="stylus" >
  .reply-page
    margin-right: -20px
    .reply-scroll>div:first-child
      padding-right: 20px
      padding-top: 30px
  #material-reply
    min-height: 700px
    margin-top 10px
    // padding: 0 !important
    padding 0 20px 20px
    background-color #ffffff
    border-radius 3px
  .wechat-title
    p
      display:inline-block
      padding:0 15px 20px
      margin-bottom:-20px
      cursor:pointer
      font-size:18px
      color:#606366
      &.router-link-active,&.active
        color:#409eff;
        border-bottom:2px solid #409eff;
  .type-title
    align-items: center
    padding:30px 0 26px
    border-bottom solid 1px #e3e5e6
    .type-hand
      .addReply
        height:40px;
        margin-left: 20px
      .switch
        margin-left 20px
    h2
      font-size 24px
      font-weight normal
      color #303133
      padding-bottom 6px
    p
      font-size 14px
      line-height 22px
      color #979899
  .ivu-btn[disabled]
    background-color #f7f7f7 !important

  // 警告语样式
  .input-warn
    display: none
    position: absolute
    bottom: -24px
    left: 4px
    color: #ed4014
    font-size: 12px
    line-height: 1
  .warn
    input,.ivu-input-group-prepend
      border-color: #ed4014
    .keyword .ivu-input-group-prepend
      border-color: #ed4014
    .input-warn
      display: block
  .edit-box.warn
    border: 1px solid #ed4014
    position: relative
    .input-warn
      display: block
</style>
