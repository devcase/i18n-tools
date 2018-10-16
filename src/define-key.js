export default function (text) {
    while (text[text.length - 1].match(/\W/)) {
        text = text.substring(0, text.length - 1)
    }
    const r = text
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/\W/g, "-")
        .replace(/\-{2,}/g, "-")
        .toLowerCase()
    
    return r
}