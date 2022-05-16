import axios from "axios";
import env from "../config/Env";

const service = axios.create();

/**
 * @description axios interceptor for replacing baseURL a& adding api key
 */
service.interceptors.request.use((config: any) => {
  config.headers["apikey"] = "bLWFrLDPKFbfWVWB1NlkTtPSs56YZJjy";
  config.url = config.url.replace("[api]", env.API_SERVICE);
  return config;
});

export default service;
