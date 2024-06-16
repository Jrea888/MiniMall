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
      this.clickLinkHandle(link)
    },
    clickLinkHandle(link) {
      wx.navigateTo({
        url: '../webview/webview?link=' + link,
      })
    },
    // 图片加载完成
    imageLoadedHandle() {
      this.triggerEvent('imageLoad', {}, {})
    }
  }
})