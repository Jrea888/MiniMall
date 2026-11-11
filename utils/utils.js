// 纯 JS 版时间格式化。
// 原来这里用的是 WXS 专有的 getDate / getRegExp，放在 .js 文件里调用会直接报错；
// 而且当时全项目没有任何地方引用它，等于一段跑不起来的死代码。
function padZero(num) {
  return num < 10 ? '0' + num : '' + num
}

/**
 * 时间戳格式化
 * @param {number|string} timestamp 秒级或毫秒级时间戳
 * @param {string} format 形如 'yyyy-MM-dd hh:mm:ss'
 */
export function formatDate(timestamp, format = 'yyyy-MM-dd hh:mm:ss') {
  if (timestamp === null || timestamp === undefined || timestamp === '') {
    return ''
  }

  const raw = String(timestamp)
  // 10 位当作秒级（接口返回的是秒），13 位当作毫秒级
  const time = raw.length <= 10 ? Number(timestamp) * 1000 : Number(timestamp)
  const date = new Date(time)

  if (isNaN(date.getTime())) {
    return ''
  }

  const map = {
    yyyy: date.getFullYear(),
    MM: padZero(date.getMonth() + 1),
    dd: padZero(date.getDate()),
    hh: padZero(date.getHours()),
    mm: padZero(date.getMinutes()),
    ss: padZero(date.getSeconds())
  }

  return Object.keys(map).reduce((result, key) => {
    return result.replace(key, map[key])
  }, format)
}

export default formatDate
