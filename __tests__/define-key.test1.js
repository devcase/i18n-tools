import defineKey from '../src/define-key'

test("Abraço", () => {
    expect(defineKey("Abraço")).toBe("h0498558838_abraco");
})

test("Reserva de Hotéis", () => {
    expect(defineKey("Reserva de Hotéis")).toBe("h1546387703_reserva-de-hoteis");
})

test("Marcadores", () => {
    expect(defineKey("Marcadores")).toBe("h3565928867_marcadores");
})

test("Formato: +{código país}{código estado}{telefone}", () => {
    expect(defineKey("Formato: +{código país}{código estado}{telefone}")).toBe("h0140354009_formato-codigo-pais-codigo-estado-telefone");
})

test("(total com impostos e taxas)", () => {
    expect(defineKey("(total com impostos e taxas)")).toBe("h3705692813_total-com-impostos-e-taxas");
})
