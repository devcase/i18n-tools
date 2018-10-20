import extractText from '../src/commons/extract-text'

test("test 1", () => {
    const code = `
        var x = "Este texto precisa ser extraído"
    `
    const results = extractText(code);
    expect(results).toMatchSnapshot()
})

test("test com jsx", () => {
    const code = `
        import React from 'react'
        
        function Component(props) {
            var url = "http://www.ignorar.esta.url.com.br";
            var camelCaseString = "IgnoreThisWord";
            return <div 
                label="Este é um label e precisa ser extraído" 
                className="mb-2 ignorethis"
                max="3">
                Este texto precisa ser extraído
                <span>Não reembolsável</span>
            </div>;
        }
    `
    const results = extractText(code)
    expect(results).toMatchSnapshot()

})


test("test com jsx 2", () => {
    const code = `
        import React from 'react'
        
        function Component(props) {
            return <div 
                className={"mb-2 ignorethis second-time"}
                max="3">
            </div>;
        }
    `
    const results = extractText(code)
    expect(results).toMatchSnapshot()

})

test("teste ignorar jquery", () => {
    const code = `
        import $ from 'jquery'
        
        $('.selectorjquery').hide();
    `
    const results = extractText(code, "teste ignorar jquery")
    expect(results).toMatchSnapshot()

})



test("teste template com jsx", () => {
    const code = "var x = <div className={`room-rate-row row no-gutters ${1==1 ? 'ignorethis' : ''}`}></div>"
    const results = extractText(code, "teste template")
    expect(results).toMatchSnapshot()

})


test("teste template 2", () => {
    const code = "var x = `template precisa ser internacionalizável`"
    const results = extractText(code, "teste template 2")
    expect(results).toMatchSnapshot()

})


test("README", () => {
    const code = `import React from 'react'

    export default function (props) {
        var value = {
            "label": "Incluir este texto",
            text: "Este texto também, mas sem as exclamações!!!!",
            "constantName": "Ignore this text",
            "error": "i18n:Erro de entrada"
        };
        return <div className="my-ignored-classname">
            <h1>     Meu texto internacionalizável!!!!</h1>
            <input type="text" placeholder="Nome do usuário"/>
        </div>
    }
    `
    const results = extractText(code, "README.md")
    expect(results).toMatchSnapshot()
})