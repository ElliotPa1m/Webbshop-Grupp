const fallbackDescription = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum erat id libero bibendum, id tristique magna consequat. Mauris quis justo sit amet eros volutpat placerat. Sed gravida cursus tellus, vitae porttitor est pharetra id. Quisque pharetra luctus feugiat.",
    "Donec ac facilisis metus, sed dignissim erat. Integer sagittis purus sed nunc ultrices, vitae faucibus nunc sodales. Nam in bibendum mauris, sit amet varius urna."
].join(" ");

const defaultRequirements = {
    minimum: [
        { label: "OS", value: "Windows 10 64-bit" },
        { label: "CPU", value: "Intel Core i5-8400 / Ryzen 5 2600" },
        { label: "RAM", value: "16 GB" },
        { label: "GPU", value: "NVIDIA GTX 1070 / AMD RX 580" }
    ],
    recommended: [
        { label: "OS", value: "Windows 11 64-bit" },
        { label: "CPU", value: "Intel Core i7-8700K / Ryzen 7 3700X" },
        { label: "RAM", value: "32 GB" },
        { label: "GPU", value: "NVIDIA RTX 3060 / AMD RX 6700 XT" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    renderProductPage();
    loadFooter();
});

function renderProductPage() {
    const container = document.getElementById("product-container");
    if (!container) return;

    const product = resolveProductFromQuery();
    if (!product) {
        container.innerHTML = `
            <article class="product-card">
                <h1 class="product-title">Produkten kunde inte hittas</h1>
                <p class="product-description">Kontrollera att länken är korrekt eller välj en produkt från produktlistan.</p>
            </article>
        `;
        return;
    }

    const normalized = normalizeProduct(product);

    container.innerHTML = `
        <section class="product-grid">
            <article class="product-card product-media">
                <img class="product-image" src="${normalized.image}" alt="${normalized.title}">
            </article>
            <aside class="product-card product-info">
                <div class="product-header-wrapper">
                    <div class="product-heading">
                        <p class="product-genre product-category">${normalized.category}</p>
                        <h1 class="product-title">${normalized.title}</h1>
                    </div>
                    <div class="product-rating" aria-label="Betyg ${normalized.rating} av 5">
                    <span class="fa-rating-row">
                        <span class="fa-rating" style="--rating: ${normalized.rating.toFixed(2)}" aria-label="Betyg: ${normalized.rating.toFixed(1)} av 5">
                            <span class="layer empty" aria-hidden="true">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                            </span>
                            <span class="layer filled" aria-hidden="true">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                            </span>
                        </span>
                        <span class="rating-text">${normalized.rating.toFixed(1)} / 5 – ${normalized.reviewCount} recensioner</span>
                    </span>
                </div>
                </div>
                <div class="price-card">
                    <div class="price-card__price">${normalized.price} kr</div>
                    <button class="price-card__cta" type="button">Lägg till i varukorg</button>
                </div>
            </aside>
        </section>
        <section class="product-sections">
            <article class="product-card">
                <h2 class="section-title">Om spelet</h2>
                <p class="product-description">${normalized.description}</p>
            </article>
            <article class="product-card">
                <h2 class="section-title">Systemkrav</h2>
                <div class="requirements-block">
                    <h4>Minimum</h4>
                    <ul class="requirements-list">
                        ${normalized.requirements.minimum.map(renderRequirement).join("")}
                    </ul>
                </div>
                <div class="requirements-block">
                    <h4>Rekommenderat</h4>
                    <ul class="requirements-list">
                        ${normalized.requirements.recommended.map(renderRequirement).join("")}
                    </ul>
                </div>
            </article>
        </section>
    `;
}

function resolveProductFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    const index = Number(idParam);
    const productSource = (typeof products !== "undefined" && Array.isArray(products))
        ? products
        : (Array.isArray(globalThis.products) ? globalThis.products : null);

    if (!Number.isInteger(index) || !productSource) {
        return null;
    }
    return productSource[index] || null;
}

function normalizeProduct(product) {
    const title = product.title || "Okänt spel";
    const category = product.category || product.genre || "Spel";
    const image = product.image || "./img/pixelhuset.png";

    // Randomize rating and review count on each page load
    const randomRating = (Math.random() * 2 + 3).toFixed(2); // 3.00 - 5.00
    const randomReviews = Math.floor(Math.random() * 4000 + 100); // 100 - 4100

    return {
        title,
        category,
        image,
        rating: typeof product.rating === "number" ? product.rating : Number(randomRating),
        reviewCount: product.reviewCount || randomReviews,
        price: product.onSalePrice || product.price || "N/A",
        description: product.description || fallbackDescription,
        requirements: product.requirements || defaultRequirements
    };
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) stars.push('<i class="fa-solid fa-star"></i>');
        else if (i === fullStars && hasHalf) stars.push('<i class="fa-regular fa-star-half-stroke"></i>');
        else stars.push('<i class="fa-regular fa-star"></i>');
    }
    return stars.join("");
}

function renderRequirement(req) {
    return `
        <li>
            <span class="requirements-label">${req.label}:</span>
            <span>${req.value}</span>
        </li>
    `;
}

async function loadFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;
    try {
        const response = await fetch("footer.html");
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        footer.innerHTML = doc.body.innerHTML;
    } catch (error) {
        footer.textContent = "Kunde inte ladda footern.";
    }
}

