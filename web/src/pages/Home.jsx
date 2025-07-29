import { useEffect, useState } from 'react';
import { getAllItems } from '../api';

function Home() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getAllItems()
            .then(data => setItems(data))
            .catch(err => console.error('error loading items:', err));
    }, []);

    return (
        <div>
            <h1>My Cassette Collection</h1>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.name} - {item.category_name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
