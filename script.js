$(document).ready(function () {
  //Jquery Selectors
  const searchForm = $("#search-form");
  const searchInput = $("#search-input");
  const searchButton = $("#search-button");
  const resultDiv = $("#search-result");
  const wordTitle = $("#word-title");
  const phonetic = $("#phonetic");
  const meanings = $("#meanings");
  const errorDiv = $("#error-div");

  //Jquery Event Listeners
  searchInput.on("input", function () {
    const inputValue = $(this).val().trim(); //Jquery DOM Manipulation
    console.log(inputValue)
    console.log($(this).val())
    if (inputValue !== "") {
      searchButton.removeClass().addClass("text-gray-700 text-2xl mr-5"); //Jquery DOM Manipulation
    } else {
      searchButton.removeClass().addClass("hidden text-gray-700 text-2xl mr-5"); //Jquery DOM Manipulation
    }
  });

  //Jquery Event Listeners
  meanings.on("click", ".toggle-meaning", function () {
    console.log("clicked")
    const meaningDiv = $(this).closest(".meaning"); //Jquery DOM Traversing
    const meaningsList = meaningDiv.find("ul"); //Jquery DOM Traversing
    const meaningLabel = meaningDiv.find("h4:contains('Meaning')"); //Jquery DOM Traversing
    const synonymsLabel = meaningDiv.find("h4:contains('Synonyms')"); //Jquery DOM Traversing

    if ($(this).data("toggle") === "hidden") {
      meaningsList.show(300); //Jquery Effects
      meaningLabel.show(300); //Jquery Effects
      synonymsLabel.show(300); //Jquery Effects
      $(this).data("toggle", "visible");
      $(this).text("-"); //Jquery DOM Manipulation
    } else {
      meaningsList.hide(300); //Jquery Effects
      meaningLabel.hide(300); //Jquery Effects
      synonymsLabel.hide(300); //Jquery Effects
      $(this).data("toggle", "hidden");
      $(this).text("+"); //Jquery DOM Manipulation
    }
  });

  //Jquery Form Submit
  searchForm.submit(function (event) {
    event.preventDefault();
    wordTitle.empty(); //Jquery DOM Manipulation
    phonetic.empty(); //Jquery DOM Manipulation
    meanings.empty(); //Jquery DOM Manipulation
    resultDiv.hide(); //Jquery Effects
    errorDiv.hide(); //Jquery Effects
    performSearch();
  });

  function performSearch() {
    const searchWord = searchInput.val(); //Jquery DOM Manipulation
    if (!searchInput.val().trim()) return;
    searchInput.val(""); //Jquery DOM Manipulation

    searchButton.text("Loading...").prop("disabled", true);

    //Jquery AJAX
    $.ajax({
      url: `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`,
      dataType: "json",
      success: function (data) {
        searchButton.html("&#11166;").prop("disabled", false).addClass("hidden");
        console.log(data);

        data = data[0];
        wordTitle.text(data.word); //Jquery DOM Manipulation
        phonetic.text(data.phonetic);  //Jquery DOM Manipulation

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
                <h4 class="text-gray-500 text-base sm:text-lg">Synonyms</h4>
                <ul class="flex flex-wrap">
                  <li class="text-base sm:text-xl font-weight-500 cursor-pointer mr-2">${meaning.synonyms.join(", ")}</li>
                </ul>
              </div>`
              : "";

          const meaningDivHTML = `
                <div class="meaning">
                <div class="flex items-center mt-8 sm:mt-10 ">
                  <span class="italic text-lg sm:text-2xl font-bold mr-5">${meaning.partOfSpeech}</span>
                  <hr class="h-0.5 w-full mt-2 bg-gray-300 border-0"><span class="toggle-meaning text-4xl text-gray-500 cursor-pointer" data-toggle="visible">-</span>
                </div>
                <h4 class="text-gray-500 mt-4 mb-4 sm:mb-6 text-base sm:text-lg">Meaning</h4>
                ${definitionHTML}
                ${synonymsHTML}
                </div>
                `;
          meanings.append(meaningDivHTML); //Jquery DOM Manipulation
        });

        resultDiv.fadeIn(500); //Jquery Effects
      },
      error: function (error) {
        searchButton.html("&#11166;").prop("disabled", false).addClass("hidden");
        console.error("Error:", error);

        if (error.responseJSON && error.responseJSON.title) {
          errorDiv.html(`
            <h1 class="text-xl font-bold mb-6">${error.responseJSON.title}</h1>
            <p class="text-lg text-center text-white-400">${error.responseJSON.message}</p>
          `);
        } else {
          errorDiv.html(`
            <h1 class="text-xl font-bold mb-6">${error.status}</h1>
            <p class="text-lg text-center text-white-400">${error.statusText}</p>
          `);
        }
        errorDiv.fadeIn(500); //Jquery Effects
      },
    });
  }
});
