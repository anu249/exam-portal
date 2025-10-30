import axios from "axios";
const API_BASE_URL = "http://localhost:8081/api"; 
const fetchCategories = async () => {
  try {
    
    // ${API_BASE_URL}/register`,
    const { data } = await axios.get(`${API_BASE_URL}/category/`);
    console.log("categoryService:fetchCategories() Success: ", data);
    return data;
  } catch (error) {
    console.error(
      "categoryService:fetchCategories() Error: ",
      error.response.statusText
    );
    return error.response.statusText;
  }
};

const addCategory = async (category) => {
  try {
    
    const { data } = await axios.post(`${API_BASE_URL}/category/`, category);
    console.log("categoryService:addCategory() Success: ", data);
    return { data: data, isAdded: true, error: null };
  } catch (error) {
    console.error(
      "categoryService:addCategory() Error: ",
      error.response.statusText
    );
    return { data: null, isAdded: false, error: error.response.statusText };
  }
};

const deleteCategory = async (catId) => {
  try {
   
    const { data } = await axios.delete(`${API_BASE_URL}/category/${catId}/`);
    console.log("categoryService:deleteCategory()  Success: ", data);
    return {
      isDeleted: true,
      error: null,
    };
  } catch (error) {
    console.error(
      "categoryService:deleteCategory()  Error: ",
      error.response.statusText
    );
    return {
      isDeleted: false,
      error: error.response.statusText,
    };
  }
};

const updateCategory = async (category) => {
  try {
    
    const { data } = await axios.put(
      `${API_BASE_URL}/category/${category.catId}/`,
      category
    );
    console.log("categoryService:updateCategory()  Success: ", data);
    return {
      data: data,
      isUpdated: true,
      error: null,
    };
  } catch (error) {
    console.error(
      "categoryService:updateCategory()  Error: ",
      error.response.statusText
    );
    return {
      data: null,
      isUpdated: false,
      error: error.response.statusText,
    };
  }
};

const categoriesService = {
  addCategory,
  fetchCategories,
  updateCategory,
  deleteCategory,
};
export default categoriesService;
