const newBookBtn = document.querySelector('.new-book');
const form = document.querySelector('.form');
const cardsWrapper = document.querySelector('.cards-wrapper');


const myLibrary = [];
let editingId = null;

function Book(title, author, pages, date_completed, coverUrl) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.date_completed = date_completed;
    this.coverUrl = coverUrl || null;
    this.read = false; 
    this.id = crypto.randomUUID();
}

function addBookToLibrary(title, author, pages, date_completed, coverUrl, read = false) {
    const book = new Book(title, author, pages, date_completed, coverUrl);
    book.read = read;
    myLibrary.push(book);
    return book;
}


function createCard(book) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = book.id;


    const badge = document.createElement('span');
    badge.classList.add('status-badge', book.read ? 'read' : 'unread');
    badge.textContent = book.read ? 'Read' : 'Not Read';

    const img = document.createElement('img');
    img.src = book.coverUrl || 'images/placeholder.png';
    img.alt = `${book.title} cover`;
    img.classList.add('cover');
    img.onerror = () => { img.style.display = 'none'; };

    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.classList.add('author');
    author.textContent = book.author;

    const pages = document.createElement('p');
    pages.textContent = `${book.pages} pages`;

    const date = document.createElement('p');
    date.classList.add('date_completed');
    date.textContent = book.date_completed;

    const actions = document.createElement('div');
    actions.classList.add('card-actions');

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('btn-toggle');
    toggleBtn.textContent = book.read ? 'Mark Unread' : 'Mark Read';
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleRead(book.id);
    });

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn-edit');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditForm(book.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteBook(book.id);
    });

    actions.append(toggleBtn, editBtn, deleteBtn);
    card.append(badge, img, title, author, pages, date, actions);
    return card;
}

function renderLibrary() {
    cardsWrapper.innerHTML = '';
    myLibrary.forEach(book => {
        cardsWrapper.appendChild(createCard(book));
    });
}


function toggleRead(id) {
    const book = myLibrary.find(b => b.id === id);
    if (book) {
        book.read = !book.read;
        renderLibrary();
    }
}


function deleteBook(id) {
    const index = myLibrary.findIndex(b => b.id === id);
    if (index !== -1) {
        myLibrary.splice(index, 1);
        renderLibrary();
    }
}


function openEditForm(id) {
    const book = myLibrary.find(b => b.id === id);
    if (!book) return;

    editingId = id;

    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-pages').value = book.pages;

    if (book.date_completed) {
        const parts = book.date_completed.split('/');
        if (parts.length === 3) {
            document.getElementById('book-date').value = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }

    form.querySelector('.submit').textContent = 'Save Changes';
    form.classList.add('open');
}

function resetFormMode() {
    editingId = null;
    form.querySelector('.submit').textContent = 'Submit';
    form.reset();
}


newBookBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = form.classList.contains('open');
    if (isOpen) {
        form.classList.remove('open');
        resetFormMode();
    } else {
        resetFormMode();
        form.classList.add('open');
    }
});

document.addEventListener('click', (e) => {
    if (!form.contains(e.target) && e.target !== newBookBtn) {
        form.classList.remove('open');
        resetFormMode();
    }
});


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const pages = document.getElementById('book-pages').value;
    const dateRaw = document.getElementById('book-date').value;
    const coverFile = document.getElementById('book-cover').files[0];

    const date = dateRaw ? dateRaw.split('-').reverse().join('/') : '';

    if (editingId) {
        const book = myLibrary.find(b => b.id === editingId);
        if (book) {
            book.title = title;
            book.author = author;
            book.pages = pages;
            book.date_completed = date;
            if (coverFile) {
                book.coverUrl = URL.createObjectURL(coverFile);
            }
        }
    } else {
        const coverUrl = coverFile ? URL.createObjectURL(coverFile) : null;
        addBookToLibrary(title, author, pages, date, coverUrl);
    }

    renderLibrary();
    form.classList.remove('open');
    resetFormMode();
});


addBookToLibrary('Go Tell it on the Mountain', 'James Baldwin', '192', '26/04/2026', 'images/james.png', true);
addBookToLibrary('Tuesdays with Morrie', 'Mitchie Albom', '192', '09/02/2026', 'images/tuesdays.png', true);
addBookToLibrary('They Both Die at the End', 'Adam Silvera', '242', '02/04/2026', 'images/theyboth.png', true);
addBookToLibrary('Hunger Games', 'Suzanne Collins', '422', '29/03/2026', 'images/hungergames.png', true);
addBookToLibrary('Heated Rivalry', 'Rachael Reid', '375', '26/04/2026', 'images/heatedrivalry.png', true);
addBookToLibrary('Game Changers', 'Rachael Reid', '368', '24/01/2026', 'images/gamechangers.png', true);
addBookToLibrary('People We Meet on Vacation', 'Emily Henry', '400', '29/01/2026', 'images/peoplewemeet.png', true);
addBookToLibrary('Normal People', 'Sally Rooney', '288', '22/01/2026', 'images/normalpeople.png', true);
addBookToLibrary('Conversations with Friends', 'Sally Rooney', '366', '20/02/2026', 'images/conversations.png', true);
addBookToLibrary("A Broken People's Playlist", 'Chimeka Garricks', '224', '27/03/2026', 'images/brokenpeople.png', true);
addBookToLibrary('Honey & Spice', 'Bolu Babalola', '368', '26/04/2026', 'images/honeyandspice.png', true);
addBookToLibrary('Children of Blood and Bone', 'Tomi Adeyemi', '499', '04/03/2026', 'images/childrenobab.png', true);
addBookToLibrary('Children of Virtue and Vengeance', 'Tomi Adeyemi', '367', '26/04/2026', 'images/childrenovav.png', true);
addBookToLibrary('Five Feet Apart', 'Rachael Lippincott', '168', '26/03/2026', 'images/fivefeet.png', true);
addBookToLibrary('One Day', 'David Nicholls', '437', '19/01/2026', 'images/oneday.png', true);

renderLibrary();
