const API_BASE = 'http://localhost:3001/api/items';

// get all items
export const getAllItems = async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('failed to fetch items');
    return res.json();
};

// get a single item by id
export const getItemById = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('failed to fetch item');
    return res.json();
};

// add new item with image (formData should include file)
export const addItem = async (formData) => {
    const res = await fetch(API_BASE, {
        method: 'POST',
        body: formData // formData includes file + fields
    });
    if (!res.ok) throw new Error('failed to add item');
    return res.json();
};

// update item (no image)
export const updateItem = async (id, data) => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('failed to update item');
    return res.json();
};

// delete item
export const deleteItem = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('failed to delete item');
    return res.json();
};
