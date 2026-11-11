Page({
  data: {
    orderList: [{
        icon: 'message.png',
        info: '我的消息'
      },
      {
        icon: 'pointer.png',
        info: '积分商城'
      },
      {
        icon: 'vip.png',
        info: '会员卡'
      }
    ],
    serviceList: [{
        icon: 'cart.png',
        info: '我的购物车'
      },
      {
        icon: 'app.png',
        info: '下载购物APP'
      }
    ]
  }
  // 说明：原来这里有 8 个空的生命周期钩子（onLoad/onReady/onShow/onHide/onUnload/
  // onPullDownRefresh/onReachBottom/onShareAppMessage），本页是纯静态展示页，
  // 没有任何逻辑，只保留数据即可。
})
