//precisa ser atualizado para ./level3?locale=en-US
import("./level3").then(t => console.log(t.default))

//Não pode mexer em ./level4 (excluído nas regras do webpack)
import sublevel from './level4'

//Traduzido para inglês
var text = "i18n:Meu texto internacionalizável"

export default sublevel
