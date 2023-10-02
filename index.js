const express = require("express")
const cors = require('cors')
const path = require('path')
const db = require('./db')
const sequelize = require("sequelize")

// init express server and router
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors())


const router = express.Router()
router.get('/', function (req, res, next) {
    res.redirect('http://localhost:3000/static/index.html')
});

router.post('/register', function (req, res, next) {
    if(req.body.username == "" || req.body.password == "" || req.body.age == ""){
        res.status(400).json({
            message: "EMPTY FIELD"
        })
        return
    }

    db.user.create({
        username: req.body.username,
        password: req.body.password,
        age: req.body.age,
        balance: req.body.deposit,
    })
    .then(function(data){
        db.spin.create({
            user_id: data.id
        }).then(function(){
            res.status(201).json({
                message: "user berhasil terdaftar"
            })
        })
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
});

router.post('/login', function (req, res, next) {
    if(req.body.username == "" || req.body.password == ""){
        res.status(400).json({
            message: "EMPTY FIELD"
        })
        return
    }

    db.user.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    })
    .then(function(data){
        res.status(200).json({
            message: "success login",
            data: data
        })
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
});

router.delete('/del-account', function (req, res, next) {
    db.user.destroy({
        where: {
            id: req.body.id
        }
    }).then(function(){
        res.status(200).json({
            message: "YOU WIN :)"
        })
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
});

router.post('/spin', function (req, res, next) {
    db.spin.findOne({
        where: {
            user_id: req.body.id
        }
    })
    .then(function(data){
        db.maxwin.findOne({
            where: {
                min_depo: {
                    [sequelize.Op.lt]: req.body.deposit
                }
            }
        })
        .then(function(mw){
            let maxwin = mw.max_win
            if(data.win > 0 && data.win < 6){
                maxwin = 2
            }else if(data.win > 5){
                maxwin = 0
            }
            db.spin.update({
                win: data.win + 1
            }, {
                where: {
                    user_id: req.body.id
                }
            })
            .then(function(){
                console.log(maxwin)
                res.status(200).json({
                    message: "success get data",
                    data: maxwin
                })
            })
        })
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
});

router.get('/spin', function (req, res, next) {
    res.redirect('http://localhost:3000/static/spin.html')
});

// http router
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use("/", router);

const port = 3000
app.listen(port, function () {
    db.conn.authenticate()
        .then(function () {
            console.log("Database terhubung")
        })
        .catch(function (err) {
            console.log("Database gagal terhubung karena:", err)
        })
    console.log("server start on", port)
})