
let body = document.querySelector('body');

function setCookie(name, value, days, sameSite, userName) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    var cookieString = name + "_" + userName + "=" + (value || "") + expires + "; path=/; SameSite=" + sameSite;
    document.cookie = cookieString;
}


function checkCookieExists(cookieName, userName) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            var cookieValue = cookie.split('=')[1].trim();
            var userData = JSON.parse(cookieValue);
            if (userData.userName === userName) {
                return true;
            }
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


// if necessary
// function cookiesWishListToJs() {
//     let cookies = document.cookie.split(';');
//     let cartItems = [];

//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i].trim();
//         if (cookie.startsWith('wish_')) {
//             let bookName = cookie.substring(5, cookie.indexOf('='));
//             cartItems.push(bookName);
//         }
//     }

//     console.log(cartItems)
    
//     return cartItems;
// }

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=Strict;';
}
function getUserName(cookie) {
    if (!cookie) {
        console.log("Empty cookie string provided.");
        return null;
    }

    try {
        let splitCookie = cookie.split('=');
        let jsonString = splitCookie[1];
        if (!jsonString) {
            console.log("No JSON data found in the cookie string.");
            return null;
        }
        let jsonObject = JSON.parse(jsonString);
        console.log(jsonObject.userName);
        return jsonObject.userName;
    } catch (error) {
        console.log("Error parsing cookie:", error);
        return null;
    }
}
