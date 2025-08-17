const API_ROOT = 'http://localhost:3001';
const ITEMS_BASE = `${API_ROOT}/api/items`;

// small helper: read token from localstorage and return auth header
function authHeaders() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
}

/* ===== items ===== */

// get all items (protected)
export async function getAllItems() {
    const res = await fetch(ITEMS_BASE, {
        headers: { ...authHeaders() }
    });
    if (!res.ok) throw new Error('failed to fetch items');
    return res.json();
}

// get single item by id (protected)
export async function getItemById(id) {
    const res = await fetch(`${ITEMS_BASE}/${id}`, {
        headers: { ...authHeaders() }
    });
    if (!res.ok) throw new Error('failed to fetch item');
    return res.json();
}

// add new item with image (protected) – expects formdata
export async function addItem(formData) {
    const res = await fetch(ITEMS_BASE, {
        method: 'POST',
        // do not set content-type for formdata; the browser will set proper boundary
        headers: { ...authHeaders() },
        body: formData
    });
    if (!res.ok) throw new Error('failed to add item');
    return res.json();
}

// update existing item (protected)
// supports either formdata (when updating image) or plain object (json)
export async function updateItem(id, data) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    const res = await fetch(`${ITEMS_BASE}/${id}`, {
        method: 'PUT',
        headers: isFormData
            ? { ...authHeaders() } // no content-type for formdata
            : { 'Content-Type': 'application/json', ...authHeaders() },
        body: isFormData ? data : JSON.stringify(data)
    });

    if (!res.ok) throw new Error('failed to update item');
    return res.json();
}

// delete item (protected)
export async function deleteItem(id) {
    const res = await fetch(`${ITEMS_BASE}/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
    });
    if (!res.ok) throw new Error('failed to delete item');
    return res.json();
}

/* ===== categories ===== */

// get categories (can be public; keep unauthed unless your api protects it)
export async function getCategories() {
    const res = await fetch(`${API_ROOT}/api/categories`);
    if (!res.ok) throw new Error('failed to fetch categories');
    return res.json();
}

/* ===== auth ===== */

// sign up
export async function signUp(email, password) {
    const res = await fetch(`${API_ROOT}/users`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'failed to sign up');
    }
    return res.json();
}

// sign in
export async function signIn(email, password) {
    const res = await fetch(`${API_ROOT}/users/sign-in`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'failed to sign in');
    }
    return res.json(); // { token, user }
}
