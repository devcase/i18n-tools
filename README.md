# i18n-tools

## Motivação

Necessidade de adicionar suporte a múltiplos idiomas a um software feito em Javascript.

## Objetivos

- Baixo impacto no código já existente
- Não aumentar a complexidade para o desenvolvimento de novas funcionalidades
- Compatibilidade com React
- Seguir o https://projectfluent.org/

## Sobre a solução

A solução é composta por

- Extrator de textos do código existente para um arquivo da sintaxe de FTL <https://projectfluent.org/fluent/guide/>
- Plugin do [babel](https://babeljs.io) que traduz usando arquivos FTL

O extrator de texto e o plugin seguem algumas regras para identificar quais textos dentro do código Javascript passarão pelo fluxo de tradução automaticamente e quais precisam ser explicitamente identificados pelo desenvolvedor.


