"use strict";
import "dotenv/config";
import * as functions from "@google-cloud/functions-framework";
import {
  retrieveLatestFitnoteFile,
  uploadFileToDrive,
} from "./services/drive.js";
import { Synchronizer } from "./services/sync.js";
import { generateDbConnection } from "./clients/db.js";

functions.http("syncNotionToFitnotes", async (req, res) => {
  if (
    req.method === "POST" &&
    req.headers.token === process.env.VALIDATION_TOKEN
  ) {
    try {
      await sync();
      res.status(200).send("OK");
    } catch (error) {
      res.status(500).send("Error");
    }
  } else {
    res.status(403).send("Forbidden");
  }
});

async function sync() {
  const downloadPath = await retrieveLatestFitnoteFile();
  const db = generateDbConnection(downloadPath);
  const synchronizer = new Synchronizer(db);
  await synchronizer.syncNotionAndFitNotes();
  await uploadFileToDrive(downloadPath);
}

await sync();
