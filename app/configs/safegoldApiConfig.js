import SafeGoldAPI from "../safegoldApi/api.js";
const safeGoldApi = new SafeGoldAPI({
  baseUrl: process.env.SAFEGOLD_API_URL,
  accessToken: process.env.SAFEGOLD_API_ACCESS_TOKEN,
});

export default safeGoldApi;
