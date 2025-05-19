// Client.js (Client Side)
"use client";
import { useEffect, useState } from "react";
import TabbedCard from "../components/TabbedCard";
import Table from "../components/Table";
import CommentModal from "../components/CommentModal";

export default function Client({ data, addComment }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendData, setBackendData] = useState(data);
  const [formattedData, setFormattedData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch initial data on page load
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources-with-comments`
        );
        if (!response.ok) throw new Error("Fetching data failed");

        const fetchedData = await response.json();
        console.log("Fetched data from backend:", fetchedData);
        setBackendData(fetchedData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    console.log("backend url", BACKEND_URL);
    console.log("Backend data", backendData);

    const formatData = () => {
      return backendData.map((resource) => ({
        resourceType: resource.type || "",
        resourceTitle: (
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.title || resource.url}{" "}
          </a>
        ),
        resourceUrl: resource.url || "",
        resourceId: resource.id || "",
        comments: resource.comments.map((comment) => ({
          commentId: comment.id || "",
          commentType: comment.typeComm || "",
          commentDescription: comment.description || "",
        })),
      }));
    };

    // If backendData is empty, show a message instead of attempting to format the data
    if (backendData.length === 0) {
      setErrorMessage(
        "No data available. The backend might be down or unreachable."
      );
    } else {
      setFormattedData(formatData());
      setErrorMessage(null); // Clear any previous error message
    }
  }, [backendData]);

  const handleAddComment = async (submittedData) => {
    setLoading(true);
    try {
      console.log("submitted data in client", submittedData);
      console.log("BACKEND_URL:", process.env.BACKEND_URL);
      const newData = await addComment(submittedData); // Call the addComment function
      console.log("Comment added, new database:", newData);
      setBackendData(newData);
      // Optionally, refresh the local state with the new comment
      // Here, you could also re-fetch the resources if necessary
      // e.g., fetchResources(); // Implement this function to refresh data
    } catch (error) {
      console.error("Error adding comment:", error.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      id: "resourceType",
      accessorKey: "resourceType",
      header: "Resource Type",
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      id: "resourceTitle",
      accessorKey: "resourceTitle",
      header: "Resource URL",
      enableSorting: false,
      enableGlobalFilter: false,
    },
    // { id: 'resourceId', accessorKey: 'resourceId', header: 'Resource ID' },
    // { id: 'commentId', accessorKey: 'commentId', header: 'Comment ID' },
    {
      id: "comments",
      accessorKey: "comments",
      header: "Comments",
      enableSorting: false,
      enableGlobalFilter: true,
    },
  ];

  const tabs = [
    {
      label: "Database",
      content: (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Comment
          </button>

          {/* Conditionally show loading state or error message */}
          {loading && <p>Loading...</p>}

          {/* Show error message if available */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* If no data, show a message instead of the table */}
          {formattedData.length === 0 && !loading && !errorMessage ? (
            <p>No data available. The backend might be down or unreachable.</p>
          ) : (
            <>
              <select
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                className="px-2 py-1 border rounded mb-2"
              >
                <option value="">Filter by Resource Type</option>
                {[...new Set(formattedData.map((item) => item.resourceType))]
                  .filter(Boolean)
                  .map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
              </select>
              <Table
                columns={columns}
                data={formattedData}
                loading={loading}
                sorting={sorting}
                onSortingChange={setSorting}
                filtering={filtering}
                onFilteringChange={setFiltering}
              />
            </>
          )}

          <CommentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddComment} // Pass the addComment handler
          />
        </>
      ),
    },
  ];

  return <TabbedCard title={"Comments about Resources"} tabs={tabs} />;
}
