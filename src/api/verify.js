import { axios } from '@/utils/request'

export function getVerifyContents (parameter) {
  return axios({
    url: '/ver/next',
    method: 'post',
    data: parameter
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

export function prefixOpinion (parameter) {
  return axios({
    url: '/ver/opinion/prefix',
    method: 'post',
    data: parameter
  })
}