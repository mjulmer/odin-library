"use strict";

const myLibrary = [];

class Book {
  title;
  author;
  read;
  id;

  constructor(title, author, read = false) {
    this.title = title;
    this.author = author;
    this.read = read;
    this.id = Book.uniqueIds;
    Book.uniqueIds += 1;
    console.log(Book.uniqueIds);
  }

  isRead(value) {
    this.read = value;
  }
}

Book.uniqueIds = 0;

function addBookToLibrary(title, author, read = false) {
  myLibrary.push(new Book(title, author, read));
}

function addBookToLibraryAndDom(title, author, read = false) {
  const newBook = new Book(title, author, read);
  myLibrary.push(newBook);
  const bookshelf = document.querySelector(".bookshelf");
  const newBookButton = document.querySelector(".newBookButton");
  bookshelf.insertBefore(createNewBookHtmlItem(newBook), newBookButton);
}

function setUpUiElements() {
  addBooksToDom();
  addNewBookButton();
}

function addBooksToDom() {
  const bookshelf = document.querySelector(".bookshelf");
  for (const book of myLibrary) {
    bookshelf.appendChild(createNewBookHtmlItem(book));
  }
}

// I don't know of the "right" way to keep something as the last element
// so for now I'm manually maintaining the last position
function addNewBookButton() {
  const bookshelf = document.querySelector(".bookshelf");

  const newBookButton = document.createElement("button");
  newBookButton.className = "newBookButton";
  newBookButton.textContent = "Add new book";
  const newBookDialog = document.querySelector(".newBookDialog");
  newBookButton.addEventListener("click", () => {
    document.querySelector("#new-book-form").reset();
    newBookDialog.showModal();
  });

  const titleField = document.querySelector("#title");
  titleField.addEventListener("focusout", () =>
    updateFieldValidity(titleField)
  );
  titleField.addEventListener("focusin", () =>
    titleField.classList.remove("invalid")
  );
  const authorField = document.querySelector("#author");
  authorField.addEventListener("focusout", () =>
    updateFieldValidity(authorField)
  );
  authorField.addEventListener("focusin", () =>
    authorField.classList.remove("invalid")
  );

  function updateFieldValidity(element) {
    if (element.checkValidity()) {
      element.classList.remove("invalid");
    } else {
      element.classList.add("invalid");
    }
  }

  const submitButton = document.querySelector("#new-book-submit");
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();

    const titleField = document.querySelector("#title");
    const authorField = document.querySelector("#author");

    if (!titleField.checkValidity() || !authorField.checkValidity()) {
      return;
    }

    addBookToLibraryAndDom(
      titleField.value,
      authorField.value,
      document.querySelector("#read-toggle").checked
    );
    newBookDialog.close();
  });

  bookshelf.appendChild(newBookButton);
}

function createNewBookHtmlItem(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-id", book.id);
  bookElement.className = "book";
  const bookTitle = document.createElement("p");
  bookTitle.textContent = book.title;
  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = book.author;

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "buttonDiv";
  const removeButton = document.createElement("button");
  removeButton.className = "removeButton";
  removeButton.setAttribute("title", "Remove book");
  removeButton.addEventListener("click", (event) => {
    const bookCard = event.target.parentNode.parentNode;
    const bookId = bookCard.getAttribute("data-id");
    removeBookFromLibrary(bookId);
    bookCard.remove();
  });
  const toggleReadButton = document.createElement("button");
  toggleReadButton.className = "toggleReadButton";
  book.read
    ? setReadButtonToReadState(toggleReadButton)
    : setReadButtonToUnreadState(toggleReadButton);
  toggleReadButton.addEventListener("click", (event) => {
    const bookCard = event.target.parentNode.parentNode;
    const bookId = bookCard.getAttribute("data-id");
    toggleReadState(event.target, bookId);
  });

  buttonDiv.appendChild(removeButton);
  buttonDiv.appendChild(toggleReadButton);

  bookElement.appendChild(bookTitle);
  bookElement.appendChild(bookAuthor);
  bookElement.appendChild(buttonDiv);
  return bookElement;
}

function removeBookFromLibrary(bookId) {
  bookId = parseInt(bookId);
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id === bookId) {
      myLibrary.splice(i, 1);
      return;
    }
  }
  console.error(
    `Requested to remove book with ID ${bookId}, but that ID was not found.`
  );
}

function toggleReadState(readButton, bookId) {
  // Use the UI state as the source of truth, since in the event of a mismatch
  // with the library state, it better represents the user's intent.
  const readButtonId = readButton.getAttribute("id");
  if ((readButtonId !== "bookRead") & (readButtonId !== "bookUnread")) {
    console.error(
      `Unexpected ID for the read button: ${readButtonId}. Not toggling read state.`
    );
    return;
  }

  if (readButtonId === "bookRead") {
    setReadButtonToUnreadState(readButton);
  } else {
    setReadButtonToReadState(readButton);
  }

  bookId = parseInt(bookId);
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id === bookId) {
      myLibrary[i].read = !myLibrary[i].read;
      return;
    }
  }
  console.error(
    `Requested to change read state of book with ID ${bookId}, but that ID was not found.`
  );
}

function setReadButtonToReadState(
  toggleReadButton = document.querySelector(".toggleReadButton")
) {
  toggleReadButton.setAttribute("id", "bookRead");
  toggleReadButton.setAttribute("title", "Mark as unread");
}

function setReadButtonToUnreadState(
  toggleReadButton = document.querySelector(".toggleReadButton")
) {
  toggleReadButton.setAttribute("id", "bookUnread");
  toggleReadButton.setAttribute("title", "Mark as read");
}

addBookToLibrary("Pattern Recognition", "William Gibson");
addBookToLibrary("Piranesi", "Susanna Clarke");
addBookToLibrary("walkaway", "Cory Doctorow");

myLibrary.at(1).isRead(true);

setUpUiElements();
