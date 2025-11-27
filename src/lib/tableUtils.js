import Papa from 'papaparse';

/**
 * Export table data to CSV file
 * @param {Array} headers - Array of header strings
 * @param {Array} rows - Array of row arrays
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (headers, rows, filename = 'table-export.csv') => {
  try {
    // Combine headers and rows
    const data = [headers, ...rows];

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(data);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

/**
 * Export table data to Excel file (CSV format with .xlsx extension)
 * @param {Array} headers - Array of header strings
 * @param {Array} rows - Array of row arrays
 * @param {string} filename - Name of the file to download
 */
export const exportToExcel = (headers, rows, filename = 'table-export.xlsx') => {
  try {
    // Combine headers and rows
    const data = [headers, ...rows];

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(data);

    // Create blob with Excel MIME type
    const blob = new Blob([csv], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Prepare table data from backend format for TanStack Table
 * @param {Object} tableContent - Backend table content with headers and body
 * @returns {Object} - Object with columns and data for TanStack Table
 */
export const prepareTableData = (tableContent) => {
  try {
    const { headers, body } = tableContent;

    if (!headers || !body) {
      throw new Error('Invalid table content format');
    }

    // Create column definitions for TanStack Table
    const columns = headers.map((header, index) => ({
      accessorKey: `col_${index}`,
      header: header,
      id: `col_${index}`,
      enableSorting: true,
      enableHiding: true,
    }));

    // Transform rows into objects with column keys
    const data = body.map((row, rowIndex) => {
      const rowObj = { _rowId: rowIndex };
      row.forEach((cell, colIndex) => {
        rowObj[`col_${colIndex}`] = cell;
      });
      return rowObj;
    });

    return { columns, data };
  } catch (error) {
    console.error('Error preparing table data:', error);
    return { columns: [], data: [] };
  }
};

/**
 * Filter table data based on search term
 * @param {Array} data - Array of data objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered data array
 */
export const filterTableData = (data, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return data;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return data.filter((row) => {
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerSearchTerm);
    });
  });
};

/**
 * Generate a filename with timestamp
 * @param {string} prefix - Prefix for the filename
 * @param {string} extension - File extension (csv, xlsx, etc.)
 * @returns {string} - Generated filename
 */
export const generateFilename = (prefix = 'cleardemand-table', extension = 'csv') => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${prefix}-${timestamp}.${extension}`;
};
