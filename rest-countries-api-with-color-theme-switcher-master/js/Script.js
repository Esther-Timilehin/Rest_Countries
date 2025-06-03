let countriesBody = document.querySelector(".Countries-Container");
let countriesContainer = document.querySelector(".Countries-Section");
let inputBox = document.querySelector(".input-box");
let inputContainer = document.querySelector(".input-container input");
let filteredInput = document.querySelector(".Filtered-Region");
let countriesSection = document.querySelector(".Rest-Countries-section");
let countriesDetails = document.querySelector(".Countries-details");
let darkMode = document.querySelector(".Dark-Mode");
let darkModePara = document.querySelector(".Dark-Mode-Para");
let header = document.querySelector("header");
let BorderCountries = document.querySelector(".Border-countries");
let countriesSpan = document.querySelector(".countries-text span");
let isDarkMode = false;

async function countriesData() {
  function applyDarkModeToCountryDetails() {
    const detailBox = document.querySelector(".Countries-detail");
    if (detailBox) {
      detailBox.classList.add("Dark-countries-box");
      detailBox.querySelectorAll("span").forEach((span) =>
        span.classList.add("countries-text-dark-span")
      );
    }

    const borderBox = document.querySelector(".Border-countries");
    if (borderBox) {
      borderBox.classList.add("Dark-countries-box");
    }
  }

  darkMode.addEventListener("click", () => {
    isDarkMode = !isDarkMode;

    countriesBody.classList.toggle("Dark-Mode-Body");
    header.classList.toggle("Dark-Mode-header");
    darkModePara.classList.toggle("Dark-Mode-header-para");
    inputContainer.classList.toggle("input-container-dark");
    filteredInput.classList.toggle("dark-filtered-region");

    document.querySelectorAll(".Countries-box").forEach((box) =>
      box.classList.toggle("Dark-countries-box")
    );

    document.querySelectorAll(".countries-text span").forEach((span) =>
      span.classList.toggle("countries-text-dark-span")
    );

    // Reapply to details panel if visible
    applyDarkModeToCountryDetails();
  });

  const response = await fetch("data.json");
  const data = await response.json();

  function renderCountries(countryList) {
    countriesContainer.innerHTML = "";

    countryList.forEach((country) => {
      const result = document.createElement("div");
      result.innerHTML = `
        <div class="Countries-box ${isDarkMode ? "Dark-countries-box" : ""}" data-country="${country.name}">
          <img src="${country.flags.png}" class="flag-img" />
          <div class="countries-text">
            <h3>${country.name}</h3>
            <p>Population: <span>${country.population}</span></p>
            <p>Region: <span>${country.region}</span></p>
            <p>Capital: <span>${country.capital}</span></p>
          </div>
        </div>
      `;
      countriesContainer.appendChild(result);
    });

    if (isDarkMode) {
      document.querySelectorAll(".countries-text span").forEach((span) =>
        span.classList.add("countries-text-dark-span")
      );
    }
  }

  renderCountries(data);

  inputBox.addEventListener("input", () => {
    const value = inputBox.value.trim().toLowerCase();
    const filtered = data.filter((country) =>
      country.name.toLowerCase().includes(value)
    );
    renderCountries(filtered);
  });

  filteredInput.addEventListener("change", () => {
    const value = filteredInput.value;
    const filtered =
      value === "Filter by Region"
        ? data
        : data.filter((country) => country.region.includes(value));
    renderCountries(filtered);
  });

  countriesContainer.addEventListener("click", (e) => {
    const clicked = e.target.closest(".Countries-box");

    if (clicked) {
      const countryName = clicked.dataset.country;
      const country = data.find((c) => c.name === countryName);

      if (country) {
        countriesDetails.innerHTML = "";

        const detailHTML = `
          <div class="Countries-detail">
            <div class="btn-container">
              <button>
                <ion-icon name="arrow-back-outline"></ion-icon>
                <span>Back</span>
              </button>
            </div>
            <img src="${country.flags.svg}" class="flag-img" />
            <div class="Countries-detail-Name">
              <h1>${country.name}</h1>
              <p>Native Name: <span>${country.nativeName}</span></p>
              <p>Population: <span>${country.population}</span></p>
              <p>Region: <span>${country.region}</span></p>
              <p>Sub Region: <span>${country.subregion}</span></p>
              <p>Capital: <span>${country.capital}</span></p>
            </div>
            <div class="Countries-Domain">
              <p>Top Level Domain: <span>${country.topLevelDomain}</span></p>
              <p>Currencies: <span>${country.currencies
                .map((c) => c.name)
                .join(", ")}</span></p>
              <p>Languages: <span>${country.languages
                .map((l) => l.name)
                .join(", ")}</span></p>
            </div>
            ${renderBorders(country.borders)}
          </div>
        `;

        countriesDetails.innerHTML = detailHTML;

        if (isDarkMode) {
          applyDarkModeToCountryDetails();
        }

        countriesSection.style.display = "none";
        countriesDetails.style.display = "block";

        const backBtn = countriesDetails.querySelector(".btn-container button");
        backBtn.addEventListener("click", () => {
          countriesDetails.style.display = "none";
          countriesSection.style.display = "block";
        });
      }
    }
  });

  function renderBorders(borders) {
    if (!borders || borders.length === 0) {
      return `
        <div class="Border-countries">
          <p>Border Countries: Null</p>
        </div>
      `;
    }

    return `
      <div class="Border-countries">
        <p>Border Countries:</p>
        <div class="Border-Button">
          ${borders.map((b) => `<p class="border-tag">${b}</p>`).join("")}
        </div>
      </div>
    `;
  }
}

countriesData();
