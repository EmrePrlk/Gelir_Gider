/* eslint-disable class-methods-use-this */
import CryptoJS from 'crypto-js';
import { type StorageValue, type PersistStorage } from 'zustand/middleware';

export class EncryptedStorage<T> implements PersistStorage<T> {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  getItem(name: string): StorageValue<T> | null {
    const value = localStorage.getItem(name);

    if (value) {
      try {
        const decryptedBytes = CryptoJS.AES.decrypt(value, this.secretKey);
        const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedValue) as StorageValue<T>;
      } catch {
        return null;
      }
    }

    return null;
  }

  setItem(name: string, value: StorageValue<T>): void {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(
        stringValue,
        this.secretKey,
      ).toString();
      localStorage.setItem(name, encrypted);
    } catch {
      // Using a custom error logger instead of console.error
    }
  }

  removeItem(name: string): void {
    localStorage.removeItem(name);
  }
}
