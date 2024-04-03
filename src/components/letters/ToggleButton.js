import React, { useState } from 'react';
import {GrLock, GrUnlock} from "react-icons/gr";
import useHttp from "../../hooks/useHttp";

const ToggleButton = ({ letterId, initialLetterState, onUpdate }) => {
    const [letterState, setLetterState] = useState(initialLetterState);
    const http = useHttp();

     const updateLetterState = async (letterId, letterState) => {
        return await http.put(letterId, `/letters/update-state/${letterState === "DRAFT" ? "DELIVERED" : "DRAFT"}`);
    };

    const handleClick = async () => {
        try {
            updateLetterState(letterId,letterState).then(response => {
                if (response.status === 200) {
                    // Update the local state and trigger any additional callback
                    setLetterState((prevState) => (prevState === 'DRAFT' ? 'DELIVERED' : 'DRAFT'));
                    onUpdate && onUpdate();
                } else {
                    // Handle error scenario (e.g., show an error message)
                    console.error('Failed to update letter state:', response.statusText);
                }
            })
        } catch (error) {
            console.error('Error updating letter state:', error);
        }
    };
    return (
        <button style={{fontSize:"1rem",border: "none", background: "transparent", margin: "0", padding: "0"}}  onClick={handleClick}>
            {letterState === 'DRAFT' ? <GrLock /> : <GrUnlock />}
        </button>
    );
};

export default ToggleButton;
