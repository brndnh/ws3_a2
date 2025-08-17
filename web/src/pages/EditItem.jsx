import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem, getCategories } from '../api';

function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        description: '',
        category_id: '',
        image: null
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadItem();
        loadCategories();
    }, []);

    const loadItem = async () => {
        try {
            const item = await getItemById(id);
            setForm({
                name: item.name,
                description: item.description,
                category_id: item.category_id,
                image: null
            });
        } catch (err) {
            console.error('error loading item:', err);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error('error loading categories:', err);
        }
    };

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
        if (form.image) {
            formData.append('image', form.image);
        }

        try {
            await updateItem(id, formData);
            navigate('/');
        } catch (err) {
            console.error('error updating item:', err);
        }
    };

    return (
        <div>
            <h1>edit cassette</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="name"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="description"
                ></textarea>
                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">select a category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.NAME?.toLowerCase() || cat.name?.toLowerCase()}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                />
                <button type="submit">update item</button>
            </form>
        </div>
    );
}

export default EditItem;
