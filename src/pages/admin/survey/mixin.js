export default {
  data() {
    return {
      inform: [
        {
          title: '智能客户系统上线公告',
          id: 'inform2',
          time: '2019/04/13',
          cont: `
            销大师智能客服系统上线了！多公众号沟通管理，多客户管理，与客户高效沟通，提升销售转化。
            <br>智能客服系统具有以下功能：
            <br>【会话】
            <br>1、支持智能分配，同时有派单和抢单模式。
            <br>2、支持消息提醒通知。
            <br>3、支持发送不同的消息类型。
            <br>【粉丝】
            <br>1、客户资源管理，维护客户信息，根据客户。
            <br>【群发】
            <br>支持标准群发、客服消息群发、高级群发和模板消息群发。
            <br>【设置】
            <br>1、支持设置提醒通知。
            <br>2、支持设置自己的协作客服。
            <br>3、支持设置快捷回复内容。
            <br>
            <br>如您在使用产品的过程中遇到任何疑问或者建议，欢迎与我们及时联系，您的魅影想法对于我们的产品都非常重要。
          `
        },
        {
          title: '关于开具发票的相关说明',
          id: 'inform1',
          time: '2019/04/12',
          cont: `
            <br>如果您是在线购买的产品，请联系我们客服人员，我们为您开普通发票。
            <br>需要您提供的开票信息有：
            <br>单位的全称，单位地址及电话，银行基本户账号、开户行，税务登记号。
            <br>提供开票信息后，我们为您开好发票。
            <br>后期我们上线在线提交发票申请的功能，敬请关注。
          `
        },
        {
          title: '关于客户端版本下载升级通知',
          id: 'inform0',
          time: '2019/04/11',
          cont: `
            销大师客户端最新版本为V1.0，下载地址为官方网站。
            客户端版本主要功能有：客户聊天功能，粉丝管理功能，群发功能和设置功能。
            1、客户端登录页：
            <div><img src="${require('@/assets/images/survey/inform/inform0-step1.png')}"></div>
            2、客服聊天页：
            <div><img src="${require('@/assets/images/survey/inform/inform0-step2.png')}"></div>
            3、粉丝
            <div><img src="${require('@/assets/images/survey/inform/inform0-step3.png')}"></div>
            4、群发
            <div><img src="${require('@/assets/images/survey/inform/inform0-step4.png')}"></div>
          `
        }
      ],
      help: [
        {
          title: '如何添加员工和设置员工权限？',
          id: 'help2',
          time: '',
          cont: `
            添加员工分为3个步骤。
            第一步：添加员工基本信息，如下图：
            <div><img src="${require('@/assets/images/survey/help/help0-step1.png')}"></div>
            输入姓名和手机号码，职务可填可不填。
            分配坐席，如果此员工给他坐席权限，则开启坐席的开关，并选择一个坐席进行绑定。
            第二步：设置权限，如下图：
            <div><img src="${require('@/assets/images/survey/help/help0-step1.png')}"></div>
            权限分为三大权限，有企业管理系统、客服系统、客户端。可单独对3个版块的设置权限。
            第三步：邀请员工。如下图
            <div><img src="${require('@/assets/images/survey/help/help0-step1.png')}"></div>
            员工此时已经添加成功。但员工的微信尚未加入企业，所以将上图中的二维码截图发给员工，员工扫码后，验证手机号并加入企业，至此员工账号创建成功。
          `
        },
        {
          title: '客服消息群发设置',
          id: 'help1',
          time: '',
          cont: `
            一、如何发送客服消息。
            1）设置群发内容：客服消息群发支持的消息类型有文字、图文、语音、视频、文件，素材内容与微信公众平台一致。
            <div><img src="${require('@/assets/images/survey/help/help1-step1.png')}"></div><br>
            2）选择群发对象：可选择我的所属粉丝和全部粉丝群发，同时可分组发送，按照指定标签发送，根据来源发送，根据用户互动时间发送，根据其他条件发送。并可预估人数。
            <div><img src="${require('@/assets/images/survey/help/help1-step2.png')}"></div><br>
            3）发送时间：发送时间有两种形式，一是立即发送，二是定时发送，定时即选择时间发送。<br>
            二、客服消息群发注意的问题。
            1）客服消息仅支持已认证的公众号，且粉丝与公众号互动时间的48小时内，即粉丝在48小时内发消息给公众号或点击过菜单的粉丝才能收到群发客服消息。
            2）禁止滥发消息，以免造成对用户骚扰。只计算实际发送成功的条数，失败的条数不会消耗条数。
          `
        },
        {
          title: '粉丝裂变海报的玩法介绍',
          id: 'help0',
          time: '',
          cont: `
            一、如何设置粉丝裂变海报？
            1）设置海报的基本信息。
            填写海报模板名称，活动的有效期，活动所需邀请的关注数。制作一张适应手机端的海报，预留好二维码和粉丝头像昵称的位置，再设置二维码尺寸，粉丝头像的大小和形状，粉丝昵称字体的颜色和大小，并可拖动二维码和粉丝头像到海报的合适位置。如下图：
            <div><img src="${require('@/assets/images/survey/help/help2-step1.png')}"></div><br>
            2）设置扫码关注信息。
            设置自动打标签的功能，粉丝在领取粉丝海报时自动打标签。
            设置完成任务自动打标签，可分别开启和关闭自动打标签的功能。
            设置回复内容，回复内容可设置多条，支持文字、图文、图片、语音、视频、文件和模板消息。如下图：
            <div><img src="${require('@/assets/images/survey/help/help2-step2.png')}"></div><br>
            3）设置生成海报回复、活动进展通知和活动完成通知。
            设置生成海报回复：当粉丝领取粉丝海报后，在生成海报回复开启的状态下，即可收到生成粉丝海报回复。回复的内容中可填写相关的变量参数，比如粉丝昵称、海报名称等。
            <div><img src="${require('@/assets/images/survey/help/help2-step3.png')}"></div><br>
            设置活动进展通知：活动进展通知是通过微信模板消息实现的自动通知。可选择现有的模板消息或新建模板消息的方式来发送。
            <div><img src="${require('@/assets/images/survey/help/help2-step4.png')}"></div><br>
            设置活动完成通知：当邀请人完成任务后，即可收到任务完成的通知。可选择现有的模板消息或新建模板消息的方式来发送。
            <div><img src="${require('@/assets/images/survey/help/help2-step5.png')}"></div><br>
            二、粉丝海报如何领取？
            粉丝海报的领取方式目前支持1种，即从自定义菜单获取。领取后，可将自己的粉丝海报发布到微信群或朋友圈，微信好友扫码后即可参与活动领取粉丝海报。
          `
        },

      ]
    }
  }
}
