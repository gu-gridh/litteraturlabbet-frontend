import type { Paginated, Count } from "@/types/litteraturlabbet";
import axios from "axios";
import { project } from "@/assets/config.json";

function list<T>(endpoint: string, params: any): Promise<Paginated<T>> {
  return axios
    .get<Paginated<T>>(`${project.urls.baseURL}/${endpoint}`, {
      params: params,
    })
    .then((d) => {
      return d.data;
    });
}

function get<T>(id: number, endpoint: string): Promise<T> {
  return axios.get<T>(`${project.urls.baseURL}/${endpoint}/${id}`).then((d) => {
    return d.data;
  });
}

function getByLbId<T>(endpoint: string, params: any): Promise<T>{
  return axios.get<T>(`${project.urls.baseURL}/${endpoint}`, {
    params: params,
  })
  .then((d) => {
    return d.data
  })
}

function count<Count>(endpoint: string, params: any): Promise<Count> {
  return axios
    .get<Count>(`${project.urls.baseURL}/${endpoint}/count/`, {
      params: params,
    })
    .then((d) => {
      return d.data;
    });
}

function search<T>(query: string, endpoint: string): Promise<Paginated<T>> {
  return axios
    .get<Paginated<T>>(`${project.urls.baseURL}/${endpoint}`, {
      params: { search: query },
    })
    .then((d) => {
      return d.data;
    });
}


function unpaginated<T>(endpoint: string, params: any): Promise<Array<T>> {
  return axios
    .get<Array<T>>(`${project.urls.baseURL}/${endpoint}`, {
      params: params,
    })
    .then((d) => {
      return d.data;
    });
}

export { list, get, count, search, unpaginated, getByLbId };
