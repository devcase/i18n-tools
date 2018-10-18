import * as queryString from 'query-string'

export default function (locale) {
    var parsed = queryString.parse(location.search);
    parsed  = {
        ...parsed,
        locale
    }
    location.search = queryString.stringify(parsed);
}
