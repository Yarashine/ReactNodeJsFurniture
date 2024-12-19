import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import axios from 'axios';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import News from './pages/News';
import FAQ from './pages/FAQ';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState(null, '', window.location.pathname);
    }
    token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'));

    if (token) {
      axios.get('http://localhost:3001/auth/me', {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then(response => {
          setUser(response.data);
          setLoggedInUser(response.data);
        })
        .catch(error => {
          console.error('Token verification error:', error.message, token);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedInUser(null);
    window.location.reload();
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {loggedInUser ? <Redirect to="/" /> : <Login onLogin={(user) => setLoggedInUser(user)} />}
        </Route>
        <Route path="/register">
          {loggedInUser ? <Redirect to="/" /> : <Register onRegister={(user) => setLoggedInUser(user)} />}
        </Route>

        <Route path="/products/:id" render={() => <ProductDetails loggedInUser={loggedInUser} />} />

        <Route exact path="/add-product" component={AddProduct} />
        <Route exact path="/edit-product/:id" component={EditProduct} />
        <Route path="/news" component={News} />
        <Route path="/faq" component={FAQ} />
        <Route exact path="/">
          <Home loggedInUser={loggedInUser} onLogout={handleLogout} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
