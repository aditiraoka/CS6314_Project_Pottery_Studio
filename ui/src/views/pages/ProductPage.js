import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import '../../css/ProductPage.css';
import { CartContext } from '../../context/CartContext'; 


function ProductPage() {
	let { id } = useParams();
	const navigate = useNavigate();
	const { cartItems, addToCart } = useContext(CartContext); 
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		fetch('http://localhost:5000/dashboard')
		.then((response) => response.json())
		.then((data) => {
			const matchedProduct = data.find(item => item.productId.toString() === id);
			setProduct(matchedProduct);
		});
	}, [id]);

	const handleQuantityChange = (event) => {
		setQuantity(event.target.value);
	};

	const handleAddToCart = () => {
		addToCart(product, quantity);
	};

	const handleReturn = () => {
		navigate('/shop');
	};

	const imagePath = '../.' + product.image?.path;

	return (
		<div className="productI-container">
			<div className="pItem-container">
				{product && (
					<div>
						<h1>{product.name}</h1>
						<div className="row">
							<div className="col">
								<img className='productImage' src={imagePath} alt={product.name} />
							</div>
							<div className="col">
								<div className='row'>
									<p>{product.description}</p>
								</div>
								<div className='row'>
									<div className='form-group'>
										<label>Quantity: </label>
										<input className="form-control" type="number" value={quantity} onChange={handleQuantityChange} min="1" max="3"/>
									</div>
									<div className='row'>
										<div className='col'>
											<button className="btn add-to-cart" onClick={handleAddToCart}>Add to Cart</button>  
											<button className='btn return-page' onClick={handleReturn}>Return to Page</button>
										</div>	
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProductPage;
