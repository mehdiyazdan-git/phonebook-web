const CompanyBanner = ({caption, className}) => {
    return (
        <div className={className}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid lightgray",
                borderRadius: "5px",
                width: "100%",
                marginTop : "1rem",
                textAlign: "center",
                background: "50%",
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }}>
                <h5 style={{fontFamily: "IRANSansBold"}}>{caption}</h5>
            </div>
        </div>
    );
};

export default CompanyBanner;
