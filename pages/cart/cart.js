const app = getApp();

Page({
  data: {
    cartList: [],
    totalPrice: '0.00',
    totalCounter: 0,
    isAllSelect: false,
    ScreenTotalH: app.globalData.ScreenTotalH,
    shopTotalLength: 0
  },
  /* 监听页面加载 */
  onLoad: function (options) {
    // 订阅购物车变化。
    // 原来用的是 app.cartCallBack 单槽回调，现在 App 里换成了多订阅（onCartChange）。
    this._onCartChange = () => {
      this._setGlobalCartListData()
      this.calculateShopData()
      this._setTitle()
    }
    app.onCartChange(this._onCartChange)

    // 1.初始化数据
    this._setGlobalCartListData()
    this.calculateShopData()
    this._setTitle()
  },
  /* 监听页面显示 */
  onShow() {
    // 从全局同步一次，保证列表、总价、标题都是最新的
    this._setGlobalCartListData()
    this.calculateShopData()
    this._setTitle()
  },
  /* 监听页面卸载 */
  onUnload() {
    // 退订，避免页面销毁后还被回调
    app.offCartChange(this._onCartChange)
  },
  // 计算购物车中的商品 总数量和总价格
  calculateShopData() {
    const cartList = this.data.cartList
    // 获取选中的数据
    let totalPrice = 0;
    let counter = 0;
    for (let item of cartList) {
      if (item.checked) {
        counter++
        totalPrice += item.price * item.counter
      }
    }

    const allPrice = totalPrice.toFixed(2)
    // 修改 商品数量和商品总价；全选状态也在这里统一算，避免各处置位不同步
    this.setData({
      totalPrice: allPrice,
      totalCounter: counter,
      isAllSelect: cartList.length > 0 && cartList.every(v => v.checked)
    })
  },
  // 单个商品是否选择
  radioChangeHandle(e) {
    const index = e.currentTarget.dataset.index
    const goods = app.globalData.cartList.find(item => item.iid === this.data.cartList[index].iid)

    if (!goods) {
      return
    }
    // 改完会触发 _cartShopCalculateCallBack -> 订阅回调里已同步列表并重算
    app.singleCartShopIsSelect(goods.iid)
  },
  // 全部选择
  selectAllShopHandle() {
    const nextSelected = !this.data.isAllSelect
    app.isSelectAllChangeHandle(nextSelected)
  },
  // 购物车商品数加1
  cartShopAddHandle(e) {
    const index = e.currentTarget.dataset.index
    const goods = app.globalData.cartList.find(item => item.iid === this.data.cartList[index].iid)
    if (goods) {
      app.addToCart(goods)
    }
  },
  // 购物车商品数减1
  cartShopSubHandle(e) {
    const index = e.currentTarget.dataset.index
    const { iid, counter } = this.data.cartList[index]
    if (counter <= 1) {
      wx.showToast({
        icon: 'none',
        duration: 2000,
        title: '每件商品至少保留 1 件',
      })
      return
    }
    const goods = app.globalData.cartList.find(item => item.iid === iid)
    if (goods) {
      app.moveCartShop(goods.iid)
    }
  },
  // 把全局购物车数据同步到页面
  _setGlobalCartListData() {
    this.setData({
      cartList: app.globalData.cartList
    })
  },
  // 设置导航标题（放在数据同步之后，避免标题比列表慢一拍）
  _setTitle() {
    wx.setNavigationBarTitle({
      title: `购物车(${this.data.cartList.length})`,
    })
  }
})
