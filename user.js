const wrapperEl = document.querySelector(".wrapper");
const loadingEl = document.querySelector(".loading");
const btnSeemore = document.querySelector(".btn__seemore");
const BASE_URL = "https://dummyjson.com";

const perPageCount = 8;
let total = 0;
let offset = 0;

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const data = await response.json();
        createCard(data);
        total = data.total;
    } catch (err) {
        console.log(err);
    } finally {
        loadingEl.style.display = "none";
        btnSeemore.removeAttribute("disabled");
        btnSeemore.textContent = "See more";
    }
}

window.addEventListener("load", () => {
    createLoading(perPageCount);
    fetchData(`/users?limit=${perPageCount}`);
});

function createLoading(n) {
    loadingEl.style.display = "grid";
    loadingEl.innerHTML = null;
    Array(n).fill().forEach(() => {
        const div = document.createElement("div");
        div.className = "loading__item";
        div.innerHTML = `
            <div class="loading__image to-left">
            <div class="loading__user to-leftt"></div>
            <div class="loading__title to-leftt"></div>
            </div>
        `;
        loadingEl.appendChild(div);
    });
}

function createCard(data) {
    data.users.forEach(user => {
        const divEl = document.createElement("div");
        divEl.className = "card";
        divEl.innerHTML = `
            <div class="card__image">
                <img src="${user.image}" alt="user">
            </div>
            <div class="card__content">
                <h1>${user.firstName} ${user.lastName}</h1>
                <p>Age: ${user.age}</p>
                <p>@${user.email}</p>
                <p>${user.address.city}</p>
                <div class="btn__wrapper">
                    <button class="card__btn" type="submit">Message</button>
                </div>
            </div>
        `;
        wrapperEl.appendChild(divEl);    
    });
}

btnSeemore.addEventListener("click", () => {
    btnSeemore.setAttribute("disabled", true);
    btnSeemore.textContent = "Loading...";
    createLoading(perPageCount);
    offset++;
    if (total <= perPageCount + (offset * perPageCount)) {
        btnSeemore.style.display = "none";
    }
    fetchData(`/users?limit=${perPageCount}&skip=${offset * perPageCount}`);
});
