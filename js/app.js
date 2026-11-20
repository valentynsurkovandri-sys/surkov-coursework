// Основна логіка застосунку «Нотатки»
const form = document.getElementById('noteForm');
const titleInput = document.getElementById('title');
const textInput = document.getElementById('text');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('search');
const list = document.getElementById('notesList');
const empty = document.getElementById('empty');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('installBtn');

let notes = [];
let editingId = null; // id нотатки, яку зараз редагуємо

// ---------- Відображення ----------
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = notes
    .filter((n) => (n.title + ' ' + n.text).toLowerCase().includes(query))
    .sort((a, b) => b.updated - a.updated);

  list.innerHTML = '';
  empty.hidden = filtered.length > 0;

  filtered.forEach((note) => {
    const li = document.createElement('li');
    li.className = 'note';

    const h3 = document.createElement('h3');
    h3.textContent = note.title;            // textContent захищає від XSS
    const p = document.createElement('p');
    p.textContent = note.text;
    const date = document.createElement('time');
    date.textContent = new Date(note.updated).toLocaleString('uk-UA');

    const actions = document.createElement('div');
    actions.className = 'note__actions';
    actions.innerHTML = `
      <button class="btn btn--small" data-action="edit">Редагувати</button>
      <button class="btn btn--small btn--danger" data-action="delete">Видалити</button>`;
    actions.dataset.id = note.id;

    li.append(h3, p, date, actions);
    list.append(li);
  });
}

async function loadNotes() {
  notes = await db.getAll();
  render();
}

// ---------- Додавання / редагування ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const text = textInput.value.trim();
  if (!title) return;

  if (editingId) {
    await db.update({ id: editingId, title, text, updated: Date.now() });
  } else {
    await db.add({ title, text, updated: Date.now() });
  }
  resetForm();
  loadNotes();
});

function resetForm() {
  form.reset();
  editingId = null;
  saveBtn.textContent = 'Додати';
  cancelBtn.hidden = true;
}
cancelBtn.addEventListener('click', resetForm);

// Кнопки «Редагувати» / «Видалити» (делегування подій)
list.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = Number(btn.parentElement.dataset.id);

  if (btn.dataset.action === 'delete' && confirm('Видалити нотатку?')) {
    await db.remove(id);
    loadNotes();
  }
  if (btn.dataset.action === 'edit') {
    const note = notes.find((n) => n.id === id);
    titleInput.value = note.title;
    textInput.value = note.text;
    editingId = id;
    saveBtn.textContent = 'Зберегти';
    cancelBtn.hidden = false;
    titleInput.focus();
  }
});

searchInput.addEventListener('input', render);

// ---------- Статус онлайн / офлайн ----------
function updateStatus() {
  const online = navigator.onLine;
  statusEl.textContent = online ? 'Онлайн' : 'Офлайн';
  statusEl.className = 'status ' + (online ? 'status--online' : 'status--offline');
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// ---------- Встановлення PWA ----------
let installEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installEvent = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!installEvent) return;
  installEvent.prompt();
  await installEvent.userChoice;
  installEvent = null;
  installBtn.hidden = true;
});

// ---------- Реєстрація Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker зареєстровано'))
      .catch((err) => console.error('Помилка SW:', err));
  });
}

updateStatus();
loadNotes();
