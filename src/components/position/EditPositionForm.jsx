import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {Alert, Modal} from 'react-bootstrap';
import { TextInput } from "../../utils/formComponents/TextInput";
import Button from "../../utils/Button";
import {Form} from "../../utils/Form";
import useHttp from "../../hooks/useHttp";
import {bodyStyle, headerStyle, titleStyle} from "../../settings/styles";

const EditPositionForm = ({ position, onUpdatePosition, show, onHide }) => {
    const [formError, setFormError] = useState('');
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('نام پست الزامیست.')
    });
  const resolver = yupResolver(validationSchema);

    const http = useHttp();

    const [createAtJalali, setCreateAtJalali] = React.useState('');
    const [lastModifiedAtJalali, setLastModifiedAtJalali] = React.useState('');
    const [createByFullName, setCreateByFullName] = React.useState('');
    const [lastModifiedByFullName, setLastModifiedByFullName] = React.useState('');

    const findById = async (id)     => {
        return await http.get(`/positions/${id}`).then(r => r.data);
    }

    useEffect(() => {
        if (position.id) {
            findById(position.id).then(r => {
                setCreateAtJalali(r.createAtJalali)
                setLastModifiedAtJalali(r.lastModifiedAtJalali)
                setCreateByFullName(r.createByFullName)
                setLastModifiedByFullName(r.lastModifiedByFullName)
            });
        }
    }, []);
    const onSubmit = async data => {
        try {
          const message =  await  onUpdatePosition(data);
          if (message){
              setFormError(message);
              setTimeout(() => {
                  setFormError('');
              }, 3000);
          } else {
              setFormError('');
              onHide(); // Close the modal
              }

        } catch (error) {
            console.error('There was an error updating the position:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header style={headerStyle}>
                <Modal.Title style={titleStyle}>ویرایش پست</Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <Form
                    onSubmit={onSubmit}
                    defaultValues={position}
                    resolver={resolver}
                >
                    <TextInput
                        label="شناسه پست"
                        name={"id"}
                        disabled={true}
                    />
                    <TextInput
                        label="نام پست"
                        name={"name"}
                    />
                    <div className="form-group">
                        <Button type="submit" variant="success">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning">
                            انصراف
                        </Button>
                    </div>
                </Form>
                <hr/>
                <div className="row mt-3 mb-0" style={{
                    fontFamily: 'IRANSans',
                    fontSize: '0.8rem',
                    marginBottom: 0
                }}>
                    <div className="col">
                        <p>{`ایجاد : ${createByFullName}`} | {` ${createAtJalali}`}</p>
                    </div>
                    <div className="col">
                        <p>{`آخرین ویرایش : ${lastModifiedByFullName}`} | {`${lastModifiedAtJalali}`}</p>
                    </div>
                </div>
                {formError && (
                    <Alert style={{
                        fontFamily: "IRANSans",
                        fontSize: "0.7rem",
                        fontWeight: "bold"
                    }} variant="danger">{formError}</Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditPositionForm;
