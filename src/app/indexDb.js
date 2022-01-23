// here to configure the indexDB database to use offline
// db.js
import Dexie from 'dexie';

// create and give a name to database
export const db = new Dexie('iqamaDb');
//change version if new structure to update
db.version(2).stores({
    // here list the table and their fields
    prayer_times: 'id, data', // Primary key and indexed props
    last_settings: 'id, data', // Primary key and indexed props
});