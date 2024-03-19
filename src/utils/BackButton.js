import {useNavigate} from "react-router-dom";

const BackButton = ({navigateUrl = -1,disabled = false}) => {
    const navigate = useNavigate();
    return (
        <button
            style={{fontFamily:"IRANSans"}}
            className="btn btn-warning btn-sm mt-2 mx-2"
            onClick={() => navigate(navigateUrl)}
            disabled={disabled}
        >
            برگشت
        </button>
    );
};

export default BackButton;
