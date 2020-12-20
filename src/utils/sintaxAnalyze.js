import tokens from "./tokens";

let lexTokens = []
let position = -1;

export default function sintaxAnalyze(tokens) {
  lexTokens = tokens;

  return stateMachine(0)
}

function stateMachine(state, noIncrements) {
  !noIncrements && position++;

  let item;

  if(position >= lexTokens.length) {
    item = " "
  } else {
    item = lexTokens[position]
  }

  console.log('Estado ' + state)
  console.log({item})

  switch(state) {
    case 0:
      if(item.lexeme === "program")
        return stateMachine(2)
      else
        return stateMachine(-1)
      
    case 2:
      if(item.token === tokens.IDENTIFICADOR)
        return stateMachine(3)
      else
        return stateMachine(-1)
    
    case 3:
      if(item.lexeme === ";") 
        return stateMachine(4)
      else
        return stateMachine(-1)

    case 4:
      if(item.lexeme === "var") 
        return stateMachine(3)
      else
        return stateMachine(5, true)
    
    case 5:
      if(item.lexeme === "begin")
        return stateMachine(6)
      else
        return stateMachine(-1)

    case 6:
      if(item.token === tokens.IDENTIFICADOR)
        return stateMachine(7)
      else
        return stateMachine(-1)

    case 7:
      if(item.lexeme === "end")
        return stateMachine(8)
      else
        return stateMachine(-1)
    case 8:
      if(item.lexeme === ".")
        return true;
      else
        return stateMachine(-1);
    default:
      return false
  }
}