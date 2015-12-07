var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    Hashids = require('hashids'),
    hashids = new Hashids('this is my salt'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/links', function(req, res) {
    db.links.all({
        order: 'count DESC'
    }).then(function(data){
        res.render('links/index', {links: data});
    });
    
})

app.get('/links/:id', function(req, res) {
    var id = parseInt(req.params.id);
    var encoded = hashids.encode(id);    
    db.links.findAll({
        attriubtes: ['url', 'count'],
        where: {
            id: id
        }
    }).then(function(data){
        res.render('links/show', {url: data[0].dataValues.url, count: data[0].dataValues.count, hash: encoded}); 
    })
});


app.post('/links', function(req, res){
    var newLink = {
        url: req.body.inputText,
        count: 0
    }
    
    db.links.create(newLink).then(function(link) {
        var encoded = hashids.encode(link.id);
        res.render('links/show', {hash: encoded, url: req.body.inputText, count: 0});
    })
});

app.get('/:hash', function(req, res){
    var hash = req.params.hash;
    var decoded = hashids.decode(hash);
        
    db.links.findAll({
        attributes: ['url', 'count'],
        where: {
            id: decoded
        }
    }).then(function(data){
        var count = parseInt(data[0].dataValues.count) + 1, 
            url = data[0].dataValues.url;
        
        db.links.update({
            count: count
        }, {
            where: {
                id: decoded
            }   
        })
        res.redirect('http://' + url);
    })
});


app.use(function(req, res) {
    res.status(404).render('404');
});

app.listen(3000);