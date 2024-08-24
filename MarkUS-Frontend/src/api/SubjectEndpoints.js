import { post, get, destroy } from "./helpers/ApiRequestsHelper";

function create(data) {
  return post("subjects", data);
}

function getDetail(id) {
  return get(`subjects/${id}`);
}

function remove(id) {
  return destroy(`subjects/${id}`);
}

export { create, getDetail, remove };
