<template>
  <div id="baseInfo" >
    <BScroll :data="details" :offsetBottom="80">
       <Form ref="formValidate" :class="{'small-space': !isEdit, 'un-edit': !isEdit}" :model="details" :rules="ruleValidate" :label-width="120" label-position="left">
        <FormItem label="员工姓名">
            <div slot="label">
              <img width="50px" height="50px" :src="details.picUrl" v-if="details.picUrl"/>
              <img width="50px" height="50px"  v-else src="@/assets/images/admin/portrait.png"/>
            </div>
            <div class="portrait_p">
              <span class="por_left" v-if="details.joinStatus != 1">
                <i>未加入企业</i>
                <a v-if="details.seatStatus" @click.stop="handle('askFor')">去邀请</a>
              </span>
              <span class="por_left">{{details.accountNickName}}</span>
            </div>
        </FormItem>
        <FormItem label="员工姓名" prop="nickname">
          <span v-if="!isEdit">{{details.nickname}}</span>
          <Input v-else v-model="details.nickname"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <span v-if="!isMobileEdit || !isEdit">{{details.mobile}}</span>
          <Input v-else v-model="details.mobile" placeholder="员工手机号验证通过后可加入企业">
            <span slot="prepend">中国大陆 +86</span>
          </Input>
        </FormItem>

        <FormItem label="性别">
          <span v-if="!isEdit">{{details.sex | sex}}</span>
          <RadioGroup v-else v-model="details.sex">
            <Radio :label="1"><span>男</span></Radio>
            <Radio :label="2"><span>女</span></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="部门" class="split">
          <span v-if="!isEdit">{{details.deptName}}</span>
          <Input v-else placeholder="请点击选择所属部门"
              @click.native="showApart"
              style="width: 400px" v-model="details.deptName" />
        </FormItem>

        <FormItem label="职务">
          <span v-if="!isEdit">{{details.postName || '无'}}</span>
          <Input v-else v-model="details.postName"  placeholder="请输入部门职务名称, 例如:销售顾问"/>
        </FormItem>

        <FormItem label="坐席">
          <span v-if="!isEdit">{{details.seatNo || '无'}}</span>
          <div v-else>
            <i-switch v-model="isZuoxiOpen" :disabled='zuoxiArr.length <= 0' @on-change="change"></i-switch>
            <span v-if="zuoxiArr.length > 0">剩余{{ leftSeatNum }}个坐席</span>

            <p class="lightGray_color" v-if="zuoxiArr.length > 0">开启后则表示该员工占用一个坐席席位并有坐席功能</p>
            <span v-if="zuoxiArr.length <= 0">无剩余坐席</span>
            <p v-if="zuoxiArr.length <= 0">您可前往坐席管理调整分配, 或升级套餐增加坐席数。
              <i class="updateSet cursor" @click="upgrade">升级套餐</i>
            </p>
          </div>
        </FormItem>
        <FormItem label="坐席编号" :prop="zuoxi ? 'kfId' : ''" v-if="isZuoxiOpen && isEdit">
            <div>
              <Select v-model="details.kfId">
                <Option v-if="details.kfId && details.seatNo" :value="details.kfId">{{details.seatNo}}</Option>
                <Option v-for="(child, n) in zuoxiArr" :key="n" :value="child.id">{{child.seatNo}}</Option>
              </Select>
            </div>
        </FormItem>

        <FormItem label="坐席备注">
          <span v-if="!isEdit">{{details.remark || '无'}}</span>
          <Input v-else v-model="details.seatName" placeholder="请输入坐席备注"/>
        </FormItem>
    </Form>
    <Form class="small-space" :label-width="120" label-position="left">
        <FormItem label="身份" class="split">
          <span>{{details.identity | identity}}</span>
        </FormItem>
        <FormItem label="员工状态">
          <span>{{details.status | status}}</span>
        </FormItem>
        <FormItem label="加入时间">
          <span>{{details.addTime | time}}</span>
        </FormItem>
        <FormItem label="添加时间">
           <span>{{details.createTime | time}}</span>
        </FormItem>
    </Form>
    </BScroll>
    <!-- 修改部门 -->
    <ApartChoose ref="tree" v-model="showModal" @on-selected="onSelected"></ApartChoose>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import ApartChoose from './ApartChoose'
export default {
  components: {ApartChoose},
  data() {
    return {
      showModal: false,
      details: {
        picUrl: '',
        nickname: '',
        mobile: '',
        sex: '',
        deptName: '',
        postName: '',
        zuoxi: '',
        seatNo: '',
        seatName: '',
        identity: '',
        status: '',
        addTime: '',
        createTime: '',
        joinStatus: '',
        seatId: ""
      },
      zuoxi: false,
      isZuoxiOpen: false,
      zuoxiArr: [],
      total: 0,
      seatStatus: 0,
      ruleValidate: {
        nickname: [
            { required: true, type: 'string', max: 40, message: '姓名不能为空且字符数不能超过40个', trigger: 'blur' }
        ],
        mobile: [
            { required: true, type: 'string', min: 11, max: 11, message: '请输入正确的手机号码！', trigger: 'blur' }
        ],
        kfId: [
            { required: true, type: 'number', message: '请选择一个坐席！', trigger: 'change' },
        ]
      },
      userPrevApart: null, // 用户原先所在部门，
      userCurrentApart: null // 用户重新选择后的的部门
    }
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    isEdit: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      totalTree: state => state.stuff.totalTree
    }),
    ...mapGetters({
      curUser: 'stuff/getCurUser'
    }),
    leftSeatNum () {
      return this.total - (this.isZuoxiOpen - 0)
    },
    isMobileEdit() {
      return this.details.joinStatus !== 1
    }
  },
  filters: {
    sex(val) {
      return val === 1 ? '男' : '女'
    },
    status(val) {
      switch (val - 0) {
        case 1:
          return '正常'
        case 2:
          return '停用'
        case 3:
          return '未加入'
        case 5:
          return '已退出'
        default:
          return ''
      }
    },
    identity(val) {
      return val - 0 === 1 ? "管理员" : '普通员工'
    },
    time(val) {
      return (val || '').split(' ')[0] || '无'
    }
  },
  watch: {
    curUser() {
      if (this.curUser) {
        this.init()
      }
    }
  },
  mounted() {
    if (this.curUser) {
      this.init()
    }
  },
  methods: {
    ...mapMutations({
      setTotalTree: 'stuff/SET_TOTAL_TREE'
    }),
    ...mapActions({
      getTree: 'stuff/getTree'
    }),
    init() {
      this.seatStatus = this.curUser.seatStatus
      this.details = this.deepCopy(this.curUser)
      this.getZuoxi()
    },
    handle(key) {
      this._BUS.$emit('handle', key, this.curUser.eeId)
    },
    showApart() {
      this.showModal = true
    },
    onSelected(data, prevData) {
      this.details.deptName = data.label
      this.details.deptId = data.id
      this.userCurrentApart = data // 用户重新选择后的的部门
      this.userPrevApart = prevData // 用户原先所在部门
    },
    getZuoxi() {
      this.zuoxiList().then((res) => {
        if (res.code === 1) {
          this.total = res.data.total
          this.zuoxiArr = res.data.seatList
          if (this.zuoxiArr.length) {
            this.details.kfId = this.details.kfId || this.zuoxiArr[0].id
            this.isZuoxiOpen = !!this.seatStatus
          }
        }
      })
    },
    // 提交
    submit(fn) {
      this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            let data = this.details
            let param = {
              deptId: data.deptId,
              eeId: data.eeId,
              nickname: data.nickname,
              seatName: data.seatName,
              sex: data.sex,
              postName: data.postName,
              seatId: this.isZuoxiOpen ? data.kfId : null
            }

            if (!this.details.joinStatus) {
              param.mobile = data.mobile
            }

            this.modifyUserDetail(param).then((res) => {
              if (res.code === 1) {
                this.changeEenum()
                fn && fn(param)
                this.$Message.success('修改成功')
              } else {
                this.$Message.error(res.message)
              }
            })
          }
      })
    },
    changeEenum() { // 更改部门员工数
      if (!this.userPrevApart && !this.userCurrentApart) return
      this.userPrevApart.copyeeNum = this.userPrevApart.copyeeNum - 1
      this.userCurrentApart.copyeeNum = this.userCurrentApart.copyeeNum + 1
      this.userCurrentApart.selected = false
      this.setTotalTree(this.$refs.tree.datas)
    },
    change(val) {
      this.zuoxi = val
      if (val) {
        if (this.curUser.kfId) {
          this.details.kfId = this.curUser.kfId
        } else {
          this.details.kfId = this.zuoxiArr[0].id
        }
      } else {
        this.details.kfId = null
      }
      this.$emit('setSeat', val)
    },
    upgrade() {
      let obj = {
        corpId: this.localStorageSaveOrRead('currentCorp').applyId,
        corpName: this.localStorageSaveOrRead('currentCorp').corpName
      }
      this.setPayStatu(obj)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
.inline
  inline()
#baseInfo
  relative()
  height 100%
  padding 20px
  .por_left a
    color #409eff
    display inline-block
    margin-left 20px
  .split
    mt(20px)
  .portrait_p
    padding-top 20px
  .ivu-form-item
      margin-bottom 20px
  .small-space .ivu-form-item
      margin-bottom 8px
  .un-edit .ivu-form-item-required .ivu-form-item-label:before
    content: '*';
    display: none;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ff3300;

</style>
