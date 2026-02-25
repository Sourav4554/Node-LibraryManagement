const form = document.querySelector("#form");
const cardContainer = document.querySelector(".grid-container");
const search = document.querySelector(".search");
let BookList = [];
const url = "http://localhost:8000";
let editIndex = null;

//function for fetch data
const fetchDataFromServer = async () => {
  try {
    const response = await fetch(`${url}/fetchData`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    BookList = [...data];
    displayBooks(BookList);
    if (!response.ok) {
      throw Error("server error");
    }
  } catch (error) {
    console.log(error.message);
  }
};
//method for searchMovie
const searchBook = (e) => {
  const userInput = e.target.value.toLowerCase();
  const filteredData = BookList.filter(
    (value) =>
      value.bookname.toLowerCase().includes(userInput) 
  );
  displayBooks(filteredData)
};

//method for edit moviee
const editBook = (_id) => {
  const selectedItem = BookList.find((item) => item._id === _id);

  if (!selectedItem) return;

  const { bookname, author, genre, price, available } = form.elements;

  bookname.value = selectedItem.bookname;
  author.value = selectedItem.author;
  genre.value = selectedItem.genre;
  price.value = selectedItem.price;
  available.checked = selectedItem.available;

  editIndex = _id;

};

//method for delete moviee
const deleteBook = async (_id) => {
  try {
    const response = await fetch(`${url}/delete`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });
    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      await fetchDataFromServer()
    } else {
      throw new Error("server error");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//method for display Movie

  const displayBooks = (bookList) => {
    cardContainer.innerHTML = "";
  
    bookList.forEach((element) => {
      const card = document.createElement("div");
      card.classList.add("card");
  
      const h2 = document.createElement("h2");
      h2.textContent = element.bookname;
  
      const author = document.createElement("h4");
      author.textContent = `Author: ${element.author}`;
  
      const genre = document.createElement("p");
      genre.textContent = `Genre: ${element.genre}`;
  
      const price = document.createElement("p");
      price.textContent = `₹ ${element.price}`;
  
      const availability = document.createElement("p");
      availability.textContent = element.available
        ? "✅ Available"
        : "❌ Not Available";
  
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit");
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete");
  
      deleteButton.addEventListener("click", () => {
        deleteBook(element._id);
      });
  
      editButton.addEventListener("click", () => {
        editBook(element._id);
      });
  
      card.append(
        h2,
        author,
        genre,
        price,
        availability,
        editButton,
        deleteButton
      );
  
      cardContainer.appendChild(card);
    });
  
};



//method for data validation


const Validate = () => {
  const {
    bookname,
    author,
    genre,
    price,
    available
  } = form.elements;

  const bookName = bookname.value.trim();
  const authorName = author.value.trim();
  const bookGenre = genre.value;
  const bookPrice = price.value.trim();
 // const isAvailable = available.checked;

  // Required field validation
  if (!bookName || !authorName || !bookGenre || !bookPrice ) {
    return false;
  }

  // Price must be positive
  if (Number(bookPrice) <= 0) {
    return false;
  }

  return true;
};

//method for exxtract data
const extractData = async (e) => {
  e.preventDefault();
  if (!Validate()) {
    alert("All fields required");
    return;
  }
  const DataFromForm = new FormData(form);
  const formEntries = Object.fromEntries(DataFromForm);
  if (editIndex !== null) {
    console.log('working')
     try {
      const response=await fetch(`${url}/update`,{
      method:'PUT',
      headers:{
      'Content-type':'application/json'
      },
      body:JSON.stringify({editIndex:editIndex,formEntries:formEntries})
      })
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        await fetchDataFromServer()
        editIndex = null;
      } else {
        throw new Error("server error");
      }
     } catch (error) {
      console.log(error.message)
     }
   
  } else {
    try {
      const response = await fetch(`${url}/submit`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formEntries),
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  displayBooks(BookList);
  await fetchDataFromServer();
  form.reset();
};

//displayMovie(MovieList);
form.addEventListener("submit", extractData);
 search.addEventListener("keyup", searchBook);
fetchDataFromServer();
