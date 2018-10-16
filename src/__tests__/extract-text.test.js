import extractText from '../extract-text'

test("test 1", () => {
    const code = `
        var x = "Este texto precisa ser extraído"
    `
    const results = extractText(code);
    expect(results).toHaveLength(1)

    expect(results[0]).toMatchObject({
        key: "este-texto-precisa-ser-extraido",
        value: "Este texto precisa ser extraído",
        hash: 2951570100
    })
})

test("test com jsx", () => {
    const code = `
        import React from 'react'
        
        function Component(props) {
            return <div 
                label="Este é um label e precisa ser extraído" 
                className="mb-2 ignorethis"
                max="3">
                Este texto precisa ser extraído
            </div>;
        }
    `
    const results = extractText(code)
    expect(results).toMatchSnapshot()

})