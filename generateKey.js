import crypto from "crypto";

function generateApiKey(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function generateUUID() {
  return crypto.randomUUID();
}

console.log(`UUID:  ${generateUUID()}`);
console.log(`Validation Token:  ${generateApiKey()}`);
