// src/AppwriteConfig.js
import { Client, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT) // Appwrite endpoint from .env
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID); // Project ID from .env

export const databases = new Databases(client);
