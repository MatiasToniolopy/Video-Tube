export const userAccessToken = () => {
    const accesToken  = localStorage.getItem('accessToken') !== 'undefined' ? JSON.parse(localStorage.getItem('accessToken')) : localStorage.clear();
    return accesToken;
};

export const fetchUser = () => {
    const userInfo  = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    return userInfo;
};