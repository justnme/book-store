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
        bookList.innerHTML = ``;
        return;
    }

    console.log(bookInfoArray + "start");


    for (const bookInfoString of wishCookies) {
        let bookInfoTrimmed = bookInfoString.trim();
        let bookInfo = JSON.parse(bookInfoTrimmed.substring(bookInfoTrimmed.indexOf('=') + 1));
        let imagePath = bookInfo.imageSrc;
        let imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);

        bookList.innerHTML += `
                <div class="book-container">
                    <div>
                    <img class="book-image" src="book_images/${imageName}" alt="${bookInfo.name}">           
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
                    <button style="margin-top:120px;"  class="btn" id="book-button-${bookInfo.name}"  onclick="removeBook('${bookInfo.name}')">Delete</button>
                    </div>

                </div>
            `;
    }
    updateTotalPrice();
}

function clearWishList() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('wish_')) {
            let cookieName = cookie.split('=')[0];
            deleteCookie(cookieName);
        }
    }
    let totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.innerHTML = `0$`;
    load();
}

function updateTotalPrice() {
    let cookies = document.cookie.split(';');
    let totalPrice = 0;

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('wish_')) {
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


function removeBook(bookName) {
    let bookElement = document.getElementById(`book-button-${bookName}`).parentNode.parentNode;

    bookElement.remove();
    let cookieName = 'wish_' + bookName;
    deleteCookie(cookieName);
    updateTotalPrice();
    changeWishList();
}


load();
changeWishList();