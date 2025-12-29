// Keep in mind that i've put the configuration for products in config/products_config.js. So if you want to edit the games, their names, their prices or whatever, you can do it in there.

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".product-list");

    products.forEach((products) => {
        const item = document.createElement("div");
        item.className = "product-item";

        const imgContainer = document.createElement("div");
        imgContainer.className = "image-container";

        const img = document.createElement("img");
        img.src = products.image;
        img.alt = products.title;
        imgContainer.append(img);

        item.append(imgContainer);

        const title = document.createElement("h2");
        title.textContent = products.title;

        item.append(title);

        const genre = document.createElement("p");
        genre.textContent = products.genre;

        item.append(genre);

        const price = document.createElement("span");
        price.className = "price";

        if (products.price && products.onSalePrice) {
            const oldPrice = document.createElement("span");
            oldPrice.className = "old-price";
            oldPrice.textContent = `${products.price} kr`
            price.append(oldPrice);

            const onSalePrice = document.createElement("span");
            onSalePrice.className = "new-price";
            onSalePrice.textContent = `${products.onSalePrice} kr`
            price.append(onSalePrice);
        } else {
            price.textContent = `${products.price} kr`
        }

        item.append(price);

        productList.append(item);
    })
});