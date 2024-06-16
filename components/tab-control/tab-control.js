Component({
  properties: {
    titles: {
      type: Array,
      value: []
    },
    showType: {
      type: String,
      value: ''
    }
  },
  data: {
    currentIndex: 0
  },
  methods: {
    itemClickHandle(e) {
      this.setData({
        // 1.读取节点属性 data-set 中的值 
        // 2.当tab-control滚动到吸附顶部后，切换时更新active状态
        currentIndex: e.currentTarget.dataset.index
      })

      this.triggerEvent('tabclick', {
        index: this.data.currentIndex,
        type: this.properties.showType
      })
    },
    setCurrentIndex(index) {
      this.setData({
        currentIndex: index
      })
    }
  }
})