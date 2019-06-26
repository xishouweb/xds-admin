<template>
  <div id="filters">
    <div>
      <span class="label">订单编号</span>
      <Input class="input_item item" style="width: 180px" v-model="orderId" placeholder="请输入订单编号"/>
    </div>
    <div>
      <span class="label">订单状态</span>
      <Select class="select_item item" v-model="selectVal" style="width:108px">
        <Option v-for="(item, index) in statusList" :value="item.itemValue" :key="index">{{item.itemName}}</Option>
      </Select>
    </div>
    <div>
      <span class="label">订单时间</span>
      <DatePicker type="daterange" :transfer='true' format="yyyy/MM/dd" placement="bottom-end" class="data-range-color"
            placeholder="开始时间 - 结束时间" :value="dataVal" style="width: 280px" @on-change="setDate"></DatePicker>
    </div>
    <Button class="filter" type="primary" @click="filter">筛选</Button>
  </div>
</template>
<script>
  export default {
      name: 'filters',
      data() {
          return {
            orderId: null,
            selectVal: 1,
            dataVal: null,
            startTime: '',
            endTime: ''
          }
      },
      props: ['statusList'],
      components: {},
      methods: {
        getParams() {
          return {
            createTimeStr: this.timeGet(),
            orderId: this.orderId,
            orderStatus: this.selectVal === 1 ? null : this.selectVal
          }
        },
        timeGet() {
          if (!this.dataVal) return null
          if (this.dataVal && this.isArray(this.dataVal)) {
            let start = this.dataVal[0] ? this.dataVal[0].replace(/[日]/g, '').replace(/[年月]/g, '-') + ' 00:00:00' : null
            let end = this.dataVal[1] ? this.dataVal[1].replace(/[日]/g, '').replace(/[年月]/g, '-') + ' 23:59:59' : null
            return start && end ? start + ' - ' + end : null
          }
          this.dataVal = null
          return null
        },
        filter() {
          this._BUS.$emit('handleOrder', 'getRecords')
        },
        setDate(val) {
          val.forEach((v, i) => {
            val[i] = v.replace(/\//g, '-')
          })
          this.dataVal = val
        }
      }
  }
</script>
<style lang="stylus">
@import '~@/assets/stylus/index'
#filters
  fr()
  >div
    fl()
    mr(18px)
    .label
      fl()
      mr(10px)
      mt(12px)
    .item
      fl()
  .filter
    width:80px

</style>
