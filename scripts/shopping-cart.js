let listbookHTML = document.querySelector('.listbook');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.getElementById('shoppingId');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');


// iconCart.addEventListener('click', () => {
//     body.classList.toggle('showCart');
// })
// closeCart.addEventListener('click', () => {
//     body.classList.toggle('showCart');
// })

//    listbookHTML.addEventListener('click', (event) => {
//         let positionClick = event.target;
//         if(positionClick.classList.contains('addCart')){
//             let id_book = positionClick.parentElement.dataset.id;
//             addToCart(id_book);
//         }
//     })
const addToCart = (book_id) => {
    let positionThisbookInCart = cart.findIndex((value) => value.book_id == book_id);
    if(cart.length <= 0){
        cart = [{
            book_id: book_id,
            quantity: 1
        }];
    }else if(positionThisbookInCart < 0){
        cart.push({
            book_id: book_id,
            quantity: 1
        });
    }else{
        cart[positionThisbookInCart].quantity = cart[positionThisbookInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let book_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(book_id, type);
    }
})
const changeQuantityCart = (book_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.book_id == book_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}
