import { useEffect, useState } from 'react';
import { getAllItems, deleteItem } from '../api';
import { Link } from 'react-router-dom';

import './global.css';

function Home() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await getAllItems();
            setItems(data);
        } catch (err) {
            console.error('error loading items:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            loadItems(); // refresh list
        } catch (err) {
            console.error('error deleting item:', err);
        }
    };

    return (
        <div className="home-container">
            <h1>My Cassette Collection</h1>
            <Link to="/add" className="add-link">+ Add New Item</Link>

            <div className="cassette-grid">
                {items.map((item) => (
                    <div key={item.id} className="cassette-card">
                        <img
                            src={`http://localhost:3001/uploads/${item.image}`}
                            alt={item.name}
                            className="cassette-image"
                        />
                        <div className="cassette-info">
                            <h3>{item.name}</h3>
                            <p className="category">{item.category_name}</p>
                            <button onClick={() => handleDelete(item.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
