import axios from 'axios'
const baseUrl = '/api/blogs'

// https://fullstackopen.com/en/part4/token_authentication
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token}
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


export default { getAll, setToken, create}