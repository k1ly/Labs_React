var cart = JSON.parse(window.sessionStorage.getItem("cart"));

function cartReducer(prevState = cart ? cart : {items: []}, action) {
    switch(action.type) {
        case "ADD_PRODUCT": {
            if(prevState.items.filter(item => item.product == action.product)[0]) {
                let items = [...prevState.items];
                let item = items.filter(item => item.product == action.product)[0];
                items.filter(item => item.product == action.product)[0].quantity = Math.min(action.product.quantity, item.quantity + 1);
                return Object.assign({}, prevState, {items: items});
            }
            else {
                return action.product.quantity > 0 ?
                    Object.assign({}, prevState, {items: [...prevState.items, {product: action.product, quantity: 1}]}) : prevState;
            }
        }
        default:
            return prevState;
    }
}
        
const cartStorage = Redux.createStore(cartReducer);