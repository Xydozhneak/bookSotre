const bookContainer = document.getElementById("book-container");
const searchButton = document.querySelector("#searchButton");
const searchArea = document.querySelector("#search");

const API = "https://www.googleapis.com/books/v1/volumes?q=programming"; 

function getBooks(Url) {
    return fetch(Url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .catch(error => {
            bookContainer.innerHTML = `<p>ERROR ${ERROR} </p>`;
            console.error("ERROR", error);
        });
}

getBooks(API)
    .then(data => {
        if (data.items && data.items.length > 0) {
            displayAllBooks(data.items);
        } else {
            alert("Books not found");
        }
        searchButton.addEventListener("click", () => {
            const searchTerm = searchArea.value.trim().toLowerCase(); 
        
            if (searchTerm === "") {
                bookContainer.innerHTML = "";
                displayAllBooks(data.items);
            } else {
                const foundBooks = searchBook(data, searchTerm);
                if (foundBooks.length > 0) {
                    bookContainer.innerHTML = ""; 
                    foundBooks.forEach((book) => {
                        const card = createCard(book.volumeInfo);
                        bookContainer.append(card);
                    });
                } else {
                    bookContainer.innerHTML = `<p>${searchTerm} not found</p>`;
                }
            }
        });
    })
    .catch((error) => {
        bookContainer.innerHTML = `<p>${error.message}</p>`;
        console.error("ERROR", error);
    });

function createCard(bookInfo){
    const title = bookInfo.title;
    const authors = bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown Author";
    const coverUrl = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : "BOOK COVER";
    const descriptionOfBook = bookInfo.description || "Empty"; 

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthors = document.createElement("p");
    bookAuthors.innerText = authors;

    const description = document.createElement("span");
    description.innerText = descriptionOfBook;

    const bookCover = document.createElement("img");
    bookCover.src = coverUrl;

    const bookDiscription = document.createElement("div");
    bookDiscription.classList.add("bookDescription"); 
    bookDiscription.append(bookTitle, bookAuthors, description);

    const bookCard = document.createElement("div");
    bookCard.classList.add("card");
    bookCard.prepend(bookCover, bookDiscription);

    return bookCard;
}

function searchBook(data, name) {
    const foundBook = data.items.filter((book) => {
        const bookInfo = book.volumeInfo;
        const title = bookInfo.title.toLowerCase();
        const authors = bookInfo.authors ? bookInfo.authors.join(", ").toLowerCase() : "";

        return title.includes(name.toLowerCase()) || authors.includes(name.toLowerCase());
    });
    return foundBook;
}

function displayAllBooks(books) {
    books.forEach((book) => {
        const card = createCard(book.volumeInfo);
        bookContainer.append(card);
    });
}
