import tokens from './tokens'

export default function lexAnalyze(code) {
    //verifica se o codigo (sem espaços) é vazio e cancela a analise caso for
    if (code.trim() === '')
        return

    code = code.toLowerCase() + " "
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
                return [{ token: tokens.NUMERO_INTEIRO, lexeme }].concat(stateMachine(0, letters, position + 1, letter))
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
                return [{ token: tokens.NUMERO_INTEIRO, lexeme }].concat(stateMachine(0, letters, position + 1, letter))
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

            if (letter === '"') {
                return [{ token: tokens.STRING, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                return stateMachine(6, letters, position + 1, lexeme += letter)
            }
        case 7:
            /*
                ESTADO 7
                No caso de encontrar uma aspa simples
            */

            if (letter === "'") {
                return stateMachine(0, letters, position + 1, "")
            } else {
                return stateMachine(8, letters, position + 1, lexeme += letter)
            }
        case 8:
            /*
                ESTADO 8
                No caso de encontrar um char depois da aspa simples
            */

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
                No caso de encontrar um 'a'
                para tentar encontrar uma palavra reserva
            */

           switch(letter) {
                case 'a':
                    return stateMachine(15, letters, position + 1, lexeme += letter)
                case 'b':
                    return stateMachine(27, letters, position + 1, lexeme += letter)
                case 'c':
                    return stateMachine(31, letters, position + 1, lexeme += letter)
                case 'd':
                    return stateMachine(39, letters, position + 1, lexeme += letter)
                case 'e':
                    return stateMachine(44, letters, position + 1, lexeme += letter)
                case 'f':
                    return stateMachine(54, letters, position + 1, lexeme += letter)
                case 'g':
                    return stateMachine(68, letters, position + 1, lexeme += letter)
                case 'i':
                    return stateMachine(71, letters, position + 1, lexeme += letter)
                case 'l':
                    return stateMachine(96, letters, position + 1, lexeme += letter)
                case 'm':
                    return stateMachine(100, letters, position + 1, lexeme += letter)
                case 'n':
                    return stateMachine(103, letters, position + 1, lexeme += letter)
                case 'o':
                    return stateMachine(105, letters, position + 1, lexeme += letter)
                case 'p':
                    return stateMachine(106, letters, position + 1, lexeme += letter)
                case 'r':
                    return stateMachine(116, letters, position + 1, lexeme += letter)
                case 's':
                    return stateMachine(125, letters, position + 1, lexeme += letter)
                case 't':
                    return stateMachine(132, letters, position + 1, lexeme += letter)
                case 'u':
                    return stateMachine(137, letters, position + 1, lexeme += letter)
                case 'v':
                    return stateMachine(144, letters, position + 1, lexeme += letter)
                case 'w':
                    return stateMachine(146, letters, position + 1, lexeme += letter)
                case 'x':
                    return stateMachine(152, letters, position + 1, lexeme += letter)
                default:
                    return stateMachine(23, letters, position, lexeme)
           }
        case 15:
            /*
                ESTADO 15
                No caso de encontrar um 'b' ou 'r' apos um 'a'
                para tentar encontrar a palavra reservada 'absolute'
            */


            if(letter === 'b') {
                return stateMachine(16, letters, position + 1, lexeme += letter)
            } else if(letter === 'r') {
                return stateMachine(24, letters, position + 1, lexeme += letter)
            } else if(letter === 'n') {
                return stateMachine(155, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 16:
            /*
                ESTADO 16
                No caso de encontrar um 's' apos um 'b'
                para tentar encontrar a palavra reservada 'absolute'
            */

            if(letter === 's') {
                return stateMachine(17, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 17:
            /*
                ESTADO 17
                No caso de encontrar um 'o' apos um 's'
                para tentar encontrar a palavra reservada 'absolute'
            */

            if(letter === 'o') {
                return stateMachine(18, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 18:
            /*
                ESTADO 18
                No caso de encontrar um 'l' apos um 'o'
                para tentar encontrar a palavra reservada 'absolute'
            */

            if(letter === 'l') {
                return stateMachine(19, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 19:
            /*
                ESTADO 19
                No caso de encontrar um 'u' apos um 'l'
                para tentar encontrar a palavra reservada 'absolute'
            */

            if(letter === 'u') {
                return stateMachine(20, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 20:
            /*
                ESTADO 20
                No caso de encontrar um 't' apos um 'u'
                para tentar encontrar a palavra reservada 'absolute'
            */

            if(letter === 't') {
                return stateMachine(21, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 21:
            /*
                ESTADO 21
                No caso de encontrar um 'e' apos um 't'
                para tentar encontrar a palavra reservada 'absolute'
            */

            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 22:
            /*
                ESTADO 22
                No caso de encontrar um ' ' apos o ultimo caractere de uma palavra reservada
                para tentar identificar ela
            */

            if(letter === ' ') {
                return [{ token: tokens.PALAVRA_RESERVADA, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else if(!chars.test(letter)) {
                 return [{ token: tokens.PALAVRA_RESERVADA, lexeme }].concat(stateMachine(0, letters, position, ""))
             } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 23:
            /*
                ESTADO 23
                No caso de encontrar um ' ' apos um
                para tentar encontrar algo
            */


            if(!chars.test(letter) && !numbers.test(letter)) {
                return [{ token: tokens.IDENTIFICADOR, lexeme }].concat(stateMachine(0, letters, position, ""))
            } else {
                return stateMachine(23, letters, position + 1, lexeme += letter)
            }
        case 24:
            /* 
                ESTADO 24
                No caso de encontrar um 'r' apos um 'a'
                para tentar encontrar a palavra reservada 'array'
            */

            if(letter === 'r') {
                return stateMachine(25, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 25:
            /*
                ESTADO 25
                No caso de encontrar um 'r' apos um 'r'
                para tentar encontrar a palavra reservada 'array'
            */

            if(letter === 'a') {
                return stateMachine(26, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 26:
            /*
                ESTADO 26
                No caso de encontrar um 'r' apos um 'r'
                para tentar encontrar a palavra reservada 'array'
            */

            if(letter === 'y') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 27:
            /* 
                ESTADO 27
                No caso de encontrar um 'b' apos um 'a'
                para tentar encontrar a palavra reservada 'begin'
            */

            if(letter === 'e') {
                return stateMachine(28, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 28:
            /*
                ESTADO 28
                No caso de encontrar um 'e' apos um 'b'
                para tentar encontrar a palavra reservada 'begin'
            */

            if(letter === 'g') {
                return stateMachine(29, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 29:
            /*
                ESTADO 29
                No caso de encontrar um 'g' apos um 'e'
                para tentar encontrar a palavra reservada 'begin'
            */
            
            if(letter === 'i') {
                return stateMachine(30, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 30:
            /*
                ESTADO 30
                No caso de encontrar um 'i' apos um 'g'
                para tentar encontrar a palavra reservada 'begin'
            */
            
            if(letter === 'n') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 31: 
            /*
                ESTADO 30
                No caso de encontrar um 'c'
                para tentar encontrar as palavras reservada 'case', 'char' ou 'const'
            */
                
            if(letter === 'a') {
                return stateMachine(32, letters, position + 1, lexeme += letter)
            } else if(letter === 'h') {
                return stateMachine(34, letters, position + 1, lexeme += letter)
            } else if(letter === 'o') {
                return stateMachine(36, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 32:
            /*
                ESTADO 32
                No caso de encontrar um 'a' apos um 'c'
                para tentar encontrar a palavra reservada 'case'
            */


            if(letter === 's') {
                return stateMachine(33, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 33:
            /*
                ESTADO 33
                No caso de encontrar um 's' apos um 'a'
                para tentar encontrar a palavra reservada 'case'
            */


            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 34:
            /*
                ESTADO 34
                No caso de encontrar um 'h' apos um 'c'
                para tentar encontrar a palavra reservada 'char'
            */


            if(letter === 'a') {
                return stateMachine(35, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 35:
            /*
                ESTADO 35
                No caso de encontrar um 'r' apos um 'a'
                para tentar encontrar a palavra reservada 'char'
            */


            if(letter === 'r') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)   
            }
        case 36:
            /*
                ESTADO 36
                No caso de encontrar um 'o' apos um 'c'
                para tentar encontrar a palavra reservada 'const'
            */


            if(letter === 'n') {
                return stateMachine(37, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 37:
            /*
                ESTADO 37
                No caso de encontrar um 'n' apos um 'o'
                para tentar encontrar a palavra reservada 'const'
            */


            if(letter === 's') {
                return stateMachine(38, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 38:
            /*
                ESTADO 38
                No caso de encontrar um 's' apos um 'n'
                para tentar encontrar a palavra reservada 'const'
            */


            if(letter === 't') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 39:
            /*
                ESTADO 39
                No caso de encontrar um 'd'
                para tentar encontrar as palavras reservadas 'div', 'do' ou 'dowto'
            */


            if(letter === 'i') {
                return stateMachine(40, letters, position + 1, lexeme += letter)
            } if(letter === 'o') {
                return stateMachine(41, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 40:
            /*
                ESTADO 40
                No caso de encontrar um 'i' apos um 'd'
                para tentar encontrar a palavra reservada 'div'
            */


            if(letter === 'v') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 41:
            /*
                ESTADO 41
                No caso de encontrar um 'o' apos um 'd'
                para tentar encontrar as palavras reservadas 'do' ou 'dowto'
            */


            if(letter === ' ') {
                return [{ token: tokens.PALAVRA_RESERVADA, lexeme: 'do' }].concat(stateMachine(0, letters, position + 1, ""))
            } else if(letter === 'w') {
                return stateMachine(42, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 42:
            /*
                ESTADO 42
                No caso de encontrar um 'w' apos um 'o'
                para tentar encontrar as palavras reservadas 'dowto'
            */


            if(letter === 't') {
                return stateMachine(43, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 43:
            /*
                ESTADO 43
                No caso de encontrar um 't' apos um 'w'
                para tentar encontrar a palavra reservada 'dowto'
            */


            if(letter === 'o') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 44:
            /*
                ESTADO 44
                No caso de encontrar um 'e'
                para tentar encontrar as palavras reservadas 'else', 'end' ou 'external'
            */


            if(letter === 'l') {
                return stateMachine(45, letters, position + 1, lexeme += letter)
            } else if(letter === 'n') {
                return stateMachine(47, letters, position + 1, lexeme += letter)
            } else if(letter === 'x') {
                return stateMachine(48, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 45:
            /*
                ESTADO 45
                No caso de encontrar um 'l' apos um 'e'
                para tentar encontrar a palavra reservada 'else'
            */


            if(letter === 's') {
                return stateMachine(46, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 46:
            /*
                ESTADO 46
                No caso de encontrar um 's' apos um 'l'
                para tentar encontrar a palavra reservada 'else'
            */


            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 47:
            /*
                ESTADO 47
                No caso de encontrar um 'n' apos um 'e'
                para tentar encontrar a palavra reservada 'end'
            */


            if(letter === 'd') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 48:
            /*
                ESTADO 48
                No caso de encontrar um 'x' apos um 'e'
                para tentar encontrar a palavra reservada 'external'
            */


            if(letter === 't') {
                return stateMachine(49, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 49:
            /*
                ESTADO 49
                No caso de encontrar um 't' apos um 'x'
                para tentar encontrar a palavra reservada 'external'
            */


            if(letter === 'e') {
                return stateMachine(50, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 50:
            /*
                ESTADO 50
                No caso de encontrar um 'e' apos um 't'
                para tentar encontrar a palavra reservada 'external'
            */


            if(letter === 'r') {
                return stateMachine(51, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 51:
            /*
                ESTADO 51
                No caso de encontrar um 'r' apos um 'e'
                para tentar encontrar a palavra reservada 'external'
            */


            if(letter === 'n') {
                return stateMachine(52, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 52:
            /*
                ESTADO 52
                No caso de encontrar um 'n' apos um 'r'
                para tentar encontrar a palavra reservada 'external'
            */


            if(letter === 'a') {
                return stateMachine(53, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 53:
            /*
                ESTADO 53
                No caso de encontrar um 'a' apos um 'n'
                para tentar encontrar a palavra reservada 'external'
            */


            if(letter === 'l') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 54:
            /*
                ESTADO 54
                No caso de encontrar um 'f'
                para tentar encontrar as palavras reservadas 'file', 'for', 'forward', 'func', 'function'
            */


            if(letter === 'i') {
                return stateMachine(55, letters, position + 1, lexeme += letter)
            } else if(letter === 'o') {
                return stateMachine(57, letters, position + 1, lexeme += letter)
            } else if(letter === 'u') {
                return stateMachine(62, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 55:
            /*
                ESTADO 55
                No caso de encontrar um 'i' apos um 'f'
                para tentar encontrar a palavra reservada 'file'
            */


            if(letter === 'l') {
                return stateMachine(56, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 56:
            /*
                ESTADO 56
                No caso de encontrar um 'l' apos um 'i'
                para tentar encontrar a palavra reservada 'file'
            */


            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 57:
            /*
                ESTADO 57
                No caso de encontrar um 'o' apos um 'f'
                para tentar encontrar as palavras reservadas 'for' ou 'forward'
            */


            if(letter === 'r') {
                return stateMachine(58, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 58:
            /*
                ESTADO 58
                No caso de encontrar um 'r' apos um 'o'
                para tentar encontrar as palavras reservadas 'for' ou 'forward'
            */


            if(letter === ' ') {
                return [{ token: tokens.PALAVRA_RESERVADA, lexeme: 'for' }].concat(stateMachine(0, letters, position + 1, ""))
            } else if(letter === 'w') {
                return stateMachine(59, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 59:
            /*
                ESTADO 59
                No caso de encontrar um 'w' apos um 'r'
                para tentar encontrar a palavra reservada 'forward'
            */


            if(letter === 'a') {
                return stateMachine(60, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 60:
            /*
                ESTADO 60
                No caso de encontrar um 'a' apos um 'w'
                para tentar encontrar a palavra reservada 'forward'
            */


            if(letter === 'r') {
                return stateMachine(61, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 61:
            /*
                ESTADO 61
                No caso de encontrar um 'r' apos um 'a'
                para tentar encontrar a palavra reservada 'forward'
            */


            if(letter === 'd') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 62:
            /*
                ESTADO 62
                No caso de encontrar um 'u' apos um 'f'
                para tentar encontrar as palavras reservadas 'func' ou 'function'
            */


            if(letter === 'n') {
                return stateMachine(63, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 63:
            /*
                ESTADO 63
                No caso de encontrar um 'n' apos um 'u'
                para tentar encontrar as palavras reservadas 'func' ou 'function'
            */


            if(letter === 'c') {
                return stateMachine(64, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 64:
            /*
                ESTADO 64
                No caso de encontrar um 'c' apos um 'n'
                para tentar encontrar as palavras reservadas 'func' ou 'function'
            */


            if(letter === ' ') {
                return [{ token: tokens.PALAVRA_RESERVADA, lexeme: 'func' }].concat(stateMachine(0, letters, position + 1, ""))
            } else if(letter === 't') {
                return stateMachine(65, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 65:
            /*
                ESTADO 65
                No caso de encontrar um 't' apos um 'c'
                para tentar encontrar as palavras reservadas 'func' ou 'function'
            */


            if(letter === 'i') {
                return stateMachine(66, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 66:
            /*
                ESTADO 66
                No caso de encontrar um 'i' apos um 't'
                para tentar encontrar as palavras reservadas 'func' ou 'function'
            */


            if(letter === 'o') {
                return stateMachine(67, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 67:
            /*
                ESTADO 67
                No caso de encontrar um 'o' apos um 'i'
                para tentar encontrar as palavras reservadas 'func' ou 'function'
            */


            if(letter === 'n') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 68:
            /*
                ESTADO 68
                No caso de encontrar um 'g'
                para tentar encontrar a palavra reservada 'goto'
            */


            if(letter === 'o') {
                return stateMachine(69, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 69:
            /*
                ESTADO 69
                No caso de encontrar um 'o' apos um 'g'
                para tentar encontrar a palavra reservada 'goto'
            */


            if(letter === 't') {
                return stateMachine(70, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 70:
            /*
                ESTADO 70
                No caso de encontrar um 't' apos um 'o'
                para tentar encontrar a palavra reservada 'goto'
            */


            if(letter === 'o') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 71:
            /*
                ESTADO 71
                No caso de encontrar um 'i'
                para tentar encontrar as palavras reservadas 'if', 'implementation', 'in', 'integer', 'interface', 'interrupt'
            */


            if(letter === 'f') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else if(letter === 'm') {
                return stateMachine(72, letters, position + 1, lexeme += letter)
            } else if(letter === 'n') {
                return stateMachine(84, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 72:
            /*
                ESTADO 72
                No caso de encontrar um 'm' apos um 'i'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'p') {
                return stateMachine(73, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 73:
            /*
                ESTADO 73
                No caso de encontrar um 'p' apos um 'm'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'l') {
                return stateMachine(74, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 74:
            /*
                ESTADO 74
                No caso de encontrar um 'l' apos um 'p'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'e') {
                return stateMachine(75, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 75:
            /*
                ESTADO 75
                No caso de encontrar um 'e' apos um 'l'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'm') {
                return stateMachine(76, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 76:
            /*
                ESTADO 76
                No caso de encontrar um 'm' apos um 'e'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'e') {
                return stateMachine(77, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 77:
            /*
                ESTADO 77
                No caso de encontrar um 'e' apos um 'm'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'n') {
                return stateMachine(78, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 78:
            /*
                ESTADO 78
                No caso de encontrar um 'n' apos um 'e'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 't') {
                return stateMachine(79, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 79:
            /*
                ESTADO 79
                No caso de encontrar um 't' apos um 'n'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'a') {
                return stateMachine(80, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 80:
            /*
                ESTADO 80
                No caso de encontrar um 'a' apos um 't'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 't') {
                return stateMachine(81, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 81:
            /*
                ESTADO 81
                No caso de encontrar um 't' apos um 'a'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'i') {
                return stateMachine(82, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 82:
            /*
                ESTADO 82
                No caso de encontrar um 'i' apos um 't'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'o') {
                return stateMachine(83, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 83:
            /*
                ESTADO 83
                No caso de encontrar um 'o' apos um 'i'
                para tentar encontrar a palavra reservada 'implementation'
            */


            if(letter === 'n') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 84:
            /*
                ESTADO 84
                No caso de encontrar um 'n' apos um 'i'
                para tentar encontrar as palavras reservadas 'in', 'integer', 'interface', 'interrupt'
            */


            if(letter === ' ') {
                return [{ token: tokens.PALAVRA_RESERVADA, lexeme: 'in' }].concat(stateMachine(0, letters, position + 1, ""))
            } else if(letter === 't') {
                return stateMachine(85, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 85:
            /*
                ESTADO 85
                No caso de encontrar um 't' apos um 'n'
                para tentar encontrar as palavras reservadas 'integer', 'interface', 'interrupt'
            */


            if(letter === 'e') {
                return stateMachine(86, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 86:
            /*
                ESTADO 86
                No caso de encontrar um 'e' apos um 't'
                para tentar encontrar as palavras reservadas 'integer', 'interface', 'interrupt'
            */


            if(letter === 'g') {
                return stateMachine(87, letters, position + 1, lexeme += letter)
            } else if(letter === 'r') {
                return stateMachine(89, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 87:
            /*
                ESTADO 87
                No caso de encontrar um 'g' apos um 'e'
                para tentar encontrar a palavra reservada 'integer'
            */


            if(letter === 'e') {
                return stateMachine(88, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 88:
            /*
                ESTADO 88
                No caso de encontrar um 'e' apos um 'g'
                para tentar encontrar a palavra reservada 'integer'
            */


            if(letter === 'r') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 89:
            /*
                ESTADO 89
                No caso de encontrar um 'r' apos um 'e'
                para tentar encontrar as palavras reservadas 'interface', 'interrupt'
            */


            if(letter === 'f') {
                return stateMachine(90, letters, position + 1, lexeme += letter)
            } else if(letter === 'r') {
                return stateMachine(93, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 90:
            /*
                ESTADO 90
                No caso de encontrar um 'f' apos um 'r'
                para tentar encontrar a palavra reservada 'interface'
            */


            if(letter === 'a') {
                return stateMachine(91, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 91:
            /*
                ESTADO 91
                No caso de encontrar um 'a' apos um 'f'
                para tentar encontrar a palavra reservada 'interface'
            */


            if(letter === 'c') {
                return stateMachine(92, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 92:
            /*
                ESTADO 92
                No caso de encontrar um 'c' apos um 'a'
                para tentar encontrar a palavra reservada 'interface'
            */


            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 93:
            /*
                ESTADO 93
                No caso de encontrar um 'r' apos um 'r'
                para tentar encontrar a palavra reservada 'interrupt'
            */


            if(letter === 'u') {
                return stateMachine(94, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 94:
            /*
                ESTADO 94
                No caso de encontrar um 'u' apos um 'r'
                para tentar encontrar a palavra reservada 'interrupt'
            */


            if(letter === 'p') {
                return stateMachine(95, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 95:
            /*
                ESTADO 93
                No caso de encontrar um 'p' apos um 'u'
                para tentar encontrar a palavra reservada 'interrupt'
            */


            if(letter === 't') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 96:
            /*
                ESTADO 96
                No caso de encontrar um 'l'
                para tentar encontrar a palavra reservada 'label'
            */


            if(letter === 'a') {
                return stateMachine(97, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 97:
            /*
                ESTADO 97
                No caso de encontrar um 'a' apos um 'l'
                para tentar encontrar a palavra reservada 'label'
            */


            if(letter === 'b') {
                return stateMachine(98, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 98:
            /*
                ESTADO 98
                No caso de encontrar um 'b' apos um 'a'
                para tentar encontrar a palavra reservada 'label'
            */


            if(letter === 'e') {
                return stateMachine(99, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 99:
            /*
                ESTADO 99
                No caso de encontrar um 'e' apos um 'b'
                para tentar encontrar a palavra reservada 'label'
            */


            if(letter === 'l') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 100: 
            /*
                ESTADO 100
                No caso de encontrar um 'm'
                para tentar encontrar a palavra reservada 'main'
            */


            if(letter === 'a') {
                return stateMachine(101, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 101: 
            /*
                ESTADO 101
                No caso de encontrar um 'a' apos um 'm'
                para tentar encontrar a palavra reservada 'main'
            */


            if(letter === 'i') {
                return stateMachine(102, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 102:
            /*
                ESTADO 102
                No caso de encontrar um 'i' apos um 'a'
                para tentar encontrar a palavra reservada 'main'
            */


            if(letter === 'n') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 103: 
            /*
                ESTADO 103
                No caso de encontrar um 'n'
                para tentar encontrar as palavras reservadas 'nil' ou 'nit'
            */


            if(letter === 'i') {
                return stateMachine(104, letters, position + 1, lexeme += letter)
            } else if(letter === 'o') {
                return stateMachine(156, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 104: 
            /*
                ESTADO 104
                No caso de encontrar um 'i' apos um 'n'
                para tentar encontrar as palavras reservadas 'nil' ou 'nit'
            */


            if(letter === 'l' || letter === 't') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 105: 
            /*
                ESTADO 105
                No caso de encontrar um 'o'
                para tentar encontrar a palavra reservada 'of'
            */

            if(letter === 'f') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else if(letter === 'r') {
                return stateMachine(154, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 106: 
            /*
                ESTADO 106
                No caso de encontrar um 'p'
                para tentar encontrar as palavras reservadas 'packed', 'proc' ou 'program'
            */


            if(letter === 'a') {
                return stateMachine(107, letters, position + 1, lexeme += letter)
            } else if(letter === 'r') {
                return stateMachine(111, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 107: 
            /*
                ESTADO 107
                No caso de encontrar um 'a' apos um 'p'
                para tentar encontrar a palavra reservada 'packed'
            */


            if(letter === 'c') {
                return stateMachine(108, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 108: 
            /*
                ESTADO 108
                No caso de encontrar um 'c' apos um 'a'
                para tentar encontrar a palavra reservada 'packed'
            */


            if(letter === 'k') {
                return stateMachine(109, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 109: 
            /*
                ESTADO 109
                No caso de encontrar um 'k' apos um 'c'
                para tentar encontrar a palavra reservada 'packed'
            */


            if(letter === 'e') {
                return stateMachine(110, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 110: 
            /*
                ESTADO 110
                No caso de encontrar um 'e' apos um 'k'
                para tentar encontrar a palavra reservada 'packed'
            */


            if(letter === 'd') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 111:
            /*
                ESTADO 111
                No caso de encontrar um 'r' apos um 'p'
                para tentar encontrar as palavras reservadas 'proc' ou 'program'
            */


           if(letter === 'o') {
                return stateMachine(112, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 112:
            /*
                ESTADO 112
                No caso de encontrar um 'o' apos um 'r'
                para tentar encontrar as palavras reservadas 'proc' ou 'program'
            */


            if(letter === 'c') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else if(letter === 'g') {
                return stateMachine(113, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 113:
            /*
                ESTADO 113
                No caso de encontrar um 'g' apos um 'o'
                para tentar encontrar a palavra reservada 'program'
            */


            if(letter === 'r') {
                return stateMachine(114, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 114:
            /*
                ESTADO 114
                No caso de encontrar um 'r' apos um 'g'
                para tentar encontrar a palavra reservada 'program'
            */


            if(letter === 'a') {
                return stateMachine(115, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 115:
            /*
                ESTADO 115
                No caso de encontrar um 'a' apos um 'r'
                para tentar encontrar a palavra reservada 'program'
            */


            if(letter === 'm') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 116:
            /*
                ESTADO 116
                No caso de encontrar um 'r'
                para tentar encontrar as palavras reservadas 'real', 'record' ou 'repeat'
            */


            if(letter === 'e') {
                return stateMachine(117, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 117:
            /*
                ESTADO 117
                No caso de encontrar um 'e' apos um 'r'
                para tentar encontrar as palavras reservadas 'real', 'record' ou 'repeat'
            */


            if(letter === 'a') {
                return stateMachine(118, letters, position + 1, lexeme += letter)
            } else if(letter === 'c') {
                return stateMachine(119, letters, position + 1, lexeme += letter)
            } else if(letter === 'p') {
                return stateMachine(122, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 118:
            /*
                ESTADO 118
                No caso de encontrar um 'a' apos um 'e'
                para tentar encontrar a palavra reservada 'real'
            */


            if(letter === 'l') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 119:
            /*
                ESTADO 119
                No caso de encontrar um 'c' apos um 'e'
                para tentar encontrar as palavras reservadas 'record' ou 'repeat'
            */


            if(letter === 'o') {
                return stateMachine(120, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 120:
            /*
                ESTADO 120
                No caso de encontrar um 'o' apos um 'c'
                para tentar encontrar a palavra reservada 'record'
            */


            if(letter === 'r') {
                return stateMachine(121, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 121:
            /*
                ESTADO 121
                No caso de encontrar um 'r' apos um 'o'
                para tentar encontrar a palavra reservada 'record'
            */


            if(letter === 'd') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 122:
            /*
                ESTADO 122
                No caso de encontrar um 'p' apos um 'e'
                para tentar encontrar a palavra reservada 'repeat'
            */


            if(letter === 'e') {
                return stateMachine(123, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 123:
            /*
                ESTADO 123
                No caso de encontrar um 'e' apos um 'p'
                para tentar encontrar a palavra reservada 'repeat'
            */


            if(letter === 'a') {
                return stateMachine(124, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 124:
            /*
                ESTADO 124
                No caso de encontrar um 'a' apos um 'e'
                para tentar encontrar a palavra reservada 'repeat'
            */


            if(letter === 't') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 125:
            /*
                ESTADO 125
                No caso de encontrar um 's'
                para tentar encontrar as palavras reservadas 'set', 'shl', 'shr', 'string'
            */


            if(letter === 'e') {
                return stateMachine(126, letters, position + 1, lexeme += letter)
            } else if(letter === 'h') {
                return stateMachine(127, letters, position + 1, lexeme += letter)
            } else if(letter === 't') {
                return stateMachine(128, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 126:
            /*
                ESTADO 126
                No caso de encontrar um 'e' apos um 's'
                para tentar encontrar a palavra reservada 'set'
            */


            if(letter === 't') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 127:
            /*
                ESTADO 127
                No caso de encontrar um 'h' apos um 's'
                para tentar encontrar as palavras reservadas 'shl', 'shr'
            */


            if(letter === 'l' || letter === 'r') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 128:
            /*
                ESTADO 128
                No caso de encontrar um 't' apos um 's'
                para tentar encontrar a palavra reservada 'string'
            */


            if(letter === 'r') {
                return stateMachine(129, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 129:
            /*
                ESTADO 129
                No caso de encontrar um 'r' apos um 't'
                para tentar encontrar a palavra reservada 'string'
            */


            if(letter === 'i') {
                return stateMachine(130, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 130:
            /*
                ESTADO 130
                No caso de encontrar um 'i' apos um 'r'
                para tentar encontrar a palavra reservada 'string'
            */


            if(letter === 'n') {
                return stateMachine(131, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 131:
            /*
                ESTADO 131
                No caso de encontrar um 'n' apos um 'i'
                para tentar encontrar a palavra reservada 'string'
            */


            if(letter === 'g') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 132:
            /*
                ESTADO 132
                No caso de encontrar um 't'
                para tentar encontrar as palavras reservadas 'then', 'to' ou 'type'
            */


            if(letter === 'h') {
                return stateMachine(133, letters, position + 1, lexeme += letter)
            } else if(letter === 'o') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else if(letter === 'y') {
                return stateMachine(135, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 133:
            /*
                ESTADO 133
                No caso de encontrar um 'h' apos um 't'
                para tentar encontrar a palavra reservada 'then'
            */


            if(letter === 'e') {
                return stateMachine(134, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 134:
            /*
                ESTADO 134
                No caso de encontrar um 'e' apos um 'h'
                para tentar encontrar a palavra reservada 'then'
            */


            if(letter === 'n') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 135:
            /*
                ESTADO 135
                No caso de encontrar um 'y' apos um 't'
                para tentar encontrar a palavra reservada 'type'
            */


            if(letter === 'p') {
                return stateMachine(136, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 136:
            /*
                ESTADO 136
                No caso de encontrar um 'p' apos um 'y'
                para tentar encontrar a palavra reservada 'type'
            */


            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 137: 
            /*
                ESTADO 137
                No caso de encontrar um 'u'
                para tentar encontrar as palavras reservadas 'unit', 'until' ou 'uses'
            */


            if(letter === 'n') {
                return stateMachine(138, letters, position + 1, lexeme += letter)
            } else if(letter === 's') {
                return stateMachine(142, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 138:
            /*
                ESTADO 138
                No caso de encontrar um 'n' apos um 'u'
                para tentar encontrar as palavras reservadas 'unit' ou 'until'
            */


            if(letter === 'i') {
                return stateMachine(139, letters, position + 1, lexeme += letter)
            } else if(letter === 't') {
                return stateMachine(140, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 139:
            /*
                ESTADO 139
                No caso de encontrar um 'i' apos um 'n'
                para tentar encontrar a palavra reservada 'unit'
            */


            if(letter === 't') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 140:
            /*
                ESTADO 140
                No caso de encontrar um 't' apos um 'n'
                para tentar encontrar a palavra reservada 'until'
            */


            if(letter === 'i') {
                return stateMachine(141, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 141:
            /*
                ESTADO 141
                No caso de encontrar um 'i' apos um 't'
                para tentar encontrar a palavra reservada 'until'
            */


            if(letter === 'l') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 142:
            /*
                ESTADO 142
                No caso de encontrar um 's' apos um 'u'
                para tentar encontrar a palavra reservada 'uses'
            */

            if(letter === 'e') {
                return stateMachine(143, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 143:
            /*
                ESTADO 143
                No caso de encontrar um 'e' apos um 's'
                para tentar encontrar a palavra reservada 'uses'
            */
    
            lexeme += letter
    
            if(letter === 's') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 144:
            /*
                ESTADO 144
                No caso de encontrar um 'v'
                para tentar encontrar a palavra reservada 'var'
            */

            if(letter === 'a') {
                return stateMachine(145, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 145:
            /*
                ESTADO 145
                No caso de encontrar um 'a' apos um 'v'
                para tentar encontrar a palavra reservada 'var'
            */

            if(letter === 'r') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 146:
            /*
                ESTADO 146
                No caso de encontrar um 'w'
                para tentar encontrar as palavras reservadas 'while' ou 'with'
            */

            if(letter === 'h') {
                return stateMachine(147, letters, position + 1, lexeme += letter)
            } else if(letter === 'i') {
                return stateMachine(150, letters, position + 1, lexeme += letter)
            }  else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 147:
            /*
                ESTADO 147
                No caso de encontrar um 'h' apos um 'w'
                para tentar encontrar a palavra reservada 'while'
            */

            if(letter === 'i') {
                return stateMachine(148, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 148:
            /*
                ESTADO 148
                No caso de encontrar um 'i' apos um 'h'
                para tentar encontrar a palavra reservada 'while'
            */

            if(letter === 'l') {
                return stateMachine(149, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 149:
            /*
                ESTADO 149
                No caso de encontrar um 'l' apos um 'i'
                para tentar encontrar a palavra reservada 'while'
            */

            if(letter === 'e') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 150:
            /*
                ESTADO 150
                No caso de encontrar um 'i' apos um 'w'
                para tentar encontrar a palavra reservada 'with'
            */

            if(letter === 't') {
                return stateMachine(151, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 151:
            /*
                ESTADO 151
                No caso de encontrar um 't' apos um 'i'
                para tentar encontrar a palavra reservada 'with'
            */

            if(letter === 'h') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 152:
            /*
                ESTADO 152
                No caso de encontrar um 'x'
                para tentar encontrar a palavra reservada 'xor'
            */

            if(letter === 'o') {
                return stateMachine(153, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 153:
            /*
                ESTADO 153
                No caso de encontrar um 'o' apos um 'x'
                para tentar encontrar a palavra reservada 'xor'
            */

            if(letter === 'r') {
                return stateMachine(22, letters, position + 1, lexeme += letter)
            } else {
                return stateMachine(23, letters, position, lexeme)
            }
        case 154:
            /*
                ESTADO 155
                No caso de encontrar um operador logico
            */

            if(letter === ' ') {
                return [{ token: tokens.OPERADOR_LOGICO, lexeme }].concat(stateMachine(0, letters, position + 1, ""))
            } else {
                lexeme += letter
                return stateMachine(23, letters, position, lexeme)
            }
        case 155: 
            /*
                ESTADO 155
                No caso de encontrar um 'n' apos um 'a'
                para tentar encontrar a palavra reservada 'and'
            */

           if(letter === 'd') {
               return stateMachine(154, letters, position + 1, lexeme += letter)
           } else {
               return stateMachine(23, letters, position, lexeme)
           }
        case 156:
            /*
                ESTADO 156
                No caso de encontrar um 'n' apos um 'a'
                para tentar encontrar a palavra reservada 'and'
            */

           if(letter === 't') {
               return stateMachine(154, letters, position + 1, lexeme += letter)
           } else {
               return stateMachine(23, letters, position, lexeme)
           }
        default:
            //estado morte
            return []
    }
}