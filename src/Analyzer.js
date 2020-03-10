import tokens from './Tokens'

export default function analise(code) {
    //verifica se o codigo (sem espaços) é vazio e cancela a analise caso for
    if (code.trim() === '')
        return

    //separa o texto em uma lista de palavras
    var words = code
        // .replace('\n', ' ')
        // .split(' ')
        // .filter(item => item !== '')
    console.log(words)

    var lexemes = []

    //mapeia o codigo e detecta os tokens
    words.split('').map(letter => {
        //mapeia letra por letra

        

        return letter
    })

    return lexemes
}