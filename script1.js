document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const resultDiv = document.getElementById("search-result");
  const wordTitle = document.getElementById("word-title");
  const phonetic = document.getElementById("phonetic");
  const meanings = document.getElementById("meanings");
  const errorDiv = document.getElementById("error-div");


  searchInput.addEventListener("input", function () {
    console.log(searchInput.value)
    if (searchInput.value.trim() !== "") {
      searchButton.className = "text-gray-700 text-2xl mr-5";
    } else {
      searchButton.className = "hidden text-gray-700 text-2xl mr-5";
    }
  });


  meanings.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle-meaning")) {
      console.log("clicked");
      const meaningDiv = event.target.closest(".meaning");
      const meaningsList = meaningDiv.querySelectorAll("ul");
      // const meaningLabel = meaningDiv.querySelector("h4:contains('Meaning')"); 
      // const synonymsLabel = meaningDiv.querySelector("h4:contains('Synonyms')"); 
      const meaningLabel = meaningDiv.querySelector("#meaningLabel");
      const synonymsLabel = meaningDiv.querySelector("#synonymsLabel");

      if (event.target.dataset.toggle === "hidden") {
        for (const ul of meaningsList) {
          ul.style.display = "block";
        }
        meaningLabel.style.display = "block";
        if (synonymsLabel)
          synonymsLabel.style.display = "block";
        event.target.dataset.toggle = "visible";
        event.target.textContent = "-";
      } else {
        for (const ul of meaningsList) {
          ul.style.display = "none";
        }
        meaningLabel.style.display = "none";
        if (synonymsLabel)
          synonymsLabel.style.display = "none";
        event.target.dataset.toggle = "hidden";
        event.target.textContent = "+";
      }
    }
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    wordTitle.textContent = "";
    phonetic.textContent = "";
    meanings.textContent = "";
    resultDiv.style.display = "none";
    errorDiv.style.display = "none";
    performSearch();
  });

  function performSearch() {
    const searchWord = searchInput.value;
    if (!searchInput.value.trim()) return;
    searchInput.value = "";
    searchButton.className = "hidden text-gray-700 text-2xl mr-5";

    searchButton.textContent = "Loading...";
    searchButton.disabled = true;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.length) {
          throw {
            status: 404,
            statusText: "No results found",
          };
        }
        searchButton.innerHTML = "&#11166;";
        searchButton.disabled = false;
        console.log(data);

        data = data[0];
        wordTitle.textContent = data.word;
        phonetic.textContent = data.phonetic;

        data.meanings.forEach((meaning) => {
          const definitionHTML = meaning.definitions
            .map((definition) => {
              const exampleHTML = definition.example
                ? `<span class="text-gray-500 mt-2 block">${definition.example}</span>`
                : "";
              return `<ul class="flex flex-col gap-3 ml-4 sm:ml-10 list-disc marker mb-4">
                <li class="text-[15px] sm:text-lg">
                  <span class="block">${definition.definition}</span>
                  ${exampleHTML}
                </li>
              </ul>`;
            })
            .join("");

          const synonymsHTML =
            meaning.synonyms.length > 0
              ? `<div class="flex gap-6 ">
                  <h4 id="synonymsLabel" class="text-gray-500 text-base sm:text-lg">Synonyms</h4>
                  <ul class="flex flex-wrap">
                    <li class="text-base sm:text-xl font-weight-500 cursor-pointer mr-2">${meaning.synonyms.join(
                ", "
              )}</li>
                  </ul>
                </div>`
              : "";

          const meaningDivHTML = `
                <div class="meaning">
                  <div class="flex items-center mt-8 sm:mt-10 ">
                    <span class="italic text-lg sm:text-2xl font-bold mr-5">${meaning.partOfSpeech}</span>
                    <hr class="h-0.5 w-full mt-2 bg-gray-300 border-0"><span class="toggle-meaning text-4xl text-gray-500 cursor-pointer" data-toggle="visible">-</span>
                    </div>
                    <h4 id="meaningLabel" class="text-gray-500 mt-4 mb-4 sm:mb-6 text-base sm:text-lg">Meaning</h4>
                    ${definitionHTML}
                    ${synonymsHTML}
                  </div>
                `;
          meanings.insertAdjacentHTML("beforeend", meaningDivHTML);
        });

        resultDiv.style.display = "block";
      })
      .catch((error) => {
        searchButton.innerHTML = "&#11166;";
        searchButton.disabled = false;
        console.error("Error:", error);

        if (error.responseJSON && error.responseJSON.title) {
          errorDiv.innerHTML = `
              <h1 class="text-xl font-bold mb-6">${error.responseJSON.title}</h1>
              <p class="text-lg text-center text-white-400">${error.responseJSON.message}</p>
            `;
        } else {
          errorDiv.innerHTML = `
              <h1 class="text-xl font-bold mb-6">${error.status}</h1>
              <p class="text-lg text-center text-white-400">${error.statusText}</p>
            `;
        }
        errorDiv.style.display = "block";
      });
  }
});
