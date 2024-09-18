import "dotenv/config";
import path from "path";
import { getDriveClient } from "./authentication.js";
import { readJsonFromFile, saveJsonToFile } from "./utils.js";

const WATCH_DATA_PATH = path.join(process.cwd(), "./credentials/watch.json");
const drive = await getDriveClient();

export async function stopWatchingFolder() {
  try {
    const watchData = await readJsonFromFile(WATCH_DATA_PATH);
    await drive.channels.stop({
      requestBody: {
        id: watchData.id,
        resourceId: watchData.resourceId,
      },
    });

    console.log("Channel stopped successfully.");
  } catch (error) {
    console.error("Error stopping channel:", error.message);
  }
}

export async function watchFolder() {
  const requestBody = {
    id: process.env.CHANNEL_ID, // A unique identifier for this channel (you can use UUID)
    type: "web_hook",
    address: process.env.URL,
    token: process.env.VALIDATION_TOKEN,
  };

  try {
    const response = await drive.files.watch({
      fileId: process.env.DOWNLOAD_FOLDER_ID, // Folder ID you want to monitor
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
