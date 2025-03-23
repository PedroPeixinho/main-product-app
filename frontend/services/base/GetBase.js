import api from '../index';

export default async function GetBase() {
  try {
    const response = await api.get('/');
    return response;
  } catch (error) {
    console.error(error);
  }
}
