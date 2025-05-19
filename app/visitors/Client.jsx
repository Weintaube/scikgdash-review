// pages/Client.js
'use client';
import { useState, useMemo } from 'react';
import NetworkGraph from '../components/NetworkGraph';
import ChordDiagram from '../components/ChordDiagram';
import TabbedCard from '../components/TabbedCard';
import Table from '../components/Table';
import { formatDate } from '../utils/dateFormat';

export default function Client({ data, fetchMatomoData }) {
  const { nodes: initialNodes, links: initialLinks } = data;
  const [newData, setNewData] = useState({ nodes: initialNodes, links: initialLinks });
  const [selectedNode, setSelectedNode] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('Data fetched for today.');
  const [error, setError] = useState('');
  const [threshold, setThreshold] = useState(100);
  const [showTables, setShowTables] = useState(false);
  const [selectedSite, setSelectedSite] = useState('orkg'); 
  const siteIds = {
    orkg: 29, 
    orkgAsk: 49, 
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value); 
  };

  const handleFetchData = async () => {
    setLoading(true);
    setDateRange('');
    setError('');

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be later than the end date.');
      setLoading(false); // Stop loading if there is an error
      return;
    }

    try {
      const { nodes, links } = await fetchMatomoData(siteIds[selectedSite], startDate, endDate);
      setNewData({ nodes, links });
      
      // Set date range based on whether it's a single day or a range
      console.log(startDate, endDate);
      if (endDate==='') {
        setDateRange(`Data fetched for ${formatDate(startDate)}.`);
      } else {
        setDateRange(`Data fetched from ${formatDate(startDate)} to ${formatDate(endDate)}.`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLinks = useMemo(() => {
    if (!selectedNode) return [];
    return newData.links.filter(
      link => link.source === selectedNode.id || link.target === selectedNode.id
    );
  }, [selectedNode, newData.links]);

  const filteredLinksThreshold = useMemo(() => {
      return newData.links
        .sort((a, b) => b.value - a.value) // Sort by link frequency (value)
        .slice(0, threshold); // Take the top 'threshold' links
  }, [newData.links, threshold]);
  //console.log("filtered links by threshold", filteredLinksThreshold);

  const filteredNodes = useMemo(() => {
    const nodeIds = new Set(filteredLinksThreshold.flatMap(link => [link.source, link.target]));
    return newData.nodes.filter(node => nodeIds.has(node.id));
  }, [filteredLinksThreshold, newData.nodes]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowTables(true); // Show tables when a node is selected
  };
  
  const handleResetNode = () => {
    setSelectedNode(null);
    setShowTables(false); // Hide tables when resetting
    setSortConfig({ key: null, direction: 'asc' }); // Reset sort
  };

  const handleSort = (key) => {
    setSortConfig(prev => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const renderTable = (data, columns) => (
    <table className="w-full table-auto border border-gray-300 rounded text-sm">
      <thead className="bg-gray-100">
        <tr>
          {columns.map(col => (
            <th
              key={col.id}
              className="p-2 cursor-pointer"
              onClick={() => handleSort(col.accessorKey)}
            >
              {col.header}
              {sortConfig.key === col.accessorKey ? (
                sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
              ) : ' ↕'}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortData(data).map((row, i) => (
          <tr key={i} className="border-t">
            {columns.map(col => (
              <td key={col.id} className="p-2">{row[col.accessorKey]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const incomingColumns = [
    {
      id: 'source',
      header: 'Source',
      accessorKey: 'source',
    },
    {
      id: 'frequency',
      header: 'Frequency',
      accessorKey: 'value',
    },
  ];

  const outgoingColumns = [
    {
      id: 'target',
      header: 'Target',
      accessorKey: 'target',
    },
    {
      id: 'frequency',
      header: 'Frequency',
      accessorKey: 'value',
    },
  ];

  const tabs = [
    {
      label: 'Network Graph',
      content: (
        <>
        {/*<label>Select Site: </label>
        <select value={selectedSite} onChange={handleSiteChange}>
          <option value="orkg">ORKG</option>
          <option value="orkgAsk">ORKG Ask</option>
        </select>*/}
        <p className="text-sm text-gray-500">Leave end date empty to fetch only for one day. Default is today.</p>
          <div className="flex space-x-4 mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleFetchData}
              className={`p-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white`}
              disabled={loading} // Optional: Disable button while loading
            >
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 font-medium mb-2 border-l-4 border-red-600 pl-2">
              {error}
            </p>
          )}

          {dateRange && (
            <p className="text-blue-600 font-medium mb-2 border-l-4 border-blue-600 pl-2">
              {dateRange}
            </p>
          )}

          <div className="flex space-x-4 mb-4">
            <label>
              Most frequent links:
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="0"
              />
            </label>
          </div>

          <div className="flex flex-col"> {/* Container for overall layout */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* Grid layout */}
    <div className="flex-1"> {/* ChordDiagram section */}
      <ChordDiagram 
        nodes={filteredNodes} 
        links={filteredLinksThreshold} 
        onNodeClick={handleNodeClick} 
      />
    </div>

    {showTables && selectedNode && ( // Render tables only if a node is selected
      <div className="relative border border-gray-300 rounded-lg p-4 shadow-md bg-white">
        <button
          onClick={handleResetNode}
          className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
          title="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800">Node: {selectedNode.id}</h2>
        <p>Frequency: {selectedNode.totalFrequency}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3>Incoming Links (total: {selectedNode.incomingFrequency})</h3>
            {renderTable(filteredLinks.filter(link => link.target === selectedNode.id), incomingColumns)}
          </div>
          <div>
            <h3>Outgoing Links (total: {selectedNode.outgoingFrequency})</h3>
            {renderTable(filteredLinks.filter(link => link.source === selectedNode.id), outgoingColumns)}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        </>
      ),
    },
  ];

  return (
    <>
      <TabbedCard title={'Matomo Visitor Data'} tabs={tabs} />
    </>
  );
}
