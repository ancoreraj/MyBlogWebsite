const express = require('express');
const Article = require('./../models/article');
const router = express.Router();





//sends completely new article
router.get('/new',(req,res)=>{
    res.render('articles/new', { article: new Article() });
});

//the edit route
router.get('/edit/:id', async (req,res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article });
});

//asyc is used for asyn function and await is for waiting until the function is done

router.get('/:slug',async (req,res)=>{
    //accessing our article with the slug
    //find fun find array of article so we use findone to find only one
    const article = await Article.findOne({ slug: req.params.slug})

    //if we cannot find the article by findbyid from the database then it will redirect us to the home page
    if(article== null) res.redirect('/')

    //we render the article that we have just created
    res.render('articles/show', {article: article})
    
})
 
//when we submit the form it will go to the / which is article/index 
router.post('/', async (req, res, next)=>{
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))


router.put('/:id', async (req, res, next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))






//to just perform .delete function .........

//to delete all the articles which is created before slug
router.delete('/:id', async (req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req,res) => {
        let article = req.article
        
            article.title= req.body.title
            article.description= req.body.description
            article.markdown= req.body.markdown
            
      
        // This is an asyncronous function 
        try{
            article = await article.save()
            //Redirected to the now article which is saved
            res.redirect(`/articles/${article.slug}`)
            
        } catch (e) {
            
            //In case if any error it will show the same page with same filled areas
            
            res.render(`articles/${path}` ,{article: article} )
            
        }
    }
}
module.exports =  router;