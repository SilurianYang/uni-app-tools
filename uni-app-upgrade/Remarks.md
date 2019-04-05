### App升级模板使用说明

##### 当前版本：1.0.1

### 简介说明:

> 开箱即用。简单部署，下载运行即可看到效果，**完全不需要后台！！！**  在每个栏目下都有一个 **update.json** 文件，此文件作为升级功能的重要文件，需要把这个文件放在服务器下，通过请求此文件完成校验并升级。

#### 使用说明：
1. 卸载app上已经存在的hbuilder或hbuilderx同步的app，方便测试。
1. 下载你压缩包，找到你想测试的项目，点击去找到**update.json** 文件，扔到服务器。
1. 找到对应项目下的base.js，修改路径为你自己的**update.json**文件路径。
1. 查看对应项目下的**manifest.json** 节点**版本号**，修改**update.json**下**version**节点。列如：manifest.json下为1.0.0，update.json修改version为1.0.1 则升级，节点属性相同则不升级App直接跳过升级操作。

#### 注意事项：
1. **update.json** 必须是严格的json，去掉所有注释
1. **update.json** 下**size**节点必须是字节并且是**热更包**的文件大小，此参数只会在热更模式下起效，整包更新忽略。
1. 同version节点，热更包必须必比用户手机上的的要高。也就是说服务器上的**update.json**，version节点必须和更新包version一样 且必须大于用户本机应用。
1. 把manifest.json下splashscreen-->alwaysShowBeforeRender 改为**false**,waiting改为**false**,autoclose改为**false**

#### update.json
|    节点名称    |   参数类型    |   必填    |   描述  | 
|   ----    |   ----    |   ----    |   ----    | 
|    version |   string  |   **是**  |   用于对比manifest.json中的版本号    |
|   download    |   string  |    **是**  |  必填 热更下载地址 string格式只能唯一    |  
|   new_download    |    Array  |   否  |   非必填 Array格式 循环下载，挨着尝试（直到成功结束），尝试完成。当前此项存在的时候忽略download 属性  |
|   size    |   number  |    **是**  |   当前安装包文件大小(b)，用于对比当前下载的包是否完整    |
|   android-->min_hotupdate_ver |   string  |    **是**  |   最小支持的热更版本，如果此选项和version选项相同值的情况下，会采取浏览器打开的方式下载。整包更新。   |
|   android-->install |   string  |  **是**    |    整包下载地址 string格式只能唯一    |
|   android-->new_install |      Array    |   否  |    Array格式 随机选择一个下载地址打开浏览器下载。当前此项存在的时候忽略install 属性 |
|   iphone-->min_hotupdate_ver  |   string  |    **是**  |   最小支持的热更版本，如果此选项和version选项相同值的情况下，会采取浏览器打开的方式下载。整包更新。   |
|   iphone-->install    |   string  |    **是**  |    整包下载地址 string格式只能唯一    |
|   iphone-->new_install    |   Array   |   否  |   Array格式 随机选择一个下载地址打开浏览器下载。当前此项存在的时候忽略install 属性    |



#### 更新日志：

##### 1. 2019年3月20日19:30:28  首次提交
##### 2. 2019年3月22日19:02:00  更新文档注意事项
##### 3. 2019年3月27日16:37:41  修复使用热更后无法使用整包更新的问题




#### 下期更新：

##### 1. uni-app 升级进度条 

