const STORAGE_KEY = "library_books_v6";
let books = [];

// Default seed books
const DEFAULT_BOOKS = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    year: 2008,
    available: true,
    borrowerName: "",
    borrowerId: ""
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "9780201616224",
    year: 1999,
    available: true,
    borrowerName: "",
    borrowerId: ""
  },
  {
    id: 3,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    isbn: "9780262033848",
    year: 2009,
    available: true,
    borrowerName: "",
    borrowerId: ""
  },
  {
    id: 4,
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    isbn: "9781091210099",
    year: 2020,
    available: true,
    borrowerName: "",
    borrowerId: ""
  },
  {
    id: 5,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    isbn: "9781593279509",
    year: 2018,
    available: true,
    borrowerName: "",
    borrowerId: ""
  }
];

// Load books from localStorage or defaults
function loadBooks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    books = [...DEFAULT_BOOKS];
    saveBooks();
  } else {
    books = JSON.parse(raw);
  }
  renderBooks();
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderBooks() {
  const table = document.getElementById("bookTable");
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const filter = document.getElementById("filterSelect")?.value || "all";

  let filtered = books.filter(book =>
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search) ||
    book.isbn.includes(search)
  );

  if (filter === "available") filtered = filtered.filter(b => b.available);
  if (filter === "borrowed") filtered = filtered.filter(b => !b.available);

  table.innerHTML = "";
  filtered.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <h3>${book.title}</h3>
      <div class="meta">Author: ${book.author} | ISBN: ${book.isbn} | Year: ${book.year}</div>
      <div class="status ${book.available ? "available" : "borrowed"}">
        ${book.available ? "Available" : `Borrowed by ${book.borrowerName} (ID: ${book.borrowerId})`}
      </div>
      <div class="actions">
        <button onclick="borrowBook(${book.id})" ${book.available ? "" : "disabled"}>Borrow</button>
        <button onclick="returnBook(${book.id})" ${book.available ? "disabled" : ""}>Return</button>
        <button onclick="deleteBook(${book.id})">Delete</button>
      </div>
    `;
    table.appendChild(card);
  });

  updateStats();
}

function updateStats() {
  const total = books.length;
  const available = books.filter(b => b.available).length;
  const borrowed = total - available;
  document.getElementById("totalCount").textContent = `Total: ${total}`;
  document.getElementById("availableCount").textContent = `Available: ${available}`;
  document.getElementById("borrowedCount").textContent = `Borrowed: ${borrowed}`;
}

function borrowBook(id) {
  const name = prompt("Enter borrower name:");
  const borrowerId = prompt("Enter borrower ID number:");
  if (!name || !borrowerId) return;
  const book = books.find(b => b.id === id);
  book.available = false;
  book.borrowerName = name;
  book.borrowerId = borrowerId;
  saveBooks();
  renderBooks();
}

function returnBook(id) {
  const book = books.find(b => b.id === id);
  book.available = true;
  book.borrowerName = "";
  book.borrowerId = "";
  saveBooks();
  renderBooks();
}

function deleteBook(id) {
  books = books.filter(b => b.id !== id);
  saveBooks();
  renderBooks();
}

function addBook() {
  const title = prompt("Title:");
  const author = prompt("Author:");
  const isbn = prompt("ISBN:");
  const year = prompt("Year:");
  if (!title || !author || !isbn || !year) return;
  books.push({
    id: Date.now(),
    title,
    author,
    isbn,
    year,
    available: true,
    borrowerName: "",
    borrowerId: ""
  });
  saveBooks();
  renderBooks();
}

document.getElementById("addBookBtn")?.addEventListener("click", addBook);
document.getElementById("searchInput")?.addEventListener("input", renderBooks);
document.getElementById("filterSelect")?.addEventListener("change", renderBooks);

loadBooks();
