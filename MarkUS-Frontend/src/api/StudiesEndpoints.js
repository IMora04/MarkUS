import { get } from './helpers/ApiRequestsHelper'

function getAll () {
  return get('studies')
}

function getDetail (id) {
  return get(`studies/${id}`)
}

export { getAll, getDetail }
