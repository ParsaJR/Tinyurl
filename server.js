const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl');
const users = require('./models/user');
const bcrypt = require('bcrypt')
const app = express()

// Database Address
mongoose.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// Index Page
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})
// Login Page
app.get('/login', async (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    try{
        // const hashedPassword = await bcrypt.hash(req.body.password,10)
        const user = await users.findOne({email: req.body.email})
        if(user == null){
            return res.send('Account Not Found')
        } 
        const itsMatch = await bcrypt.compare(req.body.password, user.passowrd);
        if(itsMatch){
            req.flash('logged in','true')
             return res.redirect('/')
        }
        else{
             return res.send('Password Is Incorrect')
        }
        
    }
    catch(err){
        res.send('error is ' + err)
    }
    
})
app.get('/logout', async (req, res) => {
    req.flash('logged in','false')
    res.redirect('/')
})
app.get('/register', async (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        await users.create({name: req.body.name,email: req.body.email,passowrd: hashedPassword})
        res.redirect('/login')
    }
    catch{
        res.redirect('/register')
    }
    
})
app.get('/admin', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('admin', { shortUrls: shortUrls })
})
app.get('/deleteUrl/:id', async (req, res) => {
    await ShortUrl.deleteOne({ _id: req.params.id })
    res.redirect('/')
})
app.get('/updateUrl/:id', async (req, res) => {
    const updatedShortUrl = await ShortUrl.find({_id: req.params.id})
    console.log(updatedShortUrl);
    res.render('edit', { shortUrl: updatedShortUrl })
})
app.post('/updateUrl/:id', async (req, res) => {
    await ShortUrl.updateOne({ _id: req.params.id },{full: req.body.fullurl})
    res.redirect('/')
})
//ساخت لینک جدید
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})
// هدایت به لینک اصلی
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

    if (shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})


app.listen(process.env.PORT || 5000);