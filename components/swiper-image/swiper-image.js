Component({
  properties: {
    banners: {
      type: Array,
      value: []
    },
    height: {
      type: Number,
      value: 450
    }
  },
  methods: {
    swiperItemHandle(e) {
      const {
        link,
      } = e.currentTarget.dataset.item
      if (link) {
        this.clickLinkHandle(link)
      }
    },
    clickLinkHandle(link) {
      // 用绝对路径 + encodeURIComponent：
      // 原来写 '../webview/webview'，是按"当前页面"解析的相对路径，
      // 现在两个宿主页恰好在 pages/xxx/ 一层所以能跑，一旦被三级页面复用就会跳错；
      // 链接里带 ? & 时也必须编码，否则会被 query 解析截断。
      wx.navigateTo({
        url: '/pages/webview/webview?link=' + encodeURIComponent(link),
      })
    }
  }
})
