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
    fetchData(`/posts?limit=${perPageCount}`);
});

function createLoading(n) {
    loadingEl.style.display = "grid";
    loadingEl.innerHTML = null;
    Array(n).fill().forEach(() => {
        const div = document.createElement("div");
        div.className = "loading__item";
        div.innerHTML = `
            <div class="loading__image to-left">
            <div class="loading__title to-leftt"></div>
            </div>
            
        `;
        loadingEl.appendChild(div);
    });
}

function createCard(data) {
    data.posts.forEach(post => {
        const divEl = document.createElement("div");
        divEl.className = "card";
        divEl.innerHTML = `
            <div class="card__content">
                <h2>${post.title}</h2>
                <p class="post__body">${post.body}</p>
                <p>Likes: ${post.reactions.likes}, Dislikes: ${post.reactions.dislikes}</p>
                <p>Views: ${post.views}</p>
                <div class="btn__wrapper">
                <button class="post__btn" type="submit">Read more</button>
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
    fetchData(`/posts?limit=${perPageCount}&skip=${offset * perPageCount}`);
});
