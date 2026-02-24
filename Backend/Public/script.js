const form = document.querySelector("#form");
const cardContainer = document.querySelector(".grid-container");
const search = document.querySelector(".search");
const MovieList = JSON.parse(localStorage.getItem("movie"));
let editIndex = null;

//method for searchMovie
const searchMovie = (e) => {
  const userInput = e.target.value.toLowerCase();
  const filteredData = MovieList.filter(
    (value) =>
      value.moviename.toLowerCase().includes(userInput) ||
      value.category.toLowerCase().includes(userInput)
  );
  displayMovie(filteredData)
};

//method for edit moviee
const editMovie = (index) => {
  
  const selectedItem = MovieList[index];
  form.children[0].value = selectedItem?.moviename;
  form.children[1].value = selectedItem?.category;
  form.children[2].value = selectedItem?.rating;
  editIndex = index;
};

//method for delete moviee
const deleteMovie = (index) => {
  MovieList.splice(index, 1);
  setupLocalstorage(MovieList);
  displayMovie(MovieList);
};

//method for display Movie
const displayMovie = (MovieList) => {
  cardContainer.innerHTML = "";
  MovieList.forEach((element, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = element["moviename"];

    const h4 = document.createElement("h4");
    h4.textContent = element["category"];

    const p = document.createElement("p");
    p.textContent = `⭐ ${element["rating"]}/10`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add('delete')

    //function evoke for delete
    deleteButton.addEventListener("click", () => {
      deleteMovie(index);
    });

    //function evoke for update
    editButton.addEventListener("click", () => {
      editMovie(index);
    });

    card.append(h2, h4, p, editButton, deleteButton);
    cardContainer.appendChild(card);
  });
};

//method for localstorage setup
const setupLocalstorage = (MovieList) => {
  localStorage.setItem("movie", JSON.stringify(MovieList));
  displayMovie(MovieList);
};

//method for data validation
const Validate = () => {
  return form.children[0].value !== "" &&
    form.children[1].value !== "" &&
    form.children[2].value !== ""
    ? true
    : false;
};

//method for exxtract data
const extractData = (e) => {
  e.preventDefault();
  if (!Validate()) {
    alert("All fields required");
    return;
  }
  const DataFromForm = new FormData(form);
  const formEntries = Object.fromEntries(DataFromForm);
  if (editIndex !==null ) {
    MovieList[editIndex] = formEntries;
    editIndex=null
  } else {
    MovieList.push(formEntries);
    console.log('kerri')
  }

  setupLocalstorage(MovieList);
  displayMovie(MovieList);
  form.reset();
};

displayMovie(MovieList);
form.addEventListener("submit", extractData);
search.addEventListener("keyup", searchMovie);