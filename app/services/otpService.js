import axios from "axios";

export async function sendOtp(number) {
  console.log(number, "number");

  const options = {
    method: "POST",
    url: `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-C4BCE7975D41474&flowType=SMS&mobileNumber=${number}`,
    headers: {
      authToken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUM0QkNFNzk3NUQ0MTQ3NCIsImlhdCI6MTc0ODUyNDA1MywiZXhwIjoxOTA2MjA0MDUzfQ.gj87VC4bEGCChASOy7cT7ETwJVaZ-jMP1RkUHxG_Y_Kg3XE16YjWM_a4fJjA-noCudYr6g724VU1RKtJjwg2Jw",
    },
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    throw { message: "Unable to send OTP", error };
  }
}

export async function validateOtp(number, otp, verificationId) {
  const options = {
    method: "GET",
    url: `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${number}&verificationId=${verificationId}&customerId=C-C4BCE7975D41474&code=${otp}`,
    headers: {
      authToken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUM0QkNFNzk3NUQ0MTQ3NCIsImlhdCI6MTc0ODUyNDA1MywiZXhwIjoxOTA2MjA0MDUzfQ.gj87VC4bEGCChASOy7cT7ETwJVaZ-jMP1RkUHxG_Y_Kg3XE16YjWM_a4fJjA-noCudYr6g724VU1RKtJjwg2Jw",
    },
  };

  try {
    const response = await axios(options);
    return response.data.data;
  } catch (error) {
    throw { message: "OTP verification failed", error };
  }
}
