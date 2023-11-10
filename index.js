const { addUserToParking, deleteFromParking, getFreeParkingPlaces, getAllUsers } = require('./utils.js')

const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')

// almau parkovka bot
const token = '6509778524:AAF-HXbVZOcaRuhnIr9vFhUipTal_5l7kqI'

const bot = new TelegramBot(token, { polling: true })
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Добро пожаловать на парковку AlmaU')
    await bot.sendMessage(chatId, `Число доступных мест на парковке ${getFreeParkingPlaces()}`)
    await bot.sendMessage(chatId, 'Что вы хотите сделать?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Заехать на парковку', callback_data: 'in' }],
          [{ text: 'Выехать с парковки', callback_data: 'out' }],
          [{ text: 'Число доступных мест', callback_data: 'countPlaces' }],
          [{ text: 'Список людей на паркове', callback_data: 'dataTable' }],
        ],
      },
    })
    await bot.sendMessage(chatId, '', {
      reply_markup: {
        keyboard: [
          [{ text: 'Заехать на парковку', callback_data: 'in' }],
          [{ text: 'Выехать с парковки', callback_data: 'out' }],
          [{ text: 'Число доступных мест', callback_data: 'countPlaces' }],
          [{ text: 'Список людей на паркове', callback_data: 'dataTable' }],
        ],
      },
    })
  }
})

bot.on('callback_query', async (query) => {
  const user = query.message.from
  const chatId = query.message.chat.id
  const data = query.data

  const newAuto = {
    idUser: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    timeIn: new Date(),
    timeInString: this.timeIn.toLocaleString('ru-ru'),
    id: '',
    autoPlate: '',
    timeOut: '',
    timeOutString: '',
    timeSpent: () => {
      return this.timeOut - this.timeIn || new Date() - this.timeIn
    },
  }

  if (data === 'in') {
    await bot.sendMessage(chatId, 'Номер вашего автомобиля?')

    bot.on('message', async (msg) => {
      const autoPlate = msg.text
      newAuto.autoPlate = autoPlate
      const result = addUserToParking(newAuto)

      if (result === 'success') {
        await bot.sendMessage(chatId, 'Спасибо, вы в списке людей на парковке')
      } else if (result === 'no places') {
        await bot.sendMessage(chatId, 'Извините, парковка заполнена')
      } else if (result === 'already in') {
        await bot.sendMessage(chatId, 'Вы уже на парковке')
      }
    })
  } else if (data === 'out') {
    const result = deleteFromParking(newAuto)

    if (result === 'success') {
      await bot.sendMessage(chatId, 'Вы выехали с парковки')
    } else if (result === 'no user') {
      await bot.sendMessage(chatId, 'Вас еще нет в списке людей на парковке')
    }
  } else if (data === 'dataTable') {
    await bot.sendMessage(chatId, `Список людей на паркове ${getAllUsers()}`)
  } else if ((data = 'countPlaces')) {
    await bot.sendMessage(chatId, `Число доступных мест на парковке ${getFreeParkingPlaces()}`)
  }
})

const PORT = 6666
app.listen(PORT, () => console.log('app server was started on PORT ' + PORT))
