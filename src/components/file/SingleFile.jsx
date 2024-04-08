import React, { useEffect, useRef, useReducer } from "react";
import PropTypes from "prop-types";
// Styles
import styles from "./SingleFile.module.css";
import {BsFileImage} from "react-icons/bs";
// Icons


const reducer = (state, action) => {
    switch (action.type) {
        case "SET_MODE":
            return { ...state, mode: action.payload };
        case "SET_RESPONSE":
            return { ...state, response: { ...state.response, ...action.payload } };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SET_DROP_DEPTH":
            return { ...state, dropDepth: action.dropDepth };
        case "SET_IN_DROP_ZONE":
            return { ...state, inDropZone: action.inDropZone };
        case "ADD_FILE":
            return { ...state, file: action.payload };
        case "DELETE_FILE":
            return {
                ...state,
                file: undefined,
            };
        default:
            return state;
    }
};

// Take a file size in Bytes, KB, MB or GB
export const calcFileSize = (str) => {
    if (str === undefined)
        throw new Error("argument provided can't be undefined");
    if (typeof str !== "string")
        throw new Error("argument provided can only be an string");

    const myRegex = /(\d*\.*\d+)(.b)/gi;
    const match = myRegex.exec(str);
    const onlyNum = match[1];
    const unit = match[2].toUpperCase();
    const units = { KB: 1, MB: 2, GB: 3, TB: 4 };

    const convertFunc = (size, n) => {
        if (n === 0) return size;

        return convertFunc(size * 1024, n - 1);
    };

    return convertFunc(onlyNum, units[unit]);
};

// Take a number in bytes
export const convertToUnit = (bytes) => {
    if (bytes === undefined)
        throw new Error("argument provided can't be undefined");
    if (typeof bytes !== "number")
        throw new Error("argument provided can only be a number");

    const units = { 1: "KB", 2: "MB", 3: "GB", 4: "TB" };
    const convertFunc = (size, n) => {
        if (size < 1) {
            const finalCalc = Number.isInteger(size * 1024)
                ? size * 1024
                : (size * 1024).toFixed(2);
            return String(finalCalc) + units[n - 2];
        }

        return convertFunc(size / 1024, n + 1);
    };

    return convertFunc(bytes, 1);
};

// Convert type/extension to .extension
export const printTypes = (accept) => {
    if (!accept) return `"Provide valid file formats"`;
    if (typeof accept !== "object")
        return `"this function only accept an array like argument"`;

    const mapped = accept.map((type, i) => {
        let toPrint = type.match(/\/\w+/g)[0].replace("/", ".");

        if (i === accept.length - 1) return toPrint + " ";

        return toPrint + ", ";
    });

    return mapped.join("");
};

function ListFiles({ data, uploadFiles, deleteFiles, fileInput, dispatch }) {
    const handleDeleteFile = (fileUploaded) => {
        if (fileUploaded) deleteFiles(data.file);
        dispatch({ type: "DELETE_FILE" });
    };

    if (!data.file) return;

    return (
        <div className="al-w-full al-h-full al-relative al-grid al-grid-cols-12 al-grid-rows-2">
      <span className="al-block al-col-span-8 al-justify-self-start al-row-start-1">
        {data.file.name}{" "}
          <span className="al-text-gray-400">{convertToUnit(data.file.size)}</span>
      </span>
            <span className="al-text-sm al-text-bg al-block al-col-span-8 al-justify-self-start al-self-end al-row-start-2">
        {/* File Uploaded */}
                {data.response?.data?.status === 200 ? (
                    <button onClick={() => handleDeleteFile(true)} className="text-bg">
                        Delete File
                    </button>
                ) : (
                    <>
                        <button onClick={() => fileInput.current.click()}>
                            Select file
                        </button>
                        <button onClick={uploadFiles} className="ml-3">
                            Upload
                        </button>
                        <button
                            onClick={() => handleDeleteFile()}
                            className="al-text-bg al-ml-3 danger"
                        >
                            Delete
                        </button>
                    </>
                )}
      </span>
            <span className="al-w-10 al-p-3 al-flex al-justify-center al-row-span-2 al-col-start-12 al-mr-6 al-items-center al-rounded-[50%] al-bg-black/5 al-block al-h-10">
        <BsFileImage className="al-text-bg" />
      </span>
        </div>
    );
}

function Uploading({ dispatch, data, accept, maxFileSize }) {
    const loadingBarRef = useRef();

    useEffect(() => {
        if (data.response.percent <= 100) {
            loadingBarRef.current.style = `width: ${String(data.response.percent)}%;`;
        }
    }, [data.response.percent]);

    // Response is completed, update mode
    useEffect(() => {
        const status = data.response?.data?.status;
        if (status === 200) dispatch({ type: "SET_MODE", payload: 1 });
    }, [data.response, dispatch]);

    return (
        <div className="al-grid al-grid-cols-12 al-grid-rows-4 al-w-full al-h-full">
      <span className="al-col-span-8 al-justify-self-start al-row-start-1 al-block al-text-bg">
        Uploading
      </span>
            <span
                className={`al-col-span-8 al-justify-self-start al-row-start-3 al-block al-text-sm ${
                    data.response.err ? "al-text-bg danger" : "al-text-gray-400"
                }`}
            >
        {data.response.err
            ? "An error has occurred, upload the file again"
            : `${printTypes(accept)} files up to ${maxFileSize} in size`}
      </span>
            <span className="al-col-start-12 al-row-start-2 al-text-bg al-text-xl al-font-bold al-opacity-50 al-right-0">
        {data.response.percent}%
      </span>
            <span
                ref={loadingBarRef}
                className={`al-bg-bg al-absolute al-bottom-0 al-left-0 ${
                    data.response.percent === 100 ? "al-rounded-br-md" : "al-rounded-r-md"
                } al-rounded-bl-md al-h-1`}
            ></span>
        </div>
    );
}

function DragAndDrop({
                         palette = "primary",
                         dispatch,
                         data,
                         handleFileInput,
                         children,
                     }) {
    const dropzoneStyle = `${
        data.inDropZone ? "al-bg-bg" : "al-bg-gray-100"
    } al-flex al-flex-col al-justify-center al-items-center al-rounded-md al-shadow-md al-relative hover:al-shadow-xl al-w-[40rem] al-h-20 al-p-4 ${palette}`;
    // Manage file drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // If file is being uploaded or is completed
        if (
            data.response.percent > 0 ||
            data.response.data?.status ||
            data.response.data?.err
        )
            return;

        e.dataTransfer.dropEffect = "copy";
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth + 1 });
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (data.dropDepth === 0) return;
        dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth - 1 });
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If file is being uploaded or is completed
        if (
            data.response.percent > 0 ||
            data.response.data?.status ||
            data.response.data?.err
        )
            return;

        let files = [...e.dataTransfer.files];

        if (files && files.length > 0) {
            handleFileInput(files);
            e.dataTransfer.clearData();
            dispatch({ type: "SET_DROP_DEPTH", dropDepth: 0 });
            dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
        }
    };

    return (
        <div
            className={`${styles["drop-zone"]} ${dropzoneStyle}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {data.inDropZone ? (
                <BsFileImage className="al-h-6 al-w-6 al-block al-text-text" />
            ) : (
                children
            )}
        </div>
    );
}

function SingleFile({ palette = "primary", maxFileSize, accept, onUpload, onDelete }) {
    const [data, dispatch] = useReducer(reducer, {
        file: undefined,
        mode: 0,
        dropDepth: 0,
        inDropZone: false,
        error: { code: 0, message: "" },
        response: { percent: 0, data: undefined, err: undefined },
    });
    // Refs
    const fileInputRef = useRef();

    // Read file
    const handleFileInput = (files) => {
        const [file] = files;
        if (!file) return;

        // Compare maxFileSize with new input file size
        if (file.size > calcFileSize(maxFileSize)) {
            dispatch({
                type: "SET_ERROR",
                payload: {
                    code: 1,
                    message: `The file weight more than ${maxFileSize}`,
                },
            });
            return false;
        }

        // Check if fileType is accepted
        if (!accept.includes(file.type)) {
            dispatch({
                type: "SET_ERROR",
                payload: {
                    code: 1,
                    message: `${file.type} file type is not accepted`,
                },
            });
            return false;
        }

        if (data.file?.name === file.name) return;

        // Update data.file
        dispatch({ type: "ADD_FILE", payload: file });

        // Update component mode
        dispatch({ type: "SET_MODE", payload: 1 });
    };

    // Upload File
    const uploadFiles = () => {
        const formData = new FormData();
        formData.set("file", data.file);

        // Update component mode
        dispatch({ type: "SET_MODE", payload: 2 });

        // Pass file to handle prop
        onUpload(formData, (response) => {
            dispatch({
                type: "SET_RESPONSE",
                payload: response,
            });
        });
    };

    const modes = () => {
        // List Files
        if (data.mode === 1)
            return (
                <ListFiles
                    dispatch={dispatch}
                    data={data}
                    uploadFiles={uploadFiles}
                    deleteFiles={onDelete}
                    fileInput={fileInputRef}
                />
            );

        // Uploading
        if (data.mode === 2)
            return (
                <Uploading
                    {...{ dispatch, data }}
                    accept={accept}
                    maxFileSize={maxFileSize}
                />
            );

        return (
            <div className="al-grid al-grid-cols-12 al-grid-rows-4 al-w-full al-h-full">
        <span className="al-col-span-8 al-justify-self-start al-row-start-1 al-block al-text-bg">
          Select or drag a file
        </span>
                <span
                    className={`al-col-span-8 al-justify-self-start al-row-start-3 al-block al-text-sm ${
                        data.error.code === 1 ? "al-text-bg danger" : "al-text-gray-400"
                    }`}
                >
          {data.error.code === 1
              ? data.error.message
              : `${printTypes(accept)} files up to ${maxFileSize} in size`}
        </span>
            </div>
        );
    };

    const resetComponent = () => {
        dispatch({
            type: "SET_RESPONSE",
            payload: { percent: 0, data: undefined, err: undefined },
        });
        dispatch({ type: "SET_MODE", payload: 0 });
        dispatch({ type: "SET_ERROR", payload: { code: 0, message: "" } });
    };

    // Reset mode
    useEffect(() => {
        if (!data.file && data.mode > 0) resetComponent();
    }, [data.file, data.mode]);

    // Reset error state
    useEffect(() => {
        if (data.error.code > 0 || data.response.err) {
            setTimeout(resetComponent, 1000 * 5);
        }
    }, [data.error, data.response.err]);

    return (
        <DragAndDrop {...{ dispatch, data, handleFileInput, palette }}>
            {modes()}
            <input
                data-testid="upload-input"
                ref={fileInputRef}
                onChange={(e) => handleFileInput([...e.target.files])}
                className={`${styles["custom-file-input"]} ${
                    data.file ? "al-hidden" : ""
                }`}
                type="file"
                id="myFile"
                name="filename"
            />
        </DragAndDrop>
    );
}
SingleFile.propTypes = {
    palette: PropTypes.string,
    maxFileSize: PropTypes.string,
    accept: PropTypes.array,
    onUpload: PropTypes.func,
    onDelete: PropTypes.func,
};

export default SingleFile;
