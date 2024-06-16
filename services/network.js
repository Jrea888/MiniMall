import {
  BaseURL,
  timeout
} from './config.js'

export function request(option) {
  wx.showLoading({
    title: '加载中...',
  })

  return new Promise((resolve, reject) => {
    wx.request({
      url: BaseURL + option.url,
      timeout: timeout,
      data: option.data,
      success: function (res) {
        resolve(res.data)
      },
      fail: reject,
      complete: res => {
        wx.hideLoading()
      }
    })
  })
}