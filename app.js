const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'bb93eb77a7msh3790acbfbad5669p1d1fbfjsna7a1bb1e566c', // Replace with your RapidAPI Key
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
};

  
  function showLoader() {
    document.getElementById("loader").style.display = "flex";
  }
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }
  
  async function fetchBodyParts() {
    try {
      showLoader();
      const res = await fetch('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', options);
      const parts = await res.json();
      const menu = document.getElementById("bodyPartsMenu");
      parts.forEach(part => {
        const btn = document.createElement("button");
        btn.textContent = part;
        btn.onclick = () => fetchExercisesByPart(part);
        menu.appendChild(btn);
      });
    } catch (err) {
      console.error(err);
    } finally {
      hideLoader();
    }
  }
  
  async function fetchExercisesByPart(part) {
    try {
      showLoader();
      showMain();
      const res = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${part}`, options);
      const data = await res.json();
      displayExercises(data, "exercise-container");
    } catch (err) {
      console.error(err);
    } finally {
      hideLoader();
    }
  }
  
  async function filterBodyWeight() {
    try {
      showLoader();
      showMain();
      const res = await fetch('https://exercisedb.p.rapidapi.com/exercises', options);
      const data = await res.json();
      const filtered = data.filter(ex => ex.equipment.toLowerCase() === "body weight");
      displayExercises(filtered, "exercise-container");
    } catch (err) {
      console.error(err);
    } finally {
      hideLoader();
    }
  }
  
  function displayExercises(exercises, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
  
    if (!exercises || exercises.length === 0) {
      container.innerHTML = "<p>No exercises found.</p>";
      return;
    }
  
    exercises.forEach(ex => {
      const card = document.createElement("div");
      card.className = "exercise";
      card.innerHTML = `
        <h3>${ex.name}</h3>
        <img src="${ex.gifUrl}" alt="${ex.name}">
        <p><strong>Target:</strong> ${ex.target}</p>
        <p><strong>Equipment:</strong> ${ex.equipment}</p>
        <button onclick="saveFavorite('${ex.id}')">❤️ Save</button>
      `;
      container.appendChild(card);
    });
  }
  
  function saveFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Saved to favorites!");
    } else {
      alert("Already saved!");
    }
  }
  
  function deleteFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(favId => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showFavorites();
  }
  
  async function showFavorites() {
    document.getElementById("exercise-container").style.display = "none";
    document.getElementById("favorites-container").style.display = "grid";
    const container = document.getElementById("favorites-container");
    container.innerHTML = "";
  
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorites added yet.</p>";
      return;
    }
  
    for (const id of favorites) {
      try {
        showLoader();
        const res = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, options);
        const ex = await res.json();
        const card = document.createElement("div");
        card.className = "exercise";
        card.innerHTML = `
          <h3>${ex.name}</h3>
          <img src="${ex.gifUrl}" alt="${ex.name}">
          <p><strong>Target:</strong> ${ex.target}</p>
          <p><strong>Equipment:</strong> ${ex.equipment}</p>
          <button onclick="deleteFavorite('${ex.id}')">❌ Remove</button>
        `;
        container.appendChild(card);
      } catch (err) {
        console.error(err);
      } finally {
        hideLoader();
      }
    }
  }
  
  function showMain() {
    document.getElementById("favorites-container").style.display = "none";
    document.getElementById("exercise-container").style.display = "grid";
  }
  
  // Init
  fetchBodyParts();
  filterBodyWeight(); // Load home workouts by default
  