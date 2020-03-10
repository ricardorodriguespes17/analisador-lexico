import React, { useState } from 'react'
import Switch from 'react-input-switch'
import './App.css'
import analyzer from './Analyzer'

function App() {

	//constante para mudar o tema do editor de texto
	const [theme, setTheme] = useState(0)
	//constante para mudar código digitado no editor
	const [code, setCode] = useState('')
	//constante para mudar a lista de lexemas encontrados
	const [lexemes, setLexemes] = useState([])
	//constante para mudar a visibilidade da tabela
	const [showTable, setShowTable] = useState(false)

	function onAnalyzer(){
		//chama o analisador que retornará uma lista de lexemas encontrados
		var lexemesFound = analyzer(code)

		//coloca os novos lexemas para ser setados na tabela
		setLexemes(lexemesFound)

		//muda a visibilidade da tabela
		setShowTable(true)
	}

	return (
		<div className="container">
			<h2>Analisador léxico</h2>
			<div className="switchBox">
				<text>Tema </text>
				<Switch styles={styles.switch} value={theme} onChange={setTheme} />
			</div>
			<text>Digite o código em Pascal no campo abaixo:</text>
			<textarea className="codeSpace"
				value={code}
				onChangeCapture={(event) => setCode(event.target.value)}
				style={theme === 1 ? styles.darkTheme : styles.lightTheme} ></textarea>
			<button className="buttonAnalise" onClick={onAnalyzer}>
				<text>Analisar</text>
			</button>
			<table hidden={!showTable}>
				<tr>
					<td>
						<b>LEXEMA</b>
					</td>
					<td>
						<b>TOKEN</b>
					</td>
				</tr>
				{lexemes.length !== 0 ? null : (
					<tr>
						<tr>
							<td>
								Nenhum lexema encontrado
							</td>
						</tr>
					</tr>
				)}
				{lexemes.map(item => {
					return <tr key={item.id}>
						<td>
							{item.lexeme}
						</td>
						<td>
							{item.token}
						</td>
					</tr>
				})}
			</table>
		</div>
	)
}

const styles = {
	darkTheme: {
		backgroundColor: '#333',
		color: '#FFF',
	},
	lightTheme: {
		backgroundColor: '#FFF',
		color: '#000',
	},
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
