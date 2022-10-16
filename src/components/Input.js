const Input = props => {
  const { id, name, value, placeholder, onChange, required, error } = props;

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
      />
      <p className="form__error">{error}</p>
    </>
  )
};

export default Input;
