'use client';

import { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { formatDate } from '../../utils/dateFormat';
import TabbedCard from '../../components/TabbedCard';
import { fetchData } from '../../utils/fetchData';

export default function Client({ initialData, totalNumber, initialSorting }) {
  const [rawData, setRawData] = useState(initialData);
  const [data, setData] = useState(initialData.content);
  const [sorting, setSorting] = useState(initialSorting);
  const [filter, setFilter] = useState('');
  const [submittedFilter, setSubmittedFilter] = useState('');
  const [size] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(rawData.totalPages > 1);
  const [loading, setLoading] = useState(false);

  // Define columns for the table
  const columns = [
    { id: 'label', accessorKey: 'label', header: 'Label' },
    { id: 'created_at', accessorKey: 'created_at', header: 'Created At' },
  ];

  // Format data for display
  const formattedData = data.map(item => ({
    label: (
      <a 
        href={`https://orkg.org/class/${item.id}`}
        target="_blank"
        rel='noopener noreferrer'
      >
        {item.label}
      </a>
    ),
    created_at: formatDate(item.created_at),
  }));

  const fetchFilteredData = async (pageNumber) => {
    setLoading(true);
    const response = await fetchData('https://orkg.org/api/curation/classes-without-descriptions', { 
      sorting, 
      params: { size, page: pageNumber, q: submittedFilter }
    });

    if (response) {
      if (pageNumber === 1) {
        setData(response.content);
        setRawData(response);
      } else {
        setData(prevData => [...prevData, ...response.content]);
      }
      setPage(pageNumber);
      setHasMore(pageNumber < response.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFilteredData(1);
  }, [sorting, submittedFilter]);

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    setPage(1);
    fetchFilteredData(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    if (e.key === 'Enter') {
      setSubmittedFilter(filter);
      setPage(1);
      fetchFilteredData(1);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchFilteredData(page + 1);
    }
  };

  const tabs = [
    { 
      label: 'List', 
      content: (
        <>
          <label className="block font-medium text-gray-700">
            {(rawData.totalElements/totalNumber*100).toFixed(2)}%
            <span className="text-sm">
              (total Classes without descriptions: {rawData.totalElements})
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

  return <TabbedCard title={'Classes without Descriptions'} tabs={tabs} />;
}
