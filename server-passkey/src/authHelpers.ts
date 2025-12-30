import fs from 'fs';
import path from 'path';

export interface Device {
  credentialPublicKey: Uint8Array;
  credentialID: Uint8Array;
  counter: number;
  transports?: string[];
}

export interface User {
  id: Uint8Array;
  username: string;
  devices: Device[];
}

const DB_PATH = path.join(__dirname, '../db.json');

// Helper to convert Uint8Array/Buffer to Base64 for JSON storage
const toBase64 = (arr: Uint8Array | string) => {
  if (typeof arr === 'string') return arr; // Already a string
  return Buffer.from(arr).toString('base64');
};
const fromBase64 = (str: string) => {
  // If it's already a base64url string (contains - or _), convert to standard base64 first or handle directly
  return new Uint8Array(Buffer.from(str, 'base64'));
};

const loadUsers = (): Record<string, User> => {
  if (!fs.existsSync(DB_PATH)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const loaded: Record<string, User> = {};

    for (const username in data) {
      const u = data[username];
      loaded[username] = {
        id: fromBase64(u.id),
        username: u.username,
        devices: u.devices.map((d: any) => ({
          ...d,
          credentialPublicKey: fromBase64(d.credentialPublicKey),
          credentialID: fromBase64(d.credentialID),
        })),
      };
    }
    return loaded;
  } catch (e) {
    console.error('Error loading DB:', e);
    return {};
  }
};

const saveUsers = () => {
  const data: any = {};
  for (const username in users) {
    const u = users[username];
    data[username] = {
      id: toBase64(u.id),
      username: u.username,
      devices: u.devices.map((d) => ({
        ...d,
        credentialPublicKey: toBase64(d.credentialPublicKey),
        credentialID: toBase64(d.credentialID),
      })),
    };
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const users: Record<string, User> = loadUsers();
const challenges: Record<string, string> = {};

export const userExists = (username: string): boolean => {
  return !!users[username];
};

export const findUser = (username: string): User | undefined => {
  return users[username];
};

export const createUser = (username: string): User => {
  if (users[username]) return users[username];

  console.log(`[AuthHelpers] Creating new user: ${username}`);
  users[username] = {
    id: new Uint8Array(Buffer.from(username)),
    username,
    devices: [],
  };
  saveUsers();
  return users[username];
};

// Keeping for backward compatibility if needed, but we'll switch to specific ones
export const getUser = (username: string): User => {
  return findUser(username) || createUser(username);
};

export const persistUserUpdates = () => {
  saveUsers();
};

export const saveChallenge = (username: string, challenge: string) => {
  challenges[username] = challenge;
};

export const getChallenge = (username: string): string | undefined => {
  return challenges[username];
};

export const deleteChallenge = (username: string) => {
  delete challenges[username];
};
