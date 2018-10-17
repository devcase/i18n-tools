import plugin from '../src/babel-plugin-i18n-translate'
import * as babel from '@babel/core'

it('works', () => {
    const example = `
    import React from 'react';
    
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

  const {code} = babel.transform(example, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});