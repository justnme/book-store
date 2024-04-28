
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
    console.log("ахуеть" + cartItems)
    return cartItems;

}

function load() {
    let bookInfoArray = document.cookie.split(';'); 
    console.log(bookInfoArray + "start");
    let bookList = document.getElementById('bookListContainer');

    for (const bookInfoString of bookInfoArray) {
        // Удаление пробелов в начале и конце строки
        let bookInfoTrimmed = bookInfoString.trim();
        // Распарсивание строки куки в объект
        let bookInfo = JSON.parse(bookInfoTrimmed.substring(bookInfoTrimmed.indexOf('=') + 1));
        
        bookList.innerHTML += `
            <div class="book-container">
                <h2 class="book-title">${bookInfo.name}</h2>
                <p class="book-author">by ${bookInfo.author}</p>
                <img class="book-image" src="${bookInfo.imageSrc}" alt="${bookInfo.name}">
                <p class="book-price">${bookInfo.price}</p>
            </div>
        `;
    }
}

load();
