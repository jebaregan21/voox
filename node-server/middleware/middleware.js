const middleware = (req,res,next) => {
    if(req.session.userId){
       if(req.path == '/create' || req.path == '/login'){
           res.redirect('/')
       }
       else{
        next() 
       }
    }
    else if(req.path == '/create' || req.path == '/login' || req.path == '/'){
        next()
    }
    else{
        res.redirect('/login')
    }
    
}
module.exports = middleware