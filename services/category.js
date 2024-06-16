import {request} from './network.js'

function getCategory() {
 return request({
   url: '/category'
 })
}

function getSubcategory(id) {
  return request({
    url: '/subcategory',
    data: {
      maitKey: id
    }
  })
}

function getCategoryDetail(detailId, type) {
  return request({
    url: '/subcategory/detail',
    data: {
      type,
      miniWallkey: detailId,
    }
  })
}

export {getCategory, getSubcategory, getCategoryDetail}
