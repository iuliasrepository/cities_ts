import React, {useMemo, Dispatch, SetStateAction, useState} from "react";
import {useSortBy, useTable} from "react-table";
import {ICity} from "../App";
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import styles from "./Table.module.sass";

enum FILTER {
    TEXT,
    SELECT,
    RANGE
}

interface Props {
    tableData: ICity[],
    setTableData: Dispatch<SetStateAction<ICity[]>>
}

export default function Table({tableData, setTableData}: Props) {

    const [filters, setFilters] = useState<{
        [key: string]: (value: any) => boolean
    }>({})
    const filterOptions: {
        [key: string]: Set<string>
    } = {}
    tableData.map(el => Object.keys(el).forEach(key => {
        if (filterOptions[key] === undefined) {
            filterOptions[key] = new Set()
        }
        // @ts-ignore
        if (el[key] !== undefined) {
            // @ts-ignore
            filterOptions[key].add(String(el[key]))
        }
    }))

    const columns = React.useMemo(
        () => [
            {
                Header: 'Название',
                accessor: 'name',
                filter: FILTER.TEXT
            },
            {
                Header: 'Тип населенного пункта',
                accessor: 'type',
                filter: FILTER.SELECT
            },
            {
                Header: 'Район',
                accessor: 'area',
                filter: FILTER.TEXT
            },
            {
                Header: 'Население',
                accessor: 'population',
                filter: FILTER.RANGE
            },
            {
                Header: 'Удалить',
                accessor: 'remove'
            }
        ], [])

    const data: any = useMemo(() => tableData.map(el => ({
        ...el,
        remove: (
            <button
                onClick={() => setTableData(tableData.filter(({id}) => el.id !== id))}
            >
                Удалить
            </button>
        )
        // @ts-ignore
    })).filter(el => !Object.keys(filters).map(key => filters[key](el[key])).includes(false)), [
        tableData, setTableData, filters
    ])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups, // плохо прописаны типы
        rows,
        prepareRow,
    } = useTable({
            columns,
            data
        },
        useSortBy)

    return (
        <table className={styles} {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                        headerGroup.headers.map(column => (
                            <th key={column.id}>
                                <div className={styles.hColumn}>
                                    <div className={styles.hRow} {
                                        // @ts-ignore
                                        ...column.getHeaderProps(column.getSortByToggleProps())
                                    }>
                                        {column.render('Header')}
                                        <span className={styles.arrow}>
                                            {
                                                // @ts-ignore
                                                column.isSorted
                                                    // @ts-ignoreL
                                                    ? column.isSortedDesc
                                                    ? <IoMdArrowDropdown/>
                                                    : <IoMdArrowDropup/>
                                                    : ''
                                            }
                                        </span>
                                    </div>
                                    <div className={styles.hRow}>
                                        {
                                            // @ts-ignore
                                            column.filter === FILTER.TEXT && (
                                                <input type="text" onChange={({ target: { value } }) => {
                                                    setFilters({
                                                        ...filters,
                                                        // @ts-ignore
                                                        [column.id]: (string) => {
                                                            if (value) {
                                                                return typeof string === 'string'
                                                                    ? string.toLowerCase().includes(value.toLowerCase())
                                                                    : false
                                                            }
                                                            return true
                                                        }
                                                    })
                                                }}/>
                                            )
                                        }
                                        {
                                            // @ts-ignore
                                            column.filter === FILTER.SELECT && (
                                                <select defaultValue="" onChange={({ target: { value } }) => {
                                                    setFilters({
                                                        ...filters,
                                                        // @ts-ignore
                                                        [column.id]: (string) => {
                                                            if (value.length) {
                                                                return typeof string === 'string'
                                                                    ? string === value
                                                                    : false
                                                            }
                                                            return true
                                                        }
                                                    })
                                                }}>
                                                    <option value="" />
                                                    {
                                                        Array.from(
                                                            filterOptions[column.id] !== undefined
                                                                ? filterOptions[column.id]
                                                                : []
                                                        ).map((name: string, i) => (
                                                            <option key={i} value={name}>{name}</option>
                                                        ))
                                                    }
                                                </select>
                                            )
                                        }
                                        {
                                            // @ts-ignore
                                            column.filter === FILTER.RANGE && (
                                                <select defaultValue="" onChange={({ target: { value } }) => {
                                                    setFilters({
                                                        ...filters,
                                                        // @ts-ignore
                                                        [column.id]: (number) => {
                                                            if (value.length) {
                                                                return typeof number === 'number'
                                                                    ? JSON.parse(value).reduce((res: boolean, el: number, i: number) => i === 0
                                                                        ? number >= el
                                                                        : !res ? res : number < el, true)
                                                                    : false
                                                            }
                                                            return true
                                                        }
                                                    })
                                                }}>
                                                    <option value="" />
                                                    <option value="[0,500000]">до 500 000</option>
                                                    <option value="[500000,1000000]">от 500 000 до 1000000</option>
                                                    <option value="[1000000]">от 1000000</option>
                                                </select>
                                            )
                                        }
                                    </div>
                                </div>
                            </th>
                        ))
                    }
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
