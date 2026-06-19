const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    if(res.status === 401 || res.status === 403) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    return res.json();
}