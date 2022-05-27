const productArray = [
    {name: "Butter", price: 3.40, quantity: 30,
        image: "https://freight.cargo.site/i/37cc760e6c63a6591e874bd90c14f5c22afc16b227817a37310aedd4b5a04507/free-png-butter-png-images-transparent-butter-png-850_559.png",
        description: "This is very good butter", isNew: false, discount: 50, weight: "200"},
    {name: "Fish", price: 12.80, quantity: 0,
        image: "https://media.istockphoto.com/photos/fresh-fish-picture-id486874340?k=20&m=486874340&s=612x612&w=0&h=k1yoT_NUehTP5GoN7dhGeceMCK5ZrGMaJ6L4Fd7ILAs=",
        description: "This is very good fish", isNew: true, discount: 10, weight: "1200"},
    {name: "Water", price: 10.30, quantity: 11,
        image: "https://media.istockphoto.com/photos/bottle-of-spring-water-picture-id185072125?k=20&m=185072125&s=612x612&w=0&h=QM7Ejzdq_hGjtW6iI8i7Nkm1EW8VuITy4lzikfeaRVE=",
        description: "This is very good water", isNew: false, discount: 0, weight: "500"},
    {name: "Milk", price: 6.10, quantity: 25,
        image: "https://media.istockphoto.com/photos/milk-box-picture-id521855811?k=20&m=521855811&s=612x612&w=0&h=nfc2IF2_zpH5Ei1dAJLzBmyTOb9YAZ7G5tfrY2wB6uE=",
        description: "This is very good milk", isNew: false, discount: 0, weight: "800"},
    {name: "Cheese", price: 15.00, quantity: 14,
        image: "https://media.istockphoto.com/photos/piece-of-cheese-isolated-picture-id500454774?k=20&m=500454774&s=612x612&w=0&h=5Og4NA85MGLyk8QUTZaXwaXus7jdEWP_maTDMLSB9ok=",
        description: "This is very good cheese", isNew: true, discount: 15, weight: "100"}, 
    {name: "Sausage", price: 9.30, quantity: 71,
        image: "https://media.istockphoto.com/photos/cooked-sausage-piled-together-with-a-white-background-picture-id170222471?k=20&m=170222471&s=612x612&w=0&h=Gl8Ea7lRgElGIddLAyiPQWYGPQL9-HCed2NCXVZ_oNw=",
        description: "This is very good sausage", isNew: false, discount: 30, weight: "150"},
    {name: "Chocolate", price: 4.60, quantity: 2,   
        image: "https://media.baamboozle.com/uploads/images/74699/1618534876_48012_url.jpeg",
        description: "This is very good chocolate", isNew: true, discount: 0, weight: "80"}
]

function cartReducer(prevState = [], action) {
    switch(action.type) {
        case "ADD_PRODUCT": {
            if(prevState.filter(item => item.product == action.product)[0]) {
                let cart = [...prevState];
                let item = cart.filter(item => item.product == action.product)[0];
                cart.filter(item => item.product == action.product)[0].quantity = Math.min(action.product.quantity, item.quantity + 1);
                return cart;
            }
            else return action.product.quantity > 0 ? [...prevState, {product: action.product, quantity: 1}] : prevState;
        }
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
        case "CLEAR": {
            return [];
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

function authReducer(prevState = [], action) {
    switch(action.type) {
        case "SIGN_UP": {
            return [...prevState, action.user];
        }
        default:
            return prevState;
    }
}

const shopReducer = Redux.combineReducers({products: () => productArray, users: authReducer, cart: cartReducer,
    progress: progressReducer, delivery: deliveryReducer, address: addressReducer, payment: paymentReducer});

const shopStorage = Redux.createStore(shopReducer);
