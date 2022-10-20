const Input = props => {
  const { id, name, value, placeholder, onChange, required, error, role } = props;

  return (
    <>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        role={role}
      />
      <p className="form__error">{error}</p>
    </>
  )
};

export default Input;
