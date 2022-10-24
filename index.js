const TelegramApi = require('node-telegram-bot-api')
const token = "5655576598:AAEePf35m5-5rBCCTHT0ZIK9eNaTWXbpvQY";
const fetch = require('node-fetch')
const bot = new TelegramApi(token, { polling: true })

async function Weather(city,chat){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6503e14e0dea2029c229dbe8d70f781e&units=metric&lang=ru`)
    const data = await res.json()
    bot.sendMessage(chat, `Погода в городе ${data.name} ${data.sys.country}:\nТемпература: ${data.main.temp}C\nВетер: ${data.wind.speed} м/с\nПогода: ${data.weather[0].description}`)

    console.log(data)

    await Temp(data,chat)
}

function Temp(data, chat) {
    
    if (data.main.temp <= 35) {
        if (data.main.temp > 25) {
            return bot.sendMessage(chat, `Ужасно жарко иди в трусах!`)
        }
    }
    if (data.main.temp <= 25) {
        if (data.main.temp > 15) {
            return bot.sendMessage(chat, `Тепло! Можно идти в кофте.`)
        }
    }
    if (data.main.temp <= 15) {
        if (data.main.temp > 10) {
            return bot.sendMessage(chat, `Сегодня прохладно. Одень курточку!`)
        }
    }
    if (data.main.temp <= 10) {
        if (data.main.temp > 0) {
            return bot.sendMessage(chat, `Одевайся теплее!`)
        }
    }
    if (data.main.temp <= 0) {
        if (data.main.temp > -5) {
            return bot.sendMessage(chat, `Сегодня холодно. Зима как никак.`)
        }
    }
}

function Push(chat,city){
    bot.sendMessage(chat,"Вы подписались на рассылку погоды каждые 2 часа")
    Weather(city,chat)
    setInterval(() => {
        Weather(city,chat)
    },7200000)
}


bot.addListener("message", (msg) => {
    const chat = msg.chat.id
    const text = msg.text

    if(text == "/start"){
        bot.sendMessage(chat,'Добро пожаловать! Что-бы подписаться на разссылку погоды напишите "/push[Название города]"')
    }
    if(text.indexOf("/city") == 0){
        const city = text.slice(6)
        Weather(city,chat)
    }
    if(text.indexOf("/push") == 0){
        const city = text.slice(6)
        Push(chat,city)
    }
})