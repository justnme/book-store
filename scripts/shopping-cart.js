let listbookHTML = document.querySelector('.listbook');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.getElementById('shoppingId');
let body = document.querySelector('body');

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function checkCookieExists(cookieName) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            return true;
        }
    }
    return false;
}

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

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
            setCookie(cookieName, bookDataString, 30);
            alert(`${bookName} was added to your shopping cart!`);
            changeQuantityCart();
        }
    });
    

// const addToCart = (book_id) => {
//     let positionThisbookInCart = cart.findIndex((value) => value.book_id == book_id);
//     if(cart.length <= 0){
//         cart = [{
//             book_id: book_id,
//             quantity: 1
//         }];
//     }else if(positionThisbookInCart < 0){
//         cart.push({
//             book_id: book_id,
//             quantity: 1
//         });
//     }else{
//         cart[positionThisbookInCart].quantity = cart[positionThisbookInCart].quantity + 1;
//     }

//     addCartToHTML();
//     addCartToMemory();
// }





// listCartHTML.addEventListener('click', (event) => {
//     let positionClick = event.target;
//     if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
//         let book_id = positionClick.parentElement.parentElement.dataset.id;
//         let type = 'minus';
//         if(positionClick.classList.contains('plus')){
//             type = 'plus';
//         }
//         changeQuantityCart(book_id, type);
//     }
// })

function changeQuantityCart() {
    let cookies = document.cookie.split(';');
    console.log("All cookies:", cookies);
    let cartCookies = cookies.filter(cookie => cookie.trim().startsWith('cart_'));
    console.log("Cart cookies:", cartCookies);
    let quantity = cartCookies.length;
  
    let shoppingIdElement = document.getElementById('shoppingId');
    if (shoppingIdElement) {
        shoppingIdElement.textContent = quantity.toString();
    }
  
    console.log(`Number of items in cart was updated to ${quantity}`);
}


function cookiesBooksToJs() {
    let cookies = document.cookie.split(';');
    let cartItems = [];

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('cart_')) {
            let bookName = cookie.substring(5, cookie.indexOf('='));
            cartItems.push(bookName);
        }
    }

    return cartItems;
}

