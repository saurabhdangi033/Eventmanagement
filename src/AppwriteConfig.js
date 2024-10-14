// src/AppwriteConfig.js
import { Client, Databases} from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("670c26f8001a1521acfd");     // Your project ID from Appwrite

export const databases = new Databases(client);

// 670c26f8001a1521acfd