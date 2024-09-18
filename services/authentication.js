"use strict";
import { saveJsonToFile } from "./utils.js";
import path from "path";
import { authenticate } from "@google-cloud/local-auth";
import { readJsonFromFile } from "./utils.js";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = path.join(process.cwd(), "./credentials/token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "./credentials/credentials.json"
);

let drive = undefined;

async function loadSavedCredentialsIfExist() {
  try {
    const credentials = await readJsonFromFile(TOKEN_PATH);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const keys = await readJsonFromFile(CREDENTIALS_PATH);
  const key = keys.installed || keys.web;
  const payload = {
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  };
  await saveJsonToFile(payload, TOKEN_PATH);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

export async function getDriveClient() {
  if (drive) {
    return drive;
  }

  const auth = await authorize();
  drive = google.drive({ version: "v3", auth });
  return drive;
}
