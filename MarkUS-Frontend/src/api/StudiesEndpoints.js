import { get } from './helpers/ApiRequestsHelper'

function getAll () {
  return get('studies')
}

function getOne (id) {
  return get(`studies/${id}`)
}

export { getAll, getOne }
