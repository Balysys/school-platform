import { useState, useMemo } from "react";

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T extends { id?: string | number }> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  searchable?: boolean;
  searchFields?: (keyof T)[];
  itemsPerPage?: number;
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  actions,
  searchable = true,
  searchFields = [],
  itemsPerPage = 10,
  emptyMessage = "Aucune donnée",
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    let result = data;

    if (search && searchFields.length > 0) {
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || "").toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (sortBy) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortBy] ?? "";
        const bVal = b[sortBy] ?? "";
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, search, sortBy, sortOrder, searchFields]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: keyof T) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  if (data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-lg text-gray-400 mb-2">📭</p>
        <p className="text-gray-600 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchable && searchFields.length > 0 && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-50 to-blue-50 border-b border-primary-100">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`px-6 py-4 text-left font-semibold text-gray-700 ${col.className || ""}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                      >
                        {col.label}
                        <span className="text-xs opacity-50">
                          {sortBy === col.key ? (sortOrder === "asc" ? "↑" : "↓") : "⇅"}
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                {actions && <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-primary-50`}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`px-6 py-4 text-gray-700 ${col.className || ""}`}>
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] || "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="text-gray-600">
            Affichage <span className="font-semibold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{" "}
            sur <span className="font-semibold text-gray-800">{filteredData.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 font-medium"
            >
              ← Précédent
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700 font-medium"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

