import { negotiateLanguages } from 'fluent-langneg';
import * as queryString from 'query-string'

export default function(availableLocales) {
    var parsed = queryString.parse(location.search);
    const supportedLocales = negotiateLanguages(
        parsed.locale ? [parsed.locale, ...navigator.languages] : navigator.languages,  // requested locales
        availableLocales// available locales
    );

    const locale = supportedLocales[0]
      
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.charset = 'utf-8';
    script.timeout = 120;
    script.src = "/static/js/" + locale + "/bundle.js";
    head.appendChild(script);
}
