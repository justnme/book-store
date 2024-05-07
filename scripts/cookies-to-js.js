function cookiesBooksToJs() {
    let cookies = document.cookie.split(';');
    let cartItems = [];
    let userName = document.getElementById("logged_user").innerHTML;

    for (let i = 0; i < cookies.length; i++) {
        let userCookie = getUserName(cookies[i]);
        if (userCookie == userName || userCookie == "Not logged in") {
            let bookInfoTrimmed = cookies[i].trim();
            let bookInfo = JSON.parse(bookInfoTrimmed.substring(bookInfoTrimmed.indexOf('=') + 1));
            console.log(bookInfo.name);

            if (bookInfoTrimmed.startsWith('cart_')) {
                let bookName_cur = bookInfo.name;
                cartItems.push(bookName_cur);
            }   
    }
}

    console.log(cartItems);
    return cartItems;
}


function cookiesWishToJs() {
    let cookies = document.cookie.split(';');
    let cartItems = [];

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('wish_')) {
            let bookName = cookie.substring(5, cookie.indexOf('='));
            cartItems.push(bookName);
        }
    }
    console.log(cartItems)
    return cartItems;
}

