class Draw {
	constructor({
		allListKeys = [],
		repeatTo = false,
		navigateTo = ({
			pagePath
		} = {}) => {
			uni.switchTab({
				url: pagePath
			});
		},
		bottom = '0px',
		dock = 'bottom',
		height = '56px',
		left = '0px',
		opacity = 1,
		position = 'dock',
		width = '100%',
		borderStyle = '#eaeaea',
		backgroundColor = '#FFFFFF',
		borderWidth = '0px',
		color = '#8F8F94',
		selectedColor = '#F74F4F',
		Bitmap = {
			top: '5px',
			size: '24px',
		},
		font = {
			align: 'center',
			overflow: 'ellipsis',
			size: '12px',
			verticalAlign: 'top',
		},
		list = []
	} = {}) {
		this.config = {
			allListKeys,
			navigateTo,
			bottom,
			dock,
			height,
			left,
			opacity,
			position,
			width,
			borderStyle,
			backgroundColor,
			borderWidth,
			color,
			selectedColor,
			Bitmap,
			font,
			list,
			device: plus.device.vendor
		}
		this.config.position = this.config.device === 'Apple' ? 'dock' : 'absolute'; //兼容安卓手机

		Object.defineProperty(this.config, 'currentIndex', {
			set: (val) => {
				this.config._currentIndex = val;
				if (this.config._oldCurrentIndex != val) {
					//this.draw(true);
				}
				this.config._oldCurrentIndex = val;
			},
			get: () => {
				return this.config._currentIndex;
			}
		})

		this._uid = 0; //创建画板索引唯一标识
		this.injectList = []; //所有list绘制完成得页面数据

		this.ScreenHeight = plus.screen.resolutionHeight; //获取屏幕高度
		this.ScreenWidth = plus.screen.resolutionWidth; //获取屏幕宽度
		this.allLength = this.config.list.length; //先获取需要渲染多少个菜单
		this.d_width = this.ScreenWidth / this.allLength; //获取单个菜单需要占用多宽
		this.currentView = null; //当前绘制的对象画板

		this.config.currentIndex = 0; //当前面索引

		this.drawAllTabBar(); //绘制所有底部菜单，并缓存数据
	}
	/**
	 * 创建画板,并返回一个自定义位置的画板
	 */
	createView(index) {
		let view = new plus.nativeObj.View(`HHYANGVIEW${index}`, {
			bottom: this.config.bottom,
			left: this.config.left,
			opacity: this.config.opacity,
			dock: this.config.dock,
			height: this.config.height,
			position: this.config.position,
			width: this.config.width,
		});
		view.drawRect(this.config.backgroundColor);

		view.drawRect(this.config.borderStyle, {
			top: '0px',
			height: '1px'
		});

		this.currentView = view;
		this._uid++;
		return view;
	}
	/**
	 * 绘制指定tabbar
	 */
	draw(currentKey = this.config.list[0].key,index) {
		let view = this.createView(index);
		for (let i = 0; i < this.allLength; i++) {
			this.updateSingleView(view, i, currentKey, this.d_width,index);
		}
		this.addEvents(view, this.d_width);

		return view
	}
	/**
	 * 绘制所有的底部菜单
	 */
	drawAllTabBar() {
		let list = {};
		for (let i = 0; i < this.config.allListKeys.length; i++) {
			let key = this.config.allListKeys[i];
			list[key] = {
				index: i,
				val: this.draw(key,i)
			};
		}
		this.injectList = list;
		return this.injectList;
	}
	/**
	 * 渲染指定页面的bar
	 */
	renderTabBar(page, key) {
		uni.hideTabBar();
		
		let injectList = this.injectList[key];
		if (!injectList) {
			return false;
		}
		let currentView = plus.nativeObj.View.getViewById(`HHYANGVIEW${injectList.index}`);
		if (currentView == null) {
			this.drawAllTabBar();
			injectList = this.injectList[key];
		}
		page.append(injectList.val);
		if (this.config.device !== 'Apple') { //安卓手机需要兼容一下
			page.setStyle({
				position: 'dock',
				bottom: this.config.height
			})
		}
	}
	/**
	 * 隐藏底部
	 */
	hideTabBar() {

	}
	/**
	 * 显示底部菜单
	 */
	showTabBar() {

	}
	/**
	 * 销毁底部菜单
	 */
	destroyTabBar() {

	}
	/**
	 * 重置绘制的内容
	 */
	resetTabBarView() {

	}
	/**
	 * @param {Object} view
	 * @param {Object} i
	 * @param {Object} currentKey
	 * @param {Object} d_width 
	 * 修改单个按钮样式
	 */
	updateSingleView(view, i, currentKey, d_width,index) {
		const config = this.config;
		let item = config.list[i];
		if (!item) {
			return false;
		}
		let left = d_width / 2 - parseInt(config.Bitmap.size) / 2;
		let text_top = parseInt(config.height) / 2 + parseInt(config.font.size) / 2 + 'px';
		view.drawText(item.text, {
			width: d_width,
			left: i * d_width,
			height: config.height,
			top: plus.device.vendor === 'Apple' ? text_top : '12px',
		}, {
			align: config.font.align,
			color: item.key == currentKey ? config.selectedColor : config.color,
			overflow: config.font.overflow,
			size: config.font.size,
			verticalAlign: config.font.verticalAlign
		});
		let iconPath = item.key == currentKey ? `_www/${item.selectedIconPath}` : `_www/${item.iconPath}`;
		view.drawBitmap(iconPath, {}, {
			top: config.Bitmap.top,
			left: i * d_width + left,
			width: config.Bitmap.size,
			height: config.Bitmap.size
		});

	}
	/**
	 * @param {Object} style
	 * @param {Object} page
	 * 合并原生的样式
	 */
	mergeOptions(style, page) {
		if (this.config.device !== 'Apple') { //安卓手机
			let p_options = page.getStyle();
			return Object.assign({}, p_options, style, {
				position: 'dock',
				bottom: this.config.height
			});
		}
		return style;
	}
	/**
	 * 重新原生的setStyle 因为在安卓会出你意想不到的问题，贼难受
	 */
	setStyle(style, page) {
		let options = this.mergeOptions(style, page);
		page.setStyle(options);
	}
	/**
	 * 绑定事件
	 */
	addEvents(view, d_width) {
		view.addEventListener("touchend", (e) => {
			let {
				clientX
			} = e;
			const config = this.config;
			let index = Math.ceil(clientX / d_width) - 1;
			const currList=config.list[index];
				
			// if (!config.repeatTo && config.currentIndex==index) {
			// 	return false;
			// }
			// 
			// config.currentIndex = index;
			this.config.navigateTo.call(this, currList,config.list,config.allListKeys);
		}, false);
	}

}
export default Draw;
