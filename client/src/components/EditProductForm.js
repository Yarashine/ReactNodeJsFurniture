import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const EditProductForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    model: '',
    cost: '',
    description: '',
    productUrl: '',
    productType: '', 
  });
  const [productTypes, setProductTypes] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
        console.log(id);
      try {
        const productResponse = await axios.get(`http://localhost:3001/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const productTypesResponse = await axios.get('http://localhost:3001/productTypes');
        setFormData({
          model: productResponse.data.model,
          cost: productResponse.data.cost.toString(),
          description: productResponse.data.description,
          productUrl: productResponse.data.productUrl,
          productType: productResponse.data.productType, 
        });
        setProductTypes(productTypesResponse.data);
      } catch (error) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      history.push(`/products/${id}`);
    } catch (error) {
      console.error('Error editing product:', error.message);

      if (error.response && error.response.data) {
        setFormError(error.response.data[0].msg);
      } else {
        setFormError('Error editing product. Please try again.');
      }
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <label className="form-label">
        Model:
        <input
          className="form-input"
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
      </label>

      <label className="form-label">
        Cost:
        <input
          className="form-input"
          type="text"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
        />
      </label>

      <label className="form-label">
        Description:
        <input
          className="form-textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <label className="form-label">
        Product Image URL:
        <input
          className="form-input"
          type="text"
          name="productUrl"
          value={formData.productUrl}
          onChange={handleChange}
        />
      </label>

      <label className="form-label">
        Product Type:
        <select
          className="form-select"
          name="productType"
          value={formData.productType}
          onChange={handleChange}
        >
          {productTypes.map((productType) => (
            <option key={productType._id} value={productType._id}>
              {productType.designation}
            </option>
          ))}
        </select>
      </label>

      <button className="form-button" type="submit">
        Update Product
      </button>

      {formError && <p className="form-error">{formError}</p>}
    </form>
  );
};

export default EditProductForm;
