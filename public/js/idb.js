// create variable to hold the database connection
let db;
// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will eimit if the database vesion changes (noneexistant to version 1, v1 to v2 etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    //create an obejct store (table) called `new_wallet`, set it to have an auto incrementing primay key of sorts
    db.createObjectStore('new_wallet', {autoIncrement: true });
}

// upon a successful
request.onsuccess = function(event) {
    // when the db is successfully created with its obect store (from onupgradeneeded event above) or simply established a connection, then save reference to the db in global variable
    db = event.target.result;

    // check if ap is online, if yes run uploadWallet() function to send all local db data to api
    if (navigator.onLine) {
        // uploadWallet();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
}

// this function will be executed if attempt to submit a new wallet and there's no interenet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_Wallet'], 'readwrite');

    // access the object store for `new_Wallet`
    const walletObjectStore = transaction.createObjectStore('new_wallet');

    // add record ot your store with add method
    walletObjectStore.add(record);
}