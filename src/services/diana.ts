import type { Paginated, Count } from "@/types/litteraturlabbet";
import axios from "axios";
import { project } from "@/assets/config.json";

function list<T>(endpoint: string, params: any, depth?: number): Promise<Paginated<T>> {
  return axios
    .get<Paginated<T>>(`${project.urls.baseURL}/${endpoint}`+(depth?`/?depth=${depth}`:''), {
      params: params,
    })
    .then((d) => {
      return d.data;
    });
}

function get<T>(id: number, endpoint: string, depth?: number): Promise<T> {
  return axios.get<T>(`${project.urls.baseURL}/${endpoint}/${id}`+(depth?`/?depth=${depth}`:'')).then((d) => {
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

function getAligned<T>(params: any): Promise<T> {
  params["depth"] = 4;
  return axios.get<T>(`${project.urls.baseURL}/author_exchange_info/`, {
    params: params,
  }).then((d) => {
    return d.data;
  });
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

export { list, get, count, search, unpaginated, getByLbId, getAligned };
