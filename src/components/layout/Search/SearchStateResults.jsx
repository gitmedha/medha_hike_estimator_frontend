import styled from "styled-components";
import { connectStateResults } from 'react-instantsearch-dom';
import SearchHits from './SearchHits';
import { useState } from "react";
import onClickOutside from "react-onclickoutside";

const SearchStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border: 1.5px solid #D7D7E0;
  box-sizing: border-box;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  width: calc(100% - 10px);
  position: absolute;
  margin-top: 5px;
  font-size: 14px;
  line-height: 18px;
  left: 5px;

  .header {
    padding: 15px 5px 5px;
    display: flex;
    align-items: center;
  }

  .filter-by-text {
    display: none;
    font-family: 'Latto-Bold';
    color: #C4C4C4;
    margin-right: 15px;
  }

  .badges {
    display: flex;
    align-items: center;

    .badge {
      height: 25px;
      padding-left: 5px !important;
      padding-right: 5px !important;
      margin-right: 5px;
      color: white;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      min-width: 0;
      font-size: 12px;
      line-height: 18px;

      &.badge-institutions {
        background-color: #FC636B;
      }
      &.badge-students {
        background-color: #FF9700;
      }
      &.badge-employers {
        background-color: #0096FF;
      }
      &.badge-batches {
        background-color: #AA223C;
      }
      &.badge-opportunities {
        background-color: #207B69;
      }
      &.badge-institutions-light {
        background-color: #FC636B66;
      }
      &.badge-students-light {
        background-color: #FDDAA7;
      }
      &.badge-employers-light {
        background-color: #1AAFD0;
      }
      &.badge-batches-light {
        background-color: #DFBAC1;
      }
      &.badge-opportunities-light {
        background-color: #7bb47b;
      }
      &.badge-disabled {
        background-color: #C4C4C4;
      }
    }
  }
  .no-results {
    padding: 5px;
  }

  @media screen and (min-width: 768px) {
    .header {
      padding: 15px 15px 10px;
    }
    .filter-by-text {
      display: flex;
    }
    .badges {
      .badge {
        height: 30px;
        padding-left: 20px !important;
        padding-right: 11px !important;
        margin-right: 15px;
        font-size: 14px;
        line-height: 18px;
      }
    }
    .no-results {
      padding: 15px;
    }
  }
  @media screen and (max-width: 360px) {
    .header {
      height: 50px;
      overflow-y: scroll;
    }
}
`;

const SearchStateResults = (props) => {
  let { searchState, setSearchState, searchResults, onSearchIndexUpdate, hitsData } = props;
  const hasResults = searchResults && searchResults.nbHits !== 0;
  const hasQuery = props.searchState && props.searchState.query;
  const [activeFilterBy, setActiveFilterBy] = useState(props.searchIndex || 'institutions');

  const handleFilterBy = (indexName) => {
    setActiveFilterBy(indexName);
    onSearchIndexUpdate(indexName);
  }

  SearchStateResults.handleClickOutside = (event) => {
    let element = document.getElementById('search-state-container');
    if (!element.hasAttribute('hidden') && event.target.id !== 'input-meilisearch') {
      setSearchState({
        ...searchState,
        query: '',
      });
    }
  }

  return (
    <SearchStateContainer id="search-state-container" hidden={!hasQuery}>
      <div className="header">
        <div className="filter-by-text">Filter by</div>
        <div className="badges">
          <div className={`badge ${activeFilterBy === 'students' ? 'badge-students' : (hitsData.students && hitsData.students.nbHits ? 'badge-students-light' : 'badge-disabled')}`} onClick={() => handleFilterBy('students')}>
            Students {hitsData.students ? `(${hitsData.students.nbHits})` : ''}
          </div>
          <div className={`badge ${activeFilterBy === 'institutions' ? 'badge-institutions' : (hitsData.institutions && hitsData.institutions.nbHits ? 'badge-institutions-light' : 'badge-disabled')}`} onClick={() => handleFilterBy('institutions')}>
            Institutions {hitsData.institutions ? `(${hitsData.institutions.nbHits})` : ''}
          </div>
          <div className={`badge ${activeFilterBy === 'batches' ? 'badge-batches' : (hitsData.batches && hitsData.batches.nbHits ? 'badge-batches-light' : 'badge-disabled')}`} onClick={() => handleFilterBy('batches')}>
            Batches {hitsData.batches ? `(${hitsData.batches.nbHits})` : ''}
          </div>
          <div className={`badge ${activeFilterBy === 'employers' ? 'badge-employers' : (hitsData.employers && hitsData.employers.nbHits ? 'badge-employers-light' : 'badge-disabled')}`} onClick={() => handleFilterBy('employers')}>
            Employers {hitsData.employers ? `(${hitsData.employers.nbHits})` : ''}
          </div>
          <div className={`badge ${activeFilterBy === 'opportunities' ? 'badge-opportunities' : (hitsData.opportunities && hitsData.opportunities.nbHits ? 'badge-opportunities-light' : 'badge-disabled')}`} onClick={() => handleFilterBy('opportunities')}>
            Opportunities {hitsData.opportunities ? `(${hitsData.opportunities.nbHits})` : ''}
          </div>
        </div>
      </div>
      {hasResults ? (
        <SearchHits searchState={searchState} setSearchState={setSearchState} searchIndex={activeFilterBy} />
      ) : (
        <div className="no-results">
          No results found
        </div>
      )}

    </SearchStateContainer>
  );
};

const clickOutsideConfig = {
  excludeScrollbar: true,
  handleClickOutside: () => SearchStateResults.handleClickOutside,
};

export default onClickOutside(connectStateResults(SearchStateResults), clickOutsideConfig);