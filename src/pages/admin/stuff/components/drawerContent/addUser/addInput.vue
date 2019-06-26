<template>
  <div id="addInput" :style="{height: height + 'px'}">
    <Form ref="formValidate"  :model="details" :rules="ruleValidate" :label-width="120">
        <FormItem label="员工姓名" prop="nickname">
            <Input v-model="details.nickname" placeholder="请填写员工姓名"/>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="details.mobile" placeholder="员工手机号验证通过后可加入企业">
            <span slot="prepend">中国大陆 +86</span>
          </Input>
        </FormItem>
        <FormItem label="性别">
            <RadioGroup v-model="details.sex">
              <Radio label="1"><span>男</span></Radio>
              <Radio label="2"><span>女</span></Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="职务">
            <Input v-model="details.postName"  placeholder="请输入部门职务名称, 例如:销售顾问"/>
        </FormItem>
        <FormItem label="坐席">
           <div>
            <i-switch v-model="zuoxi" :disabled='zuoxiArr.length <= 0' @on-change="change"></i-switch>
            <span v-if="zuoxiArr.length > 0">剩余{{ leftSeatNum }}个坐席</span>

            <p class="lightGray_color" v-if="zuoxiArr.length > 0">开启后则表示该员工占用一个坐席席位并有坐席功能</p>
            <span v-if="zuoxiArr.length <= 0">无剩余坐席</span>
            <p v-if="zuoxiArr.length <= 0">您可前往坐席管理调整分配, 或升级套餐增加坐席数。
              <i class="updateSet cursor" @click="upgrade">升级套餐</i>
            </p>
          </div>
        </FormItem>
        <FormItem label="坐席编号" :prop="zuoxi ? 'seatId' : ''" v-if="zuoxi">
            <div >
              <Select v-model="details.seatId">
                <Option v-for="(child, n) in zuoxiArr" :key="n" :value="child.id">{{child.seatNo}}</Option>
              </Select>
            </div>
        </FormItem>
        <FormItem label="坐席备注" v-if="zuoxi">
            <Input v-model="details.seatName" placeholder="请输入坐席备注"/>
        </FormItem>
    </Form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
     const validateMobile = function(rule, value, callback) {
          if (!value || !/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
              callback(rule.message)
          } else {
              callback()
          }
      }
    return {
        details: {
          nickname: "",
          mobile: '',
          sex: "1",
          postName: '',
          seatId: '',
          seatName: ''
        },
        initSeatCode: '',
        zuoxi: false,
        ruleValidate: {
            nickname: [
                { required: true, type: 'string', max: 40, message: '姓名不能为空且字符数不能超过40个', trigger: 'blur' }
            ],
            mobile: [
                { required: true, type: 'string', validator: validateMobile, min: 11, max: 11, message: '请输入正确的手机号码！', trigger: 'blur' }
            ],
            seatId: [
                { required: true, type: "number", message: '请选择一个坐席！', trigger: 'blur' },
            ]
        },
        // 手机号输入错误
        isZuoxiOpen: false,
        zuoxiArr: [],
        total: 0,

    }
  },
  props: {
    height: {
        type: Number,
        default: 0
    }
  },
  computed: {
    leftSeatNum () {
      return this.zuoxi ? this.total - 1 - (this.isZuoxiOpen - 0)
                        : this.total - (this.isZuoxiOpen - 0)
    }
  },
  created() {
    this.getZuoxi()
  },
  methods: {
    ...mapActions({
      setPayStatu: 'pay/setPayStatu'
    }),
    init() { // 在index。vue 中调用
      this.details = {
          nickname: "",
          mobile: '',
          sex: "1",
          postName: '',
          seatId: '',
          seatName: ''
        }
      this.zuoxi = false
      this.getZuoxi()
    },
    change(val) {
      val ? (this.details.seatId = this.initSeatCode) : (this.details.seatId = null)
    },
    getParams(fn) {
      this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            fn && fn(this.details)
          }
      })
    },
    getZuoxi() {
      this.zuoxiList().then((res) => {
        if (res.code === 1) {
          this.total = res.data.total
          this.zuoxiArr = res.data.seatList
          if (this.zuoxiArr.length) {
            this.initSeatCode = this.zuoxiArr[0].id
          } else {
            this.isZuoxiOpen = false
          }
        }
      })
    },
    upgrade() {
      let obj = {
        corpId: this.localStorageSaveOrRead('currentCorp').applyId,
        corpName: this.localStorageSaveOrRead('currentCorp').corpName
      }
      this.setPayStatu(obj)
    },
  }
}
</script>

<style lang="stylus">
@import '~@/assets/stylus/index'
.inline
  inline()
#addInput
  relative()
  height 100%
  padding 20px
  overflow-y auto
  .updateSet
    color(text_color)
</style>
