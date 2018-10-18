import defineKey from '../src/define-key'

test("Abraço", () => {
    expect(defineKey("Abraço")).toMatchSnapshot()
})

test("Reserva de Hotéis", () => {
    expect(defineKey("Reserva de Hotéis!!!")).toMatchSnapshot()
})

test("Marcadores", () => {
    expect(defineKey("Marcadores")).toMatchSnapshot()
})

test("Formato: +{código país}{código estado}{telefone}", () => {
    expect(defineKey("Formato: +{código país}{código estado}{telefone}")).toMatchSnapshot()
})

test("(total com impostos e taxas)", () => {
    expect(defineKey("(total com impostos e taxas)")).toMatchSnapshot()
})
