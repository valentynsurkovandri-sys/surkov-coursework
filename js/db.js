// Робота з IndexedDB — локальною базою даних у браузері
const DB_NAME = 'notesDB';
const STORE = 'notes';

// Відкриття (або створення) бази даних
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Допоміжна функція: виконати дію в транзакції
async function runTransaction(mode, action) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Публічні функції для app.js
const db = {
  getAll: () => runTransaction('readonly', (store) => store.getAll()),
  add: (note) => runTransaction('readwrite', (store) => store.add(note)),
  update: (note) => runTransaction('readwrite', (store) => store.put(note)),
  remove: (id) => runTransaction('readwrite', (store) => store.delete(id))
};
