import { useMemo } from 'react';
import { DataTable } from './DataTable';
import { ParameterValueTable } from './ParameterValueTable';

/**
 * Custom component to render markdown tables using the enhanced DataTable component
 */
export function MarkdownTableRenderer({ children, onCellClick }) {
  console.log('[MarkdownTableRenderer] Rendered with onCellClick:', !!onCellClick);

  // Extract table data from markdown table element
  const tableContent = useMemo(() => {
    console.log('[MarkdownTableRenderer useMemo] Starting parse. children:', children);
    console.log('[MarkdownTableRenderer useMemo] children type:', typeof children);
    console.log('[MarkdownTableRenderer useMemo] children is array?', Array.isArray(children));

    if (!children) {
      console.log('[MarkdownTableRenderer useMemo] Early return: no children');
      return null;
    }

    // ReactMarkdown passes children as an array directly: [thead, tbody]
    const tableChildren = Array.isArray(children) ? children : [children];
    console.log('[MarkdownTableRenderer useMemo] tableChildren:', tableChildren);
    console.log('[MarkdownTableRenderer useMemo] tableChildren length:', tableChildren.length);

    tableChildren.forEach((child, idx) => {
      console.log(`[MarkdownTableRenderer useMemo] tableChildren[${idx}] type:`, child?.type);
    });

    // Find thead and tbody elements
    const thead = tableChildren.find(child => child?.type === 'thead');
    const tbody = tableChildren.find(child => child?.type === 'tbody');

    console.log('[MarkdownTableRenderer useMemo] Found thead?', !!thead);
    console.log('[MarkdownTableRenderer useMemo] Found tbody?', !!tbody);

    if (!thead || !tbody) {
      console.log('[MarkdownTableRenderer useMemo] Missing thead or tbody');
      return null;
    }

    // Extract headers
    const headers = [];
    console.log('[MarkdownTableRenderer useMemo] thead.props:', thead.props);
    console.log('[MarkdownTableRenderer useMemo] thead.props.children:', thead.props?.children);

    // thead.props.children should be a <tr> element
    const theadTr = thead.props?.children;
    console.log('[MarkdownTableRenderer useMemo] theadTr:', theadTr);
    console.log('[MarkdownTableRenderer useMemo] theadTr.props:', theadTr?.props);
    console.log('[MarkdownTableRenderer useMemo] theadTr.props.children:', theadTr?.props?.children);

    // theadTr.props.children should be an array of <th> elements
    const theadCells = theadTr?.props?.children;
    console.log('[MarkdownTableRenderer useMemo] theadCells is array?', Array.isArray(theadCells));

    if (Array.isArray(theadCells)) {
      theadCells.forEach((th, idx) => {
        console.log(`[MarkdownTableRenderer useMemo] th[${idx}]:`, th);
        console.log(`[MarkdownTableRenderer useMemo] th[${idx}].props:`, th?.props);
        console.log(`[MarkdownTableRenderer useMemo] th[${idx}].props.children:`, th?.props?.children);

        if (th?.props?.children) {
          const headerText = typeof th.props.children === 'string'
            ? th.props.children
            : th.props.children.toString();
          headers.push(headerText);
          console.log(`[MarkdownTableRenderer useMemo] Added header: "${headerText}"`);
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
    console.log('[MarkdownTableRenderer] Could not parse table content, rendering default');
    return children;
  }

  console.log('[MarkdownTableRenderer] Rendering table with:', {
    headers: tableContent.headers,
    rowCount: tableContent.body.length,
    onCellClickExists: !!onCellClick
  });

  // Use ParameterValueTable for simple parameter-value tables (2 columns, < 20 rows)
  // Use DataTable for complex tables with many rows or columns
  const isSimpleTable = tableContent.headers.length === 2 && tableContent.body.length < 20;
  const firstHeader = (tableContent.headers[0] || '').toLowerCase();
  const isParameterValueTable = isSimpleTable && 
    (firstHeader.includes('parameter') || 
     firstHeader.includes('key') ||
     firstHeader.includes('field') ||
     firstHeader.includes('property') ||
     firstHeader.includes('name'));

  if (isParameterValueTable) {
    return <ParameterValueTable tableContent={tableContent} onCellClick={onCellClick} />;
  }

  // For larger tables or complex tables, use DataTable
  return <DataTable tableContent={tableContent} onCellClick={onCellClick} />;
}
