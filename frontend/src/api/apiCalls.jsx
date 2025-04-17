import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendOtp = async (FormData) => {
  const response = await api.post("/auth/send-otp/", FormData);
  return response.data;
};

export const registration = async (otp) => {
  const response = await api.post("/auth/register/", otp);
  return response.data;
};

export const login = async (formData) => {
  const response = await api.post("/auth/login/", formData);
  return response.data;
};

export const getImages = async () => {
  const token = Cookies.get("token");

  const response = await api.get("/cloud/images", {
    headers: {
        "Authorization": `Bearer ${token} `,
    },
  });
  return response.data;
};

export const deleteItem = async (id, type) => {
  const response = await api.delete(`/cloud/delete/${id}`, {
    headers: {
      "type" : type
    }
  })
  return response.data
}

export const getVideos = async () => {
  const token = Cookies.get("token");

  const response = await api.get("/cloud/videos/", {
    headers: {
        "Authorization": `Bearer ${token} `,
    },
  })
  return response.data
}

export const getAudios = async () => {
  const token = Cookies.get("token")

  const response = await api.get("/cloud/audios/", {
    headers: {
      "Authorization": `Bearer ${token} `,
    },
  })
  return response.data;
}

export const upload = async (file) => {
  const token = Cookies.get("token");
  
  const response = await api.post("/cloud/upload-file/",file, {
    headers: {
      "Content-Type" : "multipart/form-data",
      "Authorization" : `Bearer ${token}`
    }
  })

  return response.data
}

export const getFiles = async () => {
  const token = Cookies.get("token");

  const response = await api.get("/cloud/files/", {
    headers: {
        "Authorization": `Bearer ${token} `,
    },
  })
  return response.data
}