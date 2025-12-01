import { useMemo } from 'react';
import { DataTable } from './DataTable';

/**
 * Custom component to render markdown tables using the enhanced DataTable component
 */
export function MarkdownTableRenderer({ children }) {
  // Extract table data from markdown table element
  const tableContent = useMemo(() => {
    if (!children || !children.props || !children.props.children) {
      return null;
    }

    const tableChildren = children.props.children;
    let thead = null;
    let tbody = null;

    // Find thead and tbody elements
    if (Array.isArray(tableChildren)) {
      thead = tableChildren.find(child => child?.type === 'thead');
      tbody = tableChildren.find(child => child?.type === 'tbody');
    }

    if (!thead || !tbody) {
      return null;
    }

    // Extract headers
    const headers = [];
    const theadRow = thead.props?.children?.props?.children;
    if (Array.isArray(theadRow)) {
      theadRow.forEach(th => {
        if (th?.props?.children) {
          headers.push(typeof th.props.children === 'string'
            ? th.props.children
            : th.props.children.toString());
        }
      });
    }

    // Extract body rows
    const body = [];
    const tbodyRows = tbody.props?.children;
    if (Array.isArray(tbodyRows)) {
      tbodyRows.forEach(tr => {
        const row = [];
        const cells = tr.props?.children;
        if (Array.isArray(cells)) {
          cells.forEach(td => {
            if (td?.props?.children !== undefined) {
              row.push(typeof td.props.children === 'string'
                ? td.props.children
                : td.props.children?.toString() || '');
            }
          });
        }
        if (row.length > 0) {
          body.push(row);
        }
      });
    }

    if (headers.length === 0 || body.length === 0) {
      return null;
    }

    return {
      headers,
      body
    };
  }, [children]);

  // If we couldn't parse the table, render default table
  if (!tableContent) {
    return children;
  }

  return <DataTable tableContent={tableContent} />;
}
