import {categoryService} from '../../services/index.js'
const app = getApp()

Page({
  data: {
    categories: [],
    categoryData: {},
    currentIndex: 0,
    ScreenHeight: 0
  },

  onLoad: function (options) {
    this.setData({
      ScreenHeight: app.globalData.ScreenTotalH
    })

    this._getCategoryList()
  },
  // 获取分类
  _getCategoryList() {
    categoryService.getCategory().then(res => {
      const categories = res.data.category.list;
      // 初始化子数据
      const categoryData = {}
      for (let index = 0; index < categories.length; index++) {
        categoryData[index] = {
          subcategories: [],
          categoryDetail: []
        }
      }
      
      this.setData({
        categoryData,
        categories: res.data.category.list
      })

      // 请求第一个分类数据
      this._getSubcategory(0)
      this._getCategoryDetail(0)
    })
  },
  // 获取子数据
  _getSubcategory(currentIndex) {
    const id = this.data.categories[currentIndex].maitKey

    categoryService.getSubcategory(id).then(res => {
      const tempCategoryData = this.data.categoryData;
      tempCategoryData[currentIndex].subcategories = res.data.list;

      this.setData({
        categoryData: tempCategoryData
      })
    })
  },
  _getCategoryDetail(currentIndex) {
    const detailId = this.data.categories[currentIndex].miniWallkey
    this._getRealCategoryDetail(currentIndex, detailId, 'pop')
  },
  _getRealCategoryDetail(index, detailId, type) {
    categoryService.getCategoryDetail(detailId, type).then(res => {
      const categoryData = this.data.categoryData
      // 填充数据
      categoryData[index].categoryDetail = res
      this.setData({
        categoryData
      })
    })
  },
  // 左侧菜单栏点击事件
  menuClickHandle(e) {
    const currentIndex = e.detail.currentIndex
    this.setData({
      currentIndex
    })
    
    this._getSubcategory(currentIndex)
    this._getCategoryDetail(currentIndex)
  },
})