import axios from "axios";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordError
} from "./userSlice";
const REACT_APP_BASE_URL = "http://localhost:5000";
export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${REACT_APP_BASE_URL}/${role}Login`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Login API Response:", result.data);
    if (result.data.role) {
      dispatch(authSuccess(result.data));
      console.log("Login API Response:", result.data);
    } else {
      dispatch(authFailed(result.data.message));
      console.log("Login failed:", result.data.message);
    }
  } catch (error) {
    console.log("Login error:", error.response?.data?.message || error.message);
    dispatch(authError(error.response?.data?.message || error.message || "Login failed"));
  }
};
export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    let formData;
    let headers = {
      "Content-Type": "application/json",
    };
    const hasFile = Object.values(fields).some((value) => value instanceof File);

    if (hasFile) {
      formData = new FormData();
      for (const key in fields) {
        formData.append(key, fields[key]);
      }
      headers = { "Content-Type": "multipart/form-data" };
    } else {
      formData = fields;
    }

    const result = await axios.post(
      `${REACT_APP_BASE_URL}/${role}Reg`,
      formData,
      { headers }
    );

    console.log("result", result);

    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else if (result.data.school) {
      dispatch(stuffAdded());
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};
export const logoutUser = () => (dispatch) => {
  dispatch(authLogout());
};
export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
      
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.delete(`${REACT_APP_BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDeleteSuccess());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(
      `${REACT_APP_BASE_URL}/${address}/${id}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${REACT_APP_BASE_URL}/${address}Create`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordRequest());
  try {
    const result = await axios.post(`${REACT_APP_BASE_URL}/forget-password`, { email });
    dispatch(forgotPasswordSuccess(result.data.message));
  } catch (error) {
    dispatch(forgotPasswordError(error.response?.data?.message || "Network Error"));
  }
};
export const resetPassword = (token, password) => async (dispatch) => {
  dispatch(resetPasswordRequest());
  try {
    const result = await axios.post(`${REACT_APP_BASE_URL}/reset-password/${token}`, { password });
    dispatch(resetPasswordSuccess(result.data.message));
  } catch (error) {
    dispatch(resetPasswordError(error.response?.data?.message || "Network Error"));
  }
};
