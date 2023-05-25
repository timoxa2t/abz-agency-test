import axios from "axios";
import { User } from "../types/User";
import { UsersResponse } from "../types/UsersResponce";
import { CreateuserBody } from "../types/CreateUserBody";

const BASE_URL = 'https://frontend-test-assignment-api.abz.agency/api/v1';
const TOKEN = 'eyJpdiI6IlFQWUl2YUl5b1ViYmw4OGFxSkdPV3c9PSIsInZhbHVlIjoiblFUbm1abDA2bVNPdCthWXpZRE4xbmhTd1J4VDBYQjBSK2tqenhIb1FqQ2luSkRNWG02UGg0bVRUS1F0KzBoUVdVQUp1UHI1ekp6VzY1bHRWR0tsTlE9PSIsIm1hYyI6IjQxZGMzYWM4YWQ5OTFiZGZhMWZkMTA0OGE4ZGEzMThiZWE3YzQwOGQ3N2ZjMGYyNjM2ZGVkMWI3Mzk1Mzg5OGUifQ==';

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

  const headers = { 'Token': TOKEN }

  const response = await post<any>('/users', formData, headers);
   
  return response.success;
}

export default {
  getUsers,
  createUser,
};