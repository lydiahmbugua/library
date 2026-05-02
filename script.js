const newBookBtn = document.querySelector(".new-book");
const form = document.querySelector(".form");
const cardsWrapper = document.querySelector(".cards-wrapper");
let editingId = null;

class Library {
  constructor() {
    this.books = [];
  }

  addBookToLibrary(book) {
    this.books.push(book);
  }

  deleteBook(id) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  }

  renderLibrary() {
    cardsWrapper.innerHTML = "";
    this.books.forEach((book) => {
      cardsWrapper.appendChild(book.createCard());
    });
  }

  toggleRead(id) {
    const book = this.books.find((b) => b.id === id);
    if (book) {
      book.read = !book.read;
      this.renderLibrary();
    }
  }

  openEditForm(id) {
    const book = this.books.find((b) => b.id === id);
    if (!book) return;

    editingId = id;

    document.getElementById("book-title").value = book.title;
    document.getElementById("book-author").value = book.author;
    document.getElementById("book-pages").value = book.pages;

    if (book.date_completed) {
      const parts = book.date_completed.split("/");
      if (parts.length === 3) {
        document.getElementById("book-date").value =
          `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    form.querySelector(".submit").textContent = "Save Changes";
    form.classList.add("open");
  }
}
const myLibrary = new Library();

class Book {
  constructor(title, author, pages, date_completed, coverUrl) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.date_completed = date_completed;
    this.coverUrl = coverUrl || null;
    this.read = false;
    this.id = crypto.randomUUID();
  }

  createCard() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = this.id;

    const badge = document.createElement("span");
    badge.classList.add("status-badge", this.read ? "read" : "unread");
    badge.textContent = this.read ? "Read" : "Not Read";

    const img = document.createElement("img");
    img.src = this.coverUrl || "images/placeholder.png";
    img.alt = `${this.title} cover`;
    img.classList.add("cover");
    img.onerror = () => {
      img.style.display = "none";
    };

    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = this.title;

    const author = document.createElement("p");
    author.classList.add("author");
    author.textContent = this.author;

    const pages = document.createElement("p");
    pages.textContent = `${this.pages} pages`;

    const date = document.createElement("p");
    date.classList.add("date_completed");
    date.textContent = this.date_completed;

    const actions = document.createElement("div");
    actions.classList.add("card-actions");

    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("btn-toggle");
    toggleBtn.textContent = this.read ? "Mark Unread" : "Mark Read";
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      myLibrary.toggleRead(this.id);
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn-edit");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      myLibrary.openEditForm(this.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn-delete");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      myLibrary.deleteBook(this.id);
    });

    actions.append(toggleBtn, editBtn, deleteBtn);
    card.append(badge, img, title, author, pages, date, actions);
    return card;
  }
}

function resetFormMode() {
  editingId = null;
  form.querySelector(".submit").textContent = "Submit";
  form.reset();
}

newBookBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = form.classList.contains("open");
  if (isOpen) {
    form.classList.remove("open");
    resetFormMode();
  } else {
    resetFormMode();
    form.classList.add("open");
  }
});

document.addEventListener("click", (e) => {
  if (!form.contains(e.target) && e.target !== newBookBtn) {
    form.classList.remove("open");
    resetFormMode();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const pages = document.getElementById("book-pages").value;
  const dateRaw = document.getElementById("book-date").value;
  const coverFile = document.getElementById("book-cover").files[0];

  const date = dateRaw ? dateRaw.split("-").reverse().join("/") : "";

  if (editingId) {
    const book = myLibrary.books.find((b) => b.id === editingId);
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
    const book = new Book(title, author, pages, date, coverUrl);
    myLibrary.addBookToLibrary(book);
  }

  myLibrary.renderLibrary();
  form.classList.remove("open");
  resetFormMode();
});

const book14 = new Book(
  "Go Tell it on the Mountain",
  "James Baldwin",
  "192",
  "26/04/2026",
  "images/james.png",
);
book14.read = true;
myLibrary.addBookToLibrary(book14);
const book13 = new Book(
  "Tuesdays with Morrie",
  "Mitchie Albom",
  "192",
  "09/02/2026",
  "images/tuesdays.png",
);
book13.read = true;
myLibrary.addBookToLibrary(book13);
const book12 = new Book(
  "They Both Die at the End",
  "Adam Silvera",
  "242",
  "02/04/2026",
  "images/theyboth.png",
);
book12.read = true;
myLibrary.addBookToLibrary(book12);
const book11 = new Book(
  "Hunger Games",
  "Suzanne Collins",
  "422",
  "29/03/2026",
  "images/hungergames.png",
);
book11.read = true;
myLibrary.addBookToLibrary(book11);
const book10 = new Book(
  "Heated Rivalry",
  "Rachael Reid",
  "375",
  "26/04/2026",
  "images/heatedrivalry.png",
);
book10.read = true;
myLibrary.addBookToLibrary(book10);
const book9 = new Book(
  "Game Changers",
  "Rachael Reid",
  "368",
  "24/01/2026",
  "images/gamechangers.png",
);
book9.read = true;
myLibrary.addBookToLibrary(book9);
const book8 = new Book(
  "People We Meet on Vacation",
  "Emily Henry",
  "400",
  "29/01/2026",
  "images/peoplewemeet.png",
);
book8.read = true;
myLibrary.addBookToLibrary(book8);
const book7 = new Book(
  "Normal People",
  "Sally Rooney",
  "288",
  "22/01/2026",
  "images/normalpeople.png",
);
book7.read = true;
myLibrary.addBookToLibrary(book7);
const book6 = new Book(
  "Conversations with Friends",
  "Sally Rooney",
  "366",
  "20/02/2026",
  "images/conversations.png",
);
book6.read = true;
myLibrary.addBookToLibrary(book6);
const book = new Book(
  "A Broken People's Playlist",
  "Chimeka Garricks",
  "224",
  "27/03/2026",
  "images/brokenpeople.png",
);
book.read = true;
myLibrary.addBookToLibrary(book);
const book1 = new Book(
  "Honey & Spice",
  "Bolu Babalola",
  "368",
  "26/04/2026",
  "images/honeyandspice.png",
);
book1.read = true;
myLibrary.addBookToLibrary(book1);
const book2 = new Book(
  "Children of Blood and Bone",
  "Tomi Adeyemi",
  "499",
  "04/03/2026",
  "images/childrenobab.png",
);
book2.read = true;
myLibrary.addBookToLibrary(book2);
const book3 = new Book(
  "Children of Virtue and Vengeance",
  "Tomi Adeyemi",
  "367",
  "26/04/2026",
  "images/childrenovav.png",
);
book3.read = true;
myLibrary.addBookToLibrary(book3);
const book4 = new Book(
  "Five Feet Apart",
  "Rachael Lippincott",
  "168",
  "26/03/2026",
  "images/fivefeet.png",
);
book4.read = true;
myLibrary.addBookToLibrary(book4);
const book5 = new Book(
  "One Day",
  "David Nicholls",
  "437",
  "19/01/2026",
  "images/oneday.png",
);
book5.read = true;
myLibrary.addBookToLibrary(book5);

myLibrary.renderLibrary();
