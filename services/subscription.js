const WATCH_DATA_PATH = path.join(process.cwd(), "./credentials/watch.json");
const CHANNEL_ID = "18888044-a447-42fc-a5df-79ec350b029e";
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;
import path from "path";
import { FOLDER_ID } from "./drive.js";
import { getDriveClient } from "./authentication.js";
import { saveJsonToFile } from "./utils.js";

const drive = await getDriveClient();

export async function stopWatchingFolder() {
  try {
    const watchData = readJsonFromFile(WATCH_DATA_PATH);
    await drive.channels.stop({
      requestBody: {
        id: CHANNEL_ID,
        resourceId: FOLDER_ID,
      },
    });

    console.log("Channel stopped successfully.");
  } catch (error) {
    console.error("Error stopping channel:", error.message);
  }
}

export async function watchFolder() {
  const folderId = FOLDER_ID; // Replace with your Google Drive folder ID
  const webhookAddress =
    "https://us-central1-fitnotes-434508.cloudfunctions.net/notion-fitnotes-integration";

  const requestBody = {
    id: CHANNEL_ID, // A unique identifier for this channel (you can use UUID)
    type: "web_hook",
    address: webhookAddress,
    token: VALIDATION_TOKEN,
  };

  try {
    const response = await drive.files.watch({
      fileId: folderId, // Folder ID you want to monitor
      resource: requestBody,
    });

    // Save the data to a file
    await saveJsonToFile(response.data, WATCH_DATA_PATH);

    console.log("Watch request successful:", response.data);
  } catch (error) {
    console.error("Error setting up watch:", error.message);
  }
}

await watchFolder();
