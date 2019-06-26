export default {
  methods: {
    // img切换alt 和src 或 url属性值
    changeAltToSrc(str, tag = "img", attr = "src") {
      let pattern1 = new RegExp(`<${tag}[^>]*>`, "g")
      let pattern2 = new RegExp(`${attr}=[\'\"]?([^\'\"]*)[\'\"]?`)
      // 1 获取 img 标签

      let arr = str.match(pattern1) || []
      // 2 获取alt 和 src
      arr.forEach(item => {
        let alt = item.match(/alt=[\'\"]?([^\'\"]*)[\'\"]?/) ? item.match(/alt=[\'\"]?([^\'\"]*)[\'\"]?/)[1] : null
        let src = item.match(pattern2) ? item.match(pattern2)[1] : null
        if (alt && src) {
          str = str.replace(src, alt) // 3 替换
        }
      })
      return str
    },
    // audio 和src 属性
    changeAudioTag(str) {
      let localContent = str
      // 1 获取 影藏的 p 标签
      let arr = str.match(/<p style="display: none">(.*?)<\/p>/g) || []

      arr.forEach(item => {
        let mediastr = item.match(/<p style="display: none">(.*?)<\/p>/)
                    ? item.match(/<p style="display: none">(.*?)<\/p>/)[1] : null
        if (mediastr) {
          let media = mediastr.replace(/&quot;/g, '"')
          media = JSON.parse(media)

          let attr = `frameborder="0" class="res_iframe js_editor_audio audio_iframe place_audio_area" src="/cgi-bin/readtemplate?t=tmpl/audio_tmpl&amp;name=${media.title}&amp;play_length=${media.timeLength}" name="${media.title}" play_length="${media.timeLength}" voice_encode_fileid="${media.mediaId}"`

          let pattern1 = new RegExp(`src="http://${media.cloudUrl}"`, "g")
          str = str.replace(pattern1, attr) // 3 替换
          str = str.replace(item, '') // 删除影藏的p
          if (localContent.split(`"src="http://${media.cloudUrl}"`).length <= 2) {
            localContent = localContent.replace(mediastr, '')
          }
        }
      })
      str = str.replace(/audio/g, "mpvoice")
      return str
    },
    mediaTagAttrChange(str) {
      let _str = ''
      // img
      _str = this.changeAltToSrc(str)
      // audio
      // _str = this.changeAudioTag(_str)
      // video

      return _str
    }
  }
}


// let str = '<p><br/></p><p style="display: none">{&quot;mediaId&quot;:&quot;zy0UrFvLuo_jOwvJGJhsn3WHbPTPvf0UOFZlWyQ0PXw&quot;,&quot;title&quot;:&quot;语音文件2.mp3&quot;,&quot;groupId&quot;:235,&quot;appAccountId&quot;:25,&quot;createId&quot;:310,&quot;createTime&quot;:&quot;2019-01-17 13:32:55&quot;,&quot;updateId&quot;:310,&quot;updateTime&quot;:&quot;2019-01-17 13:32:55&quot;,&quot;status&quot;:1,&quot;size&quot;:705515,&quot;timeLength&quot;:44090,&quot;cloudUrl&quot;:&quot;xds-10-1-1255528578.file.myqcloud.com/voice/media/25/1-1-bd8b124ab3e0ec436c1cf540688330f2.mp3&quot;,&quot;cloudType&quot;:1}</p><p><audio src="http://xds-10-1-1255528578.file.myqcloud.com/voice/media/25/1-1-bd8b124ab3e0ec436c1cf540688330f2.mp3" controls="controls"></audio></p><p><img alt="http://mmbiz.qpic.cn/mmbiz_jpg/O8SicbdvT1GGk53ljrRzFjoNSqYcBmeb9cZInK72hCXCMVlP5eicrAnMed0K6IM1H92SYibbL7svGdDUdiaSiceOarg/0?wx_fmt=jpeg" src="http://xds-10-1-1255528578.file.myqcloud.com/img/media/25/1-1-227f2f072802211adb31d78ae89df4a7"/><br/></p><p><br/></p>'



