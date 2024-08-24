import { get, post } from "./helpers/ApiRequestsHelper";

function getAll() {
  return get("evaluableTypes");
}

function create(data) {
  return post("evaluable", data);
}

export { getAll, create };
