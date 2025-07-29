const API_BASE = 'http://localhost:3001/api/items';

// get all items
export const getAllItems = async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('failed to fetch items');
    return res.json();
};

// get single item by id
export const getItemById = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('failed to fetch item');
    return res.json();
};

// add new item with image (formData)
export const addItem = async (formData) => {
    const res = await fetch(API_BASE, {
        method: 'POST',
        body: formData
    });
    if (!res.ok) throw new Error('failed to add item');
    return res.json();
};

// update existing item (no image)
export const updateItem = async (id, data) => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('failed to update item');
    return res.json();
};

// delete item
export const deleteItem = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('failed to delete item');
    return res.json();
};

// get categories for dropdowns
export async function getCategories() {
    const res = await fetch('http://localhost:3001/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}
