Component({
  properties: {
    recommends: {
      type: Array,
      value: []
    }
  },
  methods: {
    weekItemLinkHandle(e) {
      const {
        link,
      } = e.currentTarget.dataset.item
      if (link) {
        this.clickLinkHandle(link)
      }
    },
    clickLinkHandle(link) {
      // 绝对路径 + 编码（原因同 swiper-image.js）
      wx.navigateTo({
        url: '/pages/webview/webview?link=' + encodeURIComponent(link),
      })
    },
    // 图片加载完成
    imageLoadedHandle() {
      this.triggerEvent('imageLoad', {}, {})
    }
  }
})
