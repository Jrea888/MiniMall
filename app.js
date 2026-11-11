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

// 购物车本地缓存 key
const CART_STORAGE_KEY = 'cartGoods'

App({
  // 全局变量
  globalData: {
    cartList: [], // 购物车列表
    screenInfo: SCREEN_INFO,
    ScreenTotalW: SCREEN_WIDTH,
    ScreenTotalH: SCREEN_HEIGHT,
  },

  // 购物车变化订阅者列表。
  // 原来这里只有一个 app.cartCallBack 槽位，谁后赋值谁生效，
  // 多个页面同时关心购物车时会互相覆盖；改成数组支持多订阅。
  cartListeners: [],

  onLaunch() {
    // 恢复上次的购物车。
    // 之前 cartList 只存在内存里，小程序被杀死/重进就清空了。
    try {
      const cache = wx.getStorageSync(CART_STORAGE_KEY)
      if (Array.isArray(cache)) {
        this.globalData.cartList = cache
      }
    } catch (e) {
      // 读缓存失败时按空车处理，不影响启动
    }
  },

  // 订阅购物车变化
  onCartChange(listener) {
    if (typeof listener === 'function') {
      this.cartListeners.push(listener)
    }
  },

  // 取消订阅
  offCartChange(listener) {
    this.cartListeners = this.cartListeners.filter(fn => fn !== listener)
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
  // 购物车商品计算回调：落盘 + 通知所有订阅者
  _cartShopCalculateCallBack() {
    try {
      wx.setStorageSync(CART_STORAGE_KEY, this.globalData.cartList)
    } catch (e) {
      // 写缓存失败（如超出配额）不影响主流程
    }

    this.cartListeners.forEach(listener => {
      try {
        listener()
      } catch (e) {
        // 单个订阅者出错不影响其他订阅者
      }
    })
  }
})
