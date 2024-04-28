let listbookHTML = document.querySelector('.listbook');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.getElementById('shoppingId');
let body = document.querySelector('body');

function setCookie(name, value, days, sameSite) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    var cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=" + sameSite;
    document.cookie = cookieString;
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

    console.log(cartItems)

    return cartItems;
}


function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=Strict;';}