import { get, post, put, destroy } from "./helpers/ApiRequestsHelper";

function getAll() {
  return get("studies");
}

function getDetail(id) {
  return get(`studies/${id}`);
}

function create(data) {
  return post("studies", data);
}

function update(id, data) {
  return put(`studies/${id}`, data);
}

function remove(id) {
  return destroy(`studies/${id}`);
}

export { getAll, getDetail, create, update, remove };
