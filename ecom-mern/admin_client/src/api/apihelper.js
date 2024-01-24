import axios from "axios";

let url = "http://localhost:8080/api";

export const createCategory = (formData) =>
  axios.post(`${url}/create_category`, formData);
export const getCategory = () => axios.get(`${url}/get_category`);
export const updateCategory = (formData) =>
  axios.put(`${url}/update_category`, formData);
export const deleteCategory = (formData) => {
  axios.delete(`${url}/delete_category/${formData.id}`, formData);
};
