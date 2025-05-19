'use client';

import { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { formatDate } from '../../utils/dateFormat'; // Assume this formats date strings
import TabbedCard from '../../components/TabbedCard';
import { fetchData } from '../../utils/fetchData'; // Assume this handles fetching data

export default function Client({ initialData, initialSorting, totalPages }) { // Added totalPages prop
  const [data, setData] = useState(initialData);
  console.log("init data statements paper", initialData);
  const [sorting, setSorting] = useState(initialSorting);
  const [filter, setFilter] = useState(''); // State for the filter input
  const [submittedFilter, setSubmittedFilter] = useState(''); // State for the filter that is actually submitted
  const [size] = useState(10); // Fixed size of 10, but could be dynamic if needed
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(totalPages > 1); // Determine if more pages are available
  const [loading, setLoading] = useState(false); // To show a loading state

  // Define columns for the table
  const columns = [
    { id: 'title', accessorKey: 'title', header: 'Title' },
    { id: 'statementCount', accessorKey: 'statementCount', header: 'Statements' },
  ];

  // Format data for display
  const formattedData = data.map(item => ({
    title: (
      <a 
        href={`https://orkg.org/paper/${item.id}`}
        target="_blank"
        rel='noopener noreferrer'
      >
         {item.title || item.id}
      </a>
    ), 
    created_at: formatDate(item.created_at),
    statementCount: item.count
  }));

  // Function to fetch data
  const fetchFilteredData = async (pageNumber) => { // Added fetchFilteredData function
    console.log("Fetching data with sorting and submitted filter");
    setLoading(true); // Added loading state

    const response = await fetchData('https://orkg.org/api/papers/statement-counts', { 
      sorting, 
      params: { size, page: pageNumber, title: submittedFilter } // Pass page and the submitted filter to fetchData
    });

    if (response) {
      if (pageNumber === 1) {
        // For the first page, replace existing data
        setData(response.content);
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

  const handleSortingChange = (newSorting) => {
    console.log("new sorting", newSorting);
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

  const handleLoadMore = () => { // Added handleLoadMore function
    if (!loading && hasMore) {
      fetchFilteredData(page + 1);
    }
  };

  const tabs = [
    { 
      label: 'List', 
      content: (
        <>
          {/*<input
            type="text"
            placeholder="Filter by label..."
            value={filter}
            onChange={handleFilterChange}
            onKeyDown={handleFilterSubmit} // Listen for Enter key press
            className="mb-4 p-2 border border-gray-300 rounded"
          />*/}
          <Table 
            columns={columns} 
            data={formattedData} 
            sorting={sorting}
            onSortingChange={handleSortingChange}
            onLoadMore={handleLoadMore} // Added onLoadMore prop
            hasMore={hasMore}
            loading={loading}
          /> 
        </>
      ),
    },
  ];

  return <TabbedCard title={'Statements per Paper'} tabs={tabs} />;
}
