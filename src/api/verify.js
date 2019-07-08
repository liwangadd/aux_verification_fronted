import { axios } from '@/utils/request'

export function getVerifyContents (parameter) {
  return axios({
    url: '/ver/next',
    method: 'post',
    data: parameter
  })
}

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

export function dealEntity (parameter) {
  return axios({
    url: '/ver/entity',
    method: 'put',
    data: parameter
  })
}

export function openNextStatement (parameter) {
  return axios({
    url: '/ver/next/begin',
    method: 'post',
    data: parameter
  })
}

export function dealRelation (parameter) {
  return axios({
    url: '/ver/relation',
    method: 'put',
    data: parameter
  })
}

// 添加新的关系
export function addRelation (parameter) {
  return axios({
    url: '/ver/relation',
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