import { Request, Response } from 'express';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { findUser, saveChallenge, getChallenge, deleteChallenge, persistUserUpdates } from './authHelpers';
import { rpID, origin } from './authConfig';

export const handleLoginStart = async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) return res.status(400).send({ error: 'Username is required' });

  const user = findUser(username);

  if (!user) {
    console.log(`[LoginStart] User ${username} not found. blocking login.`);
    return res.status(404).send({ error: 'User not found' });
  }

  console.log(`[LoginStart] Generating options for user: ${username}`);
  console.log(`[LoginStart] Found ${user.devices.length} devices for this user`);

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.devices
      .filter((dev) => dev.credentialID)
      .map((dev) => {
        const idBase64Url = Buffer.from(dev.credentialID).toString('base64url');
        console.log(`[LoginStart] Device ID (raw length: ${dev.credentialID.length}): ${idBase64Url}`);
        return {
          id: idBase64Url,
          type: 'public-key' as const,
        };
      }),
    userVerification: 'preferred',
  });

  console.log(`[LoginStart] Sending ${options.allowCredentials?.length || 0} credentials in allowCredentials`);
  console.log('[LoginStart] Options sent to browser:', JSON.stringify(options, null, 2));
  saveChallenge(username, options.challenge);
  res.send(options);
};

export const handleLoginFinish = async (req: Request, res: Response) => {
  const { username, data } = req.body;
  const user = findUser(username);

  if (!user) {
    console.log(`[LoginFinish] User ${username} not found during login finish.`);
    return res.status(404).send({ error: 'User not found' });
  }

  const expectedChallenge = getChallenge(username);

  if (!expectedChallenge) return res.status(400).send({ error: 'No challenge found' });

  console.log(`[LoginFinish] Received authentication for user: ${username}`);
  console.log(`[LoginFinish] Browser Response ID: ${data.id}`);

  const device = user.devices.find((d: any) => {
    const dbID = Buffer.from(d.credentialID).toString('base64url');
    const match = dbID === data.id;
    if (match) console.log(`[LoginFinish] Found matching device in DB with ID: ${dbID}`);
    return match;
  });

  if (!device) {
    console.error(`[LoginFinish] Authenticator with ID ${data.id} not found for user ${username}`);
    return res.status(400).send({ error: 'Authenticator not found on user account' });
  }

  console.log('[LoginFinish] Verifying response with SimpleWebAuthn...');
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: device.credentialID as any,
        publicKey: device.credentialPublicKey as any,
        counter: device.counter,
      },
    });
  } catch (error: any) {
    console.error('[LoginFinish] Verification Error:', error);
    return res.status(400).send({ error: error.message });
  }

  const { verified, authenticationInfo } = verification;
  console.log(`[LoginFinish] Verification Success: ${verified}`);

  if (!verified) {
    return res.status(400).send({ verified: false });
  }

  device.counter = authenticationInfo.newCounter;
  persistUserUpdates();
  deleteChallenge(username);
  res.send({ verified: true });
};
