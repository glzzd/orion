import axiosInstance from "@/lib/axios";

export const uploadCategories = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/purchase/categories/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllProducts = async () => {
  const response = await axiosInstance.get("/purchase/products");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await axiosInstance.post("/purchase/categories", data);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await axiosInstance.post("/purchase/products", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axiosInstance.put(`/purchase/categories/${id}`, data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await axiosInstance.put(`/purchase/products/${id}`, data);
  return response.data;
};

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/purchase/categories");
    return response.data;
};

export const getSubCategories = async (parentId) => {
    const response = await axiosInstance.get(`/purchase/categories/${parentId}/sub`);
    return response.data;
};

export const getProductsByCategory = async (categoryId) => {
  const response = await axiosInstance.get(`/purchase/categories/${categoryId}/products`);
  return response.data;
};
