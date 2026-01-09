// /lib/jwt-utils.ts
export const cleanJwtSecret = (secret: string): string => {
  if (!secret) return secret;
  
  // Remove surrounding double quotes
  if (secret.startsWith('"') && secret.endsWith('"')) {
    return secret.slice(1, -1);
  }
  
  // Remove surrounding single quotes
  if (secret.startsWith("'") && secret.endsWith("'")) {
    return secret.slice(1, -1);
  }
  
  return secret;
};