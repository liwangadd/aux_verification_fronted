import { axios } from '@/utils/request'

// 获取实体按键
export function getEntityLabels () {
  return axios({
    url: '/ver/util/entiReflect',
    method: 'get',
  })
}

// 获取关系标签
export function getRelationLabels () {
  return axios({
    url: '/ver/util/relationReflect',
    method: 'get',
  })
}

// 获取实体列表
export function listEntities (parameter) {
  return axios({
    url: '/admin/entities',
    method: 'post',
    data: parameter
  })
}

// 获取关系列表
export function listRelations (parameter) {
  return axios({
    url: '/admin/relations',
    method: 'post',
    data: parameter
  })
}

export function prefixOpinion (parameter) {
  return axios({
    url: '/ver/opinion/prefix',
    method: 'post',
    data: parameter
  })
}