const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article')
const articleRouter =  require('./routes/articles');
const methodOverride =  require('method-override');
const app = express();


//connecting to the database
// mongoose.connect('mongodb://localhost/blog',{useNewUrlParser : true , useUnifiedTopology: true , useCreateIndex: true});
mongoose.connect('mongodb://test:test@cluster0-shard-00-00.gectn.mongodb.net:27017,cluster0-shard-00-01.gectn.mongodb.net:27017,cluster0-shard-00-02.gectn.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-gi70dw-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser : true , useUnifiedTopology: true , useCreateIndex: true});

app.set('view engine','ejs');



//we can actually access all the incoded parameter form out article form inside out article route  
app.use(express.urlencoded({extended: false}))

app.use(methodOverride('_method'))

app.get('/', async (req,res)=>{
//find function will find every article in the database
//we also sort the article accordint to the decending order of the date created
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    

    res.render('articles/index',{articles: articles});
})

//This function is to tell the app to use the router
//Every single route we create in the article router is going to be added to the end of /articles
app.use('/articles',articleRouter); 


console.log('The app is listening to port 3000')
app.listen(process.env.PORT);
