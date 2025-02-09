"use strict";

const myLibrary = [];

function Book(title, author) {
  if (!new.target) {
    throw Error("Book function should only be used as a constructor.");
  }
  this.title = title;
  this.author = author;
  this.read = false;
}

Book.prototype.isRead = function (value) {
  this.read = value;
};

function addBookToLibrary(title, author) {
  myLibrary.push(new Book(title, author));
}

function setUpUiElements() {
    addBooksToDom();
    addNewBookButton()
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

    bookshelf.appendChild(newBookButton);
}

function createNewBookHtmlItem(book) {
    const bookElement = document.createElement("div");
    bookElement.className = "book";
    const bookTitle = document.createElement("p");
    bookTitle.textContent = book.title;
    const bookAuthor = document.createElement("p");
    bookAuthor.textContent = book.author;

    bookElement.appendChild(bookTitle);
    bookElement.appendChild(bookAuthor);

    return bookElement;
}

addBookToLibrary("Pattern Recognition", "William Gibson");
addBookToLibrary("Piranesi", "Susanna Clarke");
addBookToLibrary("walkaway", "Cory Doctorow");

myLibrary.at(1).isRead(true);

// addBooksToDom();
setUpUiElements();
