Component({
  properties: {},
  data: {},
  methods: {
    onAddCart() {
      this.triggerEvent('addcart', {}, {})
    }
  }
})