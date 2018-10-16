export default function (text) {
    const r = text
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/\W/g, "-")
        .replace(/\-{2,}/g, "-")
        .toLowerCase()
    return r
}