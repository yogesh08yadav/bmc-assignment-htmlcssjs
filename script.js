(function () {
  const menu = document.getElementById("menu");
  const menuIcon = document.getElementById("menu-icon");
  const options = document.getElementById("options");
  const showFilter = document.getElementById("show-filter");
  const filters = document.querySelector(".filters");
  const sizeFilters = document.querySelectorAll(".size-filters");
  let customerCards = document.querySelector(".customer-cards");
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const paginationText = document.querySelector(".pagination-text");
  const headerImage = document.querySelector("#header-image");
  const featuredStory = document.querySelector(".featured-story");
  let pageSize = 9;
  let pageCount = 1;

  let handleNavbar = false;
  let handleFilterIcon = false;
  let selectedOptions = [];

  // function to fetch data from api
  async function fetchData() {
    await fetch(`http://localhost:3001/api/content?filter=${selectedOptions}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((res) => {
        customerCards.innerHTML = "";
        // create customer cards dynamically
        res.results.slice(0, pageCount * pageSize).forEach((card) => {
          let cardDiv = document.createElement("div");
          cardDiv.classList.add("customerCard");

          let imageDiv = document.createElement("div");
          imageDiv.classList.add("image");

          let imageTag = document.createElement("img");
          imageTag.src = `https://www.bmc.com${card.headerImage}`;
          imageTag.style.height = "100%";
          imageTag.style.width = "75%";
          imageDiv.appendChild(imageTag);

          let leftDiv = document.createElement("div");
          leftDiv.classList.add("left");

          let cardHeaderDiv = document.createElement("div");
          cardHeaderDiv.classList.add("card-header");
          let h3 = document.createElement("h3");
          h3.innerHTML = "CUSTOMER STORY";

          cardHeaderDiv.appendChild(h3);
          let hrTag = document.createElement("hr");
          cardHeaderDiv.appendChild(hrTag);
          leftDiv.appendChild(cardHeaderDiv);
          let cardContentDiv = document.createElement("div");
          cardContentDiv.classList.add("card-content");
          let line = document.createElement("hr");
          cardContentDiv.appendChild(line);
          let pTag = document.createElement("p");
          pTag.innerHTML = card.description;
          cardContentDiv.appendChild(pTag);
          leftDiv.appendChild(cardContentDiv);

          let footerDiv = document.createElement("div");
          footerDiv.classList.add("footer");
          footerDiv.appendChild(line);

          let iconsDiv = document.createElement("div");
          iconsDiv.classList.add("icons");
          let h2Tag = document.createElement("h2");
          h2Tag.innerHTML = "VIEW";
          iconsDiv.appendChild(h2Tag);
          let iconSpan = document.createElement("span");
          iconSpan.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
          iconsDiv.appendChild(iconSpan);
          footerDiv.appendChild(iconsDiv);

          cardDiv.appendChild(imageDiv);
          cardDiv.appendChild(leftDiv);
          cardDiv.appendChild(footerDiv);

          customerCards.appendChild(cardDiv);

          paginationText.innerHTML = `Showing ${
            pageCount * pageSize > res.results.length
              ? res.results.length
              : pageCount * pageSize
          } of ${res.results.length}`;
        });
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {});
  }
  fetchData();

  // event listener to handle menu icon when screen width is less than 960px
  menu.addEventListener("click", function () {
    handleNavbar = !handleNavbar;
    options.classList.toggle("active");
    updateMenuIcon();
  });

  function updateMenuIcon() {
    menuIcon.style.fontSize = "20";
    if (handleNavbar) {
      menuIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }

  // event listener to handle filter
  showFilter.addEventListener("click", function () {
    handleFilterIcon = !handleFilterIcon;
    filters.classList.toggle("show");
    sizeFilters.forEach((filter) => filter.classList.toggle("show"));
    handleFilterIcon
      ? (showFilter.innerHTML = '<i class="fa-solid fa-minus"></i>')
      : (showFilter.innerHTML = '<i class="fa-solid fa-plus"></i>');
  });

  sizeFilters.forEach((option) => {
    option.addEventListener("click", (e) => {
      let h5Tag = option.querySelector("h5");
      const index = selectedOptions.indexOf(
        h5Tag.innerHTML == "1-999"
          ? "ic-company-size-464811181"
          : h5Tag.innerHTML == "1000-4999"
          ? "ic-company-size-445893740"
          : h5Tag.innerHTML == "5000+" && "ic-company-size-392967821"
      );
      if (index === -1) {
        option.style.borderRight = "5px solid #0058ca";
        selectedOptions.push(
          h5Tag.innerHTML == "1-999"
            ? "ic-company-size-464811181"
            : h5Tag.innerHTML == "1000-4999"
            ? "ic-company-size-445893740"
            : h5Tag.innerHTML == "5000+" && "ic-company-size-392967821"
        );
      } else {
        option.style.borderRight = "";
        selectedOptions.splice(index, 1);
      }
      if (selectedOptions.length > 0) {
        featuredStory.style.display = "none";
      } else {
        featuredStory.style.display = "block";
      }
      fetchData();
    });
  });

  // pagination load more button event listener
  loadMoreBtn.addEventListener("click", () => {
    pageCount++;
    fetchData();
  });

  // to make the page responsive
  window.addEventListener("resize", function () {
    if (window.innerWidth <= 960) {
      customerCards.classList.remove("customer-cards");
      customerCards.classList.add("customer-cards-mobile");
      headerImage.src = "./images/bmc-home-page-right.png";
    } else {
      customerCards.classList.remove("customer-cards-mobile");
      customerCards.classList.add("customer-cards");
      headerImage.src = "./images/bmc-home-page.png";
    }
  });
})();
