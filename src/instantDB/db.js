import { init, i, id } from "@instantdb/core";

// Define the unique ID for your app
const APP_ID = "48cc1b1a-cd12-45ad-ba49-59dab1e23717";

// Define the schema for the database entities
export const schema = i.schema({
  entities: {
    // Users entity definition
    users: i.entity({
      id: i.string(),        // Unique identifier for each user
      name: i.string(),      // User's name
      email: i.string(),     // User's email address
      createdAt: i.date(),   // Timestamp when the user was created
    }),

    // Messages entity definition
    messages: i.entity({
      senderId: i.string(),  // ID of the user sending the message
      receiverId: i.string(), // ID of the user receiving the message
      text: i.string(),       // Content of the message
      timestamp: i.date(),    // Timestamp of when the message was sent
    }),
  },
});

// Initialize the database connection with the app ID and schema
export const db = init({ appId: APP_ID, schema });

// Utility function to generate unique IDs
export const generateId = id;
