import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import '../../css/ShopPage.css';
import ShoppingPage from '../../views/pages/ShoppingPage';
import CartProvider, { CartContext } from '../../context/CartContext'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AuthContext } from "../../context/authContext.js";
import { Link } from 'react-router-dom';


function ShopPage() {
    const API_URL = "http://localhost:5000/dashboard";
    const USER_URL = "http://localhost:5000/api/users";
    const navigate = useNavigate();
    const [uniqueData, setUniqueData] = useState({});
    const [selectedType, setSelectedType] = useState('all'); // Default to 'all'
    const [searchQuery, setSearchQuery] = useState("");
    const { currentUser, logout } = useContext(AuthContext);
    const cartContext = useContext(CartContext);

    const [userData, setUserData] = useState({});
    //const username = currentUser.username;

    

    useEffect(() => 
        {
            if (currentUser) {
            const apiUrlForCurrentUser = `${USER_URL}/${currentUser.username}`;
            fetch(apiUrlForCurrentUser)
                .then((response) => {
                if (!response.ok) {
                    console.log("Connected")
                }
                return response.json();
                })
                .then((data) => {
                setUserData(data);
                })
                .catch((error) => {
                console.error('Error fetching user data:', error);
                // Handle the error, show a message, or redirect the user
                });
            }
        }
    );

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const groupedData = data.reduce((acc, item) => {
                        const type = item.type;
                        if (type) {
                            acc[type] = acc[type] || [];
                            acc[type].push(item);
                        }
                        return acc;
                    }, {});

                    setUniqueData(groupedData);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const filteredProducts = Object.entries(uniqueData).reduce((acc, [type, products]) => {
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (selectedType === 'all' || type === selectedType) {
            acc[type] = filtered;
        }

        return acc;
    }, {});

    const handleCategoryClick = (type) => {
        setSelectedType(type);
    };

    const handleCartIconClick = () => {
        navigate(`/cart`);
    };

    const resetFilter = () => {
        setSelectedType('all');
        setSearchQuery('');
    };

    // Check if the user is logged in and has the "admin" role
    if (!currentUser) {
        // Redirect to another page or display an unauthorized message
        return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>User Not Logged In</h2>
            <p>Please Login to access the shopping page</p>
            <Link to="/login">
                Login
            </Link>
        </div>
        );
    }

    return (
        <div className="shop-container">
            <h1 className="h1title">Products</h1>
            <div className="categories-row" style={{ display: 'flex' }}>
                {Object.keys(uniqueData).map((type) => {
                    const imagePath = uniqueData[type][0]?.image?.path;
                    return (
                        <div key={type} className="category"> 
                            {imagePath && (
                                <button className='btn-category' style={{ border: 'none', background: 'none', padding: 0 }} onClick={() => handleCategoryClick(type)}>
                                    <p className='types'>{type}</p>
                                </button>
                            )}
                            {console.log("Selected Type: " + selectedType)}
                        </div>
                    );
                })}
            </div>
            <div className="search-filter">
                <div className="row">
                    <div className="col-md-4">
                        <select className="form-control" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="None"></option>
                            <option value="all">All Categories</option>
                            {Object.keys(uniqueData).map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-primary reset-button" onClick={() => setSelectedType("all")}>Reset Filter</button>
                    </div>
                </div>
            </div>
            {console.log("Filtered " + Object.values(filteredProducts).flat())}
            {selectedType && (selectedType === "all" ?
                <ShoppingPage type={selectedType} products={Object.values(filteredProducts).flat()} /> :
                <ShoppingPage type={selectedType} products={filteredProducts[selectedType]} />)
            }
        </div>
);
}

export default ShopPage;
