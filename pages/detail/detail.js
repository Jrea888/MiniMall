import {
  GoodsBaseInfo,
  ShopInfo,
  ParamInfo,
} from '../../services/detail.js'
import {
  detailService
} from '../../services/index.js'
import {
  TOP_DISTANCE
} from '../../common/const'

const app = getApp();

Page({
  data: {
    iid: '',
    topBannerImages: [],
    baseInfo: {},
    shopInfo: {},
    detailInfo: {},
    paramInfo: {},
    commentInfo: {},
    recommends: [],
    topPosition: 0,
    ScreenTotalW: 0,
    ScreenTotalH: 0,
    showBackTop: false
  },
  onLoad: function (options) {
    this.setData({
      iid: options.iid,
      ScreenTotalW: app.globalData.ScreenTotalW,
      ScreenTotalH: app.globalData.ScreenTotalH
    })

    // 获取商品详情数据
    this._getGoodsDetialData();
    // 获取推荐数据
    this._getRecommends();
  },
  _getGoodsDetialData() {
    // 获取详情轮播图数据
    detailService.getDetailBanner(this.data.iid).then(res => {
      const data = res.result;
      // 1.轮播图数据
      const topBannerImages = data.itemInfo.topImages.map(v => ({
        image: v
      }))
      // 2.通过对象收集商品基本信息
      const baseInfo = new GoodsBaseInfo(data.itemInfo, data.columns, data.shopInfo.services)
      // 3.收集商品信息
      const shopInfo = new ShopInfo(data.shopInfo)
      // 4.收集商品详情信息
      const detailInfo = data.detailInfo
      // 5.收集商品参数信息
      const paramInfo = new ParamInfo(data.itemParams.info, data.itemParams.rule)
      // 6.获取评论信息
      let commentInfo = {}
      if (data.rate && data.rate.cRate > 0) {
        commentInfo = data.rate.list[0]
      }

      this.setData({
        topBannerImages: topBannerImages,
        baseInfo: baseInfo,
        shopInfo: shopInfo,
        detailInfo: detailInfo,
        paramInfo: paramInfo,
        commentInfo: commentInfo
      })
    })
  },
  _getRecommends() {
    detailService.getRecommends().then(res => {
      this.setData({
        recommends: res.data.list
      });
    })
  },
  onAddCart() {
    // 1.获取商品对象
    const obj = {}
    obj.iid = this.data.iid;
    obj.imageUrl = this.data.topBannerImages[0].image;
    obj.title = this.data.baseInfo.title;
    obj.desc = this.data.baseInfo.desc;
    obj.price = this.data.baseInfo.realPrice;
    // 2.加入到购物车
    app.addToCart(obj)
    // 3.提示加入成功
    wx.showToast({
      title: '加入购入车成功'
    })
  },
  // 滚动触发 获取滚动离顶部的间距
  scrollPosition(e) {
    this.setData({
      showBackTop: e.detail.scrollTop > TOP_DISTANCE
    })
  },
  // 返回顶部
  backTopHandle() {
    this.setData({
      topPosition: 0,
      showBackTop: false
    })
  }
})