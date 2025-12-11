import * as SQLite from "expo-sqlite";

let db;

// initialize database
export async function init() {
  db = await SQLite.openDatabaseAsync("places.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);
}

// insert a new place
export async function insertPlace(place) {
  const result = await db.runAsync(
    `INSERT INTO places (title, imageUri, address, lat, lng)
     VALUES (?, ?, ?, ?, ?)`,
    place.title,
    place.imageUri,
    place.address,
    place.location.lat,
    place.location.lng
  );

  return result.lastInsertRowId;
}

// fetch all places
export async function fetchPlaces() {
  const rows = await db.getAllAsync("SELECT * FROM places");
  return rows;
}
