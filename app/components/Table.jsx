import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { getColorClassForType } from "../utils/colorCoding";

const Table = ({
  columns,
  data,
  sorting = [],
  onSortingChange,
  onLoadMore,
  hasMore,
  loading,
  filtering,
  onFilteringChange,
}) => {
  const tableInstance = useReactTable({
    columns,
    data,
    state: { sorting, globalFilter: filtering },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    // manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilteringChange: onFilteringChange,
  });

  return (
    <div className="relative flex flex-col h-[600px]">
      <div className="flex-1 overflow-auto z-0">
        <table className=" w-full bg-white max-w-full rounded-lg drop-shadow-lg table-auto">
          <thead className="bg-light-lighter sticky top-0 bg-white">
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-2 text-left font-bold text-black text-base cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()} // tanStack sorting handler
                    style={{ width: header.getSize() }} // Set width based on column size
                  >
                    <div className="flex items-center">
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {header.column.getIsSorted() === "asc" ? (
                        <span className="ml-2 text-sm text-gray-600">↑</span>
                      ) : header.column.getIsSorted() === "desc" ? (
                        <span className="ml-2 text-sm text-gray-600">↓</span>
                      ) : header.column.columnDef.enableSorting ? (
                        <span className="ml-2 text-sm text-gray-600">↕</span>
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-light-darker">
            {tableInstance.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {cell.column.id === "comments"
                      ? cell.getValue().map((comment) => {
                          const colorClass = getColorClassForType(
                            comment.commentType
                          );
                          return (
                            <button
                              key={comment.commentId}
                              className={`px-2 py-1 ${colorClass} text-black rounded m-1`}
                              title={comment.commentDescription}
                            >
                              {comment.commentType}
                            </button>
                          );
                        })
                      : cell.renderValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="bg-white p-4 border-t border-gray-200">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
