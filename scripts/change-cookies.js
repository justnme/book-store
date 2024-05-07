function changeQuantityCart() {
    let cookies = document.cookie.split(';');
    console.log("All cookies:", cookies);
    let userName = document.getElementById("logged_user").innerHTML;
    let cartCookies = cookies.filter(cookie => {
        let [key, value] = cookie.split('=');
        return key.trim().startsWith('cart_') && (
            (value.includes(`"userName":"${userName}"`) ||  value.includes('"userName":"Not logged in"'))
        );
    });
    console.log("Cart cookies:", cartCookies);
    let quantity = cartCookies.length;
  
    let shoppingIdElement = document.getElementById('shoppingId');
    if (shoppingIdElement) {
        shoppingIdElement.textContent = quantity.toString();
    }
  
    console.log(`Number of items in your cart was updated to ${quantity}`);
}
changeQuantityCart();

function changeWishList() {
    let cookies = document.cookie.split(';');
    console.log("All cookies:", cookies);
    let userName = document.getElementById("logged_user").innerHTML;
    let cartCookies = cookies.filter(cookie => {
        let [key, value] = cookie.split('=');
        return key.trim().startsWith('wish_') && (
            (value.includes(`"userName":"${userName}"`) ||  value.includes('"userName":"Not logged in"'))
        );
    });
    console.log("Cart cookies:", cartCookies);
    let quantity = cartCookies.length;
  
    let shoppingIdElement = document.getElementById('wishListId');
    if (shoppingIdElement) {
        shoppingIdElement.textContent = quantity.toString();
    }
  
    console.log(`Number of items in your wish list was updated to ${quantity}`);
}
changeWishList();