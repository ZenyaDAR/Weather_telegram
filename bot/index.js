require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const token = process.env.TOKEN_PROD || process.env.TOKEN_TEST;
const fetch = require('node-fetch')
const bot = new TelegramApi(token, {polling: true})

let user_city

let isClick = false

bot.on('message', async (msg) => {
    const chatid = msg.chat.id
    const text = msg.text

    if (text === "/start") {
        const data = {
            user_id: msg.from.id,
            user_name: msg.chat.username,
            first_name: msg.from.first_name,
        }
        await fetch("http://localhost:5001/api/user", {
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then(await bot.sendMessage(chatid, `Привет *${msg.from.first_name}* 👋\nЧтобы поменять город по умолчанию или узнать погоду в нем нажмите на кнопки в клавиатуре.`, {
            reply_markup: {
                keyboard: [
                    ['🏙 Изменить город 🏙', '☀️ Узнать текущую погоду ☀️'],
                    ['🌦 Прогноз на 5 дней 🌦']
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
            parse_mode: "Markdown"
        }))

    }
    if (text === "🏙 Изменить город 🏙") {
        await bot.sendMessage(chatid, "Введите название города")
        isClick = true
    }
    if (text === "☀️ Узнать текущую погоду ☀️") {
        await fetch("http://localhost:5001/api/user")
            .then(data => data.json())
            .then(async res => {
                for (const re of res) {
                    if (re.user_id == msg.from.id) {
                        if (re.user_city !== undefined) {
                            await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${re.user_city}&appid=${process.env.TOKEN_WEATHER}&units=metric&lang=ru`)
                                .then(app => app.json())
                                .then(async wes => {
                                    await bot.sendMessage(chatid, `Погода в городе *${wes.name} ${wes.sys.country}*:\n\n🌡️*Температура*🌡️: ${Math.floor(wes.main.temp)}C\n\n💨*Ветер*💨: ${wes.wind.speed} м/с порывы до ${wes.wind.gust} м/с\n\n☀️️️*Погода*☀️: ${wes.weather[0].description}\n\n🌥️*Облачность*🌥️: ${wes.clouds.all}%`, {parse_mode: 'Markdown'})
                                })
                                .catch(async e => await bot.sendMessage(chatid, "Ваш город не найден\nИзмените его через кнопку 'Изменить город'") && console.log(e))
                        } else {
                            await bot.sendMessage(chatid, `Напишите боту свой город через кнопку "Изменить город"`)
                        }
                    }
                }
            })
    }
    if (text === "🌦 Прогноз на 5 дней 🌦") {
        await fetch("http://localhost:5001/api/user")
            .then(data => data.json())
            .then(async res => {
                for (const re of res) {
                    if (re.user_id == msg.from.id) {
                        if (re.user_city !== undefined) {
                            await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${re.user_city}&appid=${process.env.TOKEN_WEATHER}&units=metric&lang=ru`)
                                .then(app => app.json())
                                .then(async wes => {


                                    let day = wes.list[0].dt_txt.split(" ");
                                    let weatherp = [];


                                    for (let i = 0; i < wes.list.length; i++) {
                                        let current = wes.list[i]
                                        let date = current.dt_txt.split(" ")
                                        if (day[0] !== date[0]) {
                                            let mes = weatherp.join('')
                                            await bot.sendMessage(chatid, `📆*${day[0]}*📆\n\n   ${mes}`, {parse_mode: "Markdown"})
                                            day = date
                                            weatherp = []
                                        }
                                        let txt = `${date[1]}\n   🌡️*Температура*🌡️: ${current.main.temp}C\n   💨*Ветер*💨: ${current.wind.speed} м/с\n   ☀️️️*Погода*☀️: ${current.weather[0].description}\n   🌥️*Облачность*🌥️: ${current.clouds.all}%\n\n`
                                        weatherp.push(txt)
                                    }
                                })
                                .catch(async e => await bot.sendMessage(chatid, "Ваш город не найден\nИзмените его через кнопку 'Изменить город'") && console.log(e))
                        } else {
                            await bot.sendMessage(chatid, `Напишите боту свой город через кнопку "Изменить город"`)
                        }
                    }
                }
            })
    }
    if (msg.from.id === 858440322) {
        if (text.indexOf("/sendAll") === 0) {
            const message = text.slice(9, text.length)
            await fetch("http://localhost:5001/api/user")
                .then(res => res.json())
                .then(async data => {
                    for (const datum of data) {
                        await bot.sendMessage(datum.user_id, message)
                            .catch(async e => {
                                if (String(e).indexOf('403') > 0) {
                                    await fetch(`http://localhost:5001/api/user/${datum.user_id}`, {
                                        method: 'delete'
                                    })
                                }
                            })
                    }
                })
        }
        if (text.indexOf("/sendOne") === 0) {
            const textusr = String(msg.text).split(" ")
            if (textusr[0] === "/sendOne") {
                const user_name = textusr[1]
                textusr.shift()
                textusr.shift()
                const message = textusr.join(' ')
                await fetch("http://localhost:5001/api/user")
                    .then(data => data.json())
                    .then(async app => {
                        let check = false
                        for (const appElement of app) {
                            if ("@" + appElement.user_name === user_name) {
                                await bot.sendMessage(appElement.user_id, `${message} \nОтправлено администратором @${msg.from.username}`)
                                    .then(() => check = true)
                            }
                        }
                        if (check === true) {
                            await bot.sendMessage(chatid, `✅Сообщение успешно отправлено пользователю ${user_name} .✅`)
                        } else {
                            await bot.sendMessage(chatid, `❌Пользователь не найден в базе.❌`)
                        }
                    })
            }
        }
    }
    if (isClick === true) {
        if (text !== '🏙 Изменить город 🏙') {
            user_city = text
            isClick = false
            await bot.sendMessage(chatid, `🏙 Ваш город это ${user_city}? 🏙`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Да✅',
                                callback_data: 'Yes'
                            },
                            {
                                text: 'Нет❌',
                                callback_data: 'No'
                            }
                        ]
                    ]
                }
            })
        }
    }
})

bot.on('callback_query', async evn => {
    const answer = evn.data
    if (answer === "Yes") {
        isClick = false
        const data = {
            user_id: evn.from.id,
            user_name: evn.from.username,
            first_name: evn.from.first_name,
            user_city: user_city
        }
        await fetch(`http://localhost:5001/api/user`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then(await bot.sendMessage(evn.from.id, `Ваш город успешно записан.\nТеперь можете узнать погоду нажав кнопку ниже.`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Узнать погоду',
                            callback_data: 'weather'
                        }
                    ]
                ]
            }
        }))
    }
    if (answer === "No") {
        isClick = true
        await bot.sendMessage(evn.from.id, "Введите город еще раз.")
    }
    if (answer === "weather") {
        await fetch("http://localhost:5001/api/user")
            .then(data => data.json())
            .then(async res => {
                for (const re of res) {
                    if (re.user_id == evn.from.id) {
                        if (re.user_city !== undefined) {
                            await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${re.user_city}&appid=${process.env.TOKEN_WEATHER}&units=metric&lang=ru`)
                                .then(app => app.json())
                                .then(async wes => {
                                    await bot.sendMessage(evn.from.id, `Погода в городе *${wes.name} ${wes.sys.country}*:\n\n🌡️*Температура*🌡️: ${wes.main.temp}C чувствуется на ${wes.main.feels_like}C\n\n💨*Ветер*💨: ${wes.wind.speed} м/с\n\n☀️*Погода*☀️: ${wes.weather[0].description}\n\n🌥️*Облачность*🌥️: ${wes.clouds.all}%`, {parse_mode: 'Markdown'})
                                })
                                .catch(async e => await bot.sendMessage(evn.from.id, "Ваш город не найден\nИзмените его через кнопку 'Изменить город'"))
                        } else {
                            await bot.sendMessage(evn.from.id, `Напишите боту свой город через кнопку "Изменить город"`)
                        }
                    }
                }
            })
    }
})
