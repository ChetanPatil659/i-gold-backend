import crypto from "crypto";

function encrypt(json_data, key) {
  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(json_data, "utf8", "hex");
  encrypted += cipher.final("hex");

  const ivBuffer = Buffer.from(iv);
  const encryptedBuffer = Buffer.from(encrypted, "hex");

  let final = Buffer.concat([ivBuffer, encryptedBuffer]);

  return final.toString("base64");
}

export function decrypt(encrypted_text) {
  const token = "386cbd97a7e3fe1ff4233d80858ee9ab";
  const key = crypto.createHash("md5").update(token).digest("hex");
  const buffer = Buffer.from(encrypted_text, "base64");

  const iv = buffer.subarray(0, 16);
  const encryptedData = buffer.subarray(16);

  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
