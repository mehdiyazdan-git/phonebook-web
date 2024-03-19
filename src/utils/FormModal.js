import React from 'react';
import Modal from 'react-bootstrap/Modal';

const FormModal = (props) => {
    return (
        <Modal onHide={props.onHide} show={props.show} {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.message}</p>
                {props.children}
            </Modal.Body>
            <div className="text-center" style={{fontFamily:"IRANSans",fontSize:"0.9rem"}}>
                <button className="button button-create mb-2" onClick={props.onHide}>
                    بستن
                </button>
            </div>
        </Modal>
    );
};

export default FormModal;
