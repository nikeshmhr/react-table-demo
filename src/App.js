import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'

import makeData from './makeData'

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
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data
        });

// Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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

    // useEffect(() => {
    //     fetch('http://localhost:9001/lenders').then(async(response) => {
    //         const data = await response.json();
    //         setRowData([...rowData, ...data])
    //     });
    // }, []);

    const fetchNiches = () => {
        fetch('http://localhost:9001/niches/' + columnCount).then(async(response) => {
            setColumnCount(columnCount+1);
            const data = await response.json();
            const newColumns = data.columns.map(({ title, columnId }) => ({
                Header: title,
                accessor: `accessor-${columnId}`
            }));
            setColumns([...columns, ...newColumns]);

            console.log(data.data);
            let newRowData = null;
            if(rowData.length === 0) {
                newRowData = data.data.map(({ lenderName, values }) => {
                    return {
                        "csq": lenderName,
                        ...values
                    }
                });
            } else {
                newRowData = data.data.map(({values}, index) => {
                    return {
                        ...rowData[index],
                        ...values,
                    }
                })
            }

            console.log('existing rowdata ', rowData);
            console.log('new rowdata ', newRowData);

            setRowData([...newRowData]);
        });
    }

    const cols = React.useMemo(
        () => {
            console.log('something changed', columns);
            return [{
                Header: `CSQ`,
                accessor: `csq`
            }, ...columns];
        },
        [columns]
    );

    const data = React.useMemo(() => [...rowData], [rowData]);
    console.log('final', data);

    return (
        <>
            <button type="button" onClick={fetchNiches} style={{ margin: '10px' }}>AddColumns {columnCount}</button>
            <Styles>
                <Table columns={cols} data={data}/>
            </Styles>
        </>
    )
}

export default App
