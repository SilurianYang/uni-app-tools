<template>
	<view>
		<view class="cu-chat">
			<div class="prop" v-if="propHide">
				<div class="box">
					<input type="text" v-model="selfName" placeholder="请输入用户名" class="userIput" />
					<button type="primary" @click="suerName">确定</button>
				</div>
			</div>

			<div id='sound-alert' class="rprogress" v-if="showSound">
				<div class="rschedule"></div>
				<div class="r-sigh">!</div>
				<div id="audio_tips" class="rsalert" :class="{'cancel':moveCancel}">{{moveCancelText}}</div>
			</div>

			<scroll-view :scroll-y="true" class="scroll-y" :scroll-top="scrollTop" :scroll-with-animation="true">
				<div class="chatBox">
					<view class="cu-item" v-for="(item,index) in chartPage" :key="index" :class="{'self':item.msg.selfName==selfName}">
						<view class="main" v-if="item.msg.selfName==selfName">
							<view class="content bg-green shadow">
								<text>{{item.msg.text}}</text>
							</view>
						</view>
						<view class="cu-avatar radius" v-if="item.msg.selfName!=selfName" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>

						<view class="main" v-if="item.msg.selfName!=selfName">
							<view class="content shadow">
								<text>{{item.msg.text}}</text>
							</view>
						</view>

						<view class="cu-avatar radius" v-if="item.msg.selfName==selfName" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
						<view class="date">{{item.msg.selfName}}</view>
					</view>
				</div>
			</scroll-view>


		</view>

		<view class="cu-bar foot input" id="foot" :style="[{bottom:InputBottom+'px'}]" :class="{'showVoice':showVoice}">
			<view class="action" @click="changeStatus('showVoice')">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<div class="voiceSwitch" v-if="showVoice" @touchstart="voiceStart" @touchend="voiceEnd" @touchmove="voiceMove">{{voiceText}}</div>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus"
			 @blur="InputBlur" v-model="userMsg" v-else=""></input>
			<view class="action face">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="sendMsg" v-if="isIos">发送</button>
			<button class="cu-btn bg-green shadow" @touchend.stop="sendMsg" v-else="">发送</button>
		</view>

	</view>
</template>

<script>
	//如需启动，需在main.js 中打开 聊天测试中的注释代码
	import {
		mapMutations,
		mapState
	} from 'vuex';

	// #ifdef APP-PLUS
	let RM = uni.getRecorderManager();
	// #endif

	let scrennH = 0;
	let androidH = 0;
	let androidOff = 0;
	let moveDis = 0;
	let moveY = 150;
	export default {
		data() {
			return {
				isIos: true, //ios 使用点击事件
				voiceText: '按住 说话', //录音按钮文字
				moveCancelText: '手指上滑，取消发送', //动画提示文字
				showVoice: false, //显示录音按钮
				showSound: false, //显示录音动画
				moveCancel: false, //手势移动到取消录音
				scrollTop: 0,
				InputBottom: 0,
				selfName: '',
				userMsg: '',
				propHide: true,
				chartPage: [],
			};
		},
		computed: {
			...mapState(['SocketState'])
		},
		onLoad() {
			// #ifdef APP-PLUS
			if (plus.device.vendor !== 'Apple') {
				this.isIos = false;
			}
			RM.onStop(({
				tempFilePath
			} = {}) => {
				let isCancel = this.moveCancel;
				this.moveCancel = false;
				this.showSound = false;
				this.moveCancelText = '手指上滑，取消发送';
				this.voiceText = '按住 说话';
				if (!isCancel) {
					this.sendMsg({
						Msg: tempFilePath,
						type: 0
					})
				}
			})
			// #endif
			setTimeout(() => {
				let crSelect = uni.createSelectorQuery();
				crSelect.select('.scroll-y').boundingClientRect(res => {
					scrennH = res.height;
				}).exec()
			}, 300)
			uni.setNavigationBarTitle({
				title: `聊天室`
			});
			uni.onWindowResize((res) => {
				androidH = res.size.windowHeight;
				if (scrennH < androidH) {
					androidOff = androidH - scrennH;
				}
				this.isScrollBottom();
			})
		},
		watch: {
			'SocketState.chartPage': function(val) {
				this.chartPage = val;
				this.isScrollBottom();
			}
		},
		methods: {
			sendMsg({
				Msg = this.userMsg,
				type = 1
			} = {}) {
				if (Msg == '') {
					return false;
				}
				let msg = {
					type: 'self',
					selfName: this.selfName,
					text: Msg,
					time: new Date().toLocaleTimeString()
				};
				this.$Socket.nsend(JSON.stringify(msg));
				if (type = 1) {
					this.userMsg = '';
				}
			},
			isScrollBottom() {
				setTimeout(() => {
					uni.createSelectorQuery().select('.chatBox').boundingClientRect(res => {
						if (this.isIos) {
							if (scrennH < res.height) {
								this.scrollTop = res.height - scrennH
							}
						} else {
							if (androidH < res.height) {
								this.scrollTop = res.height - androidH + androidOff
							}
						}
					}).exec()
				}, 100)
			},
			suerName() {
				if (this.selfName !== '') {
					this.propHide = false
				}
			},
			changeStatus(key) {
				this[key] = !this[key];
			},
			//录音开始
			voiceStart(e) {
				moveDis = e.mp.changedTouches[0].pageY;
				this.showSound = true;
				this.voiceText = "松开 结束";
				RM.start({
					duration: 600000,
					format: "mp3"
				})
			},
			//录音过程中手势移动
			voiceMove(e) {
				let pageY = e.mp.changedTouches[0].pageY;
				if (pageY < moveDis) { //向上滚动
					if (moveDis - pageY > moveY) { //滚动到指定位置，显示取消录音
						this.moveCancel = true;
						this.moveCancelText = '松开手指，取消发送';
						this.voiceText = '松开手指，取消发送';
					} else {
						this.moveCancel = false;
						this.moveCancelText = '手指上滑，取消发送';
						this.voiceText = '松开 结束'
					}
				} else { //向下滚动		

				}
			},
			//录音结束
			voiceEnd() {
				RM.stop();
			},
			InputFocus(e) {
				// #ifndef APP-PLUS
				this.InputBottom = e.detail.height;
				// #endif
			},
			InputBlur(e) {
				this.InputBottom = 0;
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/colorui/icon.css";
	@import "../../common/colorui/main.css";

	page {
		padding-bottom: 100upx;
	}

	.chatBox {
		.content {
			word-wrap: break-word;
			white-space: normal;
			word-break: break-all;
		}
	}

	.voiceSwitch {
		font-size: 28upx;
		flex: 1;
		text-align: center;
		display: inline-block;
		height: 65upx;
		line-height: 65upx;
		background-color: #e4e3e3;
		border-radius: 8upx;
		margin: 0 22upx;

		&:active {
			background-color: #ccc;
		}
	}

	.showVoice {
		.action {
			&.face {
				margin-right: 20upx;
				margin-left: 0px;
			}
		}
	}

	.scroll-y {
		/* #ifdef H5 */
		height: calc(100vh - 55px - 100upx);
		/* #endif */
		/* #ifndef H5 */
		height: calc(100vh - 100upx);
		/* #endif */
	}

	.prop {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
		background-color: rgba(0, 0, 0, 0.2);

		.box {
			width: 80%;
			height: 300upx;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -40%;
			margin-top: -150upx;
			background-color: #fff;

			.userIput {
				margin: 60upx 0;
				text-align: center;
			}
		}
	}

	.cancel {
		background-color: darkred;
	}

	.rprogress {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 140px;
		height: 140px;
		margin-left: -70px;
		margin-top: -70px;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 5px;
		-webkit-transition: .15s;
		box-sizing: border-box;
		z-index: 9999;
	}

	.rschedule {
		background-color: rgba(0, 0, 0, 0);
		border: 5px solid rgba(0, 183, 229, 0.9);
		opacity: .9;
		border-left: 5px solid rgba(0, 0, 0, 0);
		border-right: 5px solid rgba(0, 0, 0, 0);
		border-radius: 50px;
		box-shadow: 0 0 15px #2187e7;
		width: 46px;
		height: 46px;
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -23px;
		margin-top: -30px;
		-webkit-animation: spin 1s infinite linear;
		animation: spin 1s infinite linear;
	}

	.r-sigh {
		display: none;
		border-radius: 50px;
		box-shadow: 0 0 15px #2187e7;
		width: 46px;
		height: 46px;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -23px;
		margin-top: -23px;
		text-align: center;
		line-height: 46px;
		font-size: 40px;
		font-weight: bold;
		color: #2187e7;
		box-sizing: border-box;
	}

	.rsalert {
		font-size: 12px;
		color: #bbb;
		text-align: center;
		position: absolute;
		border-radius: 5px;
		width: 130px;
		margin: 5px 5px;
		padding: 5px;
		left: 0px;
		bottom: 0px;
		box-sizing: border-box;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
