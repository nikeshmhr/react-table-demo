import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useFilters, useSortBy, useTable } from 'react-table'
import _ from 'lodash';

const Styles = styled.div`
    position: relative;
    width:100%;
    z-index: 1;
    margin: auto;
    overflow: auto;
    height: 700px;
 
  table {
      width: 100%;
      min-width: 1280px;
      margin: auto;
      border-collapse: separate;
      border-spacing: 0;
    }
.table-wrap {
  position: relative;
}

thead th {
  background: #333;
  color: #fff;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

tfoot,
tfoot th,
tfoot td {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  background: #666;
  color: #fff;
  z-index: 4;
  }
  
  th:first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
  background: #ccc;
}
thead th:first-child,
tfoot th:first-child {
  z-index: 5;
}
`


function Table({ columns, data }) {

    // const filterTypes = React.useMemo(
    //     () => ({
    //         // Or, override the default text filter to use
    //         // "startWith"
    //         text: (rows, id, filterValue) => {
    //             return rows.filter(row => {
    //                 const rowValue = row.values[id]
    //                 return rowValue !== undefined
    //                     ? String(rowValue)
    //                         .toLowerCase()
    //                         .startsWith(String(filterValue).toLowerCase())
    //                     : true
    //             })
    //         },
    //     }),
    //     []
    // )


    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns,
        state,
        ...rest
    } = useTable(
        {
            columns,
            data,
            defaultColumn
        },
        useFilters,
        useSortBy,
    );

    const defaultColumnsByKey = React.useMemo(() => {
        return {
            "Column0_0": ["Column0_1", "Column0_2", "Column0_3", "Column0_4", "Column0_5", "Column0_6", "Column0_7", "Column0_8", "Column0_9",],
            "Column1_0": ["Column1_1", "Column1_2", "Column1_3", "Column1_4", "Column1_5", "Column1_6", "Column1_7", "Column1_8", "Column1_9",],
            "Column2_0": ["Column2_1", "Column2_2", "Column2_3", "Column2_4", "Column2_5", "Column2_6", "Column2_7", "Column2_8", "Column2_9",],
            "Column3_0": ["Column3_1", "Column3_2", "Column3_3", "Column3_4", "Column3_5", "Column3_6", "Column3_7", "Column3_8", "Column3_9",],
            "Column4_0": ["Column4_1", "Column4_2", "Column4_3", "Column4_4", "Column4_5", "Column4_6", "Column4_7", "Column4_8", "Column4_9",],
            "Column5_0": ["Column5_1", "Column5_2", "Column5_3", "Column5_4", "Column5_5", "Column5_6", "Column5_7", "Column5_8", "Column5_9",],
            "Column6_0": ["Column6_1", "Column6_2", "Column6_3", "Column6_4", "Column6_5", "Column6_6", "Column6_7", "Column6_8", "Column6_9",],
        }
    }, [])

    const toggleColumnHide = (columnIds) => {
        setHiddenColumns((existingHiddenColumns) => {
            const hideThese = columnIds.filter(c => !existingHiddenColumns.includes(c));
            return [...hideThese];
        });
    }

// Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            {column.Header !== "CSQ" && <div onClick={(e)=>{e.stopPropagation()}}>{column.canFilter ? column.render('Filter') : null}</div>}
                            {
                                Object.keys(defaultColumnsByKey).includes(column.id) &&
                                <button type="button" onClick={(e) => {
                                    toggleColumnHide(defaultColumnsByKey[column.id]);
                                    e.stopPropagation();
                                }}>{isSubset(state.hiddenColumns, defaultColumnsByKey[column.id]) ? 'Open' : 'Close'}</button>
                            }
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map((cell, index) => {
                            if(index === 0) {
                                return <th {...cell.getCellProps()}>{cell.render('Cell')}</th>;
                            } else {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            }
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

function App() {
    const [columns, setColumns] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [columnCount, setColumnCount] = useState(0);

    useEffect(() => {
        fetch('http://localhost:9001/lenders').then(async(response) => {
            const data = await response.json();

            window.localStorage.setItem("lenders", JSON.stringify(data));
            const lenderData = data.map((lender) => {
                return {
                    csq: lender.name
                };
            })
            setRowData([...rowData, ...lenderData])
        });
    }, []);

    const fetchNiches = () => {
        fetch('http://localhost:9001/niches/' + columnCount).then(async(response) => {
            setColumnCount(columnCount + 1);
            const data = await response.json();
            console.time('Render');
            const newColumns = data.columns.map(({ label, id }) => ({
                Header: label,
                accessor: id
            }));
            setColumns([...columns, ...newColumns]);

            let newRowData = [];
            let newLenderRowData = [];
            if(rowData.length === 0) {
                newRowData = data.rowData.map(({ lenderInfo: { name: lenderName }, cellData }) => {
                    const cellValues = cellData.reduce((cur, acc) => {
                        return {
                            ...cur,
                            [acc.columnId]: acc.value
                        }
                    }, {});
                    return {
                        "csq": lenderName,
                        ...cellValues
                    }
                });
            } else {
                newLenderRowData = data.rowData.filter(({ lenderInfo }) => !_.find(rowData, { csq: lenderInfo.name }))
                    .map(({ lenderInfo: { name: lenderName }, cellData }) => {
                        const cellValues = cellData.reduce((cur, acc) => {
                            return {
                                ...cur,
                                [acc.columnId]: acc.value
                            }
                        }, {});
                        return {
                            "csq": lenderName,
                            ...cellValues
                        }
                    });
                newRowData = data.rowData.filter(({ lenderInfo }) => _.find(rowData, { csq: lenderInfo.name }))
                    .map(({ lenderInfo: { name: lenderName }, cellData }) => {
                        const cellValues = cellData.reduce((cur, acc) => {
                            return {
                                ...cur,
                                [acc.columnId]: acc.value
                            }
                        }, {});
                        const currElement = _.find(rowData, { csq: lenderName });
                        return {
                            ...currElement,
                            ...cellValues
                        }
                    });
            }
            if(newRowData.length === 0) {
                setRowData([...rowData, ...newLenderRowData]);
            } else {
                setRowData([...newRowData, ...newLenderRowData]);
            }
            console.timeEnd("Render");
        });
    }

    const cols = React.useMemo(
        () => {
            return [{
                Header: `CSQ`,
                accessor: `csq`
            }, ...columns];
        },
        [columns]
    );

    const data = React.useMemo(() => [...rowData], [rowData]);

    return (
        <>
            <button type="button" onClick={fetchNiches} style={{ margin: '10px' }}
                    disabled={columnCount === 7}>AddColumns {columnCount}</button>
            <Styles>
                <Table columns={cols} data={data}/>
            </Styles>
        </>
    )
}

// Checks if secondary list subset of main list
function isSubset(main, secondary) {
    return secondary.every(e => main.includes(e));
}

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter }, }) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

export default App
