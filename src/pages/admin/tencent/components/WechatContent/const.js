import { uuid } from '@/utils/util'
export default {
  // 菜单内容
  contentIcon: [
    {
      icon: '&#xe662;',
      text: '文字',
      key: 'text',
      type: 'click'
    },
    {
      icon: '&#xe629;',
      text: '图文消息',
      key: 'news',
      type: 'media_id'
    },
    {
      icon: '&#xe6f7;',
      text: '图片',
      key: 'image',
      type: 'media_id'
    },
    {
      icon: '&#xe650;',
      text: '语音',
      key: 'voice',
      type: 'media_id'
    },
    {
      icon: '&#xe624;',
      text: '视频',
      key: 'video',
      type: 'media_id'
    },
    {
      icon: '&#xe60c;',
      text: '文件',
      key: 'file',
      type: 'click'
    },
    {
      icon: '&#xe643;',
      text: "模板",
      key: "template",
      type: 'click'
    }
  ],
  menuTemplate(menuLeave) {
    return {
        uuid: uuid(),
        menuId: '',
        parentId: '',
        appId: '',
        isMenuOpen: 1,
        createTime: '',
        createId: '',
        updateTime: '',
        updateId: '',
        type: 'click',
        name: menuLeave === 1 ? '菜单名称' : '子菜单名称',
        nameCopy: menuLeave === 1 ? '菜单名称' : '子菜单名称',
        key: 'text',
        value: '',
        url: '',
        view: '',
        miniprogram: {
          appid: '',
          pagepath: '',
          url: ''
        },
        subMenu: [],
        text: '',
        news: '',
        image: '',
        voice: '',
        video: '',
        file: '',
        template: '',
        posterTemplate: '',
        textLength: 0
    }
  }
}
