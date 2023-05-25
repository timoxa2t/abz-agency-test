import axios from "axios";
import { UsersResponse } from "../types/UsersResponce";
import { CreateuserBody } from "../types/CreateUserBody";
import { Position } from "../types/Position";
import { CreateUserResponce } from "../types/CreateUserResponce";
import { TokenResponse } from "../types/TokenResponse";

const BASE_URL = 'https://frontend-test-assignment-api.abz.agency/api/v1';

async function get<T>(url: string, queryParams: string = ''): Promise<T> {
  const response = await axios.get(BASE_URL + url + queryParams);

  return response.data
}

async function post<T>(
  url: string,
  body: any,
  headers: any,
  queryParams: string = ''
): Promise<T> {
  const response = await axios.post(
    BASE_URL + url + queryParams,
    body,
    { headers });

  return response.data
}

interface PositionsResponce {
  success: boolean,
  positions: Position[],
}

const getPositions = async (): Promise<Position[]> => {
  const responce = await get<PositionsResponce>('/positions');

  return responce.positions;
}


const getUsers = async (page: number, count: number): Promise<UsersResponse> => {
  const urlParams = new URLSearchParams();
  urlParams.set('page', page.toString());
  urlParams.set('count', count.toString());

  const urlParamsString = '?' + urlParams.toString();

  const responce = await get<UsersResponse>('/users', urlParamsString);

  return responce;
}

const createUser = async (user: CreateuserBody): Promise<boolean>=> {
  const {
    position_id,
    name,
    email,
    phone,
    photo,
  } = user;
  const formData = new FormData(); 

  formData.append('position_id', position_id.toString());
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('photo', photo);

  const tokenResponce = await get<TokenResponse>('/token')

  if (!tokenResponce.success) {
    throw new Error('Can`t get token');
  }

  const headers = { 'Token': tokenResponce.token }

  const response = await post<CreateUserResponce>('/users', formData, headers);
   
  return response.success;
}

const api =  {
  getUsers,
  getPositions,
  createUser,
};

export default api;