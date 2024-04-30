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
changeQuantityCart();