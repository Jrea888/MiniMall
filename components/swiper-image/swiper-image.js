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
      wx.navigateTo({
        url: '../webview/webview?link=' + link,
      })
    }
  }
})