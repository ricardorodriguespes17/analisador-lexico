import React, { useEffect, useState } from 'react'
import Switch from 'react-input-switch'
import lexAnalyze from './utils/lexAnalyze'
import sintaxAnalyze from './utils/sintaxAnalyze'

import './styles/global.css'
import tokens from './utils/tokens'

function App() {

	//constante para mudar o tema do editor de texto
	const [theme, setTheme] = useState(0)
	//constante para mudar código digitado no editor
	const [code, setCode] = useState('')
	//constante para mudar a lista de lexemas encontrados
	const [lexemes, setLexemes] = useState([])
	//constante para mudar a visibilidade da tabela
	const [showTable, setShowTable] = useState(false)
	//constante para mostrar se há erro de digitacao
	const [codeError, setCodeError] = useState(false);
	
	const [sintaxLog, setSintaxLog] = useState("");

	useEffect(() => {
		const theme = JSON.parse(localStorage.getItem("theme"));

		if(theme) {
			setTheme(parseInt(theme))
		}
	}, [])

	useEffect(() => {
		localStorage.setItem("theme", JSON.stringify(theme));
	}, [theme]);

	function onAnalyzer(){
		if(code === "") {
			setCodeError(true);
			setTimeout(() => setCodeError(false), 2500);
			return;
		}

		//chama o analisador que retornará uma lista de lexemas encontrados
		var lexemesFound = lexAnalyze(code)

		var sintax = sintaxAnalyze(lexemesFound);

		setSintaxLog(sintax.result ? "Código aceito!" : `Erro sintático. ${sintax.token ? `Token inexperado: "${sintax.token}"` : ""}`)

		//coloca os novos lexemas para ser setados na tabela
		setLexemes(lexemesFound)

		//muda a visibilidade da tabela
		setShowTable(true)
	}

	function lexemeColor(token) {

		switch(token) {
			case tokens.ATRIBUICAO:
			case tokens.OPERADOR_ARITMETICO:
			case tokens.OPERADOR_LOGICO:
			case tokens.OPERADOR_RELACIONAL:
			case tokens.SIMBOLO_ESPECIAL:
				return "#ff79c6"
			case tokens.CARACTERE:
			case tokens.STRING:
				return "#e87937"
			case tokens.FIM:
				return "#e7ce4c"
			case tokens.NUMERO_INTEIRO:
			case tokens.NUMERO_REAL:
				return "#78d1e1";
			case tokens.PALAVRA_RESERVADA:
				return "#32c480"
			default:
				return null;
		}
	}

	return (
		<div className={`container${theme === 1 ? " dark" : ""}`}>
			<h2>Analisador léxico e sintático</h2>

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

			<button className={`buttonAnalise${theme === 1 ? " dark" : ""}`} onClick={onAnalyzer}>
				<label>Analisar</label>
			</button>

			<div className="results" hidden={!showTable}>
				<h3 className="title-results">Análise sintática</h3>
				<input className="console" disabled={true} value={"> " + sintaxLog} />

				<h3 className="title-results">Tabela de tokens</h3>
				<div className={`table${theme === 1 ? " dark" : ""}`}>
					<div className="header">
						<h4 className="title">LEXEMA</h4>
						<h4 className="title">TOKEN</h4>
					</div>
					{lexemes.length !== 0 ? null : (
						<div className="item">
							Nenhum lexema encontrado
						</div>
					)}
					{lexemes.map((item, index) => {
						return <div key={index} className="item">
							<label style={lexemeColor(item.token) && theme === 1 ? {color: lexemeColor(item.token)} : {}}>
								{item.lexeme}
							</label>
							<label>
								{item.token}
							</label>
						</div>
					})}
				</div>
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
			backgroundColor: '#555'
		},
		button: {
			backgroundColor: '#fff',
		},
		buttonChecked: {
			backgroundColor: '#000'
		},
	}
}

export default App
