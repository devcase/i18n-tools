import defineKey from '../define-key'

test("Abraço", () => {
    expect(defineKey("Abraço")).toMatch("abraco");
})

test("Reserva de Hotéis", () => {
    expect(defineKey("Reserva de Hotéis")).toMatch("reserva-de-hoteis");
})

test("Marcadores", () => {
    expect(defineKey("Marcadores")).toMatch("marcadores");
})

test("Formato: +{código país}{código estado}{telefone}", () => {
    expect(defineKey("Formato: +{código país}{código estado}{telefone}")).toMatch("formato-codigo-pais-codigo-estado-telefone");
})