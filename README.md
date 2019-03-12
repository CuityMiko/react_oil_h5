# oilStation-h5
oilStation-h5 system solution

<img src="https://raw.githubusercontent.com/yezihaohao/react-admin/master/screenshots/logo.png" alt="logo" width="150" height="53" />

### 依赖模块
<span style="color: rgb(184,49,47);">项目是用create-react-app创建的，主要还是列出新加的功能依赖包</span>

<span style="color: rgb(184,49,47);">点击名称可跳转相关网站😄😄</span>

- [react](https://facebook.github.io/react/)(基础开发mvc框架)
- [react-router](https://react-guide.github.io/react-router-cn/)(react路由)
- [redux](https://redux.js.org/)(基础用法，但是封装了通用action和reducer)
- [antd-mobile](https://mobile.ant.design/index-cn)(<span style="color: rgb(243,121,52);">蚂蚁金服开源的react-mobile ui组件框架</span>)
- [axios](https://github.com/mzabriskie/axios)(<span style="color: rgb(243,121,52);">http请求模块</span>)
- [echarts-for-react](https://github.com/hustcc/echarts-for-react)(<span style="color: rgb(243,121,52);">可视化图表，别人基于react对echarts的封装，足够用了</span>)
- [animate.css](http://daneden.me/animate)(<span style="color: rgb(243,121,52);">css动画库</span>)
- [react-loadable](https://github.com/jamiebuilds/react-loadable)(代码拆分，按需加载，预加载)
- 其他小细节省略

### 代码目录
```js
+-- dist/                                  ---打包的文件目录
+-- config/                                 ---webpack的配置文件目录
+-- node_modules/                           ---npm下载文件目录
+-- public/                                 
|   --- favicon.ico							---站点ico文件
|   --- index.html							---首页入口html文件
|   --- manifest.json						---站点manifest配置
|   --- theme.less							---站点全局样式配置（自动生成）
+-- src/                                    ---核心代码目录
|   +-- axios                               ---http请求存放目录
|   |    --- index.js
|   +-- pub-sub-events                      ---事件发布订阅机制
|   |    --- index.js
|   +-- components                          ---各式各样的组件存放目录
|   |    +-- common                         ---公共组件封装
|   |    |    --- BreadcrumbCustom.jsx      ---面包屑组件
|   |    +-- widget                         ---操作性组件封装
|   |    |    --- ...   
|   |    --- HeaderCustom.jsx               ---顶部导航组件
|   |    --- SiderCustom.jsx                ---左边菜单组件
|   +-- views                          ---页面容器存放目录
|   |    +-- charts                         ---图表组件
|   |    |    --- ...   
|   |    +-- forms                          ---表单组件
|   |    |    --- ...   
|   |    +-- pages                          ---页面组件
|   |    |    --- ...   
|   |    +-- tables                         ---表格组件
|   |    |    --- ...   
|   |    --- Page.jsx                       ---页面容器
|   |    --- App.js                         ---组件入口文件
|   +-- style                               ---项目的样式存放目录，主要采用less编写
|   +-- utils                               ---工具文件存放目录
|   +-- redux                               ---redux状态管理目录
|   |    --- actions-types.js
|   |    --- actions.js
|   |    --- reducers.js
|   |    --- store   
|   +-- services                            ---结构存放目录
|   --- index.js                            ---项目的整体js入口文件，包括路由配置等
--- .env                                    ---启动项目自定义端口配置文件（端口号）
--- .eslintrc                               ---自定义eslint配置文件，包括增加的react jsx语法限制
--- package.json                            ---依赖库配置文件
```
### 安装运行
##### 1.下载或克隆项目源码
```
git clone -b develop http://gitlab.cloudrelation.com/cuitongyang/oilStation-h5.git
```
##### 2.npm安装相关包文件(国内建议增加淘宝镜像源，不然很慢，你懂的😁)
> 有些老铁遇到运行时报错，首先确定下是不是最新稳定版的nodejs和npm（推荐使用6.10/11.0），切记不要用cnpn

```js
npm install --registry=https://registry.npm.taobao.org
or
npm config set --registry=https://registry.npm.taobao.org
npm install
```
##### 3.启动项目
```js
npm run dev
```
##### 4.打包项目
```js
npm run build
```

### 相关网站
- 1.react-router：https://reacttraining.com/react-router/web/guides/quick-start

### 约定

##### 主题颜色
- 1. 项目中主题颜色在base/style/variables.less修改
- 2. antd-mobile中主题颜色在base/style/index.less修改
- 3. 修改后运行npm run theme
- 4. 生成后自动生成public/theme.less文件

##### 目录结构创建
- 1. 模块目录结构
```js
// 模块目录结构 - 多页面
+-- home                                                   --- 模块名称
|   +-- components                                         --- 模块级公共组件
|   |   +-- header_button                                  --- 组件名称
|   |   |   --- HeaderButton.jsx
|   |   |   --- header_button.less
|   +-- containers                                         --- 模块下容器（页面）目录
|   |   +-- notice_center                                  --- 通知中心目录
|   |   |   +-- components                                 --- 页面级组件目录
|   |   |   |   --- NavButton.jsx
|   |   |   |   --- nav_button.module.less
|   |   |   +-- redux                                      --- 页面级状态管理
|   |   |   |   |   --- action-types.js
|   |   |   |   |   --- actions.js
|   |   |   |   |   --- reducers.js
|   |   |   +-- styles                                     --- 页面级样式目录
|   |   |   |   --- list.less
|   |   |   |   --- detail.less
|   |   |   --- List.jsx
|   |   |   --- Detail.jsx
|   |   |   --- notice_center.less
|   +-- assets                                             --- 模块级资源目录
|   |   +-- images
|   +-- routes                                             --- 模块级路由
|   |    --- index.js                                      --- 路由页面模块配置文件
|   |    --- route.js                                      --- 路由url配置
|   +-- redux                                              --- 模块级状态管理
|   |   --- action-types.js
|   |   --- actions.js
|   |   --- reducers.js
|   +-- services                                           --- 模块级服务目录
|   |    --- notice_center.service.js
|   --- home.less                                          --- 模块样式文件
|   --- home.reducer.js                                    --- 模块全局reducer文件

// 模块目录结构 - 单页面
+-- home                                                   --- 模块名称
|   +-- components                                         --- 模块级公共组件
|   |   +-- header_button                                  --- 组件名称
|   |   |   --- HeaderButton.jsx
|   |   |   --- header_button.less
|   +-- assets                                             --- 模块级资源目录
|   |   +-- images
|   +-- routes                                             --- 模块级路由
|   |    --- index.js                                      --- 路由页面模块配置文件
|   |    --- route.js                                      --- 路由url配置
|   +-- redux                                              --- 模块级状态管理
|   |   --- action-types.js
|   |   --- actions.js
|   |   --- reducers.js
|   --- home.service.js                                    --- 模块服务文件
|   --- home.route.js                                      --- 模块路由文件
|   --- home.less                                          --- 模块样式文件
|   --- index.jsx                                          --- 模块容器文件
```

##### 组件样式命名
- 1. 在页面级组件less文件命名中需要加上，在页面级组件less文件命名中需要加上.module前缀，方便做css模块化。例如：oil_card_detail.module.less，公共组件以及模块组件不加.module前缀

##### 表单验证
- 1. rc-form使用 (https://www.npmjs.com/package/rc-form)
```js
// 引入
import { createForm } from 'rc-form';

// 绑定 form
/ 将form表单的api绑定到props,便于调用
const EditHeaderWrapper = createForm()(EditHeader);
 
export default EditHeaderWrapper

// 绑定 item
const { getFieldProps } = this.props.form;
<InputItem
  {...getFieldProps('jq',{
    initialValue:state.jq // 初始值
  })}
  placeholder="请输入"
>监区</InputItem>

// 获取 form 的值 
this.props.form.getFieldsValue()
```

##### eslint代码规范：
- 1. https://www.imooc.com/article/20073

##### 参数接收方式： 
```js
// ?id=形式传参： 
this.props.query.id
// /:id 形式传参：
this.props.params.id
```
### 页面规范
##### 左右留白WingBlank两种size供选择
- 1. 最常用：size="sm"，大小为26px
- 2. size="md"，大小为51px

##### 上下留白WhiteSpace五种size供选择
- 1. 最常用：size="xs"，大小为26px
- 2. size="sm"，大小为35px
- 3. size="md"，大小为50px
- 4. size="lg"，大小为60px
- 5. size="xl"，大小为80px