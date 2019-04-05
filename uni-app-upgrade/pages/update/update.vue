<template>
  <view>
    <div class="mui-content">
      <div class="logo"></div>
      <div id="bottom_progressbar">
        <p class="progressbar_text">{{ text }}</p>
        <view class="progress-box">
          <progress
            :percent="upgrade"
            activeColor="red"
            active
            stroke-width="8"
            class="progress"
          />
        </view>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      platform: uni.getSystemInfoSync().platform,
      current_version: 100,
      text: "正在更新资源，请稍等",
      upgrade: 0,
      downPath: [],
      configData: {},
      AppupdateUrl: this.$updateurl
    };
  },
  async onLoad() {
    // #ifdef APP-PLUS
    let current_version = await this.getCversion();
    let AppupdateUrl = plus.storage.getItem("AppupdateUrl");

    if (AppupdateUrl == null) {
      //本地存储中没有保留用户自定义的url，就是测试保存的
      plus.storage.setItem("AppupdateUrl", this.AppupdateUrl);
    }
    if (current_version == null) {
      this.getWidgetInfo().then(data => {
        this.current_version = data;
        this.detectUpgrade();
      });
    } else {
      this.current_version = current_version;
      this.detectUpgrade();
    }
    // #endif
  },
  methods: {
    /**
     * 获取当前版本
     */
    getCversion() {
      return new Promise(async resolve => {
        let res = await this.getWidgetInfo();
        let cver = plus.storage.getItem("current_version");
        if (cver != null) {
          let flag = this.versionChecked(res, cver);
          if (flag) {
            return resolve(res);
          }
        }
        return resolve(cver);
      });
    },
    /**
     * 版本确认
     */
    versionChecked(currentV, currentV2 = this.current_version) {
      let oldV = currentV2.split(".");
      let newV = currentV.split(".");
      for (let i = 0; i < oldV.length; i++) {
        let item = +oldV[i];
        let item2 = +newV[i];
        if (item != item2) {
          if (item > item2) {
            //旧版大于新版 直接返回false
            return false; //不需要升级
          } else {
            return true;
          }
        } else {
          continue;
        }
      }
      return false; //不需要升级
    },
    /**
     * 首先获取下载地址,之前的下载地址为字符串系列。
     *传入一个父对象、一个key  返回随机一个下载地址
     */
    getConfigDownPath(pobj, key) {
      JSON.stringify(pobj);
      let newDownObj = pobj[`new_${key}`];
      if (typeof newDownObj != "undefined") {
        //先判断当前json文件中是否包含新版的升级下载地址,如果包含优先使用新版的
        //新版的下载地址必须是一个数组格式
        let pathsLeng = newDownObj.length;
        let randomIndex = parseInt(Math.random() * pathsLeng);
        let path = newDownObj[randomIndex];
        if (key == "download") {
          //热更key,新版使用
          this.downPath = newDownObj;
          this.downPath.splice(randomIndex, 1);
        }
        return path;
      }
      //没有新版下载地址，直接读取传过来的key value
      return pobj[key];
    },
    getWidgetInfo() {
      return new Promise(resolve => {
        plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
          resolve(wgtinfo.version);
        });
      });
    },
    detectUpgrade() {
      let dtask1 = plus.downloader.createDownload(
        this.AppupdateUrl,
        {
          retryInterval: 3,
          timeout: 10
        },
        (data, status) => {
          plus.downloader.clear();
          if (status === 200) {
            plus.io.resolveLocalFileSystemURL(data.filename, entry => {
              entry.file(file => {
                let fileReader = new plus.io.FileReader();
                fileReader.readAsText(file, "utf-8");
                fileReader.onload = () => {
                  let results = JSON.parse(fileReader.result);
                  if (!this.versionChecked(results.version)) {
                    console.log("不需要升级");
                    uni.reLaunch({
                      url: "../login/login?update=true"
                    });
                    return false;
                  } else {
                    plus.navigator.closeSplashscreen();
                    //需要升级
                    let iphoneData = "";

                    if (this.platform == "android") {
                      //安卓手机
                      iphoneData = results["android"];
                    } else {
                      iphoneData = results["iphone"];
                    }
                    if (!this.versionChecked(iphoneData.min_hotupdate_ver)) {
                      //热更
                      console.log("热更");
                      this.configData = JSON.parse(JSON.stringify(results));
                      this.Appupdate(this.configData);
                    } else {
                      console.log("打开链接下载");
                      let downPath = this.getConfigDownPath(
                        iphoneData,
                        "install"
                      );
                      plus.runtime.openURL(downPath);
                    }
                  }
                };
                fileReader.onerror = () => {
                  uni.showModal({
                    title: "提示",
                    content: "配置文件打开失败",
                    showCancel: false,
                    success: res => {
                      plus.runtime.quit();
                    }
                  });
                };
              });
            });
          } else {
            uni.showModal({
              title: "提示",
              content: "配置文件下载失败",
              showCancel: false,
              success: res => {
                plus.runtime.quit();
              }
            });
          }
        }
      );
      dtask1.start();
    },
    /**
     * 热更升级
     */
    Appupdate(config) {
      let downPath = this.getConfigDownPath(config, "download");
      let dtask = plus.downloader.createDownload(
        downPath,
        {
          retryInterval: 3,
          timeout: 10
        },
        (d, status) => {
          this.upgrade = 100;
          if (status == 200) {
            this.text = "正在校验安装包是否完整";
            var path = plus.io.convertLocalFileSystemURL(d.filename);
            if (plus.os.name == "iOS") {
              path = "file://" + path;
            }
            plus.io.resolveLocalFileSystemURL(
              path,
              entry => {
                entry.file(fs => {
                  if (fs.size == config.size) {
                    this.text = "正在安装，请稍后";
                    plus.runtime.install(
                      path,
                      {
                        //					force: true
                      },
                      () => {
                        this.text = "安装完成";
                        plus.storage.setItem("current_version", config.version);
                        entry.remove(
                          () => {
                            uni.showModal({
                              title: "提示",
                              content: "资源升级完成",
                              showCancel: false,
                              success: res => {
                                plus.runtime.restart();
                              }
                            });
                          },
                          () => {
                            console.log("安装包删除失败");
                          }
                        );
                      },
                      e => {
                        entry.remove(
                          () => {
                            console.log("安装包删除成功");
                          },
                          () => {
                            console.log("安装包删除失败");
                          }
                        );
                        uni.showToast({
                          icon: "none",
                          title: "安装失败了",
                          image: "/static/img/wain.png"
                        });
                        this.text = "安装失败了，重启试试？";
                        clearInterval(stop);
                        this.upgrade = 0;
                      }
                    );
                  } else {
                    entry.remove(
                      () => {
                        console.log("安装包删除成功");
                      },
                      () => {
                        console.log("安装包删除失败");
                      }
                    );
                    uni.showModal({
                      title: "提示",
                      content: "资源下载异常",
                      success: res => {
                        if (res.confirm) {
                          this.upgrade = 0;
                          this.text = "正在检测更新，请稍后";
                          this.detectUpgrade();
                        } else {
                          plus.runtime.quit();
                        }
                      }
                    });
                  }
                });
              },
              () => {
                uni.showModal({
                  title: "提示",
                  content: "读取升级包失败，请重试",
                  showCancel: false,
                  success: res => {
                    plus.runtime.quit();
                  }
                });
              }
            );
          } else {
            //下载失败
            if (this.downPath.length != 0) {
              uni.showModal({
                title: "提示",
                content: "升级包下载失败，是否重试？",
                success: res => {
                  if (res.confirm) {
                    this.Appupdate(this.configData);
                  } else {
                    plus.runtime.quit();
                  }
                }
              });
            } else {
              uni.showModal({
                title: "提示",
                content: "升级包下载失败，请退出重试",
                showCancel: false,
                success: res => {
                  plus.runtime.quit();
                }
              });
            }
          }
        }
      );
      dtask.addEventListener("statechanged", (task, status) => {
        switch (task.state) {
          case 1:
            break;
          case 2:
            break;
          case 3:
            let Size = (task.downloadedSize / task.totalSize) * 100;
            this.upgrade = parseInt(Size);
            break;
          case 4:
            break;
        }
      });
      dtask.start();
    }
  }
};
</script>

<style lang="scss">
.mui-content {
  height: 100vh;
  background: url("~@/static/img/gilr.png") 0 0 no-repeat;
  background-size: 100% 100%;
  .logo {
    width: 210upx;
    height: 229upx;
    position: relative;
    left: 50%;
    margin-left: -105upx;
    top: 253upx;
  }
  #bottom_progressbar {
    position: fixed;
    bottom: 60upx;
    width: 90%;
    left: 50%;
    margin-left: -45%;
    .progressbar_text {
      font-size: 32upx;
      color: #333333;
      margin-bottom: 30upx;
      text-align: center;
    }
    .uni-progress-bar {
      border-radius: 10px;
    }
  }
}
</style>
