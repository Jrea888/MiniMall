Component({
  properties: {
    categories: {
      type: Array,
      value: []
    },
    ScreenHeight: {
      type: Number,
      value: 0
    }
  },
  data: {
    currentIndex: 0
  },
  methods: {
    
  itemClickHandle(e) {
    const currentIndex = e.currentTarget.dataset.index
    this.setData({
      currentIndex
    })

    this.triggerEvent('menuClick', {currentIndex})
  },
  }
})