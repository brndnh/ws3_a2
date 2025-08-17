import { useEffect, useState } from 'react';
import { getItemById } from '../api';
import { useParams } from 'react-router-dom';

import './global.css';

function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        getItemById(id).then(setItem).catch(console.error);
    }, [id]);

    if (!item) return <p>loading...</p>;

    return (
        <div>
            <h1>{item.name}</h1>
            <p><strong>category:</strong> {item.category_id}</p>
            <p>{item.description}</p>
            {item.image && <img src={`http://localhost:3001/uploads/${item.image}`} alt={item.name} width="200" />}
        </div>
    );
}

export default ItemDetails;
