import React, {useMemo} from "react";
import { useTable } from "react-table";
import { ICity  } from "../App"

interface Props {
    tableData: ICity[]
}

export default function Table ( { tableData }: Props ){

    const columns = React.useMemo(
        () => [
            {
                Header: 'Название',
                accessor: 'name'
            },
            {
                Header: 'Тип населенного пункта',
                accessor: 'type'
            },
            {
                Header: 'Район',
                accessor: 'area'
            },
            {
                Header: 'Население',
                accessor: 'population'
            }


            ],[])

    const data: any = useMemo(()=>tableData,[tableData])
    console.log(data)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
    })

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
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
