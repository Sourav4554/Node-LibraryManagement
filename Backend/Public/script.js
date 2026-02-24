const form = document.querySelector("#form");
const cardContainer = document.querySelector(".grid-container");
const search = document.querySelector(".search");
let MovieList = [];
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
    MovieList = [...data];
    displayMovie(MovieList);
    if (!response.ok) {
      throw Error("server error");
    }
  } catch (error) {
    console.log(error.message);
  }
};
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
const editMovie = (_id) => {
  const selectedItem=MovieList.filter((item)=>item._id===_id)
  console.log(selectedItem)
  form.children[0].value = selectedItem[0]?.moviename;
  form.children[1].value = selectedItem[0]?.category;
  form.children[2].value = selectedItem[0]?.rating;
  editIndex = _id;
};

//method for delete moviee
const deleteMovie = async (_id) => {
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
const displayMovie = (MovieList) => {
  cardContainer.innerHTML = "";
  MovieList.forEach((element) => {
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
    deleteButton.classList.add("delete");

    //function evoke for delete
    deleteButton.addEventListener("click", () => {
      deleteMovie(element._id);
    });

    //function evoke for update
    editButton.addEventListener("click", () => {
      editMovie(element._id);
    });

    card.append(h2, h4, p, editButton, deleteButton);
    cardContainer.appendChild(card);
  });
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
  displayMovie(MovieList);
  await fetchDataFromServer();
  form.reset();
};

//displayMovie(MovieList);
form.addEventListener("submit", extractData);
 search.addEventListener("keyup", searchMovie);
fetchDataFromServer();
