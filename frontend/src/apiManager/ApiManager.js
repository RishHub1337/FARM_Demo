import axios from "axios";
import { ENDPOINTS } from "./EndPoints.js";
import qs from "qs";

class ApiManager {
  // import.meta.env.VITE_FRONTEND_BASE_URL ||
  BASE_URL = "http://localhost:8000/";

  constructor() {
    this.api = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }
    );
  }

  async createAccount(username, password, firstName, lastName, email) {
    const data = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      email,
    };
    try {
      const res = await this.api.post(ENDPOINTS.CREATE_USER(), data);
      return res;
    } catch (err) {
      return err.response;
    }
  }

  async login(username, password) {
    const data = {
      username,
      password,
    };
    try {
      const res = await this.api.post(ENDPOINTS.LOGIN(), qs.stringify(data), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return res;
    } catch (err) {
      return err.response;
    }
  }

  async logout() {
    try {
      const res = await this.api.get(ENDPOINTS.LOGOUT());
      return res;
    } catch (err) {
      return err.response;
    }
  }

  async resend_otp(email) {
    try {
      const res = await this.api.post(ENDPOINTS.RESEND_OTP(), { email });
    } catch (err) {
      return err.response;
    }
  }

  async verify_user(otp, email) {
    const data = {
      otp,
      email,
    };
    try {
      const res = await this.api.post(ENDPOINTS.VERIFY_USER(), data);
      return res;
    } catch (err) {
      return err.response;
    }
  }
  async get_user() {
    try {
      const res = await this.api.get(ENDPOINTS.GET_USER_INFO());
      return res;
    } catch (err) {
      return err.response;
    }
  }
  async update_name(first_name, last_name) {
    const data = {
      first_name,
      last_name,
    };
    try {
      const res = await this.api.post(ENDPOINTS.UPDATE_USER_NAME(), data);
      return res;
    } catch (err) {
      return err.response;
    }
  }
  async update_password(current_password, new_password) {
    const data = {
      current_password: current_password,
      new_password: new_password,
      confirm_new_password: new_password,
    };
    try {
      const res = await this.api.post(ENDPOINTS.UPDATE_PASSWORD(), data);
      return res;
    } catch (err) {
      return err.response;
    }
  }
  async update_bio(bio) {
    const data = {
      bio: bio,
    };
    try {
      const res = await this.api.post(ENDPOINTS.UPDATE_BIO(), data);
      return res;
    } catch (err) {
      return err.response;
    }
  }
  async get_unique_id_and_bio(last_unique_id) {
    const data = {
      last_unique_id: last_unique_id,
    };
    try {
      const res = await this.api.post(ENDPOINTS.GET_UNIQUE_ID_AND_BIO(), data);
      return res;
    } catch (err) {
      return err.response;
    }
  }
  async send_notification(uniqueId) {
    try {
      const res = await this.api.get(ENDPOINTS.SEND_NOTIFICATION(uniqueId));
      return res
    } catch (err) {
      return err.response;
    }
  }
}

export default ApiManager;
