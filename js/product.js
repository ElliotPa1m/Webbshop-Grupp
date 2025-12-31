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
            <article class="product-card product-gallery">
                <div class="main-image">
                    <img src="${normalized.images[0]}" alt="${normalized.title}">
                </div>
                <div class="thumbnail-row">
                    ${normalized.images.map((src, index) => `
                        <button class="thumbnail${index === 0 ? " is-active" : ""}" data-index="${index}" aria-label="Välj bild ${index + 1}">
                            <img src="${src}" alt="${normalized.title} bild ${index + 1}">
                        </button>
                    `).join("")}
                </div>
            </article>
            <aside class="product-card product-info">
                <p class="product-category">${normalized.category}</p>
                <h1 class="product-title">${normalized.title}</h1>
                <div class="rating-row" aria-label="Betyg ${normalized.rating} av 5">
                    <span class="stars">${renderStars(normalized.rating)}</span>
                    <span class="rating-text">${normalized.rating.toFixed(1)} / 5 - ${normalized.reviewCount} recensioner</span>
                </div>
                <div class="price-card">
                    <p class="price-tag">${normalized.price} kr</p>
                    <button class="add-to-cart" type="button">Lägg till i varukorg</button>
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

    wireUpThumbnails(container);
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

    const images = Array.isArray(product.images) && product.images.length
        ? product.images
        : [product.image, product.image, product.image].filter(Boolean);

    const uniqueImages = images.filter(Boolean);
    const paddedImages = uniqueImages.length >= 3
        ? uniqueImages.slice(0, 3)
        : [...uniqueImages, ...Array(Math.max(0, 3 - uniqueImages.length)).fill(uniqueImages[0] || "./img/pixelhuset.png")];

    return {
        title,
        category,
        rating: typeof product.rating === "number" ? product.rating : 4.2,
        reviewCount: product.reviewCount || 2341,
        price: product.onSalePrice || product.price || "N/A",
        description: product.description || fallbackDescription,
        requirements: product.requirements || defaultRequirements,
        images: [paddedImages[0], ...paddedImages.slice(0, 3)]
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

function wireUpThumbnails(container) {
    const mainImg = container.querySelector(".main-image img");
    const thumbnails = container.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            const img = thumb.querySelector("img");
            if (img && mainImg) {
                mainImg.src = img.src;
                thumbnails.forEach((btn) => btn.classList.remove("is-active"));
                thumb.classList.add("is-active");
            }
        });
    });
}

