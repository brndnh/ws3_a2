import { useEffect, useState } from 'react';
import { getAllItems, deleteItem } from '../api';
import { Link } from 'react-router-dom';

import './global.css';

function Home() {
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

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

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const filteredItems =
        selectedCategory === 'all'
            ? items
            : items.filter((item) => item.category_id === Number(selectedCategory));

    return (
        <div className="home-container">
            <h1>my cassette collection</h1>

            <div className="controls">
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="category-filter"
                >
                    <option value="all">all categories</option>
                    <option value="1">lo-fi</option>
                    <option value="2">synth</option>
                    <option value="3">jazz</option>
                </select>

                <Link to="/add" className="add-link">+ add new item</Link>
            </div>

            <div className="cassette-grid">
                {filteredItems.map((item) => (
                    <div key={item.id} className="cassette-card">
                        <img
                            src={`http://localhost:3001/uploads/${item.image}`}
                            alt={item.name}
                            className="cassette-image"
                        />

                        <div className="cassette-info button-row">
                            <h3>{item.name}</h3>
                            <p className="category">{item.category_name}</p>
                            <Link to={`/edit/${item.id}`} className="edit-link">edit</Link>
                            <button onClick={() => handleDelete(item.id)}>delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
