// services/chartService.ts
import { request } from 'umi';

export async function fetchChartData(blockchain, subChain, metric, timeRange) {
    try {
        const params = new URLSearchParams({
            blockchain,
            subChain,
            metric,
            timeRange
        });
        console.log(timeRange)
        const url = new URL(`http://localhost:5000/app/metrics/chart_data`);
        url.search = params.toString();
        console.log("Request URL:", url.toString()); // Log the URL

        return await request(url.toString());
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return null;
    }
};

