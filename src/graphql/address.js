export const GET_ALL_ADDRESS = `
query GET_ALL_ADDRESS {
  geographiesConnection {
    groupBy {
      state {
        key
      }
    }
  }
}
  `;
  export const GET_ALL_DISTRICTS = `
  query GET_GEOGRAPHIES($state: String) {
    geographiesConnection(where: { state: $state }) {
      groupBy {
        district {
          key
        }
        area {
          key
        }
        city {
          key
        }
      }
    }
  }
  
`;


