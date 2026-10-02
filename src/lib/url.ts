// Prefix an internal path with the deploy base ("/portfolio/").
export const url = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
