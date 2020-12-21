import tokens from './tokens'

let reservedWords = [
    'absolute',
    'array',
    'begin',
    'boolean',
    'case',
    'char',
    'const',
    'div',
    'do',
    'dowto',
    'else',
    'end',
    'external',
    'file',
    'for',
    'forward',
    'func',
    'function',
    'goto',
    'if',
    'implementation',
    'in',
    'integer',
    'interface',
    'interrupt',
    'label',
    'main',
    'nil',
    'nit',
    'of',
    'package',
    'proc',
    'program',
    'read',
    'readln',
    'real',
    'record',
    'repeat',
    'set',
    'shl',
    'shr',
    'string',
    'then',
    'to',
    'type',
    'unit',
    'until',
    'uses',
    'var',
    'while',
    'with',
    'write',
    'writeln',
    'xor',
]

export default function lexAnalyze(code) {
    //verifica se o codigo (sem espaços) é vazio e cancela a analise caso for
    if (code.trim() === '')
        return

    code += " "
    //remove as quebras de linha, separa o texto em uma lista de palavras
    var chars = code.replace(/\n/g, ' ')
        .split('')
    // .filter(item => item !== '')

    //mapeia o codigo e detecta os tokens

    var tokens = stateMachine(0, chars, 0, "")

    return tokens
}

function stateMachine(state, letters, position, lexeme) {
    //se a posicao a ser lida estiver fora do array, retorna o resultado
    if (position >= letters.length)
        return []

    //expressoes regulares para fazer comparacoes
    var numbers = RegExp('[0-9]')
    var especialsSimbols = RegExp('[>|=|<|,|;|(|)]')
    var aritmeticOperator = RegExp('[+|*|/|-]')
    var chars = RegExp('[a-z]')

    //letter recebe a letra da posicao lida
    var letter = letters[position]
    // console.log('Estado: ' + state)
    // console.log('Letra: ' + letter + '\nLexema: ' + lexeme)

    //switch do estado atual
    switch (state) {
        case 0:
            /* 
                ESTADO 0
                Estado inicial
            */

            if (numbers.test(letter)) {
                //caso reconheca um numero, vai para o estado 1
                return stateMachine(1, letters, position + 1, letter)
            } else if (especialsSimbols.test(letter) || aritmeticOperator.test(letter) || letter === ':') {
                //caso reconheca um simbolo especial, vai para o estado 5
                return stateMachine(5, letters, position, lexeme)
            } else if (chars.test(letter)) {
                //case reconheca uma letra do alfabeto, vai para o estado 14
                return stateMachine(14, letters, position, lexeme)
            } else if (letter === '"') {
                //caso reconheca uma aspa dupla, vai para o estado 6
                return stateMachine(6, letters, position + 1, letter)
            } else if (letter === "'") {
                //caso reconheca uma aspa simples, vai para o estado 7
                return stateMachine(7, letters, position + 1, letter)
            } else if (letter === '.') {
                //caso reconheca um ponto (sem ser no numero real), reconheceu o fim do programa
                return [{ token: tokens.FIM, lexeme: letter }]
            } else {
                //nenhum dos casos, nao reconhecido, tenta reconhecer o proximo
                return stateMachine(0, letters, position + 1, "")
            }
        case 1:
            /* 
                ESTADO 1
                No caso de ter reconhecido um numero
            */

            if (numbers.test(letter)) {
                //caso reconheca um numero, permaneca no mesmo estado
                return stateMachine(1, letters, position + 1, lexeme += letter)
            } else if (letter === '.') {
                //caso reconheca um ponto, vai para o estado 2
                return stateMachine(2, letters, position + 1, lexeme += letter)
            } else if (especialsSimbols.test(letter) || aritmeticOperator.test(letter)) {
                //caso reconheca um simbolo especial, termina reconhecimento de um numero, vai para o estado 5
                return [{ token: tokens.NUMERO_INTEIRO, lexeme }].concat(stateMachine(5, letters, position, letter))
            } else if (letter === ' ') {
                //caso reconheca um espaco, termina reconhecimento de um numero, vai para o estado inicial
                return [{ token: tokens.NUMERO_INTEIRO, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                //nenhum dos casos, nao reconhecimento de um numero, vai para o estado inicial
                return stateMachine(0, letters, position + 1, "")
            }
        case 2:
            /* 
                ESTADO 2
                No caso de ter reconhecido um numero real
            */

            if (numbers.test(letter)) {
                return stateMachine(2, letters, position + 1, lexeme += letter)
            } else if (letter === 'e') {
                return stateMachine(3, letters, position + 1, lexeme += letter)
            } else if (especialsSimbols.test(letter) || aritmeticOperator.test(letter)) {
                return [{ token: tokens.NUMERO_REAL, lexeme }].concat(stateMachine(5, letters, position, letter))
            } else if (letter === ' ') {
                return [{ token: tokens.NUMERO_INTEIRO, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                //nenhum dos casos, nao reconhecido, tenta reconhecer o proximo
                return stateMachine(0, letters, position + 1, "")
            }
        case 3:
            /* 
                ESTADO 3
                No caso reconhecer o 'e' de um numero real
            */

            if (letter === '-' || letter === '+') {
                return stateMachine(4, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(0, letters, position + 1, "")
            }
        case 4:
            /* 
                ESTADO 4
                No caso de ter reconhecido um sinal ('+' ou '-') depois do 'e' do numero real
            */

            if (numbers.test(letter)) {
                lexeme += letter
                return [{ token: tokens.NUMERO_REAL, lexeme }].concat(stateMachine(2, letters, position + 1, lexeme += letter))
            } else {
                return stateMachine(0, letters, position + 1, "")
            }
        case 5:
            /*
                ESTADO 5
                No caso de encontrar um simbolo especial
            */

            if (letter === '<' || letter === '>') {
                //caso encontrar um '<' ou '>, vai para o estado 9
                return stateMachine(9, letters, position + 1, lexeme += letter)
            } else if (letter === ':') {
                //caso encontrar um ':', vai para o estado 10
                return stateMachine(10, letters, position + 1, lexeme += letter)
            } else if (letter === '=' || letter === ',' || letter === ';' || letter === '(' || letter === ')') {
                //caso encontrar um '=' ou ',' ou ';' ou '(' ou ')', reconhece simbolo especial, volta para o estado 0
                return [{ token: tokens.SIMBOLO_ESPECIAL, lexeme: letter }].concat(stateMachine(0, letters, position + 1, ""))
            } else if (letter === '/') {
                //caso encontrar um '/', vai para o estado 11
                return stateMachine(11, letters, position + 1, letter)
            } else if (aritmeticOperator.test(letter)) {
                return [{ token: tokens.OPERADOR_ARITMETICO, lexeme: letter }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return stateMachine(0, letters, position + 1, "")
            }
        case 6:
            /*
                ESTADO 6
                No caso de encontrar uma aspa dupla
            */

            lexeme += letter

            if (letter === '"') {
                return [{ token: tokens.STRING, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return stateMachine(6, letters, position + 1, lexeme)
            }
        case 7:
            /*
                ESTADO 7
                No caso de encontrar uma aspa simples
            */

           lexeme += letter

            if (letter === "'") {
                return [{ token: tokens.CARACTERE, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return stateMachine(8, letters, position + 1, lexeme)
            }
        case 8:
            /*
                ESTADO 8
                No caso de encontrar um char depois da aspa simples
            */
           
            lexeme += letter

            if (letter === "'") {
                return [{ token: tokens.CARACTERE, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return stateMachine(0, letters, position + 1, "")
            }

        case 9:
            /*
                ESTADO 9
                No caso de encontrar um '>' ou '<'
            */

            if (letter === '=') {
                lexeme += letter
                return [{ token: tokens.OPERADOR_RELACIONAL, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return [{ token: tokens.OPERADOR_RELACIONAL, lexeme }].concat(stateMachine(0, letters, position, ""))
            }
        case 10:
            /*
                ESTADO 10
                No caso de encontrar um ':'
                para tentar reconhecer um comando de atribuicao (:=) ou simbolo especial (:)
            */
           
           if (letter === '=') {
                lexeme += letter
                return [{ token: tokens.ATRIBUICAO, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return [{ token: tokens.SIMBOLO_ESPECIAL, lexeme}].concat(stateMachine(0, letters, position + 1, ""))
            }
        case 11:
            /*
                ESTADO 11
                No caso de encontrar um algo apos '/'
                para tentar reconhecer um comentario
            */



            if (letter === '*') {
                return stateMachine(12, letters, position + 1, "")
            } else {
                return [{ token: tokens.OPERADOR_ARITMETICO, lexeme: '/' }].concat(stateMachine(0, letters, position + 1, ""))
            }
        case 12:
            /*
                ESTADO 12
                No caso de encontrar um '*' apos '/' (inicio de comentario)
                para tentar reconhecer um comentario
            */

            if (letter === '*') {
                return stateMachine(13, letters, position + 1, "")
            } else {
                return stateMachine(12, letters, position + 1, "")
            }
        case 13:
            /*
                ESTADO 13
                No caso de encontrar um '*' dentro de um comentario
                para tentar reconhecer um comentario
            */

            if (letter === '/') {
                return stateMachine(0, letters, position + 1, "")
            } else if (letter === '*') {
                return stateMachine(13, letters, position + 1, "")
            } else {
                return stateMachine(12, letters, position + 1, "")
            }
        case 14: 
            /*
                ESTADO 14
                No caso de encontrar uma letra
                para tentar encontrar uma palavra reserva ou identificador
            */

            if(letter === " " || (!chars.test(letter) && !numbers.test(letter))) {
                var search = reservedWords.find(item => item === lexeme)
                if(search && search.length > 0) {
                    return [{ token: tokens.PALAVRA_RESERVADA, lexeme }].concat(stateMachine(0, letters, position, ""))
                }
                return [{ token: tokens.IDENTIFICADOR, lexeme }].concat(stateMachine(0, letters, position, ""))
            }
            return stateMachine(14, letters, position + 1, lexeme += letter)
        default:
            return []
    }
}