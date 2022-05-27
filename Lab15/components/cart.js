class OrderForm extends React.Component {
    constructor(props) {
        super(props);
        this.lang = new Map();
        this.lang.set("COURIER", "Курьером");
        this.lang.set("MAIL", "По почте");
        this.lang.set("PICKUP", "Самовывоз");
        this.lang.set("CASH", "Наличные");
        this.lang.set("CARD", "Банковская карта");
        this.lang.set("TRANSFER", "Банковский перевод");
        this.state = {isListHidden: true};
        this.handleExpandClick = this.handleExpandClick.bind(this);
    }

    handleExpandClick() {
        this.setState(prevState => ({isListHidden: !prevState.isListHidden}));
    }

    render() {
        let page;
        switch(this.props.progress) {
            case 0: page = <>
                <div style={{width: "100%", height: "calc(100% - 50px)"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "50px"}}><progress value={this.props.progress} max="3"/></div>
                <table style={{margin: "15px", width: "100%"}}><tbody>
                    {this.props.cart.map((item, index) => <tr key={index} >
                        <td><input type="checkbox" checked={!item.isDisabled}
                            onChange={(e) => this.props.onDisableCheck(item.product, !e.target.checked)}/></td>
                        <td>{item.product.name}</td>
                        <td><input type="text" value={item.quantity} pattern="\d+"
                            onChange={(e) => this.props.onQuantityChange(item.product, e.target.value)}/></td>
                        <td><button onClick={(e) => this.props.onRemoveClick(item.product)}>Удалить</button></td>
                    </tr>)}
                </tbody></table>
                </div>
                <div>
                    <button style={{float: "right", margin: "0 120px 0 0", backgroundColor: "gray", color: "white"}}
                        onClick={this.props.onNextStep}>Вперед</button></div>
                </>;
                break;
            case 1: page = <>
                <div style={{width: "100%", height: "calc(100% - 50px)"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "50px"}}><progress value={this.props.progress} max="3"/></div>
                <div style={{padding: "15px"}}>
                    <div>
                        <div style={{width: "100%", textAlign: "center", fontSize: "large"}}>Способ доставки</div>
                        <label><input type="radio" name="delivery" value="COURIER" checked={this.props.delivery == "COURIER"}
                            onChange={(e) => this.props.onDeliveryChange(e.target.value)}/>{this.lang.get("COURIER")}</label><br/>
                        <label><input type="radio" name="delivery" value="MAIL" checked={this.props.delivery == "MAIL"}
                            onChange={(e) => this.props.onDeliveryChange(e.target.value)}/>{this.lang.get("MAIL")}</label><br/>
                        <label><input type="radio" name="delivery" value="PICKUP" checked={this.props.delivery == "PICKUP"}
                            onChange={(e) => this.props.onDeliveryChange(e.target.value)}/>{this.lang.get("PICKUP")}</label>
                    </div>
                    <div>
                        <div style={{fontSize: "large"}}>Адрес доставки</div>
                            <input type="text" value={this.props.address} disabled={this.props.delivery == "PICKUP"}
                                onChange={(e) => this.props.onAddressChange(e.target.value)}/>
                    </div>
                    <div>
                        <div style={{width: "100%", textAlign: "center", fontSize: "large"}}>Способ оплаты</div>
                        <label><input type="radio" name="payment" value="CASH" checked={this.props.payment == "CASH"}
                            onChange={(e) => this.props.onPaymentChange(e.target.value)}/>{this.lang.get("CASH")}</label><br/>
                        <label><input type="radio" name="payment" value="CARD" checked={this.props.payment == "CARD"}
                            onChange={(e) => this.props.onPaymentChange(e.target.value)}/>{this.lang.get("CARD")}</label><br/>
                        <label><input type="radio" name="payment" value="TRANSFER" checked={this.props.payment == "TRANSFER"}
                            onChange={(e) => this.props.onPaymentChange(e.target.value)}/>{this.lang.get("TRANSFER")}</label>
                    </div>
                </div></div>
                <div>
                    <button style={{float: "left", margin: "0 0 0 120px", backgroundColor: "gray", color: "white"}}
                        onClick={this.props.onPrevStep}>Назад</button>
                    <button style={{float: "right", margin: "0 120px 0 0", backgroundColor: "gray", color: "white"}}
                        onClick={this.props.onNextStep}>Вперед</button></div>
                </>;
                break;
            case 2: {
            let price = this.props.cart.filter(item => !item.isDisabled)
                .reduce((sum, item) => sum + item.quantity * Math.round((100 - item.product.discount) / 100 * item.product.price), 0);
            let delivery = this.props.delivery && this.props.delivery != "PICKUP" ?
                (this.props.delivery == "COURIER" ? (price < 200 ? 10 : 0)
                    : this.props.cart.reduce((sum, item) => sum + Math.ceil(item.quantity * item.product.weight / 1000) * 5, 0)) : 0;
            page = <>
                <div style={{width: "100%", height: "calc(100% - 50px)"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "50px"}}><progress value={this.props.progress} max="3"/></div>
                    <div style={{margin: "15px", width: "calc(100% - 30px)", backgroundColor: "#393939", color: "white",
                        textAlign: "center", fontSize: "large", cursor: "pointer"}}
                        onClick={this.handleExpandClick}>{this.state.isListHidden ? "Показать список товаров" : "Свернуть"}</div>
                    {!this.state.isListHidden ? 
                    <table style={{margin: "0 30px", width: "50%"}}><tbody>
                        {this.props.cart.filter(item => !item.isDisabled).map((item, index) => <tr key={index}>
                        <td>{item.product.name}</td><td>x{item.quantity}</td>
                    </tr>)}</tbody></table> : null}
                    <div style={{padding: "15px"}}>
                        <div style={{fontSize: "large"}}>{price}руб. + {delivery}руб. (Доставка)</div>
                        <div style={{fontSize: "large"}}>Итого: {price + delivery}руб.</div>
                        <div>Способ доставки: {this.lang.get(this.props.delivery)}</div>
                        <div>Способ оплаты: {this.lang.get(this.props.payment)}</div>
                        {this.props.address ? <div>Адрес: {this.props.address}</div> : null}
                    </div>
                </div>
                <div>
                    <button style={{float: "left", margin: "0 0 0 120px", backgroundColor: "gray", color: "white"}}
                        onClick={this.props.onPrevStep}>Назад</button>
                    <button style={{float: "right", margin: "0 100px 0 0", backgroundColor: "gray", color: "white"}}>Подтвердить</button></div>
                </>;
                break;
            }
        }
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 50px)"}}>
                <div style={{ width: "40vw", height: "60%", border: "2px outset gray", borderRadius: "10px"}}>
                    {page}
                </div>
            </div>;
    }
}