// app/api/visitors/route.js
import { fetchVisitorData } from './fetchVisitorData';
import { computeVisitorData } from './computeVisitorData';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const siteID = searchParams.get('siteID') || '29'; // Default site ID
    const startDate = searchParams.get('startDate') || 'today';
    const endDate = searchParams.get('endDate') || '';

    try {
        console.log("fetchinitaldata route.js");
        const initialData = await fetchVisitorData(siteID, startDate, endDate);
        const { nodes, links } = computeVisitorData(initialData);
        console.log("compute visitor data", nodes, links);

        return new Response(JSON.stringify({ nodes, links }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error fetching data', error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
