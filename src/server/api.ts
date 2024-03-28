import { prod_base_url } from "@/constants/Server";
import axios from "axios";
type Action = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

axios.defaults.baseURL = prod_base_url;

export async function ActionHandler(
  action: Action,
  url: string,
  data?: any,
  headers?: any
) {
  switch (action) {
    case "GET":
      return await axios.get(url, { headers });

    case "POST":
      return await axios.post(url, data, { headers });

    case "PUT":
      return await axios.put(url, data, { headers });

    case "DELETE":
      return await axios.delete(url, { headers });
  }
}

export async function ApiHandler(
  action: Action,
  url: string,
  data?: any,
  headers?: any
) {
  try {
    const response = await ActionHandler(action, url, data, headers);

    if (response && response?.status >= 200 && response?.status < 300) {
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data);
      return {
        success: false,
        message: e.response?.data?.message,
      };
    }

    return {
      success: false,
      message: "API Request Failed",
    };
  }
}
