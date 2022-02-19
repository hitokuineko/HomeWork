const btn = document.querySelector('button')

const name_input = document.querySelector('.name')
const name_info = document.querySelector('.nameinfo')

const surname_input = document.querySelector('.surname')
const surname_info = document.querySelector('.surnameinfo')

const pesel_input = document.querySelector('.pesel')
const pesel_info = document.querySelector('.peselinfo')

const modal = document.querySelector('.modal')
const modal_txt = document.querySelector('.modaltxt')

const date_input = document.querySelector('.date')

const letters = /[a-z]/i
const numbers = /[0-9]/

class user {
	constructor(name, surname, pesel, birthDate) {
		this.name = name
		this.surname = surname
		this.pesel = pesel
		this.birthDate = birthDate
	}
}

name_OK = false
surname_OK = false
pesel_OK = false

// SPrawdzenie poprawności PESEL według strony https://www.infor.pl/prawo/gmina/dowod-osobisty/262184,Jak-sprawdzic-czy-masz-poprawny-PESEL.html
const goodPesel = pesel => {
	const help = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
	let sum = 0

	for (let i = 0; i <= 9; i++) {
		sum += pesel[i] * help[i]
	}

	let lastnum = 10 - (sum % 10)

	return pesel[10] == lastnum
}

// ustawianie daty jeśli wpiszemy poprawny PESEL
const setDate = string => {
	let day = parseInt(string[4] + string[5])
	let month = parseInt(string[2] + string[3] - 1)
	let year
	if (month > 20) {
		year = 2000 + parseInt(string[0] + string[1])
		month -= 20
	} else {
		year = 1900 + parseInt(string[0] + string[1])
	}

	const dateHelp = new Date(year, month, day)
	date_input.value = dateHelp.toLocaleString('pl', { dateStyle: 'short' })
}

// funkcja do sprawdzania czy pesel jest odpowiednio długi
const checkPesel = () => {
	let str = pesel_input.value
	let pesel = []

	if (str.length < 11 || str.lenght > 11 || !str.match(numbers)) {
		pesel_info.textContent = 'Wpisany PESEL jest niepoprawny'
	} else {
		pesel_info.textContent = ''

		for (let num of str) {
			pesel.push(parseInt(num))
		}

		if (!goodPesel(pesel)) {
			pesel_info.textContent = 'Wpisany PESEL jest fałszywy - sprawdź proszę'
		} else {
			pesel_OK = true
			setDate(str)
		}
	}
}

// funkcja sprawdza czy długość jest odpowiednia dla imienia i nazwiska 0< len(imię/nazwisko) <= 20/30
// można by jeszcze matchem tak jak w peselu sprawdzić czy składa się jedynie z liter ponieważ type w inpucie nie działa bodaj na safarii
const checkLen = e => {
	const whatChanged = e.target.classList.item(0)

	if (whatChanged == 'name' && name_input.value.length > 20) {
		name_info.textContent = 'Wpisane imię jest za długie'
	} else {
		if (whatChanged == 'name' && name_input.value.length == 0) {
			name_info.textContent = 'Wpisz imię...'
		} else if (whatChanged == 'name') {
			name_info.textContent = ''
			name_OK = true
		}
	}

	if (whatChanged == 'surname' && surname_input.value.length > 30) {
		surname_info.textContent = 'Wpisane nazwisko jest za długie'
	} else {
		if (whatChanged == 'surname' && surname_input.value.length == 0) {
			surname_info.textContent = 'Wpisz nazwisko...'
		} else if (whatChanged == 'surname') {
			surname_info.textContent = ''
			surname_OK = true
		}
	}
}

// wyłącz modal po naciśnieciu czegobądź gdy był błąd
const modalOff = () => {
	modal.classList.remove('active')
	modal.removeEventListener('click', modalOff)
}

//sprawdza czy wszystko było wypełniane dobrze, jeśli tak to super. Jeśli nie po kliknięciu gdziebądź można się poprawić
const checkAll = () => {
	console.log(name_OK, surname_OK, pesel_OK)
	if (name_OK && surname_OK && pesel_OK) {
		modal.classList.remove('red')
		modal.classList.add('green')
		modal.classList.add('active')
		modal_txt.textContent = 'sukces 👍'
		const userCreated = new user(name_input.value, surname_input.value, pesel_input.value, date_input.value)
		console.log(userCreated)
	} else {
		modal.classList.remove('green')
		modal.classList.add('red')
		modal.classList.add('active')
		modal_txt.textContent = 'bląd ✋'
		modal.addEventListener('click', modalOff)
	}
}

pesel_input.addEventListener('change', checkPesel)
name_input.addEventListener('change', checkLen)
surname_input.addEventListener('change', checkLen)
btn.addEventListener('click', checkAll)
