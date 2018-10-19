# i18n-tools

## Motivação

Necessidade de adicionar suporte a múltiplos idiomas a um software feito em Javascript.

## Objetivos

- Baixo impacto no código já existente
- Não aumentar a complexidade para o desenvolvimento de novas funcionalidades
- Compatibilidade com React
- Seguir o https://projectfluent.org/
- Futuro: customização do motor de regras (abaixo)

## Sobre a solução

A solução é composta por

- Extrator de textos do código existente para um arquivo da sintaxe de FTL <https://projectfluent.org/fluent/guide/>
- Plugin do [babel](https://babeljs.io) que traduz usando arquivos FTL

O extrator de texto e o plugin seguem algumas regras para identificar quais textos dentro do código Javascript passarão pelo fluxo de tradução automaticamente e quais precisam ser explicitamente identificados pelo desenvolvedor.

## Exemplo

Meu código:
```
import React from 'react'

export default function (props) {
    var value = {
        "label": "Incluir este texto",
        text: "Este texto também",
        "constantName": "Ignore this text",
        "error": "i18n:Erro de entrada"
    };
    return <div className="my-ignored-classname">
        <h1>Meu texto internacionalizável</h1>
        <input type="text" placeholder="Nome do usuário"/>
    </div>
}
```

Gera o arquivo `i18n/translations.ftl`:
```
erro-de-entrada = Erro de entrada
incluir-este-texto = Incluir este texto
nome-do-usuario = Nome do usuário
este-texto-tambem = Este texto também
meu-texto-internacionalizavel = Meu texto internacionalizável
```

## Regras

### Textos traduzidos automaticamente

TODO

### Textos traduzidos por opt-in

TODO

### Textos traduzidos automaticamente

TODO




