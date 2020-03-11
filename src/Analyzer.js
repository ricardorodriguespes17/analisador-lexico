import tokens from './Tokens'

export default function analise(code) {
    //verifica se o codigo (sem espaços) é vazio e cancela a analise caso for
    if (code.trim() === '')
        return

    //remove as quebras de linha, separa o texto em uma lista de palavras
    var words = code.replace(/\n/g, ' ')
        .split(' ')
        .filter(item => item !== '')
    console.log(words)

    var lexemes = []

    //mapeia o codigo e detecta os tokens
    words.map(word => {
        var w = word.toLowerCase().split('')
        var token = stateMachine(0, w, 0, null)
        
        if(token !== null){
            lexemes.push({ id: Math.random(), lexeme: w, token: token })
        }

        return word
    })

    return lexemes
}

function stateMachine(state, letters, position, result) {
    //se a posicao a ser lida estiver fora do array, retorna o resultado
    if (position >= letters.length)
        return result
    //letter recebe a letra da posicao lida
    var letter = letters[position]

    // console.log('Estado ' + state + "\nLetra: " + letter) 

    //switch do estado atual
    switch (state) {
        case 0:
            //estado 0 

            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].filter(num => num === letter).length === 1) {
                return stateMachine(1, letters, position + 1, tokens.NUMERO_INTEIRO)
            } else {
                return stateMachine(-1, letters, position + 1, null)
            }
        case 1:
            //estado 1

            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].filter(num => num === letter).length === 1) {
                return stateMachine(1, letters, position + 1, tokens.NUMERO_INTEIRO)
            } else if (letter === '.') {
                return stateMachine(2, letters, position + 1, null)
            } else {
                return stateMachine(-1, letters, position + 1, null)
            }
        case 2:
            //estado 2
            
            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].filter(num => num === letter).length === 1) {
                return stateMachine(2, letters, position + 1, tokens.NUMERO_REAL)
            } else if (letter === 'e') {
                return stateMachine(3, letters, position + 1, null)
            } else {
                return stateMachine(-1, letters, position + 1, null)
            }
        case 3: 
            //estado 3
            
            if(letter === '-' || letter === '+'){
                return stateMachine(4, letters, position + 1, null)
            } else {
                return stateMachine(-1, letters, position + 1, null)
            }
        case 4:
            //estado 4

            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].filter(num => num === letter).length === 1) {
                return stateMachine(2, letters, position + 1, tokens.NUMERO_REAL)
            } else {
                return stateMachine(-1, letters, position + 1, null)
            }
        default:
            //estado morte
            return null
    }
}