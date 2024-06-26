## `MinMall`

### 项目展示
<img src="https://s21.ax1x.com/2024/06/16/pkwHCXq.png" width="400px"/>   <img src="https://s21.ax1x.com/2024/06/16/pkwHin0.png" width="400px"/>   <img src="https://s21.ax1x.com/2024/06/16/pkwHEAU.png" width="400px"/>   <img src="https://s21.ax1x.com/2024/06/16/pkwHZh4.png" width="400px"/>   <img src="https://s21.ax1x.com/2024/06/16/pkwHucR.png" width="400px"/>   <img src="https://s21.ax1x.com/2024/06/16/pkwHp1s.png" width="400px"/>   <img src="https://s21.ax1x.com/2024/06/16/pkwHQnx.png" width="400px"/>

### 1. 项目模块

#### 1.1 首页

```js
// 首页主要包含顶部轮播图数据、热点特例数据、tab切换数据
// tab切换数据的获取，通过先定义分类的数据结构，属性中的键用常量表示
goods:{
    [POP]:{page: 1, list: []},
    [NEW]:{page: 1, list: []},
    [SELL]:{page: 1, list: []}
}
let list = res.data.list;

// 取出之前的数据
let goods = this.data.goods;
goods[type].page += 1;
goods[type].list.push(...list)

// 最新的page重新赋值给goods，下次进来直接获取第二页数，以此类推三、四
this.setData({
    goods:goods
})

// 返回顶部，使用scroll-view组件，完成相关高度和滚动距离
```

#### 1.2 商品分类

```js
// 请求分类列表、子分类列表数据和详情数据，设置初始化值：
const categoryData = {}
for (let index = 0; index < categories.length; index++) {
    categoryData[index] = {
        subcategories: [],
        categoryDetail: []
    }
}
```

#### 1.3 购物车

```js
// 全局维护 cartList 列表数据 和 cart组件中的 cartList 列表数据

// 添加购物车回调函数
if (this.cartCallBack) {
    this.cartCallBack()
}
```

#### 1.4 我的信息

### 2. 项目中使用技术点

```js
// 1. 在项目页面之间的跳转
wx.navigateTo({
    url: '/pages/detail/detail?iid=' + iid,
})

// 2. 在另一个页面接受参数，在onLoad监听页面加载时，获取并设置属性值
this.setData({
    iid: options.iid
})


```

#### 2.2 商品详情页面参数的收集

```js
// 使用类的方式收集请求结果中不同的参数
export class GoodsBaseInfo {
  constructor(itemInfo,columns,services){
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc;
    this.realPrice = itemInfo.lowNowPrice;
    this.columns = columns;
    this.services = services
  }
}

export class ShopInfo {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}

export class ParamInfo {
  constructor(info, rule) {
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}
```

#### 2.3 路径书写规则

```js
组价引用路径：相对路径
app.json文件中tabBar的pagePath属性不能以./开头
```

#### 2.4 给父组件发送事件

```js
// 子组件向父组件发送事件
this.triggerEvent('addcart', {参数1，...}, {})

// 父组件监听子组件事件
bind:addcart="onAddCart"
```

#### 2.5 时间格式化

```js
var dateFormate = function(timestamp,format){
  if(!format){
      format = "yyyy-MM-dd hh:mm:ss";
  }
  timestamp = parseInt(timestamp*1000);
  var realDate = getDate(timestamp);
  function timeFormat(num){
      return num < 10 ? '0'+num:num;
  }
  var date = [
      ["M+",timeFormat(realDate.getMonth() + 1)],
      ["d+",timeFormat(realDate.getDate())],
      ["h+",timeFormat(realDate.getHours())],
      ["m+",timeFormat(realDate.getMinutes())],
      ["s+",timeFormat(realDate.getSeconds())],
      ["q+",Math.floor(realDate.getMonth() + 3) / 3],
      ["S+",realDate.getMilliseconds()],
  ];
  var regYear = getRegExp("(y+)","i");
  var reg1 = regYear.exec(format);
  if(reg1){
      format = format.replace(reg1[1],(realDate.getFullYear() + '').substring(4-reg1[1].length));
  }
  for(var i = 0; i < date.length; i++){
      var k = date[i][0];
      var v = date[i][1];
      
      var reg2 = getRegExp("("+k+")").exec(format);
      if(reg2){
          format = format.replace(reg2[1],reg2[1].length == 1 ? v : ("00" + v).substring(("" + v).length));
      }
  }
  return format;
}
```









