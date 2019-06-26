# yktadmin

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

  deleteuploadfile: "api/deleteuploadfile",
  // 上传图片
  upload: "api/upload",
  // 查看图片
  overview: "api/overview",
  const uploadService = 'api' 添加前缀

// 上传名片
export const uploadPostcard = (params) => api.get('/uploadpostcard', params)
// 下载名片(没有api)
export const downloadPostcard = (params) => {
    let downLoadUrl = "/downloadpostcard" + '?' + params.fileName + "=" + params.filePath
    window.location.href = downLoadUrl
}
// 获得sessionId
export const getSessionId = () => api.get('/getSessionId')

mi.uploadService = new jsonProxy("/webuploader/upload/");
initUrl: this.url + '/webuploader/upload'

模板返回的格式
1 您好，您已购买成功。<br/><br/>商品信息：{{name.DATA}}<br/>{{remark.DATA}}，                          头部没有字段
2 {{first.DATA}}<br/>预约内容：{{keyword1.DATA}}<br/>预约时间：{{keyword2.DATA}}<br/>{{remark.DATA}}， 头部有字段正常格式
3 您好，您的域名在IP{{IP.DATA}}上被{{laotion.DATA}} <br/><br/> 时间：{{time.DATA}}<br/>{{reason.DATA}}  头部一行有多个字段

先按<br /> 分数组
再按 {{}} 分数组
再按.DATA 取 label,key

测试




本地保存个人的token信息（获取绑定的公司信息），，本地保存登陆的企业信息（根据当前公司获取公众号，员工等信息），，本地保存登陆当前公众号信息（根据当前公众号获取公众号信息）。
