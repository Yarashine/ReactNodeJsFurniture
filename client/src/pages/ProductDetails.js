import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import Header from '../components/Header';
import './styles/productDetails.css';

const ProductDetails = ({ loggedInUser }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [author, setAuthor] = useState(null);
  const [productType, setProductType] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);

        const authorId = response.data.user;
        const authorResponse = await axios.get(`http://localhost:3001/users/${authorId}`);
        setAuthor(authorResponse.data.fullName);

        const productTypeId = response.data.productType;

        if (productTypeId) {
          const productTypeResponse = await axios.get(`http://localhost:3001/productTypes/${productTypeId}`);
          
          setProductType(productTypeResponse.data.designation);
        }
      } catch (error) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      history.push('/');
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const isAuthor = loggedInUser && author === loggedInUser.fullName;

  return (
    <div>
      <Header />
      <div className="containerr">
        <img className="product-imagee" alt="Product" src={`${product.productUrl}`} />
        <p className="product-detailsss">Model: {product.model}</p>
        <p className="product-detailsss">Description: {product.description}</p>
        <p className="product-detailsss">Product Type: {productType || 'Unknown'}</p>
        <p className="product-detailsss">Cost: ${product.cost}</p>
        <p className="product-detailsss">Views: {product.viewsCount}</p>
        <p className="product-detailsss">Author: {author || 'Unknown'}</p>

        {isAuthor && (
          <button className="product-detailss" onClick={handleDeleteProduct}>Delete Product</button>
        )}
        {isAuthor && (
          <Link to={`/edit-product/${id}`}>
            <button className="product-detailss">Edit Product</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
