import ProductModel from '../models/product.js';
import ProductTypeModel from '../models/productType.js';

// Получение всех продуктов
export const getAllProducts = async (req, res) => {
  try {
    const sortOption = req.query.sortBy; 
    const productTypeFilter = req.query.productType; 
    let products;

    const filter = productTypeFilter ? { productType: productTypeFilter } : {};

    if (sortOption === 'priceAsc') {
      products = await ProductModel.find(filter).sort({ cost: 1 }).populate('user').exec();
    } else if (sortOption === 'priceDesc') {
      products = await ProductModel.find(filter).sort({ cost: -1 }).populate('user').exec();
    } else {
      products = await ProductModel.find(filter).populate('user').exec();
    }

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error in getting products',
    });
  }
};

// Удаление продукта
export const removeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Cannot find a product',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error in deleting a product',
    });
  }
};

// Получение одного продукта и увеличение количества просмотров
export const getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Cannot find a product',
      });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error in getting a product',
    });
  }
};

// Создание нового продукта
export const createProduct = async (req, res) => {
  try {
    const doc = new ProductModel({
      model: req.body.model,
      cost: req.body.cost,
      description: req.body.description,
      productUrl: req.body.productUrl,
      user: req.userId,
      productType: req.body.productType,
    });
    console.log(req.body);
    const product = await doc.save();
    res.json(product);
  } catch (err) {
    console.error('Error in adding a product:', err);

    res.status(500).json({
      message: 'Error in adding a product',
      error: err.message, 
    });
  }
};

// Обновление информации о продукте
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await ProductModel.updateOne(
      { _id: productId },
      {
        model: req.body.model,
        cost: req.body.cost,
        description: req.body.description,
        productUrl: req.body.productUrl,
        user: req.userId,
        productType: req.body.productType,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error('Error in editing a product:', err);

    res.status(500).json({
      message: 'Error in editing a product',
      error: err.message, 
    });
  }
};

// Получение типа продукта по ID
export const getProductTypeById = async (req, res) => {
  try {
    const productTypeId = req.params.id;
    const productType = await ProductTypeModel.findById(productTypeId);

    if (!productType) {
      return res.status(404).json({ message: 'Product type not found' });
    }

    res.json(productType);
  } catch (error) {
    console.error('Error fetching product type details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Получение всех типов продуктов
export const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductTypeModel.find();
    res.status(200).json(productTypes);
  } catch (error) {
    console.error('Error fetching product types:', error.message);
    res.status(500).json({ message: 'Error fetching product types' });
  }
};
