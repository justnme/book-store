
let addToCartBtn = document.getElementById("buyButton");
addToCartBtn.addEventListener("click", function() {
    console.log("button pressed buy");

    let bookName = document.getElementById("BookName").innerText;
    let author = document.getElementById("bookAuthor").innerText;
    let imageUrl = document.getElementById("bookImage").src;
    let imageSrc = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    let price = document.getElementById("cost").innerText;
    let userName = document.getElementById("logged_user").innerHTML;

    let bookData = {
        name: bookName,
        author: author,
        imageSrc: imageSrc,
        price: price,
        userName: userName
    };

    let bookDataString = JSON.stringify(bookData);
    let cookieName = 'cart_'  + bookName;

    if (getCookie(cookieName + '_' + userName)) {
        alert(`${bookName} is already in your shopping cart!`);
    } else {
        setCookie(cookieName, bookDataString, 30, "Strict",userName);
        alert(`${bookName} was added to your shopping cart!`);
        changeQuantityCart();
    }
});


let addToWishBtn = document.getElementById("wishButton");
addToWishBtn.addEventListener("click", function() {
    console.log("button pressed wish");

    let bookName = document.getElementById("BookName").innerText;
    let author = document.getElementById("bookAuthor").innerText;
    let imageUrl = document.getElementById("bookImage").src;
    let imageSrc = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    let price = document.getElementById("cost").innerText;
    let userName = document.getElementById("logged_user").innerHTML;

    let bookData = {
        name: bookName,
        author: author,
        imageSrc: imageSrc,
        price: price,
        userName: userName
    };

    let bookDataString = JSON.stringify(bookData);
    let cookieName = 'wish_' + bookName;


    if (getCookie(cookieName + '_' + userName)) {
        alert(`${bookName} is already in your wish list!`);
    } else {
        setCookie(cookieName, bookDataString, 30, "Strict",userName);
        alert(`${bookName} was added to your wish list!`);
        changeWishList();
    }
});

