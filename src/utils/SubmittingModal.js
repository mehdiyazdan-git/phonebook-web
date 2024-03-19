import {ClipLoader} from "react-spinners";

const SubmittingModal = ({loading}) => {
    return (
        <div className="sweet-loading">
            <ClipLoader
                color="#366cd6"
                loading={loading}
            />
        </div>
    );
};

export default SubmittingModal;
