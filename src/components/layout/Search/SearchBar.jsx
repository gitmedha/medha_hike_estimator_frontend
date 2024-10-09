import styled from "styled-components";
import { InstantSearch } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';
import { useEffect, useState } from "react";
import { MeiliSearch } from 'meilisearch'

const searchClient = instantMeiliSearch(
  process.env.REACT_APP_MEILISEARCH_HOST_URL,
  process.env.REACT_APP_MEILISEARCH_API_KEY,
);

const client = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const SearchContainer = styled.div`
  font-family: 'Latto-Regular';
  margin-right: auto;
  width: 100%;
`;

const SearchBar = () => {
  const [searchState, setSearchState] = useState({});
  const [searchIndexName, setSearchIndexName] = useState('students');
  const [hitsData, setHitsData] = useState({
    students: [],
    institutions: [],
    employers: [],
    batches: [],
    opportunities:[],
  });

  useEffect(async () => {
    let apiHitsData = {};

    if (searchState.query === '') {
      return;
    }

    // make api call to students
    await client.index('students').search(searchState.query).then(async data => {
      apiHitsData['students'] = data;
    });
    // make api call to institutions
    await client.index('institutions').search(searchState.query).then(async data => {
      apiHitsData['institutions'] = data;
    });
    // make api call to batches
    await client.index('batches').search(searchState.query).then(async data => {
      apiHitsData['batches'] = data;
    });
    // make api call to employers
    await client.index('employers').search(searchState.query).then(async data => {
      apiHitsData['employers'] = data;
    });
    await client.index('opportunities').search(searchState.query).then(async data => {
      apiHitsData['opportunities'] = data;
    });
    setHitsData(apiHitsData);
  }, [searchState])

  return (
    <SearchContainer className="mr-auto">
      <InstantSearch
        searchClient={searchClient}
        indexName={searchIndexName}
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <SearchField />
        <SearchStateResults searchState={searchState} setSearchState={setSearchState} searchIndex={searchIndexName} onSearchIndexUpdate={setSearchIndexName} hitsData={hitsData} />
      </InstantSearch>
    </SearchContainer>
  );
}

export default SearchBar;