import React, { useState } from 'react'
import Switch from 'react-input-switch'
import './App.css'
import lexAnalyze from './utils/lexAnalyze'
import sintaxAnalyze from './utils/sintaxAnalyze'

function App() {

	//constante para mudar o tema do editor de texto
	const [theme, setTheme] = useState(1)
	//constante para mudar código digitado no editor
	const [code, setCode] = useState('')
	//constante para mudar a lista de lexemas encontrados
	const [lexemes, setLexemes] = useState([])
	//constante para mudar a visibilidade da tabela
	const [showTable, setShowTable] = useState(false)
	//constante para mostrar se há erro de digitacao
	const [codeError, setCodeError] = useState(false);

	function onAnalyzer(){
		if(code === "") {
			setCodeError(true);
			setTimeout(() => setCodeError(false), 2500);
			return;
		}

		//chama o analisador que retornará uma lista de lexemas encontrados
		var lexemesFound = lexAnalyze(code)

		var sintax = sintaxAnalyze(lexemesFound);

		console.log(sintax)
		
		//coloca os novos lexemas para ser setados na tabela
		setLexemes(lexemesFound)

		//muda a visibilidade da tabela
		setShowTable(true)
	}

	return (
		<div className="container">
			<h2>Analisador léxico</h2>

			<div className="switchBox">
				<label>Tema </label>
				<Switch styles={styles.switch} value={theme} onChange={setTheme} />
			</div>

			<label className="label-code">Digite o código em Pascal no campo abaixo:</label>
			<textarea 
				className={`code-space${codeError ? " error" : ""}${theme === 1 ? " dark" : ""}`}
				value={code}
				onChange={(event) => setCode(event.target.value)}
				style={theme === 1 ? styles.darkTheme : styles.lightTheme}
			/>

			<button className="buttonAnalise" onClick={onAnalyzer}>
				<label>Analisar</label>
			</button>

			<div hidden={!showTable} className="table">
				<div className="header">
					<h3 className="title">LEXEMA</h3>
					<h3 className="title">TOKEN</h3>
				</div>
				{lexemes.length !== 0 ? null : (
					<div className="item">
						Nenhum lexema encontrado
					</div>
				)}
				{lexemes.map((item, index) => {
					return <div key={index} className="item">
						<label>
							{item.lexeme}
						</label>
						<label>
							{item.token}
						</label>
					</div>
				})}
			</div>
		</div>
	)
}

const styles = {
	switch: {
		track: {
			backgroundColor: '#AAA'
		},
		trackChecked: {
			backgroundColor: 'black'
		},
		button: {
			backgroundColor: 'black'
		},
		buttonChecked: {
			backgroundColor: '#AAA'
		}
	}
}

export default App
