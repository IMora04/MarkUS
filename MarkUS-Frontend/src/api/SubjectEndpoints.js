import { post } from './helpers/ApiRequestsHelper'

function create (data) {
  return post('subjects', data)
}

export { create }
