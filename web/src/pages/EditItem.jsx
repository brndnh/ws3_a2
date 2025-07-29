import { useEffect, useState } from 'react';
import { getItemById, updateItem } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

import './global.css';

function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', description: '', category_id: '' });

    useEffect(() => {
        getItemById(id).then((item) => {
            setForm({
                name: item.name,
                description: item.description,
                category_id: item.category_id
            });
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateItem(id, form);
        navigate('/');
    };

    return (
        <div>
            <h1>Edit Item</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} required />
                <textarea name="description" value={form.description} onChange={handleChange} />
                <input name="category_id" value={form.category_id} onChange={handleChange} required />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditItem;
