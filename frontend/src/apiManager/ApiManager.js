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
}

export default ApiManager;