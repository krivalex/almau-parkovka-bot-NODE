const { addUserToParking, deleteFromParking, getFreeParkingPlaces, getAllUsers } = require('./utils.js')

const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')

// almau parkovka bot
const token = '6509778524:AAF-HXbVZOcaRuhnIr9vFhUipTal_5l7kqI'

const bot = new TelegramBot(token, { polling: { interval: 0, autoStart: true } })
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
        keyboard: [[{ text: 'Заехать на парковку' }], [{ text: 'Выехать с парковки' }], [{ text: 'Число доступных мест' }], [{ text: 'Список людей на паркове' }]],
        resize_keyboard: true,
      },
    })
  }
})

// Обработчик ответов на команды клавиатуры
bot.onText(/Заехать на парковку/, async (msg) => {
  console.log('Заехать на парковку')

  const user = msg.from
  const chatId = msg.chat.id

  const newAuto = {
    idUser: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    timeIn: new Date(),
    timeInString: this.timeIn?.toLocaleString('ru-ru'),
    id: '',
    autoPlate: '',
    timeOut: '',
    timeOutString: '',
    timeSpent: () => {
      return this.timeOut - this.timeIn || new Date() - this.timeIn
    },
  }

  await bot.sendMessage(chatId, 'Номер вашего автомобиля?', { reply_markup: { force_reply: true } }).then(async (gotedPlate) => {
    bot.onReplyToMessage(gotedPlate.chat.id, gotedPlate.message_id, async (msg) => {
      newAuto.autoPlate = msg.text
      newAuto.first_name = msg.reply_to_message.chat.first_name
      newAuto.last_name = msg.reply_to_message.chat.last_name
      newAuto.username = msg.reply_to_message.chat.username
      newAuto.id = msg.reply_to_message.chat.id
      const result = addUserToParking(newAuto)

      if (result === 'success') {
        await bot.sendMessage(chatId, 'Спасибо, вы в списке людей на парковке')
      } else if (result === 'no places') {
        await bot.sendMessage(chatId, 'Извините, парковка заполнена')
      } else if (result === 'already in') {
        await bot.sendMessage(chatId, 'Вы уже на парковке')
      }

      await bot.sendMessage(chatId, 'Что вы хотите сделать?', {
        reply_markup: {
          keyboard: [[{ text: 'Заехать на парковку' }], [{ text: 'Выехать с парковки' }], [{ text: 'Число доступных мест' }], [{ text: 'Список людей на паркове' }]],
          resize_keyboard: true,
        },
      })
    })
  })
})

bot.onText(/Выехать с парковки/, async (msg) => {
  console.log('Выехать с парковки')

  const user = msg.from
  const chatId = msg.chat.id

  const newAuto = {
    idUser: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    timeIn: new Date(),
    timeInString: this.timeIn?.toLocaleString('ru-ru'),
    id: '',
    autoPlate: '',
    timeOut: '',
    timeOutString: '',
    timeSpent: () => {
      return this.timeOut - this.timeIn || new Date() - this.timeIn
    },
  }

  const result = deleteFromParking(newAuto)

  if (result === 'success') {
    await bot.sendMessage(chatId, 'Вы выехали с парковки')
  } else if (result === 'no user') {
    await bot.sendMessage(chatId, 'Вас еще нет в списке людей на парковке')
  }
})

bot.onText(/Число доступных мест/, async (msg) => {
  console.log('Число доступных мест')

  chatId = msg.chat.id

  await bot.sendMessage(chatId, `Число доступных мест на парковке ${getFreeParkingPlaces()}`)

  await bot.sendMessage(chatId, 'Что вы хотите сделать?', {
    reply_markup: {
      keyboard: [[{ text: 'Заехать на парковку' }], [{ text: 'Выехать с парковки' }], [{ text: 'Число доступных мест' }], [{ text: 'Список людей на паркове' }]],
      resize_keyboard: true,
    },
  })
})

bot.onText(/Список людей на паркове/, async (msg) => {
  console.log('Список людей на паркове')

  chatId = msg.chat.id

  await bot.sendMessage(chatId, 'Список людей на парковке:')
  if (getAllUsers().length === 0) {
    await bot.sendMessage(chatId, 'Парковка пуста')
  } else {
    getAllUsers().map(async (el) => {
      await bot.sendMessage(
        chatId,
        ` Логин: ${el.username} \n\n Имя: ${el.first_name ?? ''} ${el.last_name ?? ''} \n\n Номер машины: ${el.autoPlate} \n\n Время заезда: ${el.timeIn.toLocaleString(
          'ru-ru'
        )} \n\n Время пребывания на парковке: ${String((Date.now() - el.timeIn) / 1000 / 60).substr(0, 4)} минут \n\n`
      )
    })
  }

  await bot.sendMessage(chatId, 'Что вы хотите сделать?', {
    reply_markup: {
      keyboard: [[{ text: 'Заехать на парковку' }], [{ text: 'Выехать с парковки' }], [{ text: 'Число доступных мест' }], [{ text: 'Список людей на паркове' }]],
      resize_keyboard: true,
    },
  })
})

const PORT = 6666
app.listen(PORT, async () => {
  console.log('app server will started on PORT ' + PORT)
  console.log('krivalex present')
  console.log('krivalex special start process')
  console.log('app server has been started on PORT ' + PORT)
  console.log('если видите это сообщение уже должно заработать')
})
