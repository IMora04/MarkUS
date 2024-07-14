import { get, post } from './helpers/ApiRequestsHelper'

function getAll () {
  return get('studies')
}

function getDetail (id) {
  return get(`studies/${id}`)
}

function create (data) {
  return post('studies', data)
}

export { getAll, getDetail, create }
