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
  onReady() {
    // 兜底量一次：图片全部加载完后再校正一次吸附阈值
    setTimeout(() => this.imageLoadHandle(), 500)
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
    const scrollTop = e.detail.scrollTop
    // 记录当前位置，返回顶部时要用；用普通属性存，避免每次滚动都 setData
    this._scrollTop = scrollTop

    // 返回顶部：滚动超过阈值才显示按钮
    const showBackTop = scrollTop > TOP_DISTANCE

    // 兜底：万一阈值还没量到（图片迟迟没触发 load），第一次滚动时补测一次
    if (!this.data.tabControlTop && scrollTop > 0) {
      this.imageLoadHandle()
    }

    // Tab 吸顶：阈值在图片加载完时已经量好，这里只做算术比较。
    // 原来这里每帧都 createSelectorQuery().boundingClientRect().exec()，等于每帧一次跨线程查询。
    const showTabControl = this.data.tabControlTop > 0 && scrollTop >= this.data.tabControlTop

    // 值没变就不 setData，减少渲染层通信
    if (showBackTop !== this.data.showBackTop || showTabControl !== this.data.showTabControl) {
      this.setData({
        showBackTop,
        showTabControl
      })
    }
  },
  // scroll-view 滚动到底部
  scorllBottomHandle() {
    this._getTabSwitchData(this.data.currentType)
  },
  // 图片加载完 再获取一次 tab-control 距离顶部的距离（作为吸顶阈值）
  imageLoadHandle() {
    // 获取一个组件距离顶部的距离 忽略exec()调用，会导致不生效
    wx.createSelectorQuery().select('.tab-control').boundingClientRect((rect) => {
      if (rect) {
        // 加上当前滚动距离，得到"相对滚动内容顶部"的绝对偏移，
        // 这样即使在滚动过程中测量也是准的
        const top = rect.top + (this._scrollTop || 0)
        if (top > 0 && Math.abs(top - this.data.tabControlTop) > 1) {
          this.setData({
            tabControlTop: top
          })
        }
      }
    }).exec()
  },
  // 返回顶部
  backTopHandle() {
    // scroll-view 的 scroll-top 只有在"值发生变化"时才会滚动。
    // 之前 topPosition 一直是 0，setData 同一个值等于什么都没做，所以点了没反应。
    // 做法：先把 topPosition 抬到当前滚动位置，再在下一帧归零，制造一次真实变化。
    const current = this._scrollTop || 1
    this.setData({
      topPosition: current
    })

    wx.nextTick(() => {
      this.setData({
        topPosition: 0,
        showBackTop: false,
        showTabControl: false
      })
    })
  }
})
