Page({
  data: {
    url: ''
  },
  onLoad(options) {
    // 跳转时对链接做了 encodeURIComponent，这里对应解码
    const link = options.link ? decodeURIComponent(options.link) : ''
    this.setData({
      url: link
    })
  },
})
