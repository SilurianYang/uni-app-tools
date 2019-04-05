# request.js 使用说明
#### 全局使用
```javascript {.line-numbers}
    //main.js
    import req from './common/request/request.js';
    Vue.prototype.$req = req;

    //xxx.vue 文件
    this.$req.ajax();
```
## 全局参数配置
属性名  |   类型    |   描述    |
----    |   ----    |   ----    
defaultReq  |   Object  |    [defaultReq](#defaultReq)



## 方法项列表

方法名  |   类型    |   方法参数    |   描述    |   平台兼容
----    |   ----    |   ----    |   -----   |   ---
ajax    |    [Object](#Object),[[...ages](#ages)] |   [ajax](#ajax)   |   一个基本的发起请求    |   


## <div id="defaultReq">全局defaultReq配置项列表</div> 
#### 如何配置
```javascript {.line-numbers}
    //main.js
    import req from './common/request/request.js';
    req.defaultReq.url ='https://www.easy-mock.com/mock/5ca6ec41215a7b66ff10343d/'  //设置公共url部分
    req.defaultReq.type="POST";     //设置公共请求类型
    req.defaultReq.testFun=res=>{   //设置验证方法
        if (!res.success) { //退出登录
            uni.reLaunch({
                url: 'login?userOut=true'
            });
        }
        return false
    }
```

 属性名  |   类型    |   必填    |   默认值  |   描述    |   平台支持度
----    |   ----    |   ----    |   ----    |   ----    |----
isreq   |   Boolean |   否  |   true    |   是否开启**ajax**请求方法,默认是开启,如果该为false,则**ajax不会调用并返回一个reject**    |
header  |   Object   |   否  |   {'content-type': 'application/x-www-form-urlencoded'}   |  用于设置请求类型    |
baseData    |    Object |   否  |     |   设置基础参数,也就是说**ajax**每次请求都会带上这个参数 |
url |   String  |   否  |       |   请求路径，开发者可以把公共的部分定义在这里    |
type    |   String  |   否  |   GET |   请求方式，默认GET。**设置次参数时全部使用大写** |
dataType    |   String  |   否  |   json    |   返回数据类型，默认为json。会对返回数据做一个JSON.parse  |
responseType    |   String  |   否  |  text     |   设置响应的数据类型。合法值：text、arraybuffer   |   支付宝小程序不支持
testFun |   Function    |   否  |       |   开发者自定义代码块容器，次方法回调一个**success data**对象，**即ajax返回数据。开发者可以在此方法内做一系列逻辑判断。比如退出，等其他操作。此方法可返回一个false来抛出一个ajax错误。默认返回true**



## <div id="ajax">ajax参数列表</div> 
#### <div id="Object">Object对象</div>
 属性名  |   类型    |   必填    |   默认值  |   描述    |  
----    |   ----    |   ----    |   ----    |   ----    |
path    |   String  |   **是**  |   |   请求路径，可以是整个路径，也可以是相同路径后拆分出来的后半部分[详细](#defaultReq)
title   |   Boolean/String  |   否  |   false   |   是否显示请求提示 默认为false不显示, 传入字符串则显示 推荐7个字内
header  |      Object/String    |   否  |   {'content-type': 'application/x-www-form-urlencoded'}   |   传入Object则为自定义整个header。String则只修改'content-type'，默认取全局配置中的header
data    |   Object/String/ArrayBuffer	   |    否  |       |   请求上传的参数,默认会加上全局配置中的**baseData**
type    |   String  |   否  |   GET |   请求方式。设置次参数时全部使用大写，默认使用全局配置中的
dataType    |    String |   否  |    json   |     返回数据类型，默认为json。会对返回数据做一个JSON.parse，默认使用全局配置中的
responseType    |   String  |   否  |  text     |   设置响应的数据类型。合法值：text、arraybuffer   |   支付宝小程序不支持，默认使用全局配置中的
finshFun    |    Function   |   否  |       |   ajax请求完成后调用，无论成功还是失败。返回一个回调数据
abortFun    |   Function    |   否  |   |   返回一个 requestTask 对象，通过 requestTask，可中断请求任务。
#### <div id="ages">[...ages] 不做任何处理，ajax完成后返回个你</div>

```javascript {.line-numbers}
try {
    const res = await this.$req.ajax({
        path: "example/query",
        title:"正在加载",
        data: {
            page:1
        },
    }, {key:1})
    console.log(res);
} catch (e) {
    console.log(e)
}
```