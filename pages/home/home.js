import {
  homeService
} from '../../services/index.js'
import {
  POP,
  NEW,
  SELL,
  TOP_DISTANCE
} from '../../common/const'

const app = getApp()

Page({
  data: {
    bannersImage: [],
    recommends: [],
    titles: ["流行", "新款", "精选"],
    topPosition: 0,
    tabControlTop: 0,
    currentType: 'pop',
    showBackTop: false,
    showTabControl: false,
    goods: {
      [POP]: {
        page: 1,
        list: []
      },
      [NEW]: {
        page: 1,
        list: []
      },
      [SELL]: {
        page: 1,
        list: []
      }
    },
    ScreenTotalW: 0,
    ScreenTotalH: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ScreenTotalW: app.globalData.ScreenTotalW,
      ScreenTotalH: app.globalData.ScreenTotalH
    })
    this._getData()
  },
  _getData() {
    // 轮播图数据
    this._getBannerList();
    // Tab切换数据 流行 新款 精选
    this._getTabSwitchData(POP);
    this._getTabSwitchData(NEW);
    this._getTabSwitchData(SELL);
  },
  _getBannerList() {
    homeService.getBannerData().then(res => {
      this.setData({
        bannersImage: res.data.banner.list,
        recommends: res.data.recommend.list
      })
    })
  },
  _getTabSwitchData(type) {
    let params = {
      type: type,
      page: this.data.goods[type].page // 取出对应类型的页码
    }
    homeService.getGoodsList(params).then(res => {
      let list = res.data.list;
      // 取出之前的数据
      let goods = this.data.goods;
      goods[type].list.push(...list)
      goods[type].page += 1;

      // 最新的page重新赋值给goods，下次进来直接获取第二页数，以此类推三、四
      this.setData({
        goods: goods
      })
    })
  },
  tabClickHandle(e) {
    let currentType = ''
    if (e.detail.index === 0) {
      currentType = POP;
    } else if (e.detail.index === 1) {
      currentType = NEW;
    } else if (e.detail.index === 2) {
      currentType = SELL;
    }
    this.setData({
      currentType: currentType
    })

    // 同步active状态
    if (e.detail.type === 'fixed') {
      this.selectComponent('.tab-control').setCurrentIndex(e.detail.index)
      return
    }
    this.selectComponent('.tab-control-temp').setCurrentIndex(e.detail.index)
  },
  // scroll-view 滚动时触发
  scrollPosition(e) {
    // 返回顶部判断
    this.setData({
      // 当滚动大于 预期常亮时(1000)，显示返回顶部按钮
      showBackTop: e.detail.scrollTop > TOP_DISTANCE
    })

    // Tab切换栏 吸附
    wx.createSelectorQuery().select('.tab-control').boundingClientRect((rect) => {
      this.setData({
        showTabControl: !(rect.top > 0)
      })
    }).exec()
  },
  // scroll-view 滚动到底部
  scorllBottomHandle() {
    this._getTabSwitchData(this.data.currentType)
  },
  // 图片加载完 再获取距离顶部的 距离
  imageLoadHandle() {
    // 获取一个组件距离顶部的距离 忽略exec()调用，会导致不生效
    wx.createSelectorQuery().select('.tab-control').boundingClientRect((rect) => {
      this.setData({
        tabControlTop: rect.top
      })
    }).exec()
  },
  // 返回顶部
  backTopHandle() {
    this.setData({
      topPosition: 0,
      tabControlTop: 0,
      showBackTop: false,
    })
    // 页面返回顶部
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },
  // 页面滚动到底部
  onReachBottom() {
    // this._getTabSwitchData(this.data.currentType)
  },
  // 监听页面滚动  官方文档不推荐频繁调用 this.setData，采用scroll-view内置组件
  onPageScroll(options) {
    // const scrollTop = options.scrollTop

    // // 返回顶部判断
    // const isBack = scrollTop >= TOP_DISTANCE
    // if (isBack !== this.data.showBackTop) {
    //   this.setData({
    //     showBackTop: isBack
    //   })
    // }

    // // tab切换吸附效果
    // const isFixed = this.data.tabControlTop <= scrollTop
    // if (isFixed !== this.data.showTabControl) {
    //   this.setData({
    //     showTabControl: isFixed
    //   })
    // }
  }
})