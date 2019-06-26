<template>
  <!-- 页面简介 -->
  <remind class="gray_color">
    <!-- 标准群发 -->
    <template v-if="pageDex === 0">
      <template v-if="publicType === 2">
        <p>
          1、销大师为已认证服务号提供每日<span style="font-weight: bold;">{{massNum[0]}}</span>次的群发能力，即每日群发给不同的粉丝，单个粉丝每月只能接收<span style="font-weight: bold;">4</span>条消息。当前公众号今日已使用次数：
          <span class="text_color">{{massNum[1]}}次</span>
        </p>
      </template>
      <template v-else>
        <p>
          1、销大师为已认证订阅号提供每日1次的群发能力。
        </p>
      </template>
      <p>2、标准群发支持文本、图片、图文(多图文)、语音、视频消息类型。</p>
    </template>
    <!-- 高级群发 -->
    <template v-else-if="pageDex === 1">
      <p>
        1、销大师为已认证服务号提供每日<span style="font-weight: bold;">{{massNum[0]}}</span>次的群发能力，即每日群发给不同的粉丝，单个粉丝每月只能接收<span style="font-weight: bold;">4</span>条消息。当前公众号今日已使用次数：
        <span class="text_color">{{massNum[1]}}</span>
      </p>
      <p>2、高级群发支持文本、图片、图文(多图文)、语音、视频消息类型。</p>
    </template>
    <!-- 客服消息群发 -->
    <template v-else-if="pageDex === 2">
      <p>
        1、已认证公众号提供每日<span style="font-weight: bold;">{{massNum[0]}}</span>条的群发能力，今日客服消息已使用条数：
        <span class="text_color">{{massNum[1]}}</span>
      </p>
      <p>2、客服消息仅支持已认证的公众号，且粉丝与公众号互动时间的48小时内，即粉丝在48小时内发消息给公众号或点击过菜单的粉丝才能收到群发客服消息。</p>
      <p>3、禁止滥发消息，以免造成对用户骚扰。只计算实际发送成功的条数，失败的条数不会消耗条数。</p>
      <p>4、客服消息群发支持文本、图片、图文(单图文)、语音、文件消息类型。</p>
    </template>
    <!-- 模板消息群发 -->
    <template v-else-if="pageDex === 3">
      <p>
        1、已认证公众号提供每日<span style="font-weight: bold;">{{massNum[0]}}</span>条的群发能力，今日模板消息已使用条数：
        <span class="text_color">{{massNum[1]}}</span>
      </p>
      <p>2、模板消息不受时间和次数限制，随时可以发送给粉丝，支持点击模板消息跳转到指定链接。但需要控制群发次数。</p>
      <p>3、禁止滥发消息，以免造成对用户骚扰。只计算实际发送成功的条数，失败的条数不会消耗条数。</p>
      <p>4、模板消息群发仅支持模板消息类型。</p>
    </template>
  </remind>
</template>

<script>
  export default {
    props: {
      pageDex: {
        type: Number,
        default: 0
      },
      publicType: {
        type: Number,
        default: 1
      },
      massNum: {
        type: Array,
        default() {
          return [0, 0]
        }
      }
    },
    data() {
      return {}
    },
    components: {
      remind: () => import('@/components/pageStyle/headerRemind.vue')
    }
  }
</script>
<style lang="stylus">

</style>
