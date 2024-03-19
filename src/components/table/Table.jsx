import React, { useState } from 'react';
import Th from './Th';
import SearchInput from './SearchInput';
import SearchDateInput from './SearchDateInput';
import IconEdit from '../assets/icons/IconEdit';
import IconDeleteOutline from '../assets/icons/IconDeleteOutline';
import Pagination from '../pagination/Pagination';
import useDeepCompareEffect from '../../hooks/useDeepCompareEffect';
import ConfirmationModal from './ConfirmationModal';

const Table = ({ columns, fetchData, onEdit, onDelete, refreshTrigger }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const initialSearchState = columns.reduce((acc, column) => {
        if (column.searchable) {
            acc[column.key] = '';
        }
        return acc;
    }, {});
    const [search, setSearch] = useState(initialSearchState);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        sessionStorage.setItem('currentPage', newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        sessionStorage.setItem('pageSize', newPageSize);
    };

    const handleDeleteConfirm = () => {
        if (selectedItem) {
            onDelete(selectedItem);
            setShowConfirmationModal(false);
            setSelectedItem(null);
        }
    };

    useDeepCompareEffect(() => {
        const load = async () => {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
                sortBy: sortBy,
                order: sortOrder,
                ...search,
            });
            const response = await fetchData(queryParams);
            setData(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        };
        load();
    }, [currentPage, pageSize, search, sortBy, sortOrder, refreshTrigger]);

    return (
        <>
            <table className="recipient-table table-fixed-height mt-3">
                <thead>
                <tr className="table-header-row">
                    {columns.map((column) => (
                        <Th
                            key={column.key}
                            width={column.width}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            setSortBy={setSortBy}
                            setSortOrder={setSortOrder}
                            sortKey={column.key}
                        >
                            {column.title}
                        </Th>
                    ))}
                    <th width="5%"></th>
                </tr>
                <tr className="table-header-row">
                    {columns.map((column) =>
                        column.searchable ? (
                            column.type === 'date' ? (
                                <SearchDateInput
                                    key={column.key}
                                    width={column.width}
                                    value={search[column.key] ? (column.render ? column.render(search[column.key]) : search[column.key]) : ''}
                                    onChange={(date) => setSearch({ ...search, [column.key]: date })}
                                />
                            ) : (
                                <SearchInput
                                    key={column.key}
                                    width={column.width}
                                    id={column.key}
                                    name={column.key}
                                    value={search[column.key]}
                                    onChange={(event) => setSearch({ ...search, [column.key]: event.target.value })}
                                />
                            )
                        ) : (
                            <th key={column.key} width={column.width}></th>
                        )
                    )}
                    <th width="5%"></th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((column) => (
                            <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
                        ))}
                        <td style={{ padding: '0px' }}>
                            <IconEdit style={{ margin: '0px 10px', cursor: 'pointer' }} fontSize={'1rem'} color="green" onClick={() => onEdit(item)} />
                            <IconDeleteOutline
                                style={{ cursor: 'pointer' }}
                                size={'1.5rem'}
                                onClick={() => {
                                    setSelectedItem(item.id);
                                    setShowConfirmationModal(true);
                                }}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalElements}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default Table;
