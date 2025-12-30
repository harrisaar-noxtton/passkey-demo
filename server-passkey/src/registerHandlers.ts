import { Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { findUser, createUser, userExists, saveChallenge, getChallenge, deleteChallenge, persistUserUpdates } from './authHelpers';
import { rpName, rpID, origin } from './authConfig';

export const handleRegisterStart = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) return res.status(400).send({ error: 'Username is required' });

  if (userExists(username)) {
    console.log(`[RegisterStart] User ${username} already exists. Blocking registration.`);
    return res.status(400).send({ error: 'Username already taken' });
  }

  const user = createUser(username);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id as any,
    userName: user.username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
    // Prevent duplicate registrations for the same user
    excludeCredentials: user.devices.map((dev) => ({
      id: dev.credentialID as any,
      type: 'public-key',
    })),
  });

  console.log('[RegisterStart] Options:', JSON.stringify(options, null, 2));
  saveChallenge(username, options.challenge);
  res.send(options);
};

export const handleRegisterFinish = async (req: Request, res: Response) => {
  const { username, data } = req.body;
  const user = findUser(username);

  if (!user) {
    console.error(`[RegisterFinish] User ${username} not found during registration finish`);
    return res.status(400).send({ error: 'User not found' });
  }

  const expectedChallenge = getChallenge(username);

  if (!expectedChallenge) return res.status(400).send({ error: 'No challenge found' });

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (error: any) {
    console.error('[RegisterFinish] Verification Error:', error);
    return res.status(400).send({ error: error.message });
  }

  const { verified, registrationInfo } = verification;
  console.log(`[RegisterFinish] Verification Success: ${verified}`);

  if (!verified || !registrationInfo) {
    return res.status(400).send({ verified: false, error: 'Verification failed' });
  }

  const { credential } = registrationInfo;
  const { id: credentialID, publicKey: credentialPublicKey, counter } = credential;

  // Ensure these are treated as binary data (Uint8Array)
  const binaryID = typeof credentialID === 'string'
    ? Buffer.from(credentialID, 'base64url')
    : credentialID;

  const binaryPublicKey = typeof credentialPublicKey === 'string'
    ? Buffer.from(credentialPublicKey, 'base64url')
    : credentialPublicKey;

  const existingDevice = user.devices.find((d: any) =>
    Buffer.from(d.credentialID as any).equals(Buffer.from(binaryID as any))
  );

  if (!existingDevice) {
    user.devices.push({
      credentialPublicKey: binaryPublicKey as any,
      credentialID: binaryID as any,
      counter,
      transports: data.response.transports,
    });
    persistUserUpdates();
  }

  deleteChallenge(username);
  res.send({ verified: true });
};
