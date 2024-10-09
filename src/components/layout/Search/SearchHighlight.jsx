import styled from "styled-components";
import { connectHighlight } from 'react-instantsearch-dom';

const HighlightedText = styled.span`
  padding-top: 5px;
  padding-bottom: 5px;
  background: rgba(218, 91, 91, 0.3);
`;

const SearchHighlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <span>
      {parsedHit.map(
        (part, index) =>
          part.isHighlighted ? (
            <HighlightedText key={index}>{part.value}</HighlightedText>
          ) : (
            <span key={index}>{part.value}</span>
          )
      )}
    </span>
  );
};

export default connectHighlight(SearchHighlight);