import React from 'react';
import AddProductForm from '../components/AddProductForm';
import { useHistory } from 'react-router-dom';

const AddProductPage = () => {
  const history = useHistory();

  const handleAddProduct = (productData) => {
    console.log('Product added:', productData);
    history.push('/'); // После успешного добавления перенаправляем на главную страницу
  };

  return (
    <div>
      <AddProductForm onAddProduct={handleAddProduct} />
    </div>
  );
};

export default AddProductPage;
