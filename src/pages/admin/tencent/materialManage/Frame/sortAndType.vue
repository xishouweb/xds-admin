<template>
  <div id="sort-type">
    <Dropdown class="sortdowndown" trigger="click" :transfer="false" @on-click="getTimeList" >
      <span>{{timeList[timeIndex].label}}</span><span class="icon"> &#xe7d6;</span>
      <DropdownMenu slot="list">
        <DropdownItem :class="{'drop-down-item': timeIndex=== index}" v-for="(item, index) in timeList" :name="index" :key="index" :disabled="item.status == 0">
          {{item.label}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Dropdown class="sortdowndown" trigger="click" :transfer="false" @on-click="getTypeList" >
      <span>{{typeList[typeIndex].label}}</span><span class="icon"> &#xe7d6;</span>
      <DropdownMenu slot="list">
        <DropdownItem :class="{'drop-down-item': typeIndex === index}" v-for="(item, index) in typeList" :name="index" :key="index" :disabled="item.status == 0">
          {{item.label}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>

</template>
<script>
export default {
  name: 'currentPublicNumbuer',
  data() {
    return {
      timeIndex: 0,
      timeList: [
        {label: '时间从近到远', val: "create_time/DESC"},
        {label: '时间从远到近', val: "create_time/ASC"}
      ],
      typeIndex: 0,
      typeList: [
        {label: '全部文件', val: "size/''"},
        {label: '文件从大到小', val: "size/DESC"},
        {label: '文件从小到大', val: "size/ASC"}
      ],
      value: {
        time: 1,
        type: 1
      }
    }
  },
  methods: {
    update(arg) {
      this.$emit('update', arg)
    },
    getTimeList(name) {
      this.timeIndex = name
      // this.value.time = this.timeList[name].val
      this.update(this.timeList[name].val)
    },
    getTypeList(name) {
      this.typeIndex = name
      // this.value.type = this.typeList[name].val
      this.update(this.typeList[name].val)
    }
  }
}
</script>
<style lang="stylus">
#sort-type
  height 30px
  line-height 30px
  .sortdowndown
    padding 0 16px
    cursor pointer
  .icon
    font-size 12px
  .drop-down-item
    color: #409eff;
  .drop-down-item:hover
    background #f2f4f5 !important

</style>
