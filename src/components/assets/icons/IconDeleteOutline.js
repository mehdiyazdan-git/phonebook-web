import * as React from "react";

function IconDeleteOutline(props) {
    return (
        <svg
            baseProfile="tiny"
            viewBox="0 0 24 24"
            fill="currentColor"
            fontSize={props.size}
            color="red"
            height="1em"
            width="1em"
            {...props}
        >
            <path d="M12 3c-4.963 0-9 4.038-9 9s4.037 9 9 9 9-4.038 9-9-4.037-9-9-9zm0 16c-3.859 0-7-3.14-7-7s3.141-7 7-7 7 3.14 7 7-3.141 7-7 7zm.707-7l2.646-2.646a.502.502 0 000-.707.502.502 0 00-.707 0L12 11.293 9.354 8.646a.5.5 0 00-.707.707L11.293 12l-2.646 2.646a.5.5 0 00.707.708L12 12.707l2.646 2.646a.5.5 0 10.708-.706L12.707 12z" />
        </svg>
    );
}

export default IconDeleteOutline;
