import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { errorLogger } from "../utils/logger";

interface HttpServiceInterface {
  get(url: string, request?: AxiosRequestConfig): Promise<AxiosResponse | null>;
  delete(
    url: string,
    request: AxiosRequestConfig,
  ): Promise<AxiosResponse | null>;
  post(url: string, request: AxiosRequestConfig): Promise<AxiosResponse | null>;
  put(url: string, request: AxiosRequestConfig): Promise<AxiosResponse | null>;
  patch(
    url: string,
    request: AxiosRequestConfig,
  ): Promise<AxiosResponse | null>;
}

class HttpService implements HttpServiceInterface {
  async get(
    url: string,
    request?: AxiosRequestConfig,
  ): Promise<AxiosResponse | null> {
    try {
      const config: AxiosRequestConfig = {
        method: "get",
        url,
        headers: request?.headers,
        data: request?.data,
      };
      const response = await axios(config);
      return response;
    } catch (error) {
      errorLogger.log(error);
      return null;
    }
  }

  async delete(
    url: string,
    request: AxiosRequestConfig,
  ): Promise<AxiosResponse | null> {
    try {
      const config: AxiosRequestConfig = {
        method: "delete",
        url,
        headers: request.headers,
        data: request.data,
      };
      const response = await axios(config);
      return response;
    } catch (error) {
      errorLogger.log(error);
      return null;
    }
  }

  async post(
    url: string,
    request: AxiosRequestConfig,
  ): Promise<AxiosResponse | null> {
    try {
      const config: AxiosRequestConfig = {
        method: "post",
        url,
        headers: request.headers,
        data: request.data,
      };
      const response = await axios(config);
      return response;
    } catch (error) {
      errorLogger.log(error);
      return null;
    }
  }

  async put(
    url: string,
    request: AxiosRequestConfig,
  ): Promise<AxiosResponse | null> {
    try {
      const config: AxiosRequestConfig = {
        method: "put",
        url,
        headers: request.headers,
        data: request.data,
      };
      const response = await axios(config);
      return response;
    } catch (error) {
      errorLogger.log(error);
      return null;
    }
  }

  async patch(
    url: string,
    request: AxiosRequestConfig,
  ): Promise<AxiosResponse | null> {
    try {
      const config: AxiosRequestConfig = {
        method: "patch",
        url,
        headers: request.headers,
        data: request.data,
      };
      const response = await axios(config);
      return response;
    } catch (error) {
      errorLogger.log(error);
      return null;
    }
  }
}

export { HttpService, HttpServiceInterface };
