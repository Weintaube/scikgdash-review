'use client';
import { useState } from "react";
import { Input } from "@headlessui/react"; // Ensure this import is correct
import { formatDate } from '../utils/dateFormat';

export default function Contributions() {
    const [resourceEndpoint, setResourceEndpoint] = useState("");
    const [resourceLabel, setResourceLabel] = useState("");  // To store the label for display
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // Define an array with labels and values
    const endpoints = [
        { value: "resources", label: "Resources" },
        { value: "comparisons", label: "Comparisons" },
        { value: "papers", label: "Papers" },
        { value: "predicates", label: "Predicates" },
        { value: "smart-reviews", label: "Smart Reviews" },
        { value: "literature-lists", label: "Literature Lists" },
        { value: "templates", label: "Templates" },
        { value: "statements", label: "Statements" },
        { value: "rosetta-stone/templates", label: "Rosetta Stone Templates" },
        { value: "rosetta-stone/statements", label: "Rosetta Stone Statements" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);

        try {
            const startDateParameter = startDate ? new Date(startDate).toISOString() : '';
            const endDateParameter = endDate ? new Date(endDate).toISOString() : '';

            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                throw new Error("Start date cannot be later than the end date.");
            }

            if (!resourceEndpoint) {
                throw new Error("Please select an endpoint.");
            }

            const response = await fetch(`https://orkg.org/api/${resourceEndpoint}?created_at_start=${startDateParameter || ''}&created_at_end=${endDateParameter}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            console.log("Contributions in time span", result);
            setData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <p className="text-lg font-semibold text-gray-700 mb-4">Pick Dates for Number of Contributions</p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Resource Endpoint
                    </label>
                    <select
                        value={resourceEndpoint}
                        onChange={(e) => {
                            const selectedOption = endpoints.find(endpoint => endpoint.value === e.target.value);
                            setResourceEndpoint(selectedOption.value);
                            setResourceLabel(selectedOption.label);  // Set the label for display
                            setData(null);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select an endpoint</option>
                        {endpoints.map((endpoint) => (
                            <option key={endpoint.value} value={endpoint.value}>
                                {endpoint.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Start Date <span className="text-gray-500">(optional)</span>
                    </label>
                    <p className="text-sm text-gray-500">Leave dates empty to fetch all data.</p>
                    <Input 
                        name="start date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Select a start date"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        End Date <span className="text-gray-500">(optional)</span>
                    </label>
                    <Input 
                        name="end date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Select an end date"
                    />
                </div>

                <button
                    type="submit"
                    className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>

            {error && <p className="mt-4 text-red-500">Error: {error}</p>}
            {data && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                    <p className="text-blue-600 font-medium mb-2 border-l-4 border-blue-600 pl-2">
                    <span className="text-sm">
                        Number of {resourceLabel} added from <br></br> 
                        {startDate ? formatDate(startDate) : 'ORKG beginning'} to {endDate ? formatDate(endDate) : 'now'}:
                    </span> 
                      { data.totalElements}
                    </p> 
                    {/*<pre className="mt-2 text-xs text-gray-600">{JSON.stringify(data, null, 2)}</pre>*/}
                </div>
            )}
        </div>
    );
}
