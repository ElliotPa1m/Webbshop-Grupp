// Keep in mind that i've put the configuration for products in config/products_config.js. So if you want to edit the games, their names, their prices or whatever, you can do it in there.

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".product-list");
    const searchInput = document.getElementById("products-list-search");
    
    document.getElementById("filter-sorting-btn").addEventListener("click", handleFilterModal);
    document.getElementById("close-btn").addEventListener("click", handleFilterModal);
    document.getElementById("overlay").addEventListener("click", handleFilterModal)

    function handleFilterModal() {
        const filterModal = document.querySelector(".filter-modal");
        const overlay = document.querySelector(".overlay");
        if (filterModal.classList.contains("open")) {
            overlay.classList.remove("active");
            filterModal.classList.remove("open");
        } else {
            overlay.classList.add("active");
            filterModal.classList.add("open");
        }
    }

    // This is for automatically render / generate all games in the products list.
    products.forEach((product) => {
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
        item.dataset.title = product.title.toLowerCase();

        item.append(title);

        const genre = document.createElement("p");
        genre.textContent = product.genre;

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
        } else {
            price.textContent = `${product.price} kr`
        }

        item.append(price);

        productList.append(item);
    })

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            const listProducts = document.querySelectorAll(".product-item");

            listProducts.forEach((item) => {
                const title = item.dataset.title;

                item.style.display = query && !title.includes(query) ? "none" : "";
            });
        });
    }
});