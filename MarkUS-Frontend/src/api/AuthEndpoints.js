import { post, put, getBearer } from './helpers/ApiRequestsHelper'

function login (data) {
  return post('users/login', data)
}

function register (data) {
  return post('users/register', data)
}

function update (data) {
  return put('users', data)
}

function isTokenValid (storedToken) {
  return put('users/isTokenValid', { token: storedToken })
}

function fetchGoogleData (bearer) {
  return getBearer('https://www.googleapis.com/userinfo/v2/me', bearer)
}

export { login, register, isTokenValid, update, fetchGoogleData }
