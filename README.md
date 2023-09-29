# Telegram_Weather

Telegram_Weather is an open-source project that provides a Telegram bot to deliver weather information to users. It allows users to get the current weather conditions, as well as the forecast for the next few days, by simply sending a message to the bot.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Get current weather conditions by location.
- Get weather forecast for the next few days.
- Integration with Telegram for easy access and usage.
- Simple and intuitive user interface.

## Installation

To use the Telegram_Weather project, follow the steps below:

1. Clone the repository:

```
git clone https://github.com/ZenyaDAR/Weather_telegram.git
```

2. Install the project dependencies:

```
npm install
```

3. Obtain an API key from [OpenWeatherMap](https://openweathermap.org/) by creating an account and generating an API key.

4. Create a new file named `.env` in the "bot" directory and add the following content:

```.env
TOKEN_WEATHER = 'your_openweathermap_api_key'
```

Replace `'your_openweathermap_api_key'` with the API key you obtained from OpenWeatherMap.

5. Add in this file (.env) "TOKEN_PROD". Get your bot token in BotFather

6. Open `api` directory and create `.env` file, and add:
```.env
 LINK_DB="your link to database mongo"
```

7. Run the bot:

```powershell
cd api
npm start
cd ..
cd bot
npm start
```

The Telegram bot is now up and running.

## Usage

To use the Telegram bot and get weather information, follow these steps:

1. Open the Telegram app and search for the bot with the username you provided during the bot creation process.

2. Start a conversation with the bot by sending a message.

4. Follow the bot's instructions and provide the necessary information (e.g., location) to receive the weather information.

## Contributing

Contributions to the Telegram_Weather project are always welcome. If you find any issues or have suggestions for improvements, please open a new issue or submit a pull request.
