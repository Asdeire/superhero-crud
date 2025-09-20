export function imageUrl(path) {
    if (!path) return ''
    if (path.startsWith('http')) return path

    const base = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:3000'
    return `${base}${path.startsWith('/') ? path : '/' + path}`
}
