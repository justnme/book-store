function buyShoppingCart(){
    // 🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓🐓
        cookiesBooksToJs();
    }
    
    
    
    function load() {
        let bookInfoArray = document.cookie.split(';'); 
        let bookList = document.getElementById('bookListContainer');
        if  (bookInfoArray.length === 0  || 
            (bookInfoArray.length === 1  &&
             bookInfoArray[0]     === "" )) {
            console.log("No saved coockies was found.");
            bookList.innerHTML = ``;
            return; 
        }
        
        console.log(bookInfoArray + "start");
      
    
        for (const bookInfoString of bookInfoArray) {
            let bookInfoTrimmed = bookInfoString.trim();
            let bookInfo = JSON.parse(bookInfoTrimmed.substring(bookInfoTrimmed.indexOf('=') + 1));
        let imagePath = bookInfo.imageSrc;
    let imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    
            bookList.innerHTML += `
                <div class="book-container">
                    <h2 class="book-title">${bookInfo.name}</h2>
                    <p class="book-author">${bookInfo.author}</p>
                    <img class="book-image" src="book_images/${imageName}" alt="${bookInfo.name}">
                    <p class="book-price">${bookInfo.price}</p>
                    <button class="btn" id="book-button-${bookInfo.name}"  onclick="removeBook('${bookInfo.name}')">Remove book</button>
                </div>
            `;
        }
        updateTotalPrice();
    }
    
    function clearShoppingCart() {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith('cart_')) {
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
            if (cookie.startsWith('cart_')) {
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
        let bookElement = document.getElementById(`book-button-${bookName}`).parentNode;
    
        bookElement.remove();
        let cookieName = 'cart_' + bookName;
        deleteCookie(cookieName);
        updateTotalPrice();
    }
    
    
    load();
    changeQuantityCart();