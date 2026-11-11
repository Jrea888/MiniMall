// components/GoodItem/good-item.js
Component({
  properties: {
    goods: {
      type: Object,
      value: {}
    }
  },
  methods: {
    itemClick() {
      const goods = this.data.goods || {}
      // 首页/分类的商品用 iid，分类详情里也可能是 shop_id
      const iid = goods.iid || goods.shop_id
      // 拿不到 id 就不跳转（例如接口字段缺失），避免跳到 /detail?iid=undefined
      if (!iid) {
        return
      }
      wx.navigateTo({
        url: '/pages/detail/detail?iid=' + iid,
      })
    }
  }
})
