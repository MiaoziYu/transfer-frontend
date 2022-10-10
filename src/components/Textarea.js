const Textarea = props => {
  const { id, name, value, onChange, error } = props;

  return (
    <>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      />
      <p>{error}</p>
    </>
  )
};

export default Textarea;
