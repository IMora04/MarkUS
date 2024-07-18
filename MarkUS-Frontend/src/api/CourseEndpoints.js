import { get, post } from './helpers/ApiRequestsHelper'

function getDetail (id) {
  return get(`courses/${id}`)
}

function create (data) {
  return post('courses', data)
}

export { getDetail, create }
