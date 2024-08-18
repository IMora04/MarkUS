import { get, post, destroy } from './helpers/ApiRequestsHelper'

function getDetail (id) {
  return get(`courses/${id}`)
}

function create (data) {
  return post('courses', data)
}

function remove (id) {
  return destroy(`courses/${id}`)
}

export { getDetail, create, remove }
