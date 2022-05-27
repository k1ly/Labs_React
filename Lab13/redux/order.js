var cart = JSON.parse(window.sessionStorage.getItem("cart"));

if(!cart)
    window.location.href = "./index.html";

function cartReducer(prevState = cart.items, action) {
    switch(action.type) {
        case "SET_QUANTITY": {
            if(prevState.filter(item => item.product == action.product)[0]) {
                let cart = [...prevState];
                cart.filter(item => item.product == action.product)[0].quantity
                    = Math.min(cart.filter(item => item.product == action.product)[0].product.quantity,
                    isNaN(action.quantity) || action.quantity < 0 ? 0 : action.quantity);
                return cart;
            }
        }
        case "REMOVE_ITEM": {
            if(prevState.filter(item => item.product == action.product)[0]) {
                let cart = [...prevState];
                cart.splice(cart.indexOf(action.product), 1);
                return cart;
            }
        }
        case "SET_DISABLE": {
            if(prevState.filter(item => item.product == action.product)[0]) {
                let cart = [...prevState];
                cart.filter(item => item.product == action.product)[0].isDisabled = action.isDisabled;
                return cart;
            }
        }
        default: return prevState
    }
}

function progressReducer(prevState = 0, action) {
    switch(action.type) {
        case "NEXT_STEP":
            return prevState + 1;
        case "PREV_STEP":
            return prevState - 1;
        default: return prevState
    }
}
        
function deliveryReducer(prevState = "PICKUP", action) {
    switch(action.type) {
        case "SET_DELIVERY":
            return action.delivery;
        default: return prevState
    }
}

function addressReducer(prevState = "", action) {
    switch(action.type) {
        case "SET_ADDRESS":
            return action.address;
        default: return prevState
    }
}

function paymentReducer(prevState = "CASH", action) {
    switch(action.type) {
        case "SET_PAYMENT":
            return action.payment;
        default: return prevState
    }
}

const orderReducer = Redux.combineReducers({cart: cartReducer,
    progress: progressReducer, delivery: deliveryReducer, address: addressReducer, payment: paymentReducer});

const orderStorage = Redux.createStore(orderReducer);
