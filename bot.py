from aiogram import types, Bot, Dispatcher, executor
from aiogram.types.web_app_info import WebAppInfo
from aiogram.utils import executor

from config import *

bot = Bot(token=TOKEN)
dp = Dispatcher(bot)

def on_startup():
    print("MATCH BOT STARTED")

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton('Open Web Bot', web_app=WebAppInfo(url='https://exdesy.github.io/TBot/')))
    await message.answer('Hola amigo', reply_markup=markup)


if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True, on_startup=on_startup())