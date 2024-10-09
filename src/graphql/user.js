export const GET_ALL_USERS = `
query GET_ALL_USERS {
  users(
    sort: "username:asc"
    where: {_or: [{ blocked_null: "true" }, { blocked_contains: "false" }] }
  ) {
    id
    username
    email
  }
}
`;

export const FILTER_USERS_BY_NAME = `
query GET_ALL_USERS($name:String) {
  users(
    sort: "username:asc"
    where: {username_contains: $name, _or: [{ blocked_null: "true" }, { blocked_contains: "false" }] }
  ) {
    id
    username
    email
  }
}
`;
export const GET_USERS_BY_ROLE =`
  query GET_ALL_USERS($roleid:Int){
    users(
      sort:"username:asc"
      where:{role:$roleid }
    ){
      id,
      username,
      email,
    }
  }
`
