import defineKey from '../src/define-key'

test("Abraço", () => {
    expect(defineKey("Abraço")).toBe("abraco");
})

test("Reserva de Hotéis", () => {
    expect(defineKey("Reserva de Hotéis")).toBe("reserva-de-hoteis");
})

test("Marcadores", () => {
    expect(defineKey("Marcadores")).toBe("marcadores");
})

test("Formato: +{código país}{código estado}{telefone}", () => {
    expect(defineKey("Formato: +{código país}{código estado}{telefone}")).toBe("formato-codigo-pais-codigo-estado-telefone");
})