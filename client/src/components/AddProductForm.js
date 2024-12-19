import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles/addForm.css';

const AddProductForm = ({ onAddProduct }) => {
  const [model, setModel] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [productType, setProductType] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  const history = useHistory();
  const [formError, setFormError] = useState('');

  // Получаем доступные типы продуктов
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/productTypes');
        setProductTypes(response.data);
      } catch (error) {
        console.error('Error fetching product types:', error.message);
      }
    };

    fetchProductTypes();
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:3001/products', {
        model,
        cost,
        description,
        productUrl,
        user: localStorage.getItem('userId'),
        productType,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onAddProduct(response.data);

      // Очищаем форму после успешного добавления продукта
      setModel('');
      setCost('');
      setDescription('');
      setProductUrl('');
      setProductType('');

      history.push('/');
    } catch (error) {
      console.error('Error adding product:', error.message);

      if (error.response && error.response.data) {
        setFormError(error.response.data[0].msg);
      } else {
        setFormError('Error adding product. Please try again.');
      }
    }
  };

  return (
    <form className="addform-container" onSubmit={handleSubmit}>
      <label className="addform-label">
        Model:
        <input
          className="addform-input"
          type="text"
          placeholder="Enter product model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
      </label>

      <label className="addform-label">
        Cost:
        <input
          className="addform-input"
          type="number"
          placeholder="Enter product cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
      </label>

      <label className="addform-label">
        Description:
        <textarea
          className="addform-textarea"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label className="addform-label">
        Product Image URL:
        <input
          className="addform-input"
          type="url"
          placeholder="Enter product URL"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          required
        />
      </label>

      <label className="addform-label">
        Product Type:
        <select
          className="addform-select"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          required
        >
          <option value="" disabled>Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.designation}
            </option>
          ))}
        </select>
      </label>

      <button className="addform-button" type="submit">Add Product</button>
      {formError && <p className="addform-error">{formError}</p>}
    </form>
  );
};

export default AddProductForm;
