import farmhash from 'farmhash';

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
export default function (text) {
    var r = text
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/\W/g, "-")
        .replace(/\-{2,}/g, "-")
        .toLowerCase()

    //all lowercase?
    var allLower = text === text.toLowerCase();

    if (r[0] === "-") r = r.substring(1)
    if (r[r.length - 1] === "-") r = r.substring(0, r.length - 1)

    // return "h" + pad(farmhash.hash32(text), 10) + "_" + r
    return r + (allLower ? "_lowercase" : "");
}