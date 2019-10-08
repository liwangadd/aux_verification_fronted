import { axios } from '@/utils/request'

export function getEntityCount () {
  return axios({
    url: '/admin/entities/count',
    method: 'get',
  })
}

export function getRelationCount () {
  return axios({
    url: '/admin/relations/count',
    method: 'get',
  })
}