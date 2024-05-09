import React, {useEffect, useState} from 'react';
import useHttp from "../../hooks/useHttp";
import Button from "../../utils/Button";

const PersonPositions = ({personId,onHide}) => {
    const [personPositions, setPersonPositions] = useState();
    const http = useHttp();
    const loadData = async (personId) => {
        return await http.get(`/board-members/find-all-by-person-id/${personId}`);
    }
    useEffect(() => {
        try {
           loadData(personId).then(response => {
               setPersonPositions(response.data)
           })
        }catch (e){
            if (!e.response && e.request){
                console.log(e)
            }
        }
    }, [personId]);
    let handleDelete = async (id) => {
        http.delete(`/board-members/${id}`).then(response => {
            if (response.status === 204){
                loadData(personId).then(response => {
                    setPersonPositions(response.data)
                })
            }
        });
    };
    return (
        <div style={{
            minHeight: "300px",
            width: "100%",
        }}>
            <div className="p-0" style={{
                width: "100%",
                height: "100%",
                minHeight: "300px",
                border: "1px solid #d8d8d8",
            }}>
                <table
                    style={{
                        fontFamily: "IRANSansBold",
                        fontSize: "0.8rem",
                        borderCollapse: "collapse"
                    }}
                    className="recipient-table table-bordered table-fixed-height">
                    <thead>
                    <tr className="table-header-row">
                        <th>سمت</th>
                        <th>شرکت</th>
                    </tr>
                    </thead>
                    <tbody>
                    {personPositions && personPositions.map(position => (
                        <tr>
                            <td>{position.positionName}</td>
                            <td>{position.companyCompanyName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Button variant={"warning"} onClick={onHide}>
                برگشت
            </Button>
        </div>
    );
};

export default PersonPositions;
