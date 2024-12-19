import React from 'react';
import { Link } from 'react-router-dom';
import AuthButtons from '../components/AuthButtons';
import ProductList from '../components/ProductList';
import axios from 'axios';
import ApiJoke from '../components/ApiJoke';
import ApiDogImage from '../components/ApiDogImage';
import TimeZoneInfo from '../components/TimeZoneInfo';
import Header from '../components/Header';
import './styles/utils.css';

const Home = ({ loggedInUser, onLogout }) => {

  return (
    <div>
      <Header />

      <ProductList />
      <div className='container'>
        {loggedInUser && <Link to="/add-product" className="add-product-link">Add Product</Link>}
      </div>

      {loggedInUser && <ApiJoke />}
      {loggedInUser && <ApiDogImage />}
    </div>
  );
};

export default Home;
