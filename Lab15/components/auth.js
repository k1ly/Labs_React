class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", repeat: ""};
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordRepeat = this.handlePasswordRepeat.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";
    passwordPattern = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$";

    handleEmailChange(e) {
        this.setState({email: e.target.value})
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value})
    }

    handlePasswordRepeat(e) {
        this.setState({repeat: e.target.value})
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let user = {email: this.state.email, password: this.state.password};
        this.props.onSignUp(user);
        alert("Регистрация прошла успешно!");
        this.props.setUser(user);
    }

    render() {
        let isSubmitEnabled = this.state.email && this.state.password ?
            (this.state.email.match(this.emailPattern) && this.state.password.match(this.passwordPattern) && this.state.password == this.state.repeat) : false;
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "calc(100vh - 50px)", textAlign: "center"}}>
            <div style={{width: "30%", border: "3px outset gray", borderRadius: "10px", backgroundColor: "#dff0ff"}}>{React.createElement("form", {onSubmit: this.handleFormSubmit}, <>
                <SignUpEmailInput email={this.state.email} onEmailChange={this.handleEmailChange}/>
                <SignUpPasswordInput password={this.state.password} repeat={this.state.repeat}
                    onPasswordChange={this.handlePasswordChange} onPasswordRepeat={this.handlePasswordRepeat}/>
                <SignUpName/>
                <SignUpGender/>
                <SignUpBirthDate/>
                <PhoneInput/>
                <div><input style={{margin: "10px", backgroundColor: "#91ffa3"}} disabled={!isSubmitEnabled} type="submit" value="Регистрация"/></div></>)}
                <div style={{width: "100%", color: "#3434ee", textAlign: "right", cursor: "pointer"}}>
                    <span onClick={this.props.onSwitchForm}>Уже зарегистрированы? Войдите</span></div>
            </div></div>;
    }
}

function SignUpEmailInput(props) {
    return <div><label>Email<br/><input value={props.email} type="email" onChange={(e) => props.onEmailChange(e)}/></label></div>;
}

function SignUpPasswordInput(props) {
    return <><div><label>Пароль<br/><input value={props.password} type="password" onChange={(e) => props.onPasswordChange(e)}/></label><br/>
        <ProgressBar password={props.password}/></div>
        {props.password === props.repeat ? null : <div style={{color: "red"}}>Пароль не сопадает</div>}
        <div><label>Подтверждение пароля<br/><input value={props.repeat} type="password" onChange={(e) => props.onPasswordRepeat(e)}/></label></div></>;
}

function ProgressBar(props) {
    let progress = 0;
    if(props.password) {
        if(props.password.match("(?=.*\\d)"))
            progress++;
        if(props.password.match("(?=.*[a-z])"))
            progress++;
        if(props.password.match("(?=.*[A-Z])"))
            progress++;
        if(props.password.match(".{8,}"))
            progress++;
    }
    return <progress value={progress} max="4"></progress>;
}

function SignUpName() {
    return <div><label>ФИО<br/><input type="text"/></label></div>;
}

function SignUpGender() {
    return <div>Пол<br/><label><input type="radio" name="gender"/> мужской</label><br/>
                <label><input type="radio" name="gender"/> женский</label></div>;
}

function SignUpBirthDate() {
    let date = new Date();
    let days = Array.from(new Array(31), (x, i) => i + 1);
    let months = Array.from(new Array(12), (x, i) => i + 1);
    let years = Array.from(new Array(date.getFullYear() + 1 - 1970), (x, i) => i + 1970);
    return <div>Дата рождения<br/>
                <label style={{padding: "0 5px"}}><select>{days.map(day => <option key={day} value={day}>{day}</option>)}</select> Число</label>
                <label style={{padding: "0 5px"}}><select>{months.map(month => <option key={month} value={month}>{month}</option>)}</select> Месяц</label>
                <label style={{padding: "0 5px"}}><select>{years.map(year => <option key={year} value={year}>{year}</option>)}</select> Год</label>
            </div>;
}

class PhoneInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedCountry: this.countryArray[0], phone: ""};
        this.handleInput = this.handleInput.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    countryArray = [ {code: ""},
        {name: "Беларусь", code: "+375", pattern: "+375 \d\d \d\d\d-\d\d-\d\d"},
        {name: "Украина", code: "+380", pattern: "+380 \d\d \d\d\d-\d\d-\d\d"},
        {name: "Литва", code: "+370", pattern: "+370 \d\d \d\d\d-\d\d-\d\d"}
    ]

    handleInput(e) {
        let country = this.countryArray.slice(1).filter(country => e.target.value.startsWith(country.code));
        if(country.length > 0 && this.state.phone.length < e.target.value.length) {
            e.target.value = e.target.value.substring(0, country[0].pattern.length);
            for(let i = country[0].code.length; i < country[0].pattern.length; i++) {
                if(country[0].pattern[i] != "\d" && e.target.value[i] != country[0].pattern[i]) {
                    e.target.value = e.target.value.substring(0, i) + country[0].pattern[i] + e.target.value.substring(i);
                }
                else if(country[0].pattern[i] == "\d" && !e.target.value[i].match(/\d/)) {
                    e.target.value = e.target.value.substring(0, i);
                    break;
                }
                if(i == e.target.value.length - 1)
                    break;
            }
        }
        this.setState({selectedCountry: (country.length > 0 ? country[0] : this.countryArray[0]), phone: e.target.value});
    }
    
    handleSelect(e) {
        let country = this.countryArray.filter(country => e.target.value == country.code);
        this.setState({selectedCountry: country.length > 0 ? country[0] : this.countryArray[0], phone: e.target.value});
    }

    render() {
        return <div><label>Телефон<br/><input type="text" value={this.state.phone} onChange={(e) => this.handleInput(e)}/></label><br/>
            <select value={this.state.selectedCountry.code} onChange={(e) => this.handleSelect(e)}>{this.countryArray.map(country =>
            <option key={country.code} value={country.code}>{country.name ? (country.name + " (" + country.code + ")") : null}</option>)}</select>
            </div>;
    }
}

class SignInForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: "", password: ""};
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value})
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value})
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if(this.props.email != "" && this.props.password != "") {
            let user = this.props.users.filter(user => user.email == this.state.email);
            if(user.length > 0 && user[0].password == this.state.password) {
                alert("Вход прошел успешно!");
                this.props.setUser(user[0]);
            }
                else alert("Неверный логин или пароль!");
        }
    }

    render() {
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "calc(100vh - 50px)", textAlign: "center"}}>
            <div style={{width: "30%", border: "3px outset gray", borderRadius: "10px", backgroundColor: "#ffe0d5"}}>{React.createElement("form", {onSubmit: this.handleFormSubmit}, <>
                <div><label>Email<br/><input value={this.state.email} type="email" onChange={this.handleEmailChange}/></label></div>
                <div><label>Пароль<br/><input value={this.state.password} type="password" onChange={this.handlePasswordChange}/></label></div>
                <div><input style={{margin: "10px", backgroundColor: "#91ffa3"}} type="submit" value="Войти"/></div></>)}
                <div style={{width: "100%", color: "#3434ee", textAlign: "right", cursor: "pointer"}}>
                    <span onClick={this.props.onSwitchForm}>Нет аккаунта? Зарегистрируйтесь</span></div>
            </div></div>;
    }
}

class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {signInForm: true}
        this.handleSwitchForm = this.handleSwitchForm.bind(this);
    }

    handleSwitchForm() {
        this.setState(prevState => ({signInForm: !prevState.signInForm}));
    }

    render() {
        return this.state.signInForm ? <SignInForm {...this.props} onSwitchForm={this.handleSwitchForm}/> : <SignUpForm {...this.props} onSwitchForm={this.handleSwitchForm}/>;
    }
}
