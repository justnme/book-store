// function addWishList() {
//     cookiesWishListToJs();
// }



function load() {
    let bookInfoArray = document.cookie.split(';');
    let wishCookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith('wish_'));

    let bookList = document.getElementById('bookWishContainer');
    if (bookInfoArray.length === 0 ||
        (bookInfoArray.length === 1 &&
            bookInfoArray[0] === "")) {
        console.log("No saved cookies was found.");
        return;
    }
    bookList.innerHTML = ``;
    let userName = document.getElementById("logged_user").innerHTML;
    for (const bookInfoString of wishCookies) {
        let userCookie = getUserName(bookInfoString);
        if (userCookie == userName || userCookie == "Not logged in") {
            let bookInfoTrimmed = bookInfoString.trim();
            let bookInfo = JSON.parse(bookInfoTrimmed.substring(bookInfoTrimmed.indexOf('=') + 1));
            let imagePath = bookInfo.imageSrc;
            let imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);

            bookList.innerHTML += `
                <div class="book-container">
                    <div>
                    <a href="/book/${bookInfo.name}"><img class="book-image" src="book_images/${imageName}" alt="${bookInfo.name}"> </a>      
                    </div>
                    <div style="width:100%;">
                    <h2 class="book-title">${bookInfo.name}</h2>
                    <p class="book-author">${bookInfo.author}</p>
                    </div>
                    <div style="display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: flex-end;">
                    <p   class="book-price">${bookInfo.price}</p>
                    <button style="margin-top:40px;"  class="btn" id="book-button-${bookInfo.name}"  onclick="removeBook('${bookInfo.name}', '${userName}')">Delete</button>
                    <button class="btn" class="btn" onclick="moveWishBook('${bookInfo.name}','${userName}')">Buy book</button>
                    </div>

                </div>
            `;
        }
        updateTotalPrice();
    }
}
function clearWishList() {
    let cookies = document.cookie.split(';');
    let userName = document.getElementById("logged_user").innerHTML;
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let userCookie = getUserName(bookInfoString);
        if (cookie.startsWith('wish_') && (
            userCookie == userName || 
            userCookie == "Not logged in")) {
            let cookieName = cookie.split('=')[0];
            deleteCookie(cookieName);
        }
    }
    let totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.innerHTML = `0$`;
    load(); updateTotalPrice();
    changeWishList();
}

function updateTotalPrice() {
    let cookies = document.cookie.split(';');
    let totalPrice = 0;
    let userName = document.getElementById("logged_user").innerHTML;

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let userCookie = getUserName(cookie);
        if (cookie.startsWith('wish_') && (
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
    let cookieName = 'wish_' + bookName + '_' + userName;
    deleteCookie(cookieName);
    updateTotalPrice();
    changeWishList();
}


function moveWishBook(cookieName, userName) {
    let name = 'wish_' + cookieName + '_' + userName;
    let cookieValue = getCookie(name);
    let newName = 'cart_' + cookieName;

    setCookie(newName,cookieValue,30,"Strict" ,userName)

    deleteCookie(name);

    updateTotalPrice();
    changeWishList();
    changeQuantityCart();
    load();
}

load();
changeWishList();