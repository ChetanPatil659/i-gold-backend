import axios from "axios";
import { decrypt } from "../utils/safeGold.js";

class SafeGoldAPI {
  constructor({ baseUrl, accessToken }) {
    this.accessToken = `Bearer ${accessToken}`;
    this.baseUrl = `${baseUrl}/v1`;
    this.baseUrlV6 = `${baseUrl}/v6`;

    // Create axios instance
    this.axiosInstance = axios.create({
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: this.accessToken,
      },
    });

    // Add response interceptor to the instance
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data.data && typeof response.data.data === "string") {
          try {
            const decryptedData = decrypt(response.data.data);
            response.data = JSON.parse(decryptedData);
          } catch (error) {
            console.log("Response decryption failed:", error);
          }
        }
        return response;
      },
      (error) => {
        if (
          error.response.data.data &&
          typeof error.response.data.data === "string"
        ) {
          try {
            const decryptedData = decrypt(error.response.data.data);
            error.data = JSON.parse(decryptedData);
          } catch (error) {
            console.log("error decryption failed:", error);
          }
        }
        return error;
      }
    );
  }

  //1 - register API
  async register({ name, mobile_no, pin_code }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users`,
        data: { name, mobile_no, pin_code },
      };
      const response = await this.axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //1 - Gold Ledger API
  async fetchBalance(userId) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/users/${userId}`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("user balance fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //2
  async transactions(userId) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/users/${userId}/transactions`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("user transactions fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //1 - Buy Gold Flow Apis
  async buyPrice() {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrlV6}/buy-price`,
      };
      const response = await this.axiosInstance.request(options);

      const data = {
        current_price: response.data.current_price,
        applicable_tax: 3,
        rate_id: 74281334,
        rate_validity: "2025-05-15 02:53:37",
      };
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //2
  async verifyBuyGold({ rate_id, gold_amount, buy_price, userId }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/buy-gold-verify`,
        data: { rate_id, gold_amount, buy_price },
      };
      const response = await this.axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log(error, "error buy gold verify");
      return error;
    }
  }

  //3
  async buyConfirm({ tx_id, pincode, userId }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/buy-gold-confirm`,
        data: { tx_id, pincode },
      };
      const response = await this.axiosInstance.request(options);
      console.log("buy gold confirm fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //4
  async buyStatus(tx_id) {
    try {
      console.log(this.baseUrl, "\n", tx_id);

      const options = {
        method: "GET",
        url: `${this.baseUrl}/buy-gold/${tx_id}/order-status`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("buy gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //5
  async invoice(tx_id) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/transactions/${tx_id}/fetch-invoice`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("buy gold invoice fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //1 - Sell Gold Flow APIs
  async sellPrice() {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/sell-price`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell price fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //2
  async verifySellGold({ rate_id, gold_amount, sell_price, userId }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/sell-gold-verify`,
        data: { rate_id, gold_amount, sell_price },
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold verify fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //3
  async sellConfirm({ tx_id, pincode, userId }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/sell-gold-confirm`,
        data: { tx_id, pincode },
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold confirm fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //4
  async sellStatus(tx_id) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/sell-gold/${tx_id}/order-status`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  // 1 - Delivery Flow
  async validatePincode(pin_code) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/validate-pincode`,
        data: { pin_code },
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  // 2 -
  async redeemGold({ product_code, address, userId }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/redeem-gold-verify`,
        data: {
          product_code,
          address,
        },
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  // 3 -
  async goldProducts() {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/gold-products`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //4 -
  async redeemGoldConfirm({
    tx_id,
    client_reference_id,
    pincode,
    date,
    userId,
  }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/redeem-gold-confirm`,
        data: {
          tx_id,
          client_reference_id,
          pincode,
          date,
        },
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //5
  async redeemGoldStatus(tx_id) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/redeem-gold/${tx_id}/order-status`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //6
  async redeemGoldDispatchStatus(tx_id) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/redeem-gold/${tx_id}/dispatch-status`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //1 -KYC Flow
  async kycUpdate({ userId, pan_no, identity_no }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/kyc-update`,
        data: { kyc_requirement: { pan_no, identity_no } },
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  // 1 - Historical Prices Flow
  async historicalPrices30Days({ from_date, to_date }) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/gold/historical-data?from_date=${from_date}&to_date=${to_date}`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //2 -
  async historicalPricesDaily({ from_date, to_date, type }) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/gold/historical?from_date=${from_date}&to_date=${to_date}&type=${type}`,
      };
      const response = await this.axiosInstance.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }
}

export default SafeGoldAPI;
