export const isSRM = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'srm';
}

export const isAdmin = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'admin';
}

export const isChapterHead = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'chapter head';
}

export const isPartnership = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'partnership';
}
export const isMedhavi = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole && userRole.toLowerCase() === 'medhavi';
}

export const getUser = () =>{
  const fullName = localStorage.getItem('user_name');
  return fullName;
}
