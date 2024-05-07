function buyShoppingCart() {
    cookiesBooksToJs();
}



function load() {
    let bookList = document.getElementById('bookListContainer');
    let cartCookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith('cart_'));

    if (cartCookies.length === 0 ||
        cartCookies.length === 1 &&
        cartCookies[0] === ""
    ) {
        console.log("No saved cookies were found.");
        return;
    }

    bookList.innerHTML = ``;

    console.log(cartCookies + "start");

    let userName = document.getElementById("logged_user").innerHTML;
    for (const cookie of cartCookies) {
        let userCookie = getUserName(cookie);
        // console.log(userCookie + " _user name");
        if(userCookie == userName || userCookie == "Not logged in" ){
        let cookieValue = cookie.split('=')[1];
        let bookInfo = JSON.parse(cookieValue);
        let imagePath = bookInfo.imageSrc;
        let imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);

        bookList.innerHTML += `
            <div class="book-container">
                <div>
                <a href="/book/${bookInfo.name}">  <img class="book-image" src="book_images/${imageName}" alt="${bookInfo.name}"> </a>     
                </div>
                <div style="width:100%;">
                    <h2 class="book-title">${bookInfo.name}</h2>
                    <p class="book-author">${bookInfo.author}</p>
                </div>
                <div style="display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            justify-content: flex-end;">
                    <p class="book-price">${bookInfo.price}</p>
                    <button style="margin-top:120px;" class="btn" id="book-button-${bookInfo.name}" onclick="removeBook('${bookInfo.name}', '${userName}')">Delete</button>
                </div>
            </div>
        `; 
    }
    }
    updateTotalPrice();
}


function clearShoppingCart() {
    let cookies = document.cookie.split(';');
    let userName = document.getElementById("logged_user").innerHTML;
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let userCookie = getUserName(cookie);
        if (cookie.startsWith('cart_') && (
            userCookie == userName || 
            userCookie == "Not logged in")) {
            let cookieName = cookie.split('=')[0];
            deleteCookie(cookieName);
        }
    }
    let totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.innerHTML = `0$`;
    let bookList = document.getElementById('bookListContainer');
    bookList.innerHTML = ``;
    updateTotalPrice();
    changeQuantityCart();
}

function updateTotalPrice() {
    let cookies = document.cookie.split(';');
    let totalPrice = 0;
    let userName = document.getElementById("logged_user").innerHTML;

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let userCookie = getUserName(cookie);
        if (cookie.startsWith('cart_') && (
            userCookie == userName || 
            userCookie == "Not logged in"))  {
            let cookieValue = cookie.split('=')[1];
            let bookInfo = JSON.parse(cookieValue);
            let price = parseFloat(bookInfo.price.replace('$', ''));
            totalPrice += price;
        }
    }

    let totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2) + "$";
    }
}


function removeBook(bookName, userName) {
    let bookElement = document.getElementById(`book-button-${bookName}`).parentNode.parentNode;

    bookElement.remove();
    let cookieName = 'cart_' + bookName + '_' + userName;
    deleteCookie(cookieName);
    updateTotalPrice();
    changeQuantityCart();
}

load();
changeQuantityCart();