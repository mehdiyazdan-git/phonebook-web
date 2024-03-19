export function Input({ register, name, errors, label, style, ...rest }) {
    const hasError = errors && errors[name];

    return (
        <div>
            <label className="label">{label}</label>
            <input
                {...register(name)}
                {...rest}
                placeholder={hasError ? errors[name].message : ''}
                className={hasError ? "red-placeholder" : ""}
                style={{
                    border: hasError ? '1px solid red' : '1px solid #73b5fe',
                    color: hasError ? 'red' : '#000',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    fontSize: "0.8rem",
                    ...style
                }}
            />
        </div>
    );
}



