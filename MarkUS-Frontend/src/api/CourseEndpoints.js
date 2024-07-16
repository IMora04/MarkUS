import { get } from './helpers/ApiRequestsHelper'

function getDetail (id) {
  return get(`courses/${id}`)
}

export { getDetail }
