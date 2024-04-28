let listbookHTML = document.querySelector('.listbook');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.getElementById('shoppingId');
let body = document.querySelector('body');

function checkCookie(name) {
    var cookieValue = getCookie(name);
    return cookieValue !== null;
}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = "cart_" + name + "=" + (value || "") + expires + "; path=/";
    console.log(`Cookie cart_${name} set with value ${value}`);
}


function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

let addToCartBtn = document.getElementById("buyButton");
addToCartBtn.addEventListener("click", function() {
    console.log("button pressed buy")
    var containerId = this.parentElement.parentElement.parentElement.id;

    if (checkCookie(containerId)) {
        alert(`${containerId} is already in your shopping cart!`);
    } else {
        setCookie(containerId, true, 30); 
        alert(`${containerId} was added to your shopping cart!`);
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
