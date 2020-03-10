import React, { useState } from 'react'
import Switch from 'react-input-switch'
import './App.css'
import tokens from './Tokens'

function App() {

	const [theme, setTheme] = useState(0)
	const [code, setCode] = useState('')
	const [lexemas, setLexemas] = useState([])
	const [showTable, setShowTable] = useState(false)

	function analise() {
		//verifica se o codigo (sem espaços) é vazio e cancela a analise caso for
		if (code.trim() === '')
			return

		//separa o texto em uma lista de palavras
		var words = code.replace('\n', ' ')
			.split(' ')
			.filter(item => item !== '')
		console.log(words)

		//mapeia a lista de palavras e detecta os tokens
		var newLexemas = []
		words.map(word => {
			tokens.map(item => {
				if (item.lexema === word) {
					newLexemas.push(item)
				}
				return item
			})
			return word
		})
		//coloca os novos lexemas para ser setados na tabela
		setLexemas(newLexemas)

		//muda a visibilidade da tabela
		setShowTable(true)
	}

	return (
		<div className="container">
			<h2>Análisador léxico</h2>
			<div className="switchBox">
				<text>Tema </text>
				<Switch styles={styles.switch} value={theme} onChange={setTheme} />
			</div>
			<text>Digite o código em Pascal no campo abaixo:</text>
			<textarea className="codeSpace"
				value={code}
				onChangeCapture={(event) => setCode(event.target.value)}
				style={theme === 1 ? styles.darkTheme : styles.lightTheme} ></textarea>
			<button className="buttonAnalise" onClick={analise}>
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
				{lexemas.length !== 0 ? null : (
					<tr>
						<tr>
							<td>
								Nenhum lexema encontrado
							</td>
						</tr>
					</tr>
				)}
				{lexemas.map(item => {
					return <tr key={item.id}>
						<td>
							{item.lexema}
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
