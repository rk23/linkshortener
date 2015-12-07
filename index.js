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

app.get('/:hash', function(req, res){
    var hash = req.params.hash;
    var decoded = hashids.decode(hash);
        
    db.links.findAll({
        attributes: ['url'],
        where: {
            id: decoded
        }
    }).then(function(data){
        res.redirect('http://' + data[0].dataValues.url);
    })
});

app.get('/links/:id', function(req, res) {
    var id = req.params.id;
   res.render('links/show', {id: id}); 
});

app.get('/links', function(req, res) {
    
    db.links.findAll({
        attributes: ['url']
    }).then(function(data){
        console.log(data)
        res.render('links/index', {links: data[0].dataValues.url})
    })
    
})

app.post('/links', function(req, res){
    var newLink = {
        url: req.body.inputText,
        count: 0
    }
    
    db.links.create(newLink).then(function(link) {
        var encoded = hashids.encode(link.id);
        res.render('links/show', {hash: encoded});
    })
});

app.use(function(req, res) {
    res.status(404).render('404');
});

app.listen(3000);