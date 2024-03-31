import React from 'react';

export default (props) => {
    return (
        <div
            style={{ backgroundColor: 'transparent', height: '9%',fontFamily:"IRANSans",fontSize:"1rem" }}
        >
            <i className="fas fa-hourglass-half"> {props.loadingMessage} </i>
        </div>
    );
};
