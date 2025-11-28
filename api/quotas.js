export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { surveyId } = req.query;

    if (!surveyId) {
        return res.status(400).json({
            result_ok: false,
            message: 'surveyId is required'
        });
    }

    // Forward all query parameters to Alchemer
    const queryParams = new URLSearchParams(req.url.split('?')[1] || '');
    queryParams.delete('surveyId'); // Remove our internal param

    const alchemerUrl = `https://api.alchemer.com/v5/survey/${surveyId}/quotas?${queryParams.toString()}`;

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
