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
      className="search-input"
      onChange={handleSearch()}
      placeholder="Search for account holder or note">
    </input>
  )
}