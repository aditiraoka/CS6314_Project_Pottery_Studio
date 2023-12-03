import React, { useState, useEffect } from 'react';

// Non-editable Product card
const ProductDesc = function ({productInfo, buttonFunc, handleInventory}) {
  const deleteProduct = async () => {
    try {
      // Try to update the product with the given ID
      const response = await fetch('http://localhost:5000/dashboard/' + productInfo._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If the update is successful, update the Product card with the updated info
      if (response.ok) {
        // Log the success
        console.log('Product data deleted successfully!');

        // Update the product info
        handleInventory();
      } else { // Otherwise, log the failure and switch back to non-editable mode
        console.error('Failed to delete product');
      }
    } catch (error) { // Log the error if something crashes along the way
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <p>Name: {productInfo.name}</p>
      <p>Desc: {productInfo.description}</p>
      <p>Type: {productInfo.type}</p>
      <p>Count: {productInfo.count}</p>
      <p>Image Path: {productInfo.image.path}</p>
      <p>Image Desc: {productInfo.image.description}</p>
      <button onClick={buttonFunc}>Edit</button>
      <button onClick={deleteProduct}>DELETE</button>
    </div>
  );
}

// Editable Product Card
const ProductEditForm = function ({productInfo, buttonFunc, submitFunc}) {
  // Hook to keep track of the form contents
  const [productData, setProductData] = useState({
    name: productInfo.name,
    description: productInfo.description,
    type: productInfo.type,
    count: productInfo.count,
    imgPath: productInfo.image.path,
    imgDescription: productInfo.image.description,
  });

  // Allows updates to the form fields
  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  // Updates the product on form submission
  const formSubmit = async () => {
    try {
      // Try to update the product with the given ID
      const response = await fetch('http://localhost:5000/dashboard/' + productInfo._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      // If the update is successful, update the Product card with the updated info
      if (response.ok) {
        // Log the success
        console.log('Product data updated successfully!');

        // Create the new product info object
        let newProductInfo = 
        {
          productID: productInfo.productId,
          name: productData.name,
          description: productData.description,
          type: productData.type,
          count: productData.count,
          image:
          { path: productData.imgPath,
            description: productData.imgDescription}
        }

        // Update the product info
        submitFunc(newProductInfo);

        // Switch back to non-editable mode
        buttonFunc();
      } else { // Otherwise, log the failure and switch back to non-editable mode
        console.error('Failed to update product data');
        buttonFunc();
      }
    } catch (error) { // Log the error if something crashes along the way
      console.error('Error:', error);
    }
  }

  // Displays the product form
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" name="name"
          value={productData.name} onChange={handleChange} required />
        <label htmlFor="description">Desc: </label>
        <input type="text" id="description" name="description"
          value={productData.description} onChange={handleChange} required />
        <label htmlFor="type">Type: </label>
        <input type="text" id="type" name="type"
          value={productData.type} onChange={handleChange} required />
        <label htmlFor="count">Count: </label>
        <input type="text" id="count" name="count"
          value={productData.count} onChange={handleChange} required />
        <label htmlFor="imgPath">Image Path: </label>
        <input type="text" id="imgPath" name="imgPath"
          value={productData.imgPath} onChange={handleChange} required />
        <label htmlFor="imgDescription">Image Desc: </label>
        <input type="text" id="imgDescription" name="imgDescription"
          value={productData.imgDescription} onChange={handleChange} required />
        <button onClick={formSubmit}>Save</button>
        <button onClick={buttonFunc}>Cancel</button>
      </form>
    </div>
  );
}

// Editable Product Card
const ProductAddForm = function ({currMaxProdId, handleInventory}) {
  // Hook to keep track of the form contents
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    type: '',
    count: '',
    imgPath: '',
    imgDescription: '',
  });

  // Allows updates to the form fields
  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  // Updates the product on form submission
  const formSubmit = async () => {
    try {
      // Create the object to add to the inventory
      let newProduct = Object.assign({ productId : currMaxProdId + 1 }, productData)
      console.log(newProduct);

      // Try to update the product with the given ID
      const response = await fetch('http://localhost:5000/dashboard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      // If the update is successful, update the Product card with the updated info
      if (response.ok) {
        // Log the success
        console.log('Product data inserted successfully!');

        // Update the inventory info
        handleInventory();
      } else { // Otherwise, log the failure
        console.error('Failed to insert new product');
      }
    } catch (error) { // Log the error if something crashes along the way
      console.error('Error:', error);
    }
  }

  // Displays the product form
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" name="name"
          value={productData.name} onChange={handleChange} required />
        <label htmlFor="description">Desc: </label>
        <input type="text" id="description" name="description"
          value={productData.description} onChange={handleChange} required />
        <label htmlFor="type">Type: </label>
        <input type="text" id="type" name="type"
          value={productData.type} onChange={handleChange} required />
        <label htmlFor="count">Count: </label>
        <input type="text" id="count" name="count"
          value={productData.count} onChange={handleChange} required />
        <label htmlFor="imgPath">Image Path: </label>
        <input type="text" id="imgPath" name="imgPath"
          value={productData.imgPath} onChange={handleChange} required />
        <label htmlFor="imgDescription">Image Desc: </label>
        <input type="text" id="imgDescription" name="imgDescription"
          value={productData.imgDescription} onChange={handleChange} required />
        <button onClick={formSubmit}>Add</button>
      </form>
    </div>
  );
}

// Stores and edits the information for each Product
const Product = function ({productObj, handleInventory}) {
  // Keeps track of when each product card should be editable
  const [editEnabled, setEditable] = useState(false);

  // Toggles the editable state
  const toggleEditable = () => {
    setEditable(!editEnabled);
  }

  // Keeps track of the product information
  const [productInfo, setProductInfo] = useState(productObj);

  // Updates the card product info
  const updateCard = (newProductInfo) => {
    setProductInfo(newProductInfo);
  }

  // Displays the product card
  if (!editEnabled)
  {
    return <ProductDesc productInfo={productInfo} buttonFunc={toggleEditable} handleInventory={handleInventory} />
  }
  else
  {
    return <ProductEditForm productInfo={productInfo} buttonFunc={toggleEditable} submitFunc={updateCard} />
  }
};

// Displays the admin page
function AdminPage() {
  // Hook to keep track of inventory
  const [inventory, setInventory] = useState([]);

  // Hook to keep track of productId
  const [maxProdId, setMaxProdId] = useState(0);

  // Refreshes the inventory
  const refreshInventory = () => {
    // Fetch inventory from MongoDB
    fetch('http://localhost:5000/dashboard')
    .then((response) => response.json())
    .then((data) => {
      // Refresh the inventory
      setInventory(data);

      // Refresh the productId
      let productIds = data.map(product => product.productId);
      setMaxProdId(Math.max(...productIds));
    });
  }

  // Get the current inventory contents when first loading the page
  useEffect(() => refreshInventory, []);

  // Display the admin page
  return (
    <div>
      <h2>Admin Page</h2>
      {inventory.map(product =>
        <Product key={product._id} productObj={product} handleInventory={refreshInventory} />
      )}
      <hr />
      <ProductAddForm currMaxProdId={maxProdId} submitFunc={refreshInventory} />
    </div>
  );
}

export default AdminPage;