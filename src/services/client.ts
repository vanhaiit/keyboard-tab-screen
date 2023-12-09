import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Config from 'react-native-config';
declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}
export default class AxiosClient {
  public client: AxiosInstance;

  public constructor() {
    this.client = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this._initializeInterceptor();
  }

  private _initializeInterceptor = () => {
    this.client.interceptors.request.use(
      async config => {
        if (config.headers) {
          config.headers.Authorization = '';
        }

        return config;
      },
      error => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      this._handleResponse,
      this._handleRequestError,
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  private _handleRequestError = (error: AxiosError) => Promise.reject(error);
}

async function uploadMedia(formData: FormData) {
  const res = await fetch(`${Config.BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return await res.json();
}

export { uploadMedia };
