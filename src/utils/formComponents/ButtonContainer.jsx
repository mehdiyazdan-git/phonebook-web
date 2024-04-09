import React from 'react';

const ButtonContainer = ({children,lastChild}) => {
    return (
        <div style={{backgroundColor:"rgba(255,255,255,0.2)"}} className={"d-flex justify-content-between mt-3 border border-dark-subtle p-3 rounded"}>
            <div className={'d-flex justify-content-start mt-3'}>
                {children}
            </div>
            <div className={'d-flex justify-content-end mt-3'}>
                {lastChild}
            </div>
        </div>
    );
};

export default ButtonContainer;