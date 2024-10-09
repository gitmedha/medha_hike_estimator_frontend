import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  z-index: 1;
  height: 100vh;
  display: flex;
  overflow: auto;
  @extend .container;
  flex-direction: column;
  background-color: white;
`;

export default Container;
