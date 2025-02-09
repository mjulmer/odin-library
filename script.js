"use strict";

const myLibrary = [];

function Book(title, author) {
    if (!new.target) {
        throw Error('Book function should only be used as a constructor.');
    }
    this.title = title;
    this.author = author;
    this.read = false;
}

Book.prototype.isRead = function(value) { this.read = value}

function addBookToLibrary(title, author) {
  myLibrary.push(new Book(title, author));
}


addBookToLibrary("Pattern Recognition", "William Gibson");
addBookToLibrary("Piranesi", "Susanna Clarke");
addBookToLibrary("walkaway", "Cory Doctorow");

myLibrary.at(1).isRead(true);

console.log(myLibrary);