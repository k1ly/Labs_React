class Catalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isModalShown: false, product: {}};
        this.handleSort = this.handleSort.bind(this);
        this.handleProductAddClick = this.handleProductAddClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    handleSort(e) {
        this.setState(prevState => ({attribute: e.target.dataset.name, asc: prevState.asc && prevState.attribute == e.target.dataset.name ? !prevState.asc : true}));
    }

    handleProductAddClick(e) {
        let product = this.props.products.filter(product => product.name == e.target.value)[0];
        this.props.onProductAddClick(product);
        this.setState({isModalShown: true, product: product ? product : {}});
    }

    handleModalClose() {
        this.setState({isModalShown: false, product: {}});
    }

    render() {
        let asc = this.state.asc;
        let comparator;
        switch(this.state.attribute) {
            case "name": comparator = (a, b) => a.name == b.name ? 0 : (asc ? (a.name > b.name ? 1 : -1) : (a.name < b.name ? 1 : -1)); break;
            case "price": comparator = (a, b) => a.price == b.price ? 0 : (asc ? (a.price > b.price ? 1 : -1) : (a.price < b.price ? 1 : -1)); break;
            case "quantity": comparator = (a, b) => a.quantity == b.quantity ? 0 : (asc ? (a.quantity > b.quantity ? 1 : -1) : (a.quantity < b.quantity ? 1 : -1)); break;
            case "discount": comparator = (a, b) => a.discount == b.discount ? 0 : (asc ? (a.discount > b.discount ? 1 : -1) : (a.discount < b.discount ? 1 : -1)); break;
        }
        let products = this.props.products.sort(comparator).sort((a, b) => a.isNew && !b.isNew ? -1 : (!a.isNew && b.isNew ? 1 : 0));
        let sort = asc != undefined ? (<svg style={{width: "10px", height: "10px"}}>
            <polygon points={asc ? "0,10 10,10 5,0" : "0,0 10,0 5,10"} style={{fill: "black"}}/></svg>) : null;
        let header = <div style={{display: "flex", justifyContent: "flex-end", width: "100%"}}><ul className="catalog-header">
            <li data-name="name" style={this.state.attribute == "name" ? {backgroundColor: "rgb(10, 133, 190)", color: "white"} : null}
                onClick={this.handleSort}>Название {this.state.attribute == "name" ? sort : null}</li>
            <li data-name="price" style={this.state.attribute == "price" ? {backgroundColor: "rgb(10, 133, 190)", color: "white"} : null}
                onClick={this.handleSort}>Цена {this.state.attribute == "price" ? sort : null}</li>
            <li data-name="quantity" style={this.state.attribute == "quantity" ? {backgroundColor: "rgb(10, 133, 190)", color: "white"} : null}
                onClick={this.handleSort}>Кол-во {this.state.attribute == "quantity" ? sort : null}</li>
            <li data-name="discount" style={this.state.attribute == "discount" ? {backgroundColor: "rgb(10, 133, 190)", color: "white"} : null}
                onClick={this.handleSort}>Скидка {this.state.attribute == "discount" ? sort : null}</li>
        </ul></div>;
        const createRow = (value, index) => React.createElement("tr", {key: value.name,
            style: {height: "300px", border: index % 2 == 0 ? "solid rgb(236, 236, 236)" : null}}, <>
            <td style={{padding: "0 0 0 10%"}}><div style={{margin: "5px", width: "280px", height: "280px",
                backgroundImage: "url(" + value.image + ")", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
                <div style={{lineHeight: "30px"}}>
                    {value.isNew ? <div style={{display: "inline-block", margin: "5px", width: "100px", backgroundColor: "#b4b4b4", color: "#242424", textAlign: "center"}}>
                        Новинка</div> : null}
                {value.discount > 0 ? <div style={{display: "inline-block", margin: "5px", width: "100px", backgroundColor: "rgb(231, 50, 18)", color: "white", textAlign: "center"}}>
                    {value.discount}%</div> : null}
                </div></div></td>
            <td style={{padding: "0 0 0 10%"}}><div style={{fontSize: "25px", fontWeight: "600"}}>{value.name}</div>
                <div>
                    <div style={{display: "inline-block", fontSize: "20px", fontWeight: "500"}}>{Math.round((100 - value.discount) / 100 * value.price)} руб.</div>
                    {value.discount > 0 ? <div style={{display: "inline-block", margin: "0 10px", color: "#bcbaba", fontSize: "15px", fontWeight: "500", textDecoration: "line-through"}}>
                        {value.price} руб.</div> : null}
                </div>
                <div style={{fontWeight: "700"}}>Количество {value.quantity} шт.</div>
                <div>{value.description}</div>
                <button style={{margin: "100px 0 0 0", borderRadius: "100px", backgroundColor: "green", color: "white"}}
                    value={value.name} onClick={this.handleProductAddClick}>Добавить в корзину</button></td>
        </>);
        let totalQuantity = 0;
        let totalPrice = 0;
        this.props.cart.map(item => {totalQuantity += item.quantity;
            totalPrice += item.quantity * Math.round((100 - item.product.discount) / 100 * item.product.price)});
        return <div style={{display: "flex", justifyContent: "center", padding: "20px"}}><div style={{width: "100%"}}>{header}
            <div style={{display: "flex", justifyContent: "center", padding: "20px"}}>
                {React.createElement("table", {width: "60%"}, <tbody>{products.map(createRow)}</tbody>)}
            </div></div>
            {this.state.isModalShown ? <Modal onModalClose={this.handleModalClose}>
                <div style={{fontSize: "x-large"}}>Товар был успешно добавлен в корзину!</div>
                <table style={{margin: "10px 30px", width: "calc(100% - 60px)", fontSize: "large"}}>
                    <tbody>
                    <tr><td style={{textAlign: "left"}}>Название</td><td style={{textAlign: "right"}}>{this.state.product.name}</td></tr>
                    <tr><td style={{textAlign: "left"}}>Стоимость</td><td style={{textAlign: "right"}}>
                        {Math.round((100 - this.state.product.discount) / 100 * this.state.product.price)} руб.</td></tr>
                    <tr><td style={{textAlign: "left"}}>Кол-во товаров в корзине</td><td style={{textAlign: "right"}}>{totalQuantity}</td></tr>
                    <tr><td style={{textAlign: "left"}}>Суммарная стоимость</td><td style={{textAlign: "right"}}>{totalPrice} руб.</td></tr>
                    </tbody>
                </table>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <ReactRouterDOM.Link style={{padding: "1px 6px", backgroundColor: "rgba(113, 177, 232, 0.5)", color: "white", textDecoration: "none"}}
                        to="/cart">Перейти к оформлению заказа</ReactRouterDOM.Link>
                    <button style={{backgroundColor: "rgb(53, 115, 222)", color: "white"}}
                        onClick={this.handleModalClose}>Продолжить просмотр товаров</button></div>
                </Modal> : null} 
            </div>;
    }
}

class Modal extends React.Component{
    constructor(props) {
        super(props);
        this.handleModalClick = this.handleModalClick.bind(this);
    }

    handleModalClick(e) {
        if(e.target.className == "modal") {
            this.props.onModalClose(e);
        }
    }

    render() {
        return ReactDOM.createPortal(<div className="modal" onClick={this.handleModalClick}>
            <div style={{position: "relative", minWidth: "600px", minHeight: "30%",
                border: "3px solid gray", borderRadius: "20px", backgroundColor: "white", textAlign: "center"}}>
            <div style={{margin: "15px"}}>{this.props.children}</div>
            <div style={{position: "absolute", top: "10px", right: "10px", cursor: "pointer"}} onClick={this.props.onModalClose}>❌</div>
        </div></div>, document.getElementById("modal"));
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchPattern: ""};
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(e) {
        this.setState({searchPattern: e.target.value});
    }

    render() {
        return <><div style={{display: "flex", justifyContent: "center", margin: "10px"}}>
            <input value={this.state.searchPattern} type="text" onChange={this.handleSearchChange}/></div><br/>
            <Catalog {...this.props} products={this.props.products.filter(value => value.name.match(this.state.searchPattern))}/></>;
    }
}
