const getEnv = (name: string): string => {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return val;
};

export const rpName = process.env.RP_NAME || 'Passkey demo';
export const rpID = getEnv('RP_ID');
export const origin = getEnv('EXPECTED_ORIGIN');

console.log('[AuthConfig] Loaded Configuration:');
console.log(`  RP_NAME: ${rpName}`);
console.log(`  RP_ID:   ${rpID}`);
console.log(`  ORIGIN:  ${origin}`);
