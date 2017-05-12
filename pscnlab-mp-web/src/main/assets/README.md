#前端项目架构
*基于node.js 和 ant.design*
##需要node.js版本
```
node 4.x
```
##准备
```
sudo npm install webpack -g
sudo npm install webpack-dev-server -g
```
##前端环境安装启动
*注：如果执行npm install  中途取消，需要重新安装，要清除npm缓存 npm cache clean 删除 node_modules 文件夹，再执行npm install重新安装*
```
cd assets
npm install
npm run watch #启动webpack的watch模式
npm run dev #开启前端静态服务器（构建生成的文件放在内存中，不生成具体的文件），结合后端服务器可以做到浏览器自动刷新，方便开发。详见下面说明

npm run build-dev #构建development（开发）环境前端代码
npm run build-test #构建test（测试）环境前端代码
npm run build-stage #构建stage（预发布）环境前端代码
npm run build-release #构建release (正式) 环境前端代码
npm run build-pro #构建production（生产）环境前端代码
```

##dev-server
>- 结合webpack-dev-server 可以做到代码改动,浏览器自动刷新.
 - 使用webpack-dev-server 作为静态服务器,以--inline方式启动,js中会添加热刷新相关的代码.前后端各添加一个开发服务器的配置,对项目基本无侵入.
 - 注意前端静态服务器的端口，硬编码方式，多处有对应。

nodejs为例:

> 后台正式服务器添加一个启动模式:

```
exports.devserver = {
    static_url_prefix: 'http://localhost:8086/s/' //这个指向webpack-dev-server服务器
};
```
> 前端webpack.config.js添加一个启动模式:

```
"devserver": {
    "path": '../public',
    "publicPath": 'http://localhost:8086/s/' //这个指向webpack-dev-server服务器
},
```

> webpack-dev-server 启动方式:(以devserver方式启动)
*可以在assets目录中直接执行`npm run dev-server`*    

```
webpack-dev-server --port 8086 --progress --inline  --cfg.clean=false --cfg.runmod=devserver
```

> 后端启动方式:(以devserver方式启动,nodejs 为例：)
*可以在根目录中直接执行`npm run dev-server`*

```
PORT=3001 NODE_ENV=devserver npm start
```

> 浏览器输入下面连接访问,就可以达到浏览器自动刷新,尤其适合双屏开发，调整页面细节情况.

```
http://localhost:3001/    
```    


##约定
###目录结构
```
-assets
    -src
        -component              业务相关通用组件(注:工具类/业务无关的相关组件，统一写到framework/common中)。
        -entry                  项目入口文件
        -framework              框架，各位同学不要修改这个文件夹下面的代码，如果有bug，或者需求，向有关同学提出。
            -app                包含框架各个部分,头部 左侧 主体内容等.
            -common             业务无关的js公共方法.
            -component          业务无关的公共组件,比如ListPage组件等.
            -container          主体容器,会包含page
            -error              出错页面,比如404页面
            -faicon             字体图标组件
            -header             页面头部组件
            -page               页面组件,页面代码都会包含在page组件中,page组件会负责页面头部标题/面包屑导航 页面进场动画 初始化加载状态等.
            -settings           系统设置
            -sidebar            左侧菜单组件
            -HeaderMenu.jsx     获取 构建 头部导航菜单组件
            -Routes.jsx         路由组件,会获取pate/Routes.js中的路由配置,会包含一部分非业务相关的路由配置
            -SidebarMenu.jsx    获取 构建 左侧菜单.
        -page                   业务相关,平时开发主要在这个文件夹下进行.
            -所有文件夹          各个页面/模块业务代码,详见下面说明
            -RoutesCfg.js       所有业务相关的路由配置
    -package.json               项目资源管理配置文件.
    -READEME.md                 说明文档
    -webpack.config.js          构建工具webpack配置              
```
> 每个页面为一个单独组件，统一放在page目录下,每个页面所用到的资源都放到一个文件夹下面,比如home

```
home
    -img
        -home.jpg
    -home.jsx    
    -style.less

    
-brand // 大的模块
    -dine-dishAdd // 大模块下的子模块
    -dine-dishList
    -sellingStore
    -take-commodityAdd
    -take-dishAdd
    -take-dishList
    -Routes.js // 大模块下的所有路由
```
###URL(路由&菜单path)
> 需要根据路由同步页面状态（浏览器url同步页面状态，主要是头部导航和左侧菜单的选中状态，以及页面要渲染哪个组件），所以需要有固定格式的url，方便提取信息。

```
初步定为：http[s]://www.xxxx.com/m/mchID/sys-path/menu-path
/m/mchID/：对应商户id
sys-path：对应头部导航，确定是哪个系统，确定左侧显示哪组菜单，确定头部菜单状态。
menu-path：左侧菜单对应的path，同时跟路由有对应。menu-path可以多级，比如users/lists/...
注：url更头部/左侧菜单状态有关，不按约定编写url会导致菜单状态不对，或者左侧菜单不显示。
```
###路由&菜单
> 后端所有的get请求最终没有被截获的，都打到index.html

```
node后端路由配置（routes.js）：
router.get('*', function (req, res, next) {
    res.render('index.html');
});
```
> 前端所有没有截获的path，都打到Error404组件。

```
详见 framework/Routes.jsx
```

> 1.页面跳转要使用Link，否则会跳出单页面应用。

```
import {Link} from 'react-router'
<Link to="/xxxxx">XXXXX</Link>
```

> 2.PubSubMsg.publish('setPushState', url);
```
PubSubMsg.publish('setPushState', url);
```

####菜单数据来源：
> 左侧菜单数据由后台提供，会包含path，路由前端单独维护，通过path跟菜单（或者Link）关联。
> *注:头部和左侧菜单也可以前端硬编码,根据项目具体需求,具体决定.*

```
左侧菜单数据:详见 framework/SidebarMenu.jsx
头部导航菜单:详见 framework/HeaderMenu.jsx 
```
 
####菜单数据结构：
> 如果后端提供的数据结构字段名无法对应，做一层数据转换，或者修改转换函数。

```
/*
 * 左侧菜单与路由公用的数据
 * current：true/false 是否是当前菜单
 * path：对应地址,与路由关联
 * */
var menusRouts = [
    {text: '表单校验', icon: 'fa-arrow-right', path: '/validation0'},
    {text: '仪表盘', icon: 'fa-arrow-right', path: '/dashboard0'},
    {
        text: '用户管理', icon: 'fa-th-list',
        children: [
            {text: '仪表盘', icon: 'fa-arrow-right', path: '/dashboard3'},
            {text: '我的表单', icon: 'fa-arrow-right', path: '/myForm3'},
            {text: '用户查询', icon: 'fa-arrow-right', path: '/myTime3'}
        ]
    }
]

route属性:
noHaveMenu: 表示该页面不需要拥有菜单,在url改变的时候不会改变菜单的选中项
haveShowDetail: 表示改菜单能传入参数.比如:/m/1/stores-range/111会拥有/m/1/stores-range这个菜单
isSystemMenu: 表示系统应用,在顶部导航不会选中任何项
```

####地址栏与菜单自动关联
> 点击菜单时(或其他链接)，不需要绑定事件，直接通过Link走路由跳转，地址栏改变后，会触发监听事件，同步头部导航和左侧菜单状态

```
browserHistory.listen(function (data) {
//细节参见 具体代码 framework/Routes.jsx
}}
```

###各个页面头部的写法：
####目前一共三种写法：

> 第一种，直接写jsx：

```
let pageHeader = <div>
    <h1 className="admin-page-header-title">Dashboard</h1>
    <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item href="">应用中心</Breadcrumb.Item>
        <Breadcrumb.Item href="">应用列表</Breadcrumb.Item>
        <Breadcrumb.Item>某应用</Breadcrumb.Item>
    </Breadcrumb>
</div>;
<Page header={pageHeader}>
    ...
</Page>
```

> 第二种，js对象：

```
let pageHeader = {
    back: { // 头部得返回按钮
        title: '返回列表页',
        path: 'www.baidu.com',
    },
    title: '表单校验', // 缺省将不显示标题；'auto' 将会根据左侧导航，自动获取当前菜单名作为标题
    breadcrumbItems: [// 缺省将不显示面包屑导航； 'auto' 将会根据左侧导航，自动获取当前菜单展开状态作为面包屑导航。
        {text: '某应用'},
        {text: '我的时间', path: '/myTime3'},
        {text: '表单校验'}
    ]
};  
<Page header={pageHeader}>
    ...
</Page>
```

> 第三种，根据左侧菜单自动获取：

```
<Page header='auto'>
    ...
</Page>
```

###页面加载状态切换
> 传给Page loading（true/false）属性即可

```
<Page loading={this.state.loading}>
    ...
</Page>
```
###进场动画
> Page组件中有默认进场动画，各个页面可以自定义进场动画

```
let animConfig = [
            {opacity: [1, 0], translateX: [0, 50]},
            {opacity: [1, 0], translateX: [0, -50]}
        ];
<Page animConfig={animConfig}>
    ...
</Page>
```

###路由（url）中获取参数的方式：
```
router对应的组件，会被注入一些props属性，通过这些属性，可以获取到path中的参数。
// from the path `/inbox/messages/:id`
    const id = this.props.params.id 
    
// from the path `/foo?bar=baz`    
    this.props.location.query.bar
```
### 跳转到其他页面的方法
```
router会在组件得props中添加history对象，通过这个history.pushState可以实现页面间的跳转，而不刷新页面。
this.props.history.pushState({}, url);
```

##待解决问题
- 统一组件的写法，统一使用class extends 的方式。Home.jsx已经改为class方式。
    ```
    class方式，子类将重写父类的方法，
    比如父类有componentDidMount方法，子类也要实现componentDidMount方法，父类的componentDidMount方法将被覆盖，
    要想调用父类的componentDidMount，只能在子类的componentDidMount方法中调用super.componentDidMount().
    如果父类没有定义componentDidMount，子类调用super.componentDidMount()将报错！
    if(super.componentDidMount) super.componentDidMount();这样比较安全一些。。。
    每个方法都写if(super.componentDidMount) super.componentDidMount();，感觉好烦，一旦忘记了，会出问题。。。
    MiXin方式不存在这些问题。
    ```
- 前端添加modal层,所有与后端交互的(ajax请求,websocket等),都通过modal,view(React)层,通过modal层获取数据.
- 关于mchID，登陆时，如果存在next，想办法获取next中的mchID，存到sessionStorage中。如果不存在next，登陆之后跳转到选择商户页面，点击商户时，将mchID存到sessionStorage中，以后前端用到mchID都从sessionStorage中获取。
- 处理有些页面没有左侧菜单的情况，隐藏左侧菜单以及头部“切换菜单状态”按钮 done
- 通过发布订阅或者其他模式，统一管理头部导航和左侧菜单，以及url与页面状态的对应。由于地址栏改变事件会提前于菜单渲染，发布订阅模式是否合适？生产者消费者？还是使用发布订阅，通过状态检测？有点恶心。。。 done
- react react-dom antd 做成全局，节省打包时间。
- ajax封装，使用promise模式。 done promise 模式无法打断,不考虑使用promise模式.
- 框架级的东西，单独打包成一个组件，也通过npm方式安装，提高各个项目之间的通用性。方便统一维护。 done 架构相关代码暂时先区分到了同一个目录下。
- 表单校验 done 官网有提供
- 执行构建有些慢 done 构建慢一般可以接受，watch速度还是可以的。
- 根据地址定位左侧菜单 目前使用全局持有菜单句柄的方法，有点恶心，有没有好一点的方法？ done 使用发布订阅模式解决
- 根据左侧菜单修改右上角对应的面包屑 done 
- 由于这个是一个单页面应用,从新发送ajax请求的时候,一些ajax请求需要被打断,否则用户网络情况不好,点击了多个按钮,最终不能确定哪个ajax会被执行,会导致页面错乱问题. done 通过xhr的abort方法取消请求.
- 组件之间的通信
    - 父级->子级 props
    - 子级->父级 props传递事件?
    - 没有级联关系组件之间 flux
- 同一个组件,使用不同的react-router path,会导致这个组件渲染页面特变慢
    ```
    比如:
    path: 'aaaaa', component: Dashboard
    path: 'bbbbb', component: Dashboard
    这样一个路由,会导致Dashboard渲染页面特别慢
    ```
- 前端代码生成工具，主要针对CRUD页面。    
    
##报错
windows环境下安装一直报错如下：
> 解决办法： 

1. 删除node_modules文件夹
1. 执行 `npm cache clean `
1. 单独安装pre-commit：`npm install pre-commit`
1. 安装其他插件：`npm install`

```
npm WARN optional dep failed, continuing fsevents@1.0.6
npm ERR! Windows_NT 6.1.7601
npm ERR! argv "E:\\Program Files (x86)\\nodejs\\node.exe" "E:\\Program Files (x86)\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" "--registry" "https://registry.npm.taobao.org" "install"
npm ERR! node v4.2.6
npm ERR! npm  v2.14.12
npm ERR! path C:\Users\wanglei\AppData\Roaming\npm-cache\core-js\1.2.6\package\package.json.9e8432833306762fc34eea6335ac3a39
npm ERR! code EPERM
npm ERR! errno -4048
npm ERR! syscall rename

npm ERR! Error: EPERM: operation not permitted, rename 'C:\Users\wanglei\AppData\Roaming\npm-cache\core-js\1.2.6\package\package.json.9e8432833306762fc34eea6335ac3a39' -> 'C:\Users\wanglei\AppData\Roaming\npm-cache\core-js\1.2.6\package\package.json'
npm ERR!     at Error (native)
npm ERR!  { [Error: EPERM: operation not permitted, rename 'C:\Users\wanglei\AppData\Roaming\npm-cache\core-js\1.2.6\package\package.json.9e8432833306762fc34eea6335ac3a39' -> 'C:\Users\wanglei\AppData\Roaming\npm-cache\core-js\1.2.6\package\package.json']
npm ERR!   errno: -4048,
npm ERR!   code: 'EPERM',
npm ERR!   syscall: 'rename',
npm ERR!   path: 'C:\\Users\\wanglei\\AppData\\Roaming\\npm-cache\\core-js\\1.2.6\\package\\package.json.9e8432833306762fc34eea6335ac3a39',
npm ERR!   dest: 'C:\\Users\\wanglei\\AppData\\Roaming\\npm-cache\\core-js\\1.2.6\\package\\package.json',
npm ERR!   parent: 'babel-runtime' }
npm ERR!
npm ERR! Please try running this command again as root/Administrator.

npm ERR! Please include the following file with any support request:
npm ERR!     E:\dev\workspaces\java\meicanyun-parent\meicanyun-mp-web\src\main\assets\npm-debug.log

```


windows 执行`RUNMODE=devserver CLEAN=false webpack-dev-server --port 8086 --progress --inline` 报错
原因：参数 RUNMODE是linux下的写法，windows无法获取，为了统一命令，使用以前--cfg.runmode=devserver方式传参

##
- 请求：superagent
- cookie:
- 本地存储：
- 时间处理：moment 

