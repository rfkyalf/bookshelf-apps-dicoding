const form = document.querySelector('form');
const bookList = JSON.parse(localStorage.getItem('bookList')) || [];
const readCardContainer = document.querySelector('.read-card');
const unfinishedCardContainer = document.querySelector('.unfinish-card');
const searchInput = document.querySelector('.search');

function renderBooks(searchTerm = '') {
  readCardContainer.innerHTML = '';
  unfinishedCardContainer.innerHTML = '';

  const filteredBooks = bookList.filter((book) => {
    const bookTitle = book.title.toLowerCase();
    const bookAuthor = book.author.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return (
      bookTitle.includes(searchTermLower) ||
      bookAuthor.includes(searchTermLower)
    );
  });

  filteredBooks.forEach((book) => {
    const card = document.createElement('div');
    card.classList.add('book-card');

    const image = document.createElement('img');
    image.src = 'assets/images/placeholder.png';

    const containerText = document.createElement('div');
    containerText.classList.add('container-text');

    const title = document.createElement('h2');
    title.textContent = book.title;

    const author = document.createElement('h3');
    author.textContent = book.author;

    const year = document.createElement('p');
    year.textContent = book.year;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      const confirmDelete = confirm(
        `Are you sure you want to delete "${book.title}" by ${book.author}?`
      );
      if (confirmDelete) {
        bookList.splice(bookList.indexOf(book), 1);
        localStorage.setItem('bookList', JSON.stringify(bookList));
        renderBooks();
        alert('Successfully deleted!');
      }
    });

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = book.isComplete ? 'Unfinished' : 'Finished';
    toggleBtn.classList.add(book.isComplete ? 'unfinish-btn' : 'finish-btn');
    toggleBtn.addEventListener('click', () => {
      book.isComplete = !book.isComplete;
      localStorage.setItem('bookList', JSON.stringify(bookList));
      renderBooks();
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
      const newTitle = prompt('Enter new title:', book.title);
      const newAuthor = prompt('Enter new author:', book.author);
      const newYear = prompt('Enter new year:', book.year);

      if (newTitle && newAuthor && newYear) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = newYear;
        localStorage.setItem('bookList', JSON.stringify(bookList));
        renderBooks();
      }
    });

    card.appendChild(image);
    card.appendChild(containerText);
    containerText.appendChild(title);
    containerText.appendChild(author);
    containerText.appendChild(year);
    containerText.appendChild(editBtn);
    containerText.appendChild(deleteBtn);
    containerText.appendChild(toggleBtn);

    if (book.isComplete) {
      card.classList.add('book-card-read');
      readCardContainer.appendChild(card);
    } else {
      card.classList.add('book-card-unfinish');
      unfinishedCardContainer.appendChild(card);
    }
  });
}

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value;
  renderBooks(searchTerm);
});

form.addEventListener('submit', (e) => {
  const formData = new FormData(e.target);
  const title = formData.get('title');
  const author = formData.get('author');
  const year = formData.get('year');
  const isCompleteValue = formData.get('isCompleted');
  const isComplete = isCompleteValue === 'true';

  if (title && author && year && isCompleteValue) {
    const book = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };

    bookList.push(book);
    localStorage.setItem('bookList', JSON.stringify(bookList));
    e.target.reset();
    alert('Successfully added!');
  } else {
    alert('Something went wrong! Please try again later.');
  }
});

renderBooks();
