import { get, post, destroy, put } from "./helpers/ApiRequestsHelper";

function getDetail(id) {
  return get(`courses/${id}`);
}

function create(data) {
  return post("courses", data);
}

function update(id, data) {
  return put(`courses/${id}`, data);
}

function remove(id) {
  return destroy(`courses/${id}`);
}

export { getDetail, create, remove, update };
