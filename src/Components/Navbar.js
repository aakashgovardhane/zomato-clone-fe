import React from 'react';
import './styles/navbar.css'
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: '10px',
        backgroundColor: 'white',
        border: 'solid 2px brown',
        "text-align": "center",
        overflow: "scroll",
        "max-height": "70%"
    }
};

class Navbar extends React.Component {

    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            formModalIsOpen: false,
            caModalIsOpen: false,
            isUserLoggedIn: false,
            user: undefined,
            username: undefined,
            password: undefined,
            mail: undefined,
            number: undefined,
            uname: undefined,
            remeberUser: false,
            cart: [],
            cartModalIsOpen: false,
            subTotal: undefined,
            poname: undefined,
            pomail: undefined,
            poaddress: undefined,
            ponumber: undefined,
            restLoginModalIsOpen: false,
            restPassword: undefined,
            restUsername: undefined,
            isRestLogin : false,
            restName : undefined
        }
    }

    Navigate = () => {
        this.props.history.push("/");
    }

    handleModal = (modalName, value) => {
        this.setState({ [modalName]: value });
        if (modalName == "restLoginModalIsOpen" && value == true) {
            this.setState({ loginModalIsOpen: false })
        }
    }

    responseGoogle = (response) => {
        const { remeberUser } = this.state
        if (response && response.profileObj && response.profileObj.name) {
            console.log(response)
            axios({
                method: 'POST',
                url: 'http://localhost:2000/signup',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    saveuser: {
                        name: response.profileObj.name,
                        socialId: response.googleId,
                        mail: response.profileObj.email,
                        imageUrl: response.profileObj.imageUrl,
                    }
                }
            }).then((res) => {
                const { savedUser } = res.data
                if (savedUser) {
                    window.alert("Acoount Successfully Created");
                    this.setState({ caModalIsOpen: false })
                    if (remeberUser) {
                        localStorage.setItem("socialId", response.profileObj.googleId)
                        localStorage.setItem("userid", savedUser._id)
                    }
                } else {
                    axios({
                        method: 'POST',
                        url: 'http://localhost:2000/login',
                        headers: { 'Content-Type': 'application/json' },
                        data: {
                            user: { socialId: response.profileObj.googleId }
                        }
                    }).then((res) => {
                        this.loginHandle(res.data.loggedInUser)
                    }).catch()
                }
            })
            this.setState({ loginModalIsOpen: false, caModalIsOpen: false, isUserLoggedIn: true, user: response.profileObj });
        } else {
            this.setState({ loginModalIsOpen: false, caModalIsOpen: false, });
        }
    }
    restLogin = () => {
        const { restUsername, restPassword } = this.state;
        const restLogin = {
            username: restUsername,
            password: restPassword
        }
        axios({
            method: 'POST',
            url: 'http://localhost:2000/restLogin',
            headers: { 'Content-Type': 'application/json' },
            data: {
                restLogin: restLogin
            }
        }).then((res) => {
            this.setState({restLoginModalIsOpen:false,isRestLogin:true,restName:res.data.Restaurant.name})
            this.props.history.push(`/restAdminPanel/?restID=${res.data.Restaurant._id}`);
        }).catch()
    }
    login = () => {
        const { username, password } = this.state;
        const socialId = localStorage.getItem('socialId')
        const usernamec = localStorage.getItem("username")
        const passwordc = localStorage.getItem("password")
        let getuser = undefined;
        if (socialId) {
            getuser = {
                socialId: socialId
            }
        } else if (usernamec) {
            getuser = {
                username: usernamec,
                password: passwordc
            }
        }
        else if (username) {
            getuser = {
                username: username,
                password: password
            }
        }
        axios({
            method: 'POST',
            url: 'http://localhost:2000/login',
            headers: { 'Content-Type': 'application/json' },
            data: {
                user: getuser
            }
        }).then((res) => {
            this.loginHandle(res.data.loggedInUser)
        }).catch()
    }
    loginHandle = (user) => {
        const { remeberUser } = this.state
        if (user) {
            if (remeberUser) {
                if (user.username) {
                    localStorage.setItem("username", user.username)
                    localStorage.setItem("password", user.password)
                } else {
                    localStorage.setItem("socialId", user.socialId)
                }
            }
            sessionStorage.setItem("userid", user._id)
            this.setState({ loginModalIsOpen: false, caModalIsOpen: false, isUserLoggedIn: true, user: user });
        }
        else {
            window.alert("Authentication Failed Try Again")
        }
    }
    responseFacebook = (response) => {
        const { remeberUser } = this.state
        if (response && response.name) {
            const fbuser = {
                name: response.name,
                imageUrl: response.picture.data.url,
                socialId: response.id
            }
            axios({
                method: 'POST',
                url: 'http://localhost:2000/signup',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    saveuser: {
                        name: response.name,
                        socialId: response.id,
                        mail: response.email,
                        cart: []
                    }
                }
            }).then((res) => {
                const { savedUser } = res.data
                if (savedUser) {
                    window.alert("Acoount Successfully Created");
                    this.setState({ caModalIsOpen: false })
                }
            })
            if (remeberUser) {
                localStorage.setItem("uname", fbuser.name)
                localStorage.setItem("imageUrl", fbuser.imageUrl)
            }
            this.setState({ loginModalIsOpen: false, caModalIsOpen: false, isUserLoggedIn: true, user: fbuser, uname: response.name, imageUrl: response.picture.data.url });
        }
        else {
            this.setState({ loginModalIsOpen: false, caModalIsOpen: false, });
        }
    }

    handleLogout = (value) => {
        this.setState({ [value]: false, user: undefined,restName:undefined})
        if(value=="isRestLogin")
        {
            this.props.history.push('/')
        }
        localStorage.clear();
    }
    ca = () => {
        const { uname, number, mail, username, password } = this.state;
        console.log(this.state)
        const saveuser = {
            name: uname,
            number: number,
            mail: mail,
            username: username,
            password: password,
            cart: []
        }
        axios({
            method: 'POST',
            url: 'http://localhost:2000/signup',
            headers: { 'Content-Type': 'application/json' },
            data: {
                saveuser: saveuser
            }
        }).then((res) => {
            const { savedUser } = res.data
            if (savedUser) {
                window.alert("Acoount Successfully Created");
                this.setState({ caModalIsOpen: false })
            } else {
                window.alert("User Already Exist");
            }
        }).catch(err => {
            window.alert("Error");
            this.setState({ caModalIsOpen: false })
        })
    }
    cart = (state, value) => {
        const { user, cart, subTotal } = this.state;
        this.setState({ [state]: value })
        let total = 0;
        if (state == 'cartModalIsOpen' && value == true) {
            this.setState({ cart: [] })
            axios({
                url: "http://localhost:2000/getuser",
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    "userId": user._id
                }
            }).then(
                result => {
                    if (result.data.user.cart.length == 0) {
                        this.setState({
                            cart: [],
                        })
                    } else {
                        result.data.user.cart.map((item) => {
                            total += item.qty * item.price;
                        })
                        this.setState({ cart: [...result.data.user.cart], subTotal: total })
                    }
                }
            )
        } else if (state == 'formModalIsOpen' && value == true) {
            this.setState({ poname: user.name, pomail: user.mail, cartModalIsOpen: false })

        }
    }
    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.cart];
        const item = items[index];

        if (operationType == 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ cart: items, subTotal: total });
    }
    updateCart = () => {
        const { cart, subTotal, user } = this.state
        if (subTotal > 0) {
            const filtered = cart.filter(item => {
                return item.qty > 0;
            });
            axios({
                url: "http://localhost:2000/cart",
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    "userId": user._id,
                    "cart": filtered
                }
            }).then(
                result => {
                    if (result.data.updated) {
                        this.cart("cartModalIsOpen", true)
                    }
                }
            )
        } else {
            axios({
                url: "http://localhost:2000/cart",
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    "userId": user._id,
                    "cart": []
                }
            }).then(
                result => {
                    if (result.data.updated) {
                        this.cart("cartModalIsOpen", false)
                    }
                }
            )
        }
    }
    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:2000/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    makePayment = (e) => {
        const { subTotal, pomail, poname, poaddress, ponumber, cart,user } = this.state
        axios({
            method: 'POST',
            url: 'http://localhost:2000/placeOrder',
            headers: { 'Content-Type': 'application/json' },
            data: {
                placedOrder: cart.map(item=>{return {
                    address : poaddress,
                    username:poname,
                    number:ponumber,
                    name:item.name,
                    description:item.description,
                    ingredients:item.ingredients,
                    restaurantId:item.restaurantId,
                    image:item.image,
                    price: item.price,
                    qty:item.qty 
                }})
            }
        }).then((res) => {
            axios({
                url: "http://localhost:2000/cart",
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                data: {
                    "userId": user._id,
                    "cart": []
                }
            }).then(
                result => {
                    if (result.data.updated) {
                        this.cart("cartModalIsOpen", true)
                    }
                }
            )
        }).catch(err => {
            window.alert("Error");
            this.setState({ caModalIsOpen: false })
        })
        this.getData({ amount: subTotal, email: pomail }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information);
        })
        e.preventDefault();
    }

    componentDidMount() {
        const username = localStorage.getItem("username")
        const socialId = localStorage.getItem("socialId")
        if (socialId || username) {
            this.login()
        }
    }
    render() {
        const {isRestLogin,restName, subTotal, restLoginModalIsOpen, loginModalIsOpen, caModalIsOpen, user, isUserLoggedIn, remeberUser, cartModalIsOpen, cart, formModalIsOpen, poaddress, pomail, poname, ponumber } = this.state;
        return <>
            <div className="logo-frame-f" onClick={this.Navigate}>
                <div className="logo-text-f">e!</div>
            </div>
            { isUserLoggedIn ? <div className="nav-bar d-flex justify-content-end align-items-center">
                <img src={user.imageUrl} />
                <div className="username">{user.name}
                </div>
                <button onClick={() => this.cart('cartModalIsOpen', true)} className="cart-btn"><i className="fa fa-shopping-cart" aria-hidden="true"></i></button>
                <button className="btn btn-primary button" onClick={()=>this.handleLogout("isUserLoggedIn")}>Logout</button>
            </div> : isRestLogin ? <div className="nav-bar d-flex justify-content-end align-items-center">
                <div className="username m-4">{restName}</div>
                <button className="btn btn-primary button" onClick={()=>this.handleLogout("isRestLogin")}>Logout</button>
            </div> : <div className="nav-bar d-flex justify-content-end align-items-center">
                <button className="btn btn-primary button" onClick={() => this.handleModal("loginModalIsOpen", true)}>Login</button>
                <button className="btn btn-secondary button" onClick={() => this.handleModal("caModalIsOpen", true)}>Create Account</button>
            </div>}
            <Modal
                isOpen={loginModalIsOpen}
                style={customStyles}
            >
                <div>
                    <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.handleModal("loginModalIsOpen", false)}></div>
                    <h1 className="m-4"> Login To Zomato-clone</h1>
                    <div className="container">
                        <label for="uname"><b>Username : </b></label>
                        <input type="text" placeholder="Enter Username" name="uname" required onInput={(event) => this.setState({ username: event.target.value })} />
                        <br />
                        <label for="psw"><b>Password : </b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required onInput={(event) => this.setState({ password: event.target.value })} />
                        <br />
                        <label className="m-2">
                            <input type="checkbox" checked={remeberUser} name="remember" onClick={() => this.setState({ remeberUser: !remeberUser })} /> Remember me
                            </label>  <span className="psw">Forgot <a href="#">password?</a></span><br />
                        <button className="btn btn-primary m-2" onClick={this.login}>Login</button>
                        <button className="m-2 btn btn-primary" onClick={() => this.handleModal("restLoginModalIsOpen", true)}>Restaurant Login</button>
                    </div>
                    <div className="m-2 mt-4 d-block">
                        <GoogleLogin
                            clientId="158628766092-dlodk8kjl565ois90tii1i7ufg2k5435.apps.googleusercontent.com"
                            buttonText="Login with Gmail"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                    <div className="m-2">
                        <FacebookLogin
                            appId="1390882807953021"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={caModalIsOpen}
                style={customStyles}
            >
                <div>
                    <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.handleModal('caModalIsOpen', false)}></div>
                    <h1 className="m-4"> Create Zomato-clone Account</h1>
                    <div className="container">
                        <label for="name"><b>Name : </b></label>
                        <input type="text" placeholder="Enter Name" name="name" required onInput={(event) => this.setState({ uname: event.target.value })} />
                        <br />
                        <label for="num"><b>Mobile Number : </b></label>
                        <input type="text" placeholder="Enter Number" name="num" required onInput={(event) => this.setState({ number: event.target.value })} />
                        <br /><label for="mail"><b>Mail : </b></label>
                        <input type="text" placeholder="Enter mail" name="mail" required onInput={(event) => this.setState({ mail: event.target.value })} />
                        <br />
                        <label for="uname"><b>Username : </b></label>
                        <input type="text" placeholder="Enter Username" name="uname" required onInput={(event) => this.setState({ username: event.target.value })} />
                        <br />
                        <label for="psw"><b>Password : </b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required onInput={(event) => this.setState({ password: event.target.value })} />
                        <br />
                        <button className="btn btn-primary btn-block m-2" onClick={this.ca}>Create Account</button>
                    </div>
                    <div className="m-2 mt-4 d-block">
                        <GoogleLogin
                            clientId="158628766092-dlodk8kjl565ois90tii1i7ufg2k5435.apps.googleusercontent.com"
                            buttonText="Login with Gmail"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                    <div className="m-2">
                        <FacebookLogin
                            appId="1390882807953021"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={cartModalIsOpen}
                style={customStyles}
            >
                {cart.length > 0 ? <div >
                    <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.cart('cartModalIsOpen', false)}></div>
                    <h3 className="restaurant-name">Cart</h3>
                    {cart.map((item, index) => {
                        return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                            <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                        <span className="card-body">
                                            <h5 className="item-name">{item.name}</h5>
                                            <h5 className="item-name">&#8377;{item.price}</h5>
                                            <p className="card-text">{item.description}</p>
                                        </span>
                                    </div>
                                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 mt-4"> <img className="card-img-center title-img mb-2" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                        {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                            <div className="add-number"><button className="m-2" onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button className="m-2" onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                    <h3>SubTotal : {subTotal}</h3>
                    <button className="btn btn-danger pay m-3" onClick={this.updateCart}>Update Cart</button>
                    <button className="btn btn-success pay m-3" onClick={() => this.cart('formModalIsOpen', true)}>Place Order</button>
                </div> :
                    <div >
                        <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.cart('cartModalIsOpen', false)}></div>
                        <h1 className="m-5">Cart Is Empty <br /> Add Items To Cart</h1>
                    </div>}
            </Modal>
            <Modal
                isOpen={formModalIsOpen}
                style={customStyles}
            >
                <div className="m-5">
                    <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.cart('formModalIsOpen', false)}></div>
                    <h3 className="restaurant-name">Place Order</h3>
                    <form onSubmit={this.makePayment}>
                        <table>
                            <tr>
                                <td>Name</td>
                                <td><input type="text" value={poname} onChange={(event) => this.handleInputChange(event, 'poname')} required /></td>
                            </tr>
                            <tr>
                                <td>Conatct Number</td>
                                <td><input type="text" value={ponumber} onChange={(event) => this.handleInputChange(event, 'ponumber')} required /></td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td><input type="text" value={poaddress} onChange={(event) => this.handleInputChange(event, 'poaddress')} required /></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input type="text" value={pomail} onChange={(event) => this.handleInputChange(event, 'pomail')} required /></td>
                            </tr>
                        </table>
                        <input type="submit" className="btn btn-danger btn-block mt-4" value="Proceed" />
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={restLoginModalIsOpen}
                style={customStyles}
            >
                <div>
                    <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.handleModal('restLoginModalIsOpen', false)}></div>
                    <h1 className="m-4">Restaurant login</h1>
                    <div className="container">
                        <label for="uname"><b>Username : </b></label>
                        <input type="text" placeholder="Enter Username" name="uname" required onInput={(event) => this.setState({ restUsername: event.target.value })} />
                        <br />
                        <label for="psw"><b>Password : </b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required onInput={(event) => this.setState({ restPassword: event.target.value })} />
                        <br />
                        <button className="btn btn-primary btn-block m-2" onClick={this.restLogin}>Login</button>
                    </div>
                </div>
            </Modal>

        </>
    }
}
export default withRouter(Navbar);;