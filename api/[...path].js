export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Extract path and query parameters
    const { path } = req.query;
    const queryParams = new URLSearchParams(req.url.split('?')[1] || '');

    // Remove 'path' from queryParams
    queryParams.delete('path');

    // Build Alchemer API URL
    const alchemerPath = Array.isArray(path) ? path.join('/') : path;
    const alchemerUrl = `https://api.alchemer.com/v5/${alchemerPath}?${queryParams.toString()}`;

    try {
        const response = await fetch(alchemerUrl);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            result_ok: false,
            message: 'Proxy error: ' + error.message
        });
    }
}
