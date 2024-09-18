"use strict";
import { createReadStream, createWriteStream } from "fs";
import { getDriveClient } from "./authentication.js";
import path from "path";

export const DOWNLOAD_FOLDER_ID = "1mVh2jPnU47N-eUtTPdNKYdt1nrmRXDV-";
const UPLOAD_FOLDER_ID = "19pqBIJ9y54HifG5UJtvQBHpXlyx9obIm";
const DOWNLOAD_PATH =
  process.env.NODE_ENV === "production"
    ? "/tmp"
    : path.join(process.cwd(), "./data");

const drive = await getDriveClient();

function generateFileDbName() {
  const date = new Date();
  return `FitNotes_Restore_${date.toISOString().split("T")[0]}.fitnotes`;
}

// List files in the folder and get the most recent file
async function getLastUploadedFile() {
  const res = await drive.files.list({
    q: `'${DOWNLOAD_FOLDER_ID}' in parents and trashed = false`, // Query to list files in the folder
    fields: "files(id, name, createdTime)", // We only need ID, name, and createdTime
    orderBy: "createdTime desc", // Order by the latest created time (most recent file)
    pageSize: 1, // Limit the result to 1 file (the most recent one)
  });

  const files = res.data.files;
  if (files.length) {
    const file = files[0];
    console.log(`Most recent file: ${file.name} (ID: ${file.id})`);
    return file; // Return the file information
  } else {
    throw new Error("No files found in the folder.");
  }
}

// Download the file
async function downloadFile(file) {
  const newFileName = generateFileDbName();
  const downloadFullPath = path.join(DOWNLOAD_PATH, newFileName);
  const dest = createWriteStream(downloadFullPath); // Save the file to local directory

  try {
    const res = await drive.files.get(
      { fileId: file.id, alt: "media" }, // Use 'alt=media' to download the file content
      { responseType: "stream" }
    );

    return new Promise((resolve, reject) => {
      res.data
        .on("end", () => {
          console.log(`Downloaded file: ${file.name}`);
          resolve(downloadFullPath);
        })
        .on("error", (err) => {
          console.error("Error downloading file:", err.message);
          reject(err);
        })
        .pipe(dest);
    });
  } catch (error) {
    console.error("Error downloading file:", error.message);
  }
}

// Upload file to a specific Google Drive folder
export async function uploadFileToDrive(filePath) {
  const fileMetadata = {
    name: path.basename(filePath), // File name
    parents: [UPLOAD_FOLDER_ID], // Upload to specific folder
  };

  const media = {
    mimeType: "application/octet-stream",
    body: createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name",
    });

    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading file:", error.message);
  }
}

export async function retrieveLatestFitnoteFile() {
  const lastUploadedFile = await getLastUploadedFile();
  return await downloadFile(lastUploadedFile);
}
