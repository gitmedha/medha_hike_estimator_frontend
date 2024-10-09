export const GET_PICKLIST = `
  query GET_PICKLIST_VALUES(
    $table: String!
    $field: String
  ) {
    picklistFieldConfigs(where: {
      table: $table,
      field: $field
    }) {
      table
      field
      values
    }
  }
`;