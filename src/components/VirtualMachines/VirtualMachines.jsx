import React, { useEffect, useState } from 'react';
import useHttp from '../../hooks/useHttp';

const VirtualMachines = () => {
    const http = useHttp();
    const [vms, setVms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadVms = async () => {
        setIsLoading(true);  // Start loading
        try {
            const response = await http.get('/vmware/vms');
            setVms(response.data);
            setIsLoading(false);  // Stop loading after data is fetched
        } catch (error) {
            console.error(error);
            setIsLoading(false);  // Stop loading if an error occurs
        }
    };
    const style = {
        textAlign: 'center',
        marginTop: '10px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: 'red',
        fontFamily: 'IRANSans'
    }

    useEffect(() => {
        loadVms();
    }, []);

    const columns = ['ردیف', 'شرکت', 'نام ماشین', 'آدرس IP', 'نام ریموت'];

    return (
        <div className="table-container" dir="rtl">
            {isLoading ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                    <strong style={style}>در حال بارگذاری...</strong>
                </p>
            ) : (
                <>
                    <table className="recipient-table table-fixed-height mt-3">
                        <thead>
                        <tr className="table-header-row">
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {vms.length > 0 ? (
                            vms.map((vm, index) => (
                                <tr key={vm.name}>
                                    <td>{index + 1}</td>
                                    <td>{vm.notes}</td>
                                    <td>{vm.name}</td>
                                    <td>{vm.ipAddress}</td>
                                    <td>{vm.guestHostName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} style={style}>اطلاعاتی برای نمایش وجود ندارد</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <p style={style}>
                        * اگر نام ریموت و آدرس IP ماشین خالی است. احتمالا VMware Tools برای آن ماشین نصب نشده است.
                    </p>
                </>
            )}
        </div>
    );
};

export default VirtualMachines;
