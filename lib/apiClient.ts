import axios, { AxiosRequestConfig } from "axios"

import { KPIData } from "@/app/(site)/dashboard/service"
import { ChurchStatusData } from "@/app/(site)/dashboard/types"

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export interface APISuccessResponse<T> {
  status: "success"
  data: T
}

export interface APIErrorResponse<T> {
  status: "failed"
  error: Array<{ path: keyof Partial<T>; message: string }>
}

class APIClient<T> {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  getData = async (config?: AxiosRequestConfig) => {
    return apiClient.get<APISuccessResponse<T>>(this.endpoint, config)
  }

  getAll = async (config?: AxiosRequestConfig) => {
    return apiClient.get<APISuccessResponse<T[]>>(this.endpoint, config)
  }

  get = async (id: string, config?: AxiosRequestConfig) => {
    const url = `${this.endpoint}/${id}`
    return apiClient.get<APISuccessResponse<T>>(url, config)
  }

  create = async (data: any, config?: AxiosRequestConfig) => {
    return apiClient.post<APISuccessResponse<T>>(this.endpoint, data, config)
  }

  update = async (id: string, data: any, config?: AxiosRequestConfig) => {
    const url = `${this.endpoint}/${id}`
    return apiClient.patch<APISuccessResponse<T>>(url, data, config)
  }

  remove = async (id: string, config?: AxiosRequestConfig) => {
    const url = `${this.endpoint}/${id}`
    return apiClient.delete<APISuccessResponse<T>>(url, config)
  }
}

export const statsApi = {
  kpi: new APIClient<KPIData>("/stats/kpi"),
  churchStatus: new APIClient<ChurchStatusData>("/stats/church-status"),
}
