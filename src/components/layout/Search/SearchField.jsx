import styled from "styled-components";
import { connectSearchBox } from 'react-instantsearch-dom';
import { FaSearch } from "react-icons/fa";

const SearchInput = styled.div`
  width: 100%;
  padding-right: 10px;
  font-family: 'Latto-Bold';
  font-size: 14px;
  line-height: 1.2px;

  form {
    display: flex;
  }

  .input-group {
    position: relative;

    .icon {
      position: absolute;
      top: 5px;
      right: 25px;
      color: #C4C4C4;
    }
  }

  input {
    padding: 8px 30px;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #C4C4C4;

    &:focus {
      outline: none;
    }
  }
`;


const SearchField = ({ currentRefinement, refine }) => (
  <SearchInput>
    <form noValidate action="" role="search">
      <div className="input-group">
        <input
          type="search"
          placeholder="search for..."
          id="input-meilisearch"
          value={currentRefinement}
          onChange={event => refine(event.currentTarget.value)}
        />
        <div className="icon" hidden={currentRefinement}>
          <FaSearch size="20" />
        </div>
      </div>
    </form>
  </SearchInput>
);

export default connectSearchBox(SearchField);