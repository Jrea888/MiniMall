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
      const iid = this.data.goods.iid ?? this.data.goods.shop_id
      // 跳转
      wx.navigateTo({
        url: '/pages/detail/detail?iid=' + iid,
      })
    }
  }
})