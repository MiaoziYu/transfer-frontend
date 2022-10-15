import { debounce } from '../../../helpers';

export const SearchInput = (props) => {
  const handleSearch = () => {
    return debounce((e) => {
      props.onChange(e.target.value)
    })
  }

  return (
    <input
      type="text"
      onChange={handleSearch()}
      placeholder="search for name or note">
    </input>
  )
}