import crypto from "crypto";
// function decryptAESCBC(base64CipherText, keyHex) {
// const decoded = Buffer.from(base64CipherText, "base64");
// const iv = decoded.slice(0, 16);
// const encryptedText = decoded.slice(16);
// const key = Buffer.from(keyHex, "hex");
// const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
// decipher.setAutoPadding(true);
// let decrypted = decipher.update(encryptedText, undefined, "utf8");
// decrypted += decipher.final("utf8");
// }

// try {
//   const decoded = `q΀JHt{^aO4�CP1"sh%@M]{䚇;h`;
//   console.log(decoded, decoded);
//   const iv = `d:ftY&jﰇF]_`;
//   const encryptedText = `q΀JHt{^aO4�CP1"sh%@M]{䚇;h`;
//   //   const key = Buffer.from(keyHex, "hex");
//   //   const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
//   //   decipher.setAutoPadding(true);
//   //   let decrypted = decipher.update(encryptedText, undefined, "utf8");
//   //   decrypted += decipher.final("utf8");
//   //   console.log("Decrypted:", decrypted);
// } catch (err) {
//   console.error("Decryption failed:", err.message);
// }

const md5Hash = crypto
  .createHash("md5")
  .update("386cbd97a7e3fe1ff4233d80858ee9ab")
  .digest("hex");

console.log(md5Hash);

// Given values
const base64CipherText =
  "ecHOnNvkF2QswL8JOS5RB4BtcqIzEIzyXhlqCLNDeXguY95+g1TUR9DKGjt+8Ufb5ngGRDHKHKNk3XFJKq5zjUU8hpf4HcSBQM++9fz9jT3t9L9uOKTQBTNI9p71mHmYuOrGc9Dcr6zR8EzfsPp1bvEY6bGtAOk0linrPm8k3AZSmjzxN4TyrvSDf6l90qyscIqFseDFkLoQhn81oPbbp5LUmgx9qgAS547zJyDDX1a+EkQkivGRwvsJCanD4jWKQDzvB0FThvPvZP7DnCF6zg==";
const md5KeyHex = "88315a510db1191416244483ee2d4aaa"; // 32-byte MD5 hash

// Decode base64
const buffer = Buffer.from(base64CipherText, "base64");

// Extract IV and Encrypted Text
const iv = buffer.slice(0, 16);
const encryptedText = buffer.slice(16);

// Create decipher
const decipher = crypto.createDecipheriv(
  "aes-128-cbc",
  Buffer.from(md5KeyHex, "hex"),
  iv
);
let decrypted = decipher.update(encryptedText, undefined, "utf8");
decrypted += decipher.final("utf8");

console.log("Decrypted JSON:", decrypted);
