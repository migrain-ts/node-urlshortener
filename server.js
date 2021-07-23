const express = require('express');
const mongoose = require('mongoose');
const shortUrlModel = require('./models/shortUrl')
const app = express();
const db = require('./database/database');

mongoose.connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/urls', async(req, res) => {
    const shortUrls = await shortUrlModel.find()
    res.render('urls', { shortUrls: shortUrls })
})

app.get('/', async(req, res) => {
    const shortUrls = await shortUrlModel.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async(req, res) => {
    await shortUrlModel.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async(req, res) => {
    const shortUrl = await shortUrlModel.findOne({ short: req.params.shortUrl })

    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
        shortUrl.save();

    res.redirect(shortUrl.full)
})

app.listen(5050)