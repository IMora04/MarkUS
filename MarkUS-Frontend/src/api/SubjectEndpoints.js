import { post, get } from './helpers/ApiRequestsHelper'

function create (data) {
  return post('subjects', data)
}

function getDetail (id) {
  return get(`subjects/${id}`)
}

export { create, getDetail }
