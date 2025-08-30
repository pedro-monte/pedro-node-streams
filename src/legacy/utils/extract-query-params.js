export function extractQueryParams (query) {
    return query
        .replace('?', '')
        .split('&')
        .map(param => param.split('='))
        .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
        }, {});
}