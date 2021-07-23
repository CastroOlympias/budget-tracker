// create variable to hold the database connection
let db;
// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will eimit if the database vesion changes (noneexistant to version 1, v1 to v2 etc.)
request.onupgradeneeded = function (event) {
    // save a reference to the database
    const db = event.target.result;
    //create an obejct store (table) called `new_wallet`, set it to have an auto incrementing primay key of sorts
    db.createObjectStore('new_wallet', { autoIncrement: true });
}

// upon a successful
request.onsuccess = function (event) {
    // when the db is successfully created with its obect store (from onupgradeneeded event above) or simply established a connection, then save reference to the db in global variable
    db = event.target.result;

    // check if ap is online, if yes run uploadWallet() function to send all local db data to api
    if (navigator.onLine) {
        uploadWallet();
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
}

// this function will be executed if attempt to submit a new wallet and there's no interenet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_Wallet'], 'readwrite');

    // access the object store for `new_Wallet`
    const walletObjectStore = transaction.objectStore('new_wallet');

    // add record ot your store with add method
    walletObjectStore.add(record);
}

function uploadWallet() {
    // open a transaction on your pending db
    const transaction = db.transaction(['new_wallet'], 'readwrite');

    // access your pending object store
    const walletObjectStore = transaction.objectStore('new_wallet');

    // get all records from store and set to a variable
    const getAll = walletObjectStore.getAll();

    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['new_wallet'], 'readwrite');
                    const walletObjectStore = transaction.objectStore('new_wallet');
                    // clear all items in your store
                    walletObjectStore.clear();
                })
                .catch(err => {
                    // set reference to redirect back here
                    console.log(err);
                });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', uploadWallet);