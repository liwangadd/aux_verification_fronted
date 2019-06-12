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

// 修改用户名
export function updateUserName (username) {
  return axios({
    url: '/user/info/update',
    method: 'post',
    data: {
      'name': username
    }
  })
}