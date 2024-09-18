import { promises as fs } from "fs";

export async function readJsonFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from file:", error);
  }
}

export async function saveJsonToFile(data, filePath) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data), "utf8");
    console.log(`Data saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving to file:", error);
  }
}
