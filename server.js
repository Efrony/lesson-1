const fs = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(express.static('./public'))
app.use(bodyParser.json())


function statsCart (event, article) {
    const dT = new Date();
    const dT_time = `${dT.getHours()}:${dT.getMinutes()}:${dT.getSeconds()}` // moment модуль
    const dT_Date = `${dT.getDate()}.${dT.getMonth()+1}.${dT.getFullYear()}`
    fs.readFile('./db/stats.json', 'utf-8', (err, data) => { // -------------------------- протестить
        const stats = JSON.parse(data)
        const string = {time:dT_time, date:dT_Date, event:event, article:article}
        stats.push(string)
        console.log(string)
        fs.writeFile('./db/stats.json', JSON.stringify(stats), () => {})})
}

app.get('/product', (req, res) => fs.readFile('./db/product.json', 'utf-8', (err, data) => {
    if (err) res.send('Произошла ошибка' + err)
    res.send(data)
}))

app.get('/cart', (req, res) => fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) res.send('Произошла ошибка' + err)
    res.send(data)
}))

app.post('/cart', (req, res) => fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) res.send('Произошла ошибка' + err)

    const cart = JSON.parse(data)
    cart.push(req.body)

    statsCart('добавлен', req.body.article)
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => res.send(req.body))
}))

app.patch('/cart/:id', (req, res) => fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) res.send('Произошла ошибка' + err)

    let cart = JSON.parse(data)
    const inCartListItem = cart.find(item => item.id == req.params.id)
    inCartListItem.count = req.body.count
    statsCart('изменён', inCartListItem.article)
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => res.send(inCartListItem))
    }))


app.delete('/cart/:id', (req, res) => fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if (err) res.send('Произошла ошибка' + err)
    const cart = JSON.parse(data)
    const inCartListIndex = cart.findIndex(item => item.id == req.params.id)
    const deletedItem = cart.splice(inCartListIndex, 1)
    statsCart('удалён', deletedItem[0].article)
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => res.send(deletedItem[0]))
    }))


app.listen(3001, () => console.log('Сервер запущен. Порт: 3001. Перейти http://localhost:3001/'))