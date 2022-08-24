/*
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

const bookshelf = [];
const RENDER = 'render';
const STORAGE_KEY = 'bookshelf';
const SAVED_EVENT = 'saved-books';

function randId() {
  return +new Date();
}

function isStorageExists() {
  if (typeof Storage === undefined) {
    return false;
  }
  else {
    return true;
  }
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id, title, author, year, isComplete
  }
}

function findBook(id) {
  for (book of bookshelf) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}

function findBookIndex(id) {
  for (index in bookshelf) {
    if (bookshelf[index].id === id) {
      return index;
    }
  }
  return -1;
}





function addBook() {
  const judulBuku = document.getElementById('inputBookTitle').value;
  const penulisBuku = document.getElementById('inputBookAuthor').value;
  const tahunBuku = document.getElementById('inputBookYear').value;
  const checkBookCompleted = document.getElementById('inputBookIsComplete').checked;

  const bookID = randId();
  const bookObject = generateBookObject(bookID, judulBuku, penulisBuku, tahunBuku, checkBookCompleted)
  bookshelf.push(bookObject);

  document.dispatchEvent(new Event(RENDER));
  saveBook();

}


function makeList(book) {

  const {
    id, title, author, year, isComplete
  } = book;

  const titleText = document.createElement('h3');
  titleText.innerText = title;


  const authorText = document.createElement('p');
  authorText.innerText = 'Author : ' + author;

  const yearText = document.createElement('p');
  yearText.innerText = 'Tahun Terbit : ' + year;

  const actionDiv = document.createElement('div');
  actionDiv.classList.add('action');

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(titleText, authorText, yearText, actionDiv);
  article.setAttribute('id', `book-${id}`);

  if (isComplete) {
    const haventReadButton = document.createElement('button');
    haventReadButton.classList.add('yellow');
    haventReadButton.innerText = 'Belum Selesai dibaca';
    haventReadButton.addEventListener('click', function () {
      haventReadBook(id);
    });


    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.addEventListener('click', function () {
      deleteBook(id);
    })


    actionDiv.append(haventReadButton, deleteButton);
  } else {
    const haveReadButton = document.createElement('button');
    haveReadButton.classList.add('green');
    haveReadButton.innerText = 'Selesai Dibaca'
    haveReadButton.addEventListener('click', function () {
      haveReadBook(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.addEventListener('click', function () {
      deleteBook(id);
    });


    actionDiv.append(haveReadButton, deleteButton);
  }

  return article;
}




function haveReadBook(id) {
  const findBookTarget = findBook(id);
  if (findBookTarget == null)
    return;

  findBookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER));
  saveBook();
}

function haventReadBook(id) {
  const findBookTarget = findBook(id);
  if (findBookTarget == null)
    return;

  findBookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER));
  saveBook();
}

function deleteBook(id) {
  const findBookTarget = findBookIndex(id);
  const findBookTitle = findBook(id);
  if (findBookTarget === -1)
    return;
  console.log(findBookTarget);
  let userConfirm = confirm('Apakah Anda yakin ingin menghapus ' + findBookTitle.title + "?");
  if (userConfirm) {
    bookshelf.splice(findBookTarget, 1);
    alert('Book ' + findBookTitle.title + ' has been deleted successfully.');
  }

  document.dispatchEvent(new Event(RENDER));
  saveBook();
}


document.addEventListener(RENDER, function () {
  const haveRead = document.getElementById('completeBookshelfList');
  const haventRead = document.getElementById('incompleteBookshelfList');

  haveRead.innerHTML = '';
  haventRead.innerHTML = '';

  for (const book of bookshelf) {
    const bookshelfElement = makeList(book);
    if (book.isComplete) {
      haveRead.append(bookshelfElement);
    }
    else {
      haventRead.append(bookshelfElement);
    }
  }
});


function showUserName(showName) {
  const nameBox = document.getElementById('name-show');
  const addName = document.createElement('p');
  addName.innerText = "Hello " + showName + ",";
  nameBox.append(addName);

}

document.addEventListener('DOMContentLoaded', function () {

  const submitBook = document.getElementById('inputBook');
  const submitSearch = document.getElementById('searchBook');

  let namePrompt = prompt('Please Enter Your Name Here...');
  showUserName(namePrompt);

  submitSearch.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });
  submitBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExists()) {
    loadDataFromStorage();
  }
});

function searchBook() {

  const userSearched = document.getElementById('searchBookTitle').value;
  const bookLists = document.querySelectorAll('.book_item  h3');

  for (const book of bookLists) {
    const findTitle = userSearched.toLowerCase();
    if (book.innerText.toLowerCase().includes(findTitle)) {
      book.parentElement.style.display = "block";
    } else {
      book.parentElement.style.display = "none";
    }

  }
}



function saveBook() {
  if (isStorageExists()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}


document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});



function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data != null) {
    for (const book of data) {
      bookshelf.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER));
}
