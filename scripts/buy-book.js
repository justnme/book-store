
let addToCartBtn = document.getElementById("buyButton");
addToCartBtn.addEventListener("click", function() {
    console.log("button pressed buy");

    var bookName = document.getElementById("BookName").innerText;
    var author = document.getElementById("bookAuthor").innerText;
    var imageUrl = document.getElementById("bookImage").src;
    var imageSrc = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    var price = document.getElementById("cost").innerText;

    var bookData = {
        name: bookName,
        author: author,
        imageSrc: imageSrc,
        price: price
    };

    var bookDataString = JSON.stringify(bookData);
    var cookieName = 'cart_' + bookName;

    if (getCookie(cookieName)) {
        alert(`${bookName} is already in your shopping cart!`);
    } else {
        setCookie(cookieName, bookDataString, 30, "Strict");
        alert(`${bookName} was added to your shopping cart!`);
        changeQuantityCart();
    }
});