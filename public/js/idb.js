// create variable to hold the database connection
let db;
// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will eimit if the database vesion changes (noneexistant to version 1, v1 to v2 etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    //create an obejct store (teable) called `new_wallet`, set it to have an auto incrementing primay key of sorts
    db.createObjectStore('new_wallet', {autoIncrement: true });

    
}