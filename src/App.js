import React, { useState } from 'react'
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
                            console.log('cell', cell);
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
    const [columnCount, setColumnCount] = useState(7);
    const columns = React.useMemo(
        () => {
            return Array(columnCount).fill(0).map((item, index) => {
                return {
                    Header: `Column ${index + 1}`,
                    accessor: `column${index}`,
                    sticky: 'top',
                }
            })
        },
        [columnCount]
    );

    const handleAddColumn = () => {
        setColumnCount(columnCount + Math.trunc(Math.random() * 10))
    }

    const data = React.useMemo(() => makeData(100, columnCount), [columnCount])

    console.log(columns, data);

    return (
        <>
            <button type="button" onClick={handleAddColumn} style={{ margin: '10px' }}>AddColumns {columnCount}</button>
            <Styles>
                <Table columns={columns} data={data}/>
            </Styles>
        </>
    )
}

export default App
