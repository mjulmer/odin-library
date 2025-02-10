"use strict";

const myLibrary = [];
let uniqueIds = 0;

function Book(title, author, read = false) {
  if (!new.target) {
    throw Error("Book function should only be used as a constructor.");
  }
  this.title = title;
  this.author = author;
  this.read = read;
  this.id = uniqueIds;
  uniqueIds += 1;
}

Book.prototype.isRead = function (value) {
  this.read = value;
};

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
  newBookButton.addEventListener("click", () => newBookDialog.showModal());

  const submitButton = document.querySelector("#new-book-submit");
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();

    addBookToLibraryAndDom(
      document.querySelector("#title").value,
      document.querySelector("#author").value,
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
  toggleReadButton.setAttribute("title", "Mark as read");
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

addBookToLibrary("Pattern Recognition", "William Gibson");
addBookToLibrary("Piranesi", "Susanna Clarke");
addBookToLibrary("walkaway", "Cory Doctorow");

myLibrary.at(1).isRead(true);

setUpUiElements();
