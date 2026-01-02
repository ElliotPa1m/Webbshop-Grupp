// Keep in mind that i've put the configuration for products in config/products_config.js. So if you want to edit the games, their names, their prices or whatever, you can do it in there.

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".product-list");
    const searchInput = document.getElementById("products-list-search");
    const sorting = document.getElementById("sorting");
    const categoryFilter = document.getElementById("category-checkboxes");

    // This is for automatically render / generate all games in the products list.
    products.forEach((product, index) => {
        const link = document.createElement("a");
        link.href = `product.html?id=${index}`; // Note: I didnt know what the product page will be named, so this is a placeholder for now. Create a "DOMContentLoaded" and change the product details by the ID from the config.
        link.className = "product-link";

        const item = document.createElement("div");
        item.className = "product-item";

        const imgContainer = document.createElement("div");
        imgContainer.className = "image-container";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;
        imgContainer.append(img);

        item.append(imgContainer);

        const title = document.createElement("h2");
        title.textContent = product.title;
        link.dataset.title = product.title.toLowerCase();

        item.append(title);

        const genre = document.createElement("p");
        genre.textContent = product.genre;
        link.dataset.genre = product.genre;

        item.append(genre);

        const price = document.createElement("span");
        price.className = "price";

        if (product.price && product.onSalePrice) {
            const oldPrice = document.createElement("span");
            oldPrice.className = "old-price";
            oldPrice.textContent = `${product.price} kr`
            price.append(oldPrice);

            const onSalePrice = document.createElement("span");
            onSalePrice.className = "new-price";
            onSalePrice.textContent = `${product.onSalePrice} kr`
            price.append(onSalePrice);
            link.dataset.price = product.onSalePrice;
        } else {
            price.textContent = `${product.price} kr`
            link.dataset.price = product.price;
        }

        item.append(price);
        link.append(item);

        productList.append(link);
    })

    document.getElementById("filter-sorting-btn").addEventListener("click", handleFilterModal);
    document.getElementById("close-btn").addEventListener("click", handleFilterModal);
    document.getElementById("overlay").addEventListener("click", handleFilterModal)

    function handleFilterModal() {
        const filterModal = document.querySelector(".filter-modal");
        const overlay = document.querySelector(".overlay");
        if (filterModal.classList.contains("active")) {
            overlay.classList.remove("active");
            filterModal.classList.remove("active");
        } else {
            overlay.classList.add("active");
            filterModal.classList.add("active");
        }
    }

    sorting.addEventListener("change", () => {
        const value = sorting.value;
        const items = Array.from(productList.querySelectorAll(".product-link"));
        let sortedProducts = [...items];

        if (value === "price-asc") {
            sortedProducts.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
        } else if (value === "price-desc") {
            sortedProducts.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
        } else if (value === "name-asc") {
            sortedProducts.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
        } else if (value === "name-desc") {
            sortedProducts.sort((a, b) => b.dataset.title.localeCompare(a.dataset.title));
        }

        sortedProducts.forEach(item => productList.append(item));
    });

    const categories = [...new Set(products.map(p => p.genre))];
    categories.forEach(category => {
        const label = document.createElement("label");
        label.className = "category-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        checkbox.checked = true;

        const categoryText = document.createElement("span");
        categoryText.textContent = category

        label.append(checkbox);
        label.append(categoryText);
        categoryFilter.append(label);
    });

    const allPrices = products.map(p => p.onSalePrice || p.price);
    const maxPrice = Math.max(...allPrices);
    const priceMinSlider = document.getElementById("price-min");
    const priceMaxSlider = document.getElementById("price-max");
    const priceMinValue = document.getElementById("price-min-value");
    const priceMaxValue = document.getElementById("price-max-value");
    const rangeFill = document.querySelector(".dual-slider .range-fill");

    // I had to add this as it's very problematic with two sliders. It doesnt really handle well when reloading the site, so I had to always put the default values in whenever the user loads the page.
    priceMinSlider.max = maxPrice;
    priceMinSlider.value = 0;
    priceMaxSlider.max = maxPrice;
    priceMaxSlider.value = maxPrice;
    priceMinValue.textContent = "0 kr";
    priceMaxValue.textContent = `${maxPrice} kr`
    updateSliders();

    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const checkedCategories = Array.from(document.querySelectorAll("#category-checkboxes input[type='checkbox']:checked")).map(cb => cb.value);
        const minPrice = parseInt(priceMinSlider.value);
        const maxPrice = parseInt(priceMaxSlider.value);
        const onlyOnSale = document.getElementById("sale-only").checked;

        document.querySelectorAll(".product-link").forEach(item => {
            const titleMatch = !query || item.dataset.title.includes(query);
            const categoryMatch = checkedCategories.includes(item.dataset.genre);
            const price = parseInt(item.dataset.price);
            const priceMatch = price >= minPrice && price <= maxPrice;
            const isOnSale = item.querySelector(".new-price") !== null;
            const saleMatch = !onlyOnSale || isOnSale;

            if (titleMatch && categoryMatch && priceMatch && saleMatch) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    function updateSliders() {
        let min = parseInt(priceMinSlider.value);
        let max = parseInt(priceMaxSlider.value);

        if (min > max) {
            if (document.activeElement === priceMinSlider) {
                priceMaxSlider.value = min;
                max = min;
            } else {
                priceMinSlider.value = max;
                min = max;
            }
        }

        priceMinValue.textContent = `${min} kr`;
        priceMaxValue.textContent = `${max} kr`;

        const minPercent = (min / parseInt(priceMinSlider.max)) * 100;
        const maxPercent = (max / parseInt(priceMaxSlider.max)) * 100;
        rangeFill.style.left = `${minPercent}%`;
        rangeFill.style.width = `${maxPercent - minPercent}%`;

        applyFilters();
    }

    searchInput.addEventListener("input", applyFilters);
    document.querySelectorAll("#category-checkboxes input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", applyFilters);
    });
    document.getElementById("sale-only").addEventListener("change", applyFilters);
    priceMinSlider.addEventListener("input", updateSliders);
    priceMaxSlider.addEventListener("input", updateSliders);
    applyFilters();
});