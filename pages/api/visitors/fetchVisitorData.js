// app/api/visitors/fetchVisitorData.js
import { fetchData } from '../../../utils/fetchData';

export async function fetchVisitorData(siteID = 29, startDate = 'today', endDate = '') {
    const matomoParams = startDate && endDate ? {
        idSite: siteID,
        period: 'range',
        date: `${startDate},${endDate}`,
        format: 'JSON',
        module: 'API',
        method: 'Live.getLastVisitsDetails',
        token_auth: process.env.MATOMO_API_KEY,
        expanded: 1,
        filter_limit: -1,
    } : {
        idSite: siteID,
        period: 'day',
        date: startDate || 'today',
        format: 'JSON',
        module: 'API',
        method: 'Live.getLastVisitsDetails',
        token_auth: process.env.MATOMO_API_KEY,
        expanded: 1,
        filter_limit: -1,
    };

    const queryParams = new URLSearchParams(matomoParams).toString();
    const url = `${process.env.MATOMO_API_URL}?${queryParams}`;
    console.log("Constructed URL:", url);

    const fetchedData = await fetchData(url);
    console.log("fetchVisitorData", fetchedData);
    if (!fetchedData) {
        throw new Error('No data available.');
    }

    return fetchedData;
}
