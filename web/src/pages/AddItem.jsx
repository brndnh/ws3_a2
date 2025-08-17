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
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

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
        setError('');

        // simple client validation to avoid bad payloads
        if (!form.name.trim()) return setError('please enter a name');
        if (!form.category_id) return setError('please choose a category');

        // coerce category_id to an integer (mysql fk safety)
        const catId = Number(form.category_id);
        if (!Number.isInteger(catId)) return setError('category is invalid');

        const fd = new FormData();
        fd.append('name', form.name.trim());
        fd.append('description', form.description.trim());
        // send as string, but it represents an int and server will handle it
        fd.append('category_id', String(catId));
        if (form.image) fd.append('image', form.image);

        try {
            setSubmitting(true);
            await addItem(fd);
            navigate('/');
        } catch (err) {
            console.error('error adding item:', err);
            setError(err?.message || 'failed to add item');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>add new cassette</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="description"
                    onChange={handleChange}
                />

                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">select a category</option>
                    <option value="1">1 - lofi</option>
                    <option value="2">2 - synthwave</option>
                    <option value="3">3 - breakcore</option>
                </select>

                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                />

                {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? 'adding…' : 'add item'}
                </button>
            </form>
        </div>
    );
}

export default AddItem;
