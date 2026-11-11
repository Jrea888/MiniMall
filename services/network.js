import {
  BaseURL,
  timeout
} from './config.js'

// 并发请求用引用计数管理 loading。
// 之前每个请求 complete 都 hideLoading：首页一次并发 4 个请求，
// 第一个回来就把遮罩关了，后面的请求还在飞但界面没有任何反馈。
let loadingCount = 0

function showLoading() {
  if (loadingCount === 0) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  loadingCount += 1
}

function hideLoading() {
  loadingCount = Math.max(loadingCount - 1, 0)
  if (loadingCount === 0) {
    wx.hideLoading()
  }
}

export function request(option) {
  showLoading()

  return new Promise((resolve, reject) => {
    wx.request({
      url: BaseURL + option.url,
      timeout: timeout,
      data: option.data,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (error) {
        // 之前失败是静默 reject，页面上看不出任何变化，这里补一个统一提示
        wx.showToast({
          title: '网络请求失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
        reject(error)
      },
      complete: function () {
        hideLoading()
      }
    })
  })
}
