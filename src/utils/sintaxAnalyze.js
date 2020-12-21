import tokens from "./tokens";

let lexTokens = []
let position = -1;
let stack = []
const grammar = [
  {v: "S1", p: "S"},
  {v: "S", p: "program id ; D begin L end ."},
  {v: "D", p: "var V"},
  {v: "D", p: ""},
  {v: "V", p: "I : T ; V1"},
  {v: "V1", p: "I : T ; V1"},
  {v: "V1", p: ""},
  {v: "T", p: "integer"},
  {v: "T", p: "boolean"},
  {v: "I", p: "id I1"},
  {v: "I1", p: ", I"},
  {v: "I1", p: ""},
  {v: "L", p: "C ; L1"},
  {v: "L1", p: "C ; L1"},
  {v: "L1", p: ""},
  {v: "C", p: "A"},
  {v: "C", p: "R"},
  {v: "C", p: "W"},
  {v: "C", p: "M"},
  {v: "C", p: "N"},
  {v: "C", p: "P"},
  {v: "A", p: "id := E"},
  {v: "R", p: "read ( I )"},
  {v: "R", p: "readln R1"},
  {v: "R1", p: "( I )"},
  {v: "R1", p: ""},
  {v: "W", p: "write ( F )"},
  {v: "W", p: "writeln W1"},
  {v: "W1", p: "( F )"},
  {v: "W1", p: ""},
  {v: "F", p: "G F1"},
  {v: "F1", p: ", F"},
  {v: "F1", p: ""},
  {v: "G", p: "str"},
  {v: "G", p: "E"},
  {v: "M", p: "begin L end"},
  {v: "N", p: "if B then C"},
  {v: "P", p: "while B do C"},
  {v: "E", p: "X"},
  {v: "E", p: "- E"},
  {v: "E", p: "( E )"},
  {v: "E1", p: "+ X"},
  {v: "E1", p: "- X"},
  {v: "E1", p: "* X"},
  {v: "E1", p: "/ X"},
  {v: "E1", p: ""},
  {v: "X", p: "id E1"},
  {v: "X", p: "num E1"},
  {v: "B", p: "id"},
  {v: "B", p: "E B1"},
  {v: "B1", p: "< E"},
  {v: "B1", p: "<= E"},
  {v: "B1", p: "> E"},
  {v: "B1", p: ">= E"},
  {v: "B1", p: "= E"},
  {v: "B1", p: "<> E"},
]

export default function sintaxAnalyze(tokens) {
  lexTokens = tokens.concat({lexeme: "$"});
  position = 0;
  stack = [0]

  return stateMachine(0)
}

function stackUp(state, lexeme) {
  stack.push(lexeme)
  stack.push(state)

  position++;

  return stateMachine(state);
}

function unstack(line) {
  let r = grammar[line]

  let size = r.p === "" ? 0 : r.p.split(" ").length;

  for(let i = 0; i < size * 2; i++) {
    stack.pop()
  }

  var nextState = stack[stack.length - 1]

  if(nextState === 0 && r.v === "S")
    nextState = 1
  else if(nextState === 4 && r.v === "D")
    nextState = 5
  else if(nextState === 6){
    if(r.v === "V") nextState = 8
    else if (r.v === "I") nextState = 9
  }
  else if(nextState === 7){
    if(r.v === "L") nextState = 11
    else if(r.v === "C") nextState = 12
    else if(r.v === "A") nextState = 13
    else if(r.v === "R") nextState = 14
    else if(r.v === "W") nextState = 15
    else if(r.v === "M") nextState = 16
    else if(r.v === "N") nextState = 17
    else if(r.v === "P") nextState = 18
  }
  else if(nextState === 10 && r.v === "I1")
    nextState = 28
  else if(nextState === 21 && r.v === "R1")
    nextState = 34
  else if(nextState === 23 && r.v === "W1")
    nextState =37
  else if(nextState === 24){
    if(r.v === "L") nextState = 39
    else if(r.v === "C") nextState = 12 
    else if(r.v === "A") nextState = 13 
    else if(r.v === "R") nextState = 14 
    else if(r.v === "W") nextState = 15 
    else if(r.v === "M") nextState = 16 
    else if(r.v === "N") nextState = 17 
    else if(r.v === "P") nextState = 18 
  }
  else if(nextState === 25){
    if(r.v === "E") nextState = 42
    else if(r.v === "X") nextState = 43
    else if(r.v === "B") nextState = 40
  }
  else if(nextState === 26) {
    if(r.v === "E") nextState = 42
    else if(r.v === "X") nextState = 43
    else if(r.v === "B") nextState = 47 
  }
  else if(nextState === 27 && r.v === "T")
    nextState = 48
  else if(nextState === 29 && r.v === "I")
    nextState = 51
  else if(nextState === 31) {
    if (r.v === "L1") nextState = 53
    else if (r.v === "C") nextState = 54
    else if (r.v === "A") nextState = 13
    else if (r.v === "R") nextState = 14
    else if (r.v === "W") nextState = 15
    else if (r.v === "M") nextState = 16
    else if (r.v === "N") nextState = 17
    else if (r.v === "P") nextState = 18
  }
  else if(nextState === 32) {
    if(r.v === "E") nextState = 55
    else if(r.v === "X") nextState = 43
  }
  else if(nextState === 33 && r.v === "I")
    nextState = 57
  else if(nextState === 38){
    if(r.v === "F") nextState = 63
    if(r.v === "G") nextState = 60
    if(r.v === "E") nextState = 62
    if(r.v === "X") nextState = 43
  }
  else if (nextState === 41 && r.v === "E1")
      nextState = 66
  else if (nextState === 42 && r.v === "B1")
      nextState = 71
  else if (nextState === 44) {
      if (r.v === "E") nextState = 78;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 45) {
      if (r.v === "E") nextState = 79;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 46 && r.v === "E1") {
      nextState = 80;
  } else if (nextState === 56 && r.v === "E1") {
      nextState = 66;
  } else if (nextState === 60 && r.v === "F1")
      nextState = 87;
  else if (nextState === 65) {
      if (r.v === "C") nextState = 90;
      else if (r.v === "A") nextState = 13;
      else if (r.v === "R") nextState = 14;
      else if (r.v === "W") nextState = 15;
      else if (r.v === "M") nextState = 16;
      else if (r.v === "N") nextState = 17;
      else if (r.v === "P") nextState = 18;
  } else if (nextState === 67 && r.v === "X") {
      nextState = 91;
  } else if (nextState === 68 && r.v === "X") {
      nextState = 92;
  } else if (nextState === 69 && r.v === "X") {
      nextState = 93;
  } else if (nextState === 70 && r.v === "X") {
      nextState = 94;
  } else if (nextState === 71) {
      if (r.v === "E") nextState = 95;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 72) {
      if (r.v === "E") nextState = 96;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 73) {
      if (r.v === "E") nextState = 97;
      else if (r.v === "X") nextState = 43;
  }  else if (nextState === 74) {
      if (r.v === "E") nextState = 98;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 75) {
      if (r.v === "E") nextState = 99;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 76) {
      if (r.v === "E") nextState = 100;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 81) {
      if (r.v === "C") nextState = 102;
      else if (r.v === "A") nextState = 13;
      else if (r.v === "R") nextState = 14;
      else if (r.v === "W") nextState = 15;
      else if (r.v === "M") nextState = 16;
      else if (r.v === "N") nextState = 17;
      else if (r.v === "P") nextState = 18;
  } else if (nextState === 82) {
      if (r.v === "V1") nextState = 103;
      else if (r.v === "I") nextState = 104;
  } else if (nextState === 83) {
      if (r.v === "L1") nextState = 105;
      else if (r.v === "C") nextState = 54;
      else if (r.v === "A") nextState = 13;
      else if (r.v === "R") nextState = 14;
      else if (r.v === "W") nextState = 15;
      else if (r.v === "M") nextState = 16;
      else if (r.v === "N") nextState = 17;
      else if (r.v === "P") nextState = 18;
  } else if (nextState === 88) {
      if (r.v === "F") nextState = 106;
      else if (r.v === "G") nextState = 60;
      else if (r.v === "E") nextState = 62;
      else if (r.v === "X") nextState = 43;
  } else if (nextState === 107 && r.v === "T") {
      nextState = 108;
  } else if (nextState === 109) {
      if (r.v === "V1") nextState = 110;
      else if (r.v === "I") nextState = 104;
  } else if (nextState === "$" && r.v === "S") {
      nextState = 1;
  } else {
    return stateMachine(-1)
  }

  stack.push(r.v)
  stack.push(nextState)

  return stateMachine(nextState)
}

function stateMachine(state) {
  let item;

  if(position >= lexTokens.length) {
    item = " "
  } else {
    item = lexTokens[position]
  }

  switch(state) {    
    case 0:
      if(item.lexeme === "program"){
        return stackUp(2, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 1:
      if(item.lexeme === "$") {
        return {result: true};
      }

      return {result: false, token: item.lexeme};
    case 2:
      if(item.token === tokens.IDENTIFICADOR)
        return stackUp(3, item.lexeme)
    
        return {result: false, token: item.lexeme};
    case 3:
      if(item.lexeme === ";") 
        return stackUp(4, item.lexeme)

        return {result: false, token: item.lexeme};
    case 4:
      if(item.lexeme === "var") {
        return stackUp(6, item.lexeme)
      }
      if(item.lexeme === "begin"){
        return unstack(3)
      }
    
      return {result: false, token: item.lexeme};
    case 5:
      if(item.lexeme === "begin"){
        return stackUp(7, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 6:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(10, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 7:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(19, item.lexeme)
      }
      if(item.lexeme === "read") {
        return stackUp(20, item.lexeme)
      }
      if(item.lexeme === "readln") {
        return stackUp(21, item.lexeme)
      }
      if(item.lexeme === "write") {
        return stackUp(22, item.lexeme)
      }
      if(item.lexeme === "writeln") {
        return stackUp(23, item.lexeme)
      }
      if(item.lexeme === "begin") {
        return stackUp(24, item.lexeme)
      }
      if(item.lexeme === "if") {
        return stackUp(25, item.lexeme)
      }
      if(item.lexeme === "while") {
        return stackUp(26, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 8:
      if(item.lexeme === "begin") {
        return unstack(2)
      }

      return {result: false, token: item.lexeme};
    case 9:
      if(item.lexeme === ":") {
        return stackUp(27, item.lexeme)
      }
  
      return {result: false, token: item.lexeme};
    case 10:
      if(item.lexeme === ":") {
        return unstack(11)
      }
      if(item.lexeme === ",") {
        return stackUp(29, item.lexeme)
      }
      if(item.lexeme === ")") {
        return unstack(11)
      }

      return {result: false, token: item.lexeme};
    case 11:
      if(item.lexeme === "end") {
        return stackUp(30, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 12:
      if(item.lexeme === ";") {
        return stackUp(31, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 13:
      if(item.lexeme === ";") {
        return unstack(15)
      }

      return {result: false, token: item.lexeme};
    case 14:
      if(item.lexeme === ";") {
        return unstack(16)
      }

      return {result: false, token: item.lexeme};
    case 15:
      if(item.lexeme === ";") {
        return unstack(17)
      }

      return {result: false, token: item.lexeme};
    case 16:
      if(item.lexeme === ";") {
        return unstack(18)
      }

      return {result: false, token: item.lexeme};
    case 17:
      if(item.lexeme === ";") {
        return unstack(19)
      }

      return {result: false, token: item.lexeme};
    case 18:
      if(item.lexeme === ";") {
        return unstack(20)
      }

      return {result: false, token: item.lexeme};
    case 19:
      if(item.lexeme === ":=") {
        return stackUp(32, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 20:
      if(item.lexeme === "(") {
        return stackUp(33, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 21:
      if(item.lexeme === ";") {
        return unstack(25)
      }
      if(item.lexeme === "(") {
        return stackUp(35, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 22:
      if(item.lexeme === "(") {
        return stackUp(36, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 23:
      if(item.lexeme === ";") {
        return unstack(29)
      }
      if(item.lexeme === "(") {
        return stackUp(38, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 24:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(19, item.lexeme)
      }
      if(item.lexeme === "read") {
        return stackUp(20, item.lexeme)
      }
      if(item.lexeme === "readln") {
        return stackUp(21, item.lexeme)
      }
      if(item.lexeme === "write") {
        return stackUp(22, item.lexeme)
      }
      if(item.lexeme === "writeln") {
        return stackUp(23, item.lexeme)
      }
      if(item.lexeme === "begin") {
        return stackUp(24, item.lexeme)
      }
      if(item.lexeme === "if") {
        return stackUp(25, item.lexeme)
      }
      if(item.lexeme === "while") {
        return stackUp(26, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    
    case 25:
    case 26:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(41, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(44, item.lexeme)
      }
      if(item.lexeme === "(") {
        return stackUp(45, item.lexeme)
      }
      if(item.token === tokens.NUMERO_INTEIRO || item.token === tokens.NUMERO_REAL) {
        return stackUp(46, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 27:
      if(item.lexeme === 'integer') {
        return stackUp(49, item.lexeme)
      }
      if(item.lexeme === "boolean") {
        return stackUp(50, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 28:
      if(item.lexeme === ":" || item.lexeme === ")") {
        return unstack(9)
      }

      return {result: false, token: item.lexeme};
    case 29:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(10, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 30:
      if(item.lexeme === ".") {
        return stackUp(52, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    
    case 31:
    case 83:
      if(item.lexeme === "end") {
        return unstack(14)
      }
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(19, item.lexeme)
      }
      if(item.lexeme === "read") {
        return stackUp(20, item.lexeme)
      }
      if(item.lexeme === "readln") {
        return stackUp(21, item.lexeme)
      }
      if(item.lexeme === "write") {
        return stackUp(22, item.lexeme)
      }
      if(item.lexeme === "writeln") {
        return stackUp(23, item.lexeme)
      }
      if(item.lexeme === "begin") {
        return stackUp(24, item.lexeme)
      }
      if(item.lexeme === "if") {
        return stackUp(25, item.lexeme)
      }
      if(item.lexeme === "while") {
        return stackUp(26, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 32:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(56, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(44, item.lexeme)
      }
      if(item.lexeme === "(") {
        return stackUp(45, item.lexeme)
      }
      if(item.token === tokens.NUMERO_INTEIRO || item.token === tokens.NUMERO_REAL) {
        return stackUp(46, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    
    case 33:
    case 35:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(10, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 34:
      if(item.lexeme === ";") {
        return unstack(23)
      }
    
      return {result: false, token: item.lexeme};
    
    case 36:
    case 38:
    case 88:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(56, item.lexeme)
      }
      if(item.token === tokens.STRING) {
        return stackUp(61, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(44, item.lexeme)
      }
      if(item.lexeme === "(") {
        return stackUp(45, item.lexeme)
      }
      if(item.token === tokens.NUMERO_INTEIRO || item.token === tokens.NUMERO_REAL) {
        return stackUp(46, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 39:
      if(item.lexeme === "end") {
        return stackUp(64, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 40:
      if(item.lexeme === "then") {
        return stackUp(65, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 41:
      if(item.lexeme === ";" || item.lexeme === "," || item.lexeme === ")" || item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(45)
      }
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(48)
      }
      if(item.lexeme === "+") {
        return stackUp(67, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(68, item.lexeme)
      }
      if(item.lexeme === "*") {
        return stackUp(69, item.lexeme)
      }
      if(item.lexeme === "/") {
        return stackUp(70, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 42:
      if(item.lexeme === "<") {
        return stackUp(72, item.lexeme)
      }
      if(item.lexeme === "<=") {
        return stackUp(73, item.lexeme)
      }
      if(item.lexeme === ">") {
        return stackUp(74, item.lexeme)
      }
      if(item.lexeme === ">=") {
        return stackUp(75, item.lexeme)
      }
      if(item.lexeme === "=") {
        return stackUp(76, item.lexeme)
      }
      if(item.lexeme === "<>") {
        return stackUp(77, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 43:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" || 
        item.lexeme === "then" || 
        item.lexeme === "do" || 
        item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(38)
      }

      return {result: false, token: item.lexeme};
    
    case 44:
    case 45:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(56, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(44, item.lexeme)
      }
      if(item.lexeme === "(") {
        return stackUp(45, item.lexeme)
      }
      if(item.token === tokens.NUMERO_INTEIRO || item.token === tokens.NUMERO_REAL) {
        return stackUp(46, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    
    case 46:
    case 56:
      if(item.lexeme === ";" || item.lexeme === "," || item.lexeme === ")" || item.lexeme === "then" || item.lexeme === "do" || item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(45)
      }
      if(item.lexeme === "+") {
        return stackUp(67, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(68, item.lexeme)
      }
      if(item.lexeme === "*") {
        return stackUp(69, item.lexeme)
      }
      if(item.lexeme === "/") {
        return stackUp(70, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 47:
      if(item.lexeme === "do") {
        return stackUp(81, item.lexeme)
      }
    
      return {result: false, token: item.lexeme};
    case 48:
      if(item.lexeme === ";") {
        return stackUp(82, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 49:
      if(item.lexeme === ";") {
        return unstack(7)
      }

      return {result: false, token: item.lexeme};
    case 50:
      if(item.lexeme === ";") {
        return unstack(8)
      }

      return {result: false, token: item.lexeme};
    case 51:
      if(item.lexeme === ":" || item.lexeme === ")") {
        return unstack(10)
      }

      return {result: false, token: item.lexeme};
    case 52:
      if(item.lexeme === "$") {
        return unstack(1)
      }

      return {result: false, token: item.lexeme};
    case 53:
      if(item.lexeme === "end") {
        return unstack(12)
      }

      return {result: false, token: item.lexeme};
    case 54:
      if(item.lexeme === ";") {
        return stackUp(83, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 55:
      if(item.lexeme === ";") {
        return unstack(21)
      }

      return {result: false, token: item.lexeme};
    case 57:
      if(item.lexeme === ")") {
        return stackUp(84, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 58:
      if(item.lexeme === ")") {
        return stackUp(85, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 59:
      if(item.lexeme === ")") {
        return stackUp(86, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 60:
      if(item.lexeme === ")") {
        return unstack(32)
      }
      if(item.lexeme === ",") {
        return stackUp(88, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 61:
      if(item.lexeme === ")" || item.lexeme === ",") {
        return unstack(33)
      }

      return {result: false, token: item.lexeme};
    case 62:
      if(item.lexeme === ")" || item.lexeme === ",") {
        return unstack(34)
      }

      return {result: false, token: item.lexeme};
    case 63:
      if(item.lexeme === ")") {
        return stackUp(89, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 64:
      if(item.lexeme === ";") {
        return unstack(35)
      }

      return {result: false, token: item.lexeme};
    
    case 65:
    case 81:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(19, item.lexeme)
      }
      if(item.lexeme === "read") {
        return stackUp(20, item.lexeme)
      }
      if(item.lexeme === "readln") {
        return stackUp(21, item.lexeme)
      }
      if(item.lexeme === "write") {
        return stackUp(22, item.lexeme)
      }
      if(item.lexeme === "writeln") {
        return stackUp(23, item.lexeme)
      }
      if(item.lexeme === "begin") {
        return stackUp(24, item.lexeme)
      }
      if(item.lexeme === "if") {
        return stackUp(25, item.lexeme)
      }
      if(item.lexeme === "while") {
        return stackUp(26, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 66:
      if(item.lexeme === ";" || item.lexeme === "," || item.lexeme === ")" || item.lexeme === "then" || item.lexeme === "do" || item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(46)
      }

      return {result: false, token: item.lexeme};
    
    case 67:
    case 68:  
    case 69:
    case 70:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(56, item.lexeme)
      }
      if(item.token === tokens.NUMERO_INTEIRO || item.token === tokens.NUMERO_REAL) {
        return stackUp(46, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 71:
      if(item.lexeme === "then" || item.lexeme === "do"){
        return unstack(49)
      }

      return {result: false, token: item.lexeme};
    
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(56, item.lexeme)
      }
      if(item.lexeme === "-") {
        return stackUp(44, item.lexeme)
      }
      if(item.lexeme === "(") {
        return stackUp(45, item.lexeme)
      }
      if(item.token === tokens.NUMERO_INTEIRO || item.token === tokens.NUMERO_REAL) {
        return stackUp(46, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 78:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" ||
        item.lexeme === "then" ||
        item.lexeme === "do" ||
        item.token === tokens.OPERADOR_RELACIONAL
      ) {
        return unstack(39)
      }

      return {result: false, token: item.lexeme};
    case 79:
      if(item.lexeme === ")") {
        return stackUp(101, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 80:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" ||
        item.lexeme === "then" ||
        item.lexeme === "do" ||
        item.token === tokens.OPERADOR_RELACIONAL
      ) {
        return unstack(47)
      }

      return {result: false, token: item.lexeme};
    case 82:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(10, item.lexeme)
      }
      if(item.lexeme === "begin") {
        return unstack(6)
      }

      return {result: false, token: item.lexeme};
    case 84:
      if(item.lexeme === ";") {
        return unstack(22)
      }

      return {result: false, token: item.lexeme};
    case 85:
      if(item.lexeme === ";") {
        return unstack(24)
      }

      return {result: false, token: item.lexeme};
    case 86:
      if(item.lexeme === ";") {
        return unstack(26)
      }

      return {result: false, token: item.lexeme};
    case 87:
      if(item.lexeme === ")") {
        return unstack(30)
      }
    
      return {result: false, token: item.lexeme};
    case 89:
      if(item.lexeme === ";") {
        return unstack(28)
      }

      return {result: false, token: item.lexeme};
    case 90:
      if(item.lexeme === ";") {
        return unstack(36)
      }
    
      return {result: false, token: item.lexeme};
    case 91:
      if(item.lexeme === ";" ||
      item.lexeme === "," ||
      item.lexeme === ")" || 
      item.lexeme === "then" || 
      item.lexeme === "do" || 
      item.token === tokens.OPERADOR_RELACIONAL) {
      return unstack(41)
    }

    return {result: false, token: item.lexeme};
    case 92:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" || 
        item.lexeme === "then" || 
        item.lexeme === "do" || 
        item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(42)
      }

      return {result: false, token: item.lexeme};
    case 93:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" || 
        item.lexeme === "then" || 
        item.lexeme === "do" || 
        item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(43)
      }

      return {result: false, token: item.lexeme};
    case 94:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" || 
        item.lexeme === "then" || 
        item.lexeme === "do" || 
        item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(44)
      }

      return {result: false, token: item.lexeme};
    case 95:
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(50)
      }

      return {result: false, token: item.lexeme};
    case 96:
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(51)
      }

      return {result: false, token: item.lexeme};
    case 97:
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(52)
      }

      return {result: false, token: item.lexeme};
    case 98:
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(53)
      }

      return {result: false, token: item.lexeme};
    case 99:
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(54)
      }

      return {result: false, token: item.lexeme};
    case 100:
      if(item.lexeme === "then" || item.lexeme === "do") {
        return unstack(55)
      }

      return {result: false, token: item.lexeme};
    case 101:
      if(item.lexeme === ";" ||
        item.lexeme === "," ||
        item.lexeme === ")" || 
        item.lexeme === "then" || 
        item.lexeme === "do" || 
        item.token === tokens.OPERADOR_RELACIONAL) {
        return unstack(40)
      }

      return {result: false, token: item.lexeme};
    case 102:
      if(item.lexeme === ";") {
        return unstack(37)
      }

      return {result: false, token: item.lexeme};
    case 103:
      if(item.lexeme === "begin") {
        return unstack(4)
      }

      return {result: false, token: item.lexeme};
    case 104:
      if(item.lexeme === ":") {
        return stackUp(107, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 105:
      if(item.lexeme === "end") {
        return unstack(13)
      }

      return {result: false, token: item.lexeme};
    case 106:
      if(item.lexeme === ")") {
        return unstack(31)
      }

      return {result: false, token: item.lexeme};
    case 107:
      if(item.lexeme === "integer") {
        return stackUp(49, item.lexeme)
      }
      if(item.lexeme === "boolean") {
        return stackUp(50, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 108:
      if(item.lexeme === ";") {
        return stackUp(109, item.lexeme)
      }

      return {result: false, token: item.lexeme};
    case 109:
      if(item.token === tokens.IDENTIFICADOR) {
        return stackUp(10, item.lexeme)
      }
      if(item.lexeme === "begin") {
        return unstack(6)
      }

      return {result: false, token: item.lexeme};
    case 110:
      if(item.lexeme === "begin") {
        return unstack(5)
      }

      return {result: false, token: item.lexeme};

    default:
      return {result: false}
  }
}