export const getApiUrl = (endpoint) => {
    return `${process.env.REACT_APP_API}/${endpoint}`
}