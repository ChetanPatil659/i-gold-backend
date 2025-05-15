import axios from "axios";

class SafeGoldAPI {
  constructor({ baseUrl, accessToken }) {
    this.accessToken = `Bearer ${accessToken}`;
    this.baseUrl = `${baseUrl}/v1`;
    this.baseUrlV6 = `${baseUrl}/v6`;
  }

  //1 - register API
  async register({ name, mobile_no, pin_code }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer 38778d59d5e17cfadc750e87703eb5e2`,
          "content-type": "application/json",
        },
        data: { name, mobile_no, pin_code },
      };
      const response = await axios.request(options);
      console.log("user registered successfully with safegold api");
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);

      const data = {
        current_price: (response.data.current_price + (response.data.current_price * ((response.data.applicable_tax + 2)/100))).toFixed(2),
        applicable_tax: 3,
        rate_id: 74281334,
        rate_validity: '2025-05-15 02:53:37'
      }

      console.log("buy price fetched successfully with safegold api", data);

      return data;
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: { rate_id, gold_amount, buy_price },
      };
      const response = await axios.request(options);
      console.log("buy gold verify fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //3
  async buyConfirm({ tx_id, pincode, userId }) {
    try {
      const options = {
        method: "POST",
        url: `${this.baseUrl}/users/${userId}/buy-gold-confirm`,
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: { tx_id, pincode },
      };
      const response = await axios.request(options);
      console.log("buy gold confirm fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }

  //4
  async buyStatus(tx_id) {
    try {
      const options = {
        method: "GET",
        url: `${this.baseUrl}/buy-gold/${tx_id}/order-status`,
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: { rate_id, gold_amount, sell_price },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: { tx_id, pincode },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: { pin_code },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: {
          product_code,
          address,
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: {
          tx_id,
          client_reference_id,
          pincode,
          date,
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
        data: { kyc_requirement: { pan_no, identity_no } },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
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
        headers: {
          accept: "application/json",
          Authorization: this.accessToken,
          "content-type": "application/json",
        },
      };
      const response = await axios.request(options);
      console.log("sell gold status fetched successfully with safegold api");
      return response.data;
    } catch (error) {
      console.log(error, "error registering user");
    }
  }
}

export default SafeGoldAPI;
