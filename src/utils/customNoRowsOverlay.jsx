import React from 'react';

export default (props) => {
    return (
        <div
            style={{ backgroundColor: 'transparent', height: '9%',fontFamily:"IRANSans",fontSize:"1rem" }}
        >
            <i className="far fa-frown"> {props.noRowsMessageFunc()}</i>
        </div>
    );
};
