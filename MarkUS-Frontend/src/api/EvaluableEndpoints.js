import { get, post, put, destroy } from "./helpers/ApiRequestsHelper";

function getAll() {
  return get("evaluableTypes");
}

function create(data) {
  return post("evaluable", data);
}

function createType(data) {
  return post("evaluableTypes", data);
}

function update(id, data) {
  return put(`evaluable/${id}`, data);
}

function remove(id, data) {
  return destroy(`evaluable/${id}`);
}

export { getAll, create, update, remove, createType };
