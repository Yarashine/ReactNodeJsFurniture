import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/productList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://localhost:3001/products';

        // Добавляем фильтрацию по типу продукта
        if (selectedProductType) {
          url += `?productType=${selectedProductType}`;
        }

        // Добавляем сортировку
        if (sortOption) {
          url += `${selectedProductType ? '&' : '?'}sortBy=${sortOption}`;
        }

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    const fetchProductTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/productTypes');
        setProductTypes(response.data);
      } catch (error) {
        console.error('Error fetching product types:', error.message);
      }
    };

    fetchData();
    fetchProductTypes();
  }, [sortOption, selectedProductType]);

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  const handleProductTypeChange = (event) => {
    setSelectedProductType(event.target.value);
  };

  return (
    <div className="container">
      <div className="sort-buttons">
        <button onClick={() => handleSortChange('priceAsc')}>Sort by Price (Asc)</button>
        <button onClick={() => handleSortChange('priceDesc')}>Sort by Price (Desc)</button>

        <select id="productTypeSelect" onChange={handleProductTypeChange} value={selectedProductType}>
          <option value="">All Types</option>
          {productTypes.map((productType) => (
            <option key={productType._id} value={productType._id}>
              {productType.designation}
            </option>
          ))}
        </select>
      </div>

      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id} className="product-item">
            <img src={`${product.productUrl}`} alt={product.model} className="product-image" />
            <Link to={`/products/${product._id}`} className="product-link">
              <p className="product-details">{product.model}</p>
            </Link>
            <p className="product-cost">Price: {product.cost}$</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
