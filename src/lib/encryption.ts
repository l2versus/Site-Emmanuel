// ══════════════════════════════════════════════════════════════════════════════
// 🔒 Criptografia AES-256-CBC — Proteção LGPD para dados médicos
// ══════════════════════════════════════════════════════════════════════════════

import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-dev-key-32-characters!!";
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default-dev-iv16";

/**
 * Criptografa dados sensíveis (anamnese, dados médicos)
 * Utiliza AES-256-CBC com chave e IV configuráveis
 */
export function encryptData(data: string): string {
  const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Hex.parse(ENCRYPTION_IV);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

/**
 * Descriptografa dados sensíveis
 */
export function decryptData(encryptedData: string): string {
  const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Hex.parse(ENCRYPTION_IV);

  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Criptografa um objeto JSON inteiro
 */
export function encryptJSON<T>(data: T): string {
  return encryptData(JSON.stringify(data));
}

/**
 * Descriptografa e retorna um objeto JSON
 */
export function decryptJSON<T>(encryptedData: string): T {
  const decrypted = decryptData(encryptedData);
  return JSON.parse(decrypted) as T;
}

/**
 * Anonimiza email para exibição (ex: j***@gmail.com)
 */
export function anonymizeEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

/**
 * Anonimiza CPF para exibição (ex: ***.***.456-78)
 */
export function anonymizeCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  return `***.***${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Anonimiza telefone para exibição (ex: (**) *****-1234)
 */
export function anonymizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `(**) *****-${digits.slice(-4)}`;
}
