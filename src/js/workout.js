// help

const questionmarkBtn = document.querySelector('.questionmark')
const helpBox = document.querySelector('.help-container')
const questionmarkIcon = document.querySelector('.fa-circle-question')
const xmarkIcon = document.querySelector('.fa-xmark')

// weather

const changeCityInput = document.querySelector('.change-city-input')
const changeCityErr = document.querySelector('.change-city-error')
const changeCityAcceptBtn = document.querySelector('.change-accept')
const changeCityCancelBtn = document.querySelector('.change-cancel')

const cityNameBtn = document.querySelector('.city-name')
const temperatureValue = document.querySelector('.temperature')
const weatherIcons = document.querySelectorAll('.weather-icon')
const weatherErr = document.querySelector('.weather-error')
const weatherInfo = document.querySelector('.weather-info')

// accordion elements

const accordion = document.querySelector('.accordion')
const accordionBtns = document.querySelectorAll('.acc-btn')
const accordionBoxes = document.querySelectorAll('.acc-box')

// stoper elements

const exerciseName = document.querySelector('.exercise-name')
const timeValue = document.querySelector('.time')
const startCountingBtn = document.querySelector('.stoper-start')
const pauseCountingBtn = document.querySelector('.stoper-pause')
const stopCountingBtn = document.querySelector('.stoper-stop')
const saveCountingBtn = document.querySelector('.stoper-save')
const stoperErr = document.querySelector('.stoper-err')
const QuoteText = document.querySelector('.quote-text')

let countedTime
let milliseconds = 0
let seconds = 0
let minutes = 0

// result elements

const startExerciseBtns = document.querySelectorAll('.start-exercises-btn')

const score = document.querySelector('.your-score')

const oldScoreBox = document.querySelector('.old-score-box')
const newScoreBox = document.querySelector('.new-score-box')
const gapScoreBox = document.querySelector('.gap-score-box')
const oldResultItemList = document.querySelector('.old-result-item-list')
const newResultItemList = document.querySelector('.new-result-item-list')
const gapResultItemList = document.querySelector('.gaps-item-list')
const oldResultTimeList = document.querySelector('.old-result-time-list')
const newResultTimeList = document.querySelector('.new-result-time-list')
const gapResultTimeList = document.querySelector('.gaps-time-list')
const saveAllBtn = document.querySelector('.done-btn')
const ResetAllBtn = document.querySelector('.reset-btn')
const cancelBtn = document.querySelector('.cancel-btn')

let exercisesList
let activeDayBox
let accList
let accListItems
let dailyTimeItems
let resultId = 1
let resultItemsArr = []
let numDay = 1

// weather API

const getWeather = () => {

    let cityNameText = cityNameBtn.textContent

    const API_KEY = 'GBPVA9D2HA5Y6BLQUVWBQDNHT'
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityNameText}?unitGroup=us&key=${API_KEY}`

    axios
        .get(URL)
        .then(res => {
            const tempF = res.data.currentConditions.temp
            const tempC = Math.round((tempF - 32) * 5 / 9)
            temperatureValue.textContent = tempC + '°C'

            if (tempC < 7) {
                weatherInfo.textContent = "It's cold, better to stay inside!"
            } else if (tempC > 25) {
                weatherInfo.textContent = "It's hot, stay hydrated!"
            } else {
                weatherInfo.textContent = ''
            }

            weatherIcons.forEach(el => {

                if (el.classList.contains(res.data.currentConditions.icon)) {

                    el.classList.add('active-icon')

                    if (el.classList.contains('clear-day') || el.classList.contains('cloudy') || el.classList.contains('partly-cloudy-day')) {

                        if (tempC > 7 && tempC < 15) {
                            weatherInfo.textContent = "It's good weather to do some running!"
                        }

                    }

                } else {
                    el.classList.remove('active-icon')
                }
            });

            changeCityInput.value = ''
            weatherErr.textContent = ''
        })
        .catch((err) => {

            temperatureValue.textContent = ''

            if (err.request.status === 429) {

                weatherErr.textContent = 'You have exceeded the maximum number of daily result records, please, try again tomorrow'
            } else {

                weatherErr.textContent = 'I cannot find this city!'
            }
        })
}

// help functions

const showMeHelp = () => {
    helpBox.classList.toggle('active')

    if (questionmarkIcon.classList.contains('active-help-icon')) {
        questionmarkIcon.classList.remove('active-help-icon')
        xmarkIcon.classList.add('active-help-icon')
    } else {
        questionmarkIcon.classList.add('active-help-icon')
        xmarkIcon.classList.remove('active-help-icon')
    }
}

// weather functions 

const showMeCityInput = () => {
    changeCityInput.closest('.popup').style.display = 'block'
}

const closeCityInput = () => {
    changeCityInput.closest('.popup').style.display = 'none'
    changeCityInput.value = ''
    changeCityErr.textContent = ''
}

const checkCityInput = () => {

    if (changeCityInput.value === '') {

        changeCityErr.textContent = 'Write name of the city!'

    } else if (changeCityInput.value.toLowerCase() === cityNameBtn.textContent.toLowerCase()) {

        changeCityErr.textContent = "It's already found!"

    } else {

        changeCityErr.textContent = ''

        acceptCityInput()
    }
}

const acceptCityInput = () => {
    cityNameBtn.textContent = changeCityInput.value.charAt(0).toUpperCase() + changeCityInput.value.slice(1)
    changeCityInput.value = ''
    changeCityInput.closest('.popup').style.display = 'none'
    getWeather()
}

const enterCheckInput = (e) => {
    if (e.key === 'Enter') {
        checkCityInput();
    }
}

// accordion functions

const openAccordion = (e) => {
    if (e.target.nextElementSibling.classList.contains('active')) {
        e.target.nextElementSibling.classList.remove('active')
        cancelExercises()
        stopCounting()
    } else {
        closeAllAccordions()
        e.target.nextElementSibling.classList.add('active')
        cancelExercises()
        stopCounting()
    }
}

const closeAllAccordions = () => {
    const allAccordionInfos = accordion.querySelectorAll('.acc-info')
    allAccordionInfos.forEach(item => {
        item.classList.remove('active')
    })
}

// stoper functions

 const startCounting = () => {
    startCountingBtn.style.display = 'none'
    pauseCountingBtn.style.display = 'block'

    stoperErr.textContent = ''
    QuoteText.textContent = ''

    clearInterval(countedTime)

    countedTime = setInterval(() => {
        if (minutes <= 9 && seconds <= 9 && milliseconds < 9) {
            milliseconds++
            timeValue.innerHTML = `0${minutes}:0${seconds}.${milliseconds}`
        } else if (minutes <= 9 && seconds < 9 && milliseconds === 9) {
            milliseconds++
            milliseconds = 0
            seconds++
            timeValue.innerHTML = `0${minutes}:0${seconds}.${milliseconds}`
        } else if (minutes <= 9 && seconds > 9 && seconds <= 59 && milliseconds < 9) {
            milliseconds++
            timeValue.innerHTML = `0${minutes}:${seconds}.${milliseconds}`
        } else if (minutes <= 9 && seconds >= 9 && seconds < 59 && milliseconds === 9) {
            milliseconds++
            milliseconds = 0
            seconds++
            timeValue.innerHTML = `0${minutes}:${seconds}.${milliseconds}`
        } else if (minutes <= 9 && seconds === 59 && milliseconds === 9) {
            milliseconds++
            milliseconds = 0
            seconds++
            seconds = 0
            minutes++
            timeValue.innerHTML = `0${minutes}:0${seconds}.${milliseconds}`
        } else if (minutes > 9 && minutes <= 59 && seconds <= 9 && milliseconds < 9) {
            milliseconds++
            timeValue.innerHTML = `${minutes}:0${seconds}.${milliseconds}`
        } else if (minutes > 9 && minutes <= 59 && seconds < 9 && milliseconds === 9) {
            milliseconds++
            milliseconds = 0
            seconds++
            timeValue.innerHTML = `${minutes}:0${seconds}.${milliseconds}`
        } else if (minutes > 9 && minutes <= 59 && seconds > 9 && seconds <= 59 && milliseconds < 9) {
            milliseconds++
            timeValue.innerHTML = `${minutes}:${seconds}.${milliseconds}`
        } else if (minutes > 9 && minutes <= 59 && seconds >= 9 && seconds < 59 && milliseconds === 9) {
            milliseconds++
            milliseconds = 0
            seconds++
            timeValue.innerHTML = `${minutes}:${seconds}.${milliseconds}`
        } else if (minutes > 9 && minutes <= 59 && seconds === 59 && milliseconds === 9) {
            milliseconds++
            milliseconds = 0
            seconds++
            seconds = 0
            minutes++
            timeValue.innerHTML = `${minutes}:0${seconds}.${milliseconds}`
        } else {
            pauseCounting()
            startCountingBtn.disabled = true
            stoperErr.textContent = 'Enough of this counting!'
        }
    }, 100);
}

const pauseCounting = () => {

    clearInterval(countedTime)

    startCountingBtn.style.display = 'block'
    pauseCountingBtn.style.display = 'none'
}

const stopCounting = () => {
    startCountingBtn.style.display = 'block'
    pauseCountingBtn.style.display = 'none'

    clearInterval(countedTime)
    timeValue.innerHTML = '00:00.0'
    milliseconds = 0
    seconds = 0
    minutes = 0
}

const saveResult = () => {

    let newResultTime = document.querySelector(`#new-result-time-${resultId}`)
    let oldResultTime = document.querySelector(`#old-result-time-${resultId}`)
    let gapResultItem = document.querySelector(`#gap-time-${resultId}`)

    newResultTime.textContent = timeValue.textContent

    if (oldResultTime.textContent !== '00:00.0') {
        calcGap(newResultTime, oldResultTime, gapResultItem)
    }

    resultId++

    let newItem = document.querySelector(`#old-result-item-${resultId}`)

    if (newItem) {
        exerciseName.textContent = newItem.textContent
    }

    if (resultId > resultItemsArr.length) {

        newResultTime.textContent = timeValue.textContent

        if (oldResultTime.textContent !== '00:00.0') {
            calcGap(newResultTime, oldResultTime, gapResultItem)
        }

        startCountingBtn.disabled = true
        stopCountingBtn.disabled = true
        saveCountingBtn.disabled = true
        stoperErr.textContent = 'All exercises done!'

        saveAllBtn.disabled = false
        ResetAllBtn.disabled = false

        resultId = 1

    }

}

const saveCounting = () => {

    if (timeValue.textContent === '00:00.0' && !(stoperErr.textContent === 'All exercises done!')) {

        stoperErr.textContent = 'Press "play" button first'
        QuoteText.textContent = ''

    } else {

        saveResult()
        eightBallQuote()
        stopCounting()
    }
}

const calcGap = (el1, el2, el3) => {

    let oldTimeResultTC = el2.textContent
    let newTimeResultTC = el1.textContent

    let oldMillisecodsText = oldTimeResultTC[6]

    let oldSecondsText1 = oldTimeResultTC[3]
    let oldSecondsText2 = oldTimeResultTC[4]

    let oldMinutesText1 = oldTimeResultTC[0]
    let oldMinutesText2 = oldTimeResultTC[1]

    let oldMillisecondsNumber = Number(oldMillisecodsText)
    let oldSecondsNumber = Number(oldSecondsText1 + oldSecondsText2)
    let oldMinutesNumber = Number(oldMinutesText1 + oldMinutesText2)

    let newMillisecodsText = newTimeResultTC[6]

    let newSecondsText1 = newTimeResultTC[3]
    let newSecondsText2 = newTimeResultTC[4]

    let newMinutesText1 = newTimeResultTC[0]
    let newMinutesText2 = newTimeResultTC[1]

    let newMillisecondsNumber = Number(newMillisecodsText)
    let newSecondsNumber = Number(newSecondsText1 + newSecondsText2)
    let newMinutesNumber = Number(newMinutesText1 + newMinutesText2)

    let newTimeInMilliseconds = newMinutesNumber * 600 + newSecondsNumber * 10 + newMillisecondsNumber
    let oldTimeInMilliseconds = oldMinutesNumber * 600 + oldSecondsNumber * 10 + oldMillisecondsNumber

    let gapInMilliseconds = Math.abs(oldTimeInMilliseconds - newTimeInMilliseconds)
    let gapTimeValue

    let millisecondsValue = gapInMilliseconds % 10
    let secondsValue = (gapInMilliseconds - millisecondsValue) / 10 % 60
    let minutesValue = Math.floor(gapInMilliseconds / 10 / 60)


    if (oldTimeInMilliseconds > newTimeInMilliseconds) {

        el3.classList.add('green-gap')

        if (gapInMilliseconds < 10) {

            gapTimeValue = gapInMilliseconds
            el3.textContent = `- 0.${gapTimeValue}`

        } else if (gapInMilliseconds < 600 && millisecondsValue === 0) {

            gapTimeValue = gapInMilliseconds / 10
            el3.textContent = `- ${gapTimeValue}.0`

        } else if (gapInMilliseconds < 600) {

            gapTimeValue = gapInMilliseconds / 10
            el3.textContent = `- ${gapTimeValue}`

        } else {

            if (secondsValue < 10 && minutesValue < 10) {

                el3.textContent = `- 0${minutesValue}:0${secondsValue}.${millisecondsValue}`

            } else if (secondsValue >= 10 && minutesValue < 10) {

                el3.textContent = `- 0${minutesValue}:${secondsValue}.${millisecondsValue}`

            } else {

                el3.textContent = `- ${minutesValue}:${secondsValue}.${millisecondsValue}`

            }

        }

    } else if (oldTimeInMilliseconds === newTimeInMilliseconds) {

        el3.textContent = '+ 00.0'

        el3.classList.remove('green-gap')
        el3.classList.remove('red-gap')

    } else {

        el3.classList.add('red-gap')

        if (gapInMilliseconds < 10) {

            gapTimeValue = gapInMilliseconds
            el3.textContent = `+ 0.${gapTimeValue}`

        } else if (gapInMilliseconds < 600) {

            gapTimeValue = gapInMilliseconds / 10
            el3.textContent = `+ ${gapTimeValue}`

        } else {

            if (secondsValue < 10 && minutesValue < 10) {

                el3.textContent = `+ 0${minutesValue}:0${secondsValue}.${millisecondsValue}`

            } else if (secondsValue >= 10 && minutesValue < 10) {

                el3.textContent = `+ 0${minutesValue}:${secondsValue}.${millisecondsValue}`

            } else {

                el3.textContent = `+ ${minutesValue}:${secondsValue}.${millisecondsValue}`

            }

        }

    }

}

// result functions

const showResults = () => {

    cleanResults()

    score.classList.add('active')
    saveCountingBtn.style.display = 'block'
    stoperErr.textContent = ''

    activeDayBox = document.querySelector('.acc-info.active')
    accListItems = activeDayBox.querySelectorAll('.acc-list-item')
    dailyTimeItems = activeDayBox.querySelectorAll('.daily-time-list-item')


    let num = 1

    accListItems.forEach(el => {

        resultItemsArr.push(el)

        let oldResultItem = document.createElement('li')
        let newResultItem = document.createElement('li')
        let gapResultItem = document.createElement('li')

        oldResultItem.setAttribute('class', 'result-item')
        oldResultItem.setAttribute('id', `old-result-item-${num}`)
        oldResultItem.textContent = el.textContent

        newResultItem.setAttribute('class', 'result-item')
        newResultItem.setAttribute('id', `new-result-item-${num}`)
        newResultItem.textContent = el.textContent

        gapResultItem.setAttribute('class', 'result-item')
        gapResultItem.setAttribute('id', `gap-item-${num}`)
        gapResultItem.textContent = el.textContent

        oldResultItemList.appendChild(oldResultItem)
        newResultItemList.appendChild(newResultItem)
        gapResultItemList.appendChild(gapResultItem)

        num++
    });

    num = 1

    dailyTimeItems.forEach(el => {

        let oldResultTime = document.createElement('li')
        let newResultTime = document.createElement('li')
        let gapResultTime = document.createElement('li')

        oldResultTime.setAttribute('class', 'result-time')
        oldResultTime.setAttribute('id', `old-result-time-${num}`)
        oldResultTime.textContent = el.textContent

        newResultTime.setAttribute('class', 'result-time')
        newResultTime.setAttribute('id', `new-result-time-${num}`)
        newResultTime.textContent = '00:00.0'

        gapResultTime.setAttribute('class', 'result-time')
        gapResultTime.setAttribute('id', `gap-time-${num}`)
        gapResultTime.textContent = '00:00.0'

        oldResultTimeList.appendChild(oldResultTime)
        newResultTimeList.appendChild(newResultTime)
        gapResultTimeList.appendChild(gapResultTime)

        num++
    })

    exerciseName.textContent = document.querySelector('#old-result-item-1').textContent

    saveAllBtn.disabled = true
    ResetAllBtn.disabled = true
    saveCountingBtn.addEventListener('click', saveCounting)
}

const removeAllItems = () => {

    let allExercises = score.querySelectorAll('.result-item')

    allExercises.forEach(el => {
        el.remove()
    });
}

const removeAllTimes = () => {

    let allTimes = score.querySelectorAll('.result-time')

    allTimes.forEach(el => {
        el.remove()
    });
}

const cleanResults = () => {
    removeAllItems()
    removeAllTimes()

    exerciseName.textContent = ''
    stoperErr.textContent = ''
    QuoteText.textContent = ''
    resultItemsArr = []

    resultId = 1

    startCountingBtn.disabled = false
    stopCountingBtn.disabled = false
    saveCountingBtn.disabled = false
}

const cancelExercises = () => {
    score.classList.remove('active')
    saveCountingBtn.style.display = 'none'

    cleanResults()
    stopCounting()
}

const saveAllResults = () => {

    let timeItemsToReplace = activeDayBox.querySelectorAll('.daily-time-list-item')
    let newTimeItems = newResultTimeList.querySelectorAll('.result-time')
    let num = 1

    timeItemsToReplace.forEach(oldTimeItem => {

        oldTimeItem.textContent = newResultTimeList.querySelector(`#new-result-time-${num}`).textContent
        num++
    })


    score.classList.remove('active')
    saveCountingBtn.style.display = 'none'
    cleanResults()
    checkIfExercisesAreDone()
    checkDay()
}

const resetNewResults = () => {

    let allNewResults = newResultTimeList.querySelectorAll('.result-time')
    let allGapsResults = gapResultTimeList.querySelectorAll('.result-time')

    allNewResults.forEach(result => result.textContent = '00:00.0')

    allGapsResults.forEach(result => {

        result.textContent = '00:00.0'
        result.classList.remove('red-gap')
        result.classList.remove('green-gap')
    })

    saveAllBtn.disabled = true
    ResetAllBtn.disabled = true

    exerciseName.textContent = document.querySelector('#old-result-item-1').textContent
    startCountingBtn.disabled = false
    stopCountingBtn.disabled = false
    saveCountingBtn.disabled = false
    stoperErr.textContent = ''
    QuoteText.textContent = ''
}

const checkIfExercisesAreDone = () => {
    accordionBoxes.forEach(box => {
        let accBtn = box.querySelector('.acc-btn')
        let accDailyItemsList = box.querySelectorAll('.daily-time-list-item')
        let accSquare = box.querySelector('.fa-square')
        let accCheck = box.querySelector('.fa-square-check')

        accDailyItemsList.forEach(item => {

            if (item.textContent !== '00:00.0') {
                accBtn.classList.add('all-exercises-done')
                accSquare.classList.remove('visible')
                accCheck.classList.add('visible')
            } else {
                accBtn.classList.remove('all-exercises-done')
                accSquare.classList.add('visible')
                accCheck.classList.remove('visible')
            }
        })
    })
}

const checkDay = () => {

    if(numDay < accordionBtns.length) {
        
        let previousDayBtn = document.querySelector(`#btn-day-${numDay}`)
        
        if(previousDayBtn.classList.contains('all-exercises-done')) {

            numDay++
            let nextDayBtn = document.querySelector(`#btn-day-${numDay}`)
            nextDayBtn.disabled = false
        }
    }
}

const eightBallQuote = () => {

    let quoteArray = ["Good job!", "Well done!", "Let me see this muscles!", "You are doing great!", "You can do better!", "Don't you think it took too long?", "it's not what I expected...", "Greate time!"]

    const randomNumber = Math.floor(Math.random() * quoteArray.length)

    switch (randomNumber) {
        case 0:
            QuoteText.textContent = quoteArray[0]
            break

        case 1:
            QuoteText.textContent = quoteArray[1]
            break

        case 2:
            QuoteText.textContent = quoteArray[2]
            break

        case 3:
            QuoteText.textContent = quoteArray[3]
            break

        case 4:
            QuoteText.textContent = quoteArray[4]
            break

        case 5:
            QuoteText.textContent = quoteArray[5]
            break

        case 6:
            QuoteText.textContent = quoteArray[6]
            break

        case 7:
            QuoteText.textContent = quoteArray[7]
            break

        default:
            QuoteText.textContent = 'Something went horribly wrong...'
    }
}

// help eventListeners

questionmarkBtn.addEventListener('click', showMeHelp)

// weather eventListeners

cityNameBtn.addEventListener('click', showMeCityInput)
changeCityInput.addEventListener('keyup', enterCheckInput)
changeCityCancelBtn.addEventListener('click', closeCityInput)
changeCityAcceptBtn.addEventListener('click', checkCityInput)

// accordion eventListeners

accordionBtns.forEach(element => {
    element.addEventListener('click', openAccordion)
});

// stoper eventListeners

startCountingBtn.addEventListener('click', startCounting)
pauseCountingBtn.addEventListener('click', pauseCounting)
stopCountingBtn.addEventListener('click', stopCounting)

// result eventListeners and functions

saveAllBtn.addEventListener('click', saveAllResults)
ResetAllBtn.addEventListener('click', resetNewResults)
cancelBtn.addEventListener('click', cancelExercises)

checkIfExercisesAreDone()

// other eventListeners

startExerciseBtns.forEach(element => {
    element.addEventListener('click', showResults)
});

// functions

getWeather()