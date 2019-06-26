<template functional>
  <div id="interaction">
    <div class="num_list">
      <div>
        <p class="num">{{props.conversationStatistics.visit || 0}}</p>
        <p class="name">来访次数</p>
      </div>
      <div>
        <p class="num">
          {{props.conversationStatistics.convrSeatMass || 0}}
        </p>
        <p class="name">强制发送次数</p>
      </div>
      <div>
        <p class="num">{{props.conversationStatistics.fansMsg || 0}}</p>
        <p class="name">粉丝说话次数</p>
      </div>
      <div>
        <p class="num">{{props.conversationStatistics.seatKfMsg || 0}}</p>
        <p class="name">客服说话次数</p>
      </div>
    </div>
    <ul class="time_list">
      <li>
        首次关注时间
        <span>{{props.conversationStatistics.firstVisitTime | chatFilterDate('content')}}</span>
      </li>
      <li>
        首次说话时间
        <span>{{props.conversationStatistics.firstTalkTime | chatFilterDate('content')}}</span>
      </li>
      <li>
        最近来访时间
        <span>{{props.conversationStatistics.lastVisitTime | chatFilterDate('content')}}</span>
      </li>
      <li>
        最后说话时间
        <span>{{props.conversationStatistics.lastTalkTime | chatFilterDate('content')}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
