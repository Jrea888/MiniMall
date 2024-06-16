const app = getApp();

Page({
  data: {
    cartList: [],
    totalPrice: '0.00',
    totalCounter: 0,
    isAllSelect: true,
    ScreenTotalH: app.globalData.ScreenTotalH,
    shopTotalLength: 0
  },
  /* 监听页面显示 */
  onShow() {
    wx.setNavigationBarTitle({
      title: `购物车(${this.data.cartList.length})`,
    })
    this.calculateShopData()
  },
  /* 监听页面加载 */ 
  onLoad: function (options) {
    // 1.初始化数据
    this.setData({
      cartList: app.globalData.cartList,
      shopTotalLength: app.globalData.cartList.length
    })

    // 2.设置回调，目的：把全局购物车数据给 购物车页面进行同步
    app.cartCallBack = () => {
      this._setGlobalCartListData()
      // 计算商品数据
      this.calculateShopData()
    }
  },
  // 计算购物车中的商品 总数量和总价格
  calculateShopData() {
    // 获取选中的数据
    let totalPrice = 0;
    let counter = 0;
    for (let item of this.data.cartList) {
      if (item.checked) {
        counter++
        totalPrice += item.price * item.counter
      }
    }

    const allPrice = totalPrice.toFixed(2)
    // 修改 商品数量和商品总价
    this.setData({
      totalPrice: allPrice,
      totalCounter: counter
    })
  },
  // 单个商品是否选择
  radioChangeHandle(e) {
    const index = e.currentTarget.dataset.index
    const goods = app.globalData.cartList.find(item => item.iid === this.data.cartList[index].iid)

    app.singleCartShopIsSelect(goods.iid)
    this._setGlobalCartListData()
    this.setData({
      isAllSelect: this.data.cartList.every(v => v.checked)
    })
  },
  // 全部选择
  selectAllShopHandle() {
    this.setData({
      isAllSelect: !this.data.isAllSelect
    })
    app.isSelectAllChangeHandle(this.data.isAllSelect)
    this._setGlobalCartListData()
  },
  // 购物车商品数加1
  cartShopAddHandle(e) {
    const index = e.currentTarget.dataset.index
    const goods = app.globalData.cartList.find(item => item.iid === this.data.cartList[index].iid)
    if (goods) {
      app.addToCart(goods)
      this.calculateShopData()
    }
  },
  // 购物车商品数减1
  cartShopSubHandle(e) {
    const index = e.currentTarget.dataset.index
    const {iid, counter} = this.data.cartList[index]
    if (counter <= 1) {
      wx.showToast({
        icon: 'none',
        duration: 2000,
        title: '至少选择一个商品！',
      })
      return
    }
    const goods = app.globalData.cartList.find(item => item.iid === iid)
    if (goods) {
      app.moveCartShop(goods.iid)
      this.calculateShopData()
    }
  },
  _setGlobalCartListData() {
    this.setData({
      cartList: app.globalData.cartList
    })
  }
})