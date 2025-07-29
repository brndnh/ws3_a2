import { useState } from 'react';
import { addItem } from '../api';
import { useNavigate } from 'react-router-dom';

function AddItem() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        category_id: '',
        image: null
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('category_id', form.category_id);
        if (form.image) formData.append('image', form.image);

        try {
            await addItem(formData);
            navigate('/');
        } catch (err) {
            console.error('error adding item:', err);
        }
    };

    return (
        <div>
            <h1>Add New Cassette</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>

                {/* might not be the optimal way, i would consider looking for actual ID's from the table in the future */}
                <select name="category_id" value={form.category_id} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    <option value="1">1 - Lofi</option>
                    <option value="2">2 - Synthwave</option>
                    <option value="3">3 - Breakcore</option>
                </select>

                <input type="file" name="image" accept="image/*" onChange={handleChange} />
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
}

export default AddItem;
