'use client';

import { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { formatDate } from '../../utils/dateFormat'; // Assume this formats date strings
import TabbedCard from '../../components/TabbedCard';
import { fetchData } from '../../utils/fetchData'; // Assume this handles fetching data

export default function Client({ initialData, totalNumber, initialSorting }) {
  const [rawData, setRawData] = useState(initialData);
  const [data, setData] = useState(initialData.content);
  const [sorting, setSorting] = useState(initialSorting);
  const [filter, setFilter] = useState(''); // State for the filter input
  const [submittedFilter, setSubmittedFilter] = useState(''); // State for the filter that is actually submitted
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(rawData.totalPages > 1); // Determine if more pages are available
  const [loading, setLoading] = useState(false); // To show a loading state

  // Define columns for the table
  const columns = [
    { id: 'label', accessorKey: 'label', header: 'Label' },
    { id: 'created_at', accessorKey: 'created_at', header: 'Created At' },
  ];

  // Format data for display
  const formattedData = data.map(item => ({
    label: (
      <a 
        href={`https://orkg.org/property/${item.id}`}
        target="_blank"
        rel='noopener noreferrer'
      >
        {item.label}
      </a>
    ),
    created_at: formatDate(item.created_at),
  }));

  // Function to fetch data
  const fetchFilteredData = async (pageNumber) => {
    console.log("fetch filtered data in Client");
    setLoading(true);
    const response = await fetchData('https://orkg.org/api/curation/predicates-without-descriptions', { 
      sorting, 
      params: { size: 10, page: pageNumber, q: submittedFilter } // Pass page and the submitted filter to fetchData
    });

    if (response) {
      if (pageNumber === 1) {
        // For the first page, replace existing data
        setData(response.content);  
        setRawData(response);
      } else {
        // For subsequent pages, append new data
        setData(prevData => [...prevData, ...response.content]);
      }
      setPage(pageNumber);
      setHasMore(pageNumber < response.totalPages); // Check if there are more pages to load
    }
    setLoading(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchFilteredData(1); // Fetch initial data
  }, [sorting, submittedFilter]);

  // Load more data when the user clicks the button
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchFilteredData(page + 1);
    }
  };

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    setPage(1); // Reset page to 1 on sorting change
    fetchFilteredData(1); // Fetch data with new sorting
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    if (e.key === 'Enter') {
      setSubmittedFilter(filter); // Update submittedFilter when Enter is pressed
      setPage(1); // Reset page to 1 on filter change
      fetchFilteredData(1); // Fetch data with new filter
    }
  };

  const tabs = [
    { 
      label: 'List', 
      content: (
        <>
        {/*
          <input
            type="text"
            placeholder="Filter by label..."
            value={filter}
            onChange={handleFilterChange}
            onKeyDown={handleFilterSubmit} // Listen for Enter key press
            className="mb-4 p-2 border border-gray-300 rounded"
          />*/}
          <label className="block font-medium text-gray-700">
            {(rawData.totalElements / totalNumber * 100).toFixed(2)}%
            <span className="text-sm">
              (total Predicates without descriptions: {rawData.totalElements})
            </span>
          </label>
          <Table 
            columns={columns} 
            data={formattedData} 
            sorting={sorting}
            onSortingChange={handleSortingChange}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
          /> 
        </>
      ),
    },
  ];

  return <TabbedCard title={'Predicates without Descriptions'} tabs={tabs} />;
}
