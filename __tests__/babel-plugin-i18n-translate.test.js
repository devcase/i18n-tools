import plugin from "../src/babel-plugin-i18n-translate";
import * as babel from "@babel/core";

it("works", () => {
  const example = `
    import React from 'react'

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
`;

  const { code } = babel.transform(example, {
    plugins: [[plugin, { locale: "en-US" }]],
  });
  expect(code).toMatchSnapshot();
});

it.only("com apostofre", () => {
  const example = `
    const x = {
        label: 'E-mail do solicitante'
    }
`;

  const { code } = babel.transform(example, {
    configFile: false,
    plugins: [[plugin, { locale: "en-US" }]],
  });
  expect(code).toBe(`"use strict";

  var x = {
      label: 'Requestor\'s email'
  }
`);
});

it("espanol", () => {
  const example = `
    const x = {
        label: 'Últimas 24 horas'
    }
`;

  const { code } = babel.transform(example, {
    plugins: [[plugin, { locale: "es" }]],
  });
  expect(code).toBe(`"use strict";

  var x = {
      label: 'Últimas 24 horas'
  }
`);
});
