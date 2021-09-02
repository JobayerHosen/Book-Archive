let query;
const getSearchText = (offset = 0) => {
    const searchField = document.getElementById("search-field");

    /*Check Whether search is initiated by input field or next buttton. Next button passes offset*/
    query = !offset ? searchField.value : query;
    const startFrom = offset ? `&offset=${offset}` : "";

    const url = `https://openlibrary.org/search.json?q=${query}${startFrom}`;

    document.getElementById(
        "search-feedback"
    ).innerHTML = `Showing Results for: <span class="fw-bold">${searchField.value}</span>`;
    searchBook(url);

    searchField.value = "";
    togglePlaceHolder(true);
};

const searchBook = (url) => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data) loadSearchResult(data);
            else {
                document.getElementById("status").innerHTML = `<div class="alert alert-danger" role="alert">
                Something Went Wrong! Please Try Again.
              </div>`;
            }
        });
};

const loadSearchResult = (data) => {
    const { docs: results } = data;

    // SHOW STATUS
    const status = document.getElementById("status");
    if (!data.numFound || !data) {
        status.innerHTML = `<div class="alert alert-danger" role="alert">Now Book Found.</div>`;
        togglePlaceHolder(false);
        return;
    }

    status.innerHTML = `<div class="alert alert-success" role="alert">${data.numFound} Books Found. </div>`;

    // SHOW RESULTS
    const searchResultBox = document.getElementById("search-results");
    searchResultBox.innerHTML = "";

    results.forEach((book) => {
        const card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-4";

        const author = book.author_name?.length > 0 ? book.author_name[0] : "Unknown";
        const firstPublished = book.first_publish_year ? `First Published in ${book.first_publish_year}` : "";
        const img = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "cover-placeholder.png";

        card.innerHTML = `
        <div class="card mb-3" style="max-width: 540px">
            <div class="row g-0">
                <div class="col-4">
                    <img src="${img}" class="img-fluid rounded-start" alt="book cover" />
                </div>
                <div class="col-8">
                    <div class="card-body d-flex flex-column justify-content-between h-100">
                        <h5 class="card-title" title="${book.title}">${book.title}</h5>
                        <p class="card-text" title="${book.author_name ? book.author_name.join(" | ") : ""}">
                            Author: ${author}
                        </p>
                        <p class="card-text"><small class="text-muted">${firstPublished}</small></p>
                    </div>
                </div>
            </div>
        </div>
        `;

        searchResultBox.appendChild(card);

        // PREPARE NEXT BUTTON FOR NEXT HUNDRED BOOKS
        if (results.indexOf(book) >= 99) {
            const next = document.getElementById("next");
            next.classList.add("show");
            next.value = parseInt(next.value) + 100;
        }
    });
    togglePlaceHolder(false);
};

const togglePlaceHolder = (loading) => {
    const status = document.getElementById("status");
    const searchResultBox = document.getElementById("search-results");
    const placeholder = document.getElementById("placeholder");
    if (loading) {
        status.innerHTML = "";
        searchResultBox.innerHTML = "";
        placeholder.classList.add("show");
    } else placeholder.classList.remove("show");
};
