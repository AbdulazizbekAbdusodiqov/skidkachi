import { Injectable } from "@nestjs/common";
const FormData = require("form-data");
import axios from "axios";

@Injectable()
export class SmsService {
  async sendSms(phone_number: string, otp: string) {
    const data = new FormData();
    data.append("mobile_phone", phone_number);
    data.append("message", "Bu Eskiz dan test");
    data.append("from", "4546");
    console.log(process.env.SMS_SERVICE_URL);

    console.log("1");
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.SMS_SERVICE_URL,
      headers: {
        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      },
      data: data,
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      return { status: 500 };
    }
  }

  async refreshToken() {
    const config = {
      method: "PATCH",
      maxBodyLength: Infinity,
      url: "https://notify.eskiz.uz/api/auth/refresh",
      headers: {
        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      },
    };

    try {
      const newToken = await axios(config);
      return newToken;
    } catch (error: any) {
      return { status: 500 };
    }
  }

  async getToken() {
    const data = new FormData();
    data.append("email", "abdulazizbekabdusodiqov@gmail.com");
    data.append("password", "L0N4Klkqfw24fGattscCzfTiHmCXq55qbzbBZiKy");

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://notify.eskiz.uz/api/auth/login",
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };

    try {
      const response = await axios(config);
      return response.data; // Faqat data qismi qaytariladi
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Error while getting token" };
    }
  }
}
