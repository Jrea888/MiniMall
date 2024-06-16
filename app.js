const systemInfo = wx.getSystemInfoSync()
// px转换到rpx的比例
const pxToRpxScale = 750 / systemInfo.windowWidth;
const STATUS_HEIGHT = systemInfo.statusBarHeight * pxToRpxScale
const NAVIGATION_HEIGHT = 44 * pxToRpxScale
const SCREEN_WIDTH = systemInfo.windowWidth * pxToRpxScale
const SCREEN_HEIGHT = systemInfo.windowHeight * pxToRpxScale
const SCREEN_TOTAL_HEIGHT = systemInfo.screenHeight * pxToRpxScale
const TAB_BAR_HEIGHT = SCREEN_TOTAL_HEIGHT - STATUS_HEIGHT - NAVIGATION_HEIGHT - SCREEN_HEIGHT

const SCREEN_INFO = {
  STATUS_HEIGHT, // 状态栏的高度
  TAB_BAR_HEIGHT, // 底部tabBar的高度
  SCREEN_HEIGHT, // window的高度
  SCREEN_WIDTH, // window的宽度
  NAVIGATION_HEIGHT, // 导航栏的高度
  SCREEN_TOTAL_HEIGHT // 屏幕的高度
}

App({
  // 全局变量
  globalData: {
    cartList: [], // 购物车列表
    TOP_DISTANCE: 1000,
    screenInfo: SCREEN_INFO,
    ScreenTotalW: SCREEN_WIDTH,
    ScreenTotalH: SCREEN_HEIGHT,
  },
  // 全局触发函数
  addToCart(shopItem) {
    const oldGoods = this.globalData.cartList.find(item => item.iid === shopItem.iid)
    // 对存在的商品数 +1 否则 =1
    if (oldGoods) {
      oldGoods.counter += 1;
    } else {
      shopItem.counter = 1
      shopItem.checked = true
      this.globalData.cartList.push(shopItem)
    }
    this._cartShopCalculateCallBack()
  },
  moveCartShop(iid) {
    this.globalData.cartList.forEach(item => {
      if (item.iid === iid) {
        item.counter -= 1
      }
    })
    this._cartShopCalculateCallBack()
  },
  // 是否选择所有商品
  isSelectAllChangeHandle(bool) {
    this.globalData.cartList.forEach(item => {
      item.checked = bool
    })
    this._cartShopCalculateCallBack()
  },
  // 
  singleCartShopIsSelect(iid) {
    this.globalData.cartList.forEach(item => {
      if (item.iid === iid) {
        item.checked = !item.checked
      }
    })
    this._cartShopCalculateCallBack()
  },
  // 购物车商品计算回调
  _cartShopCalculateCallBack() {
    if (this.cartCallBack) {
      this.cartCallBack()
    }
  }
})