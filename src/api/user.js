import { axios } from '@/utils/request'

export function listEntities (parameter) {
  return axios({
    url: '/user/entities',
    method: 'post',
    data: parameter
  })
}

export function listRelations (parameter) {
  return axios({
    url: '/user/relations',
    method: 'post',
    data: parameter
  })
}
