 //jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const postSchema=new mongoose.Schema({
  title:String,
  content:String
});

const Post=mongoose.model("Post",postSchema);


const app = express();
// let posts=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/',(req,res)=>{
  Post.find({}).then(data=>{
    
    res.render("home",{startingContent:homeStartingContent,posts:data});
}).catch(err=>{
    console.log(err);
})
  // res.render("home",{ startingContent: homeStartingContent, posts: posts}); 
})

app.get('/about',(req,res)=>{
  res.render("about",{ aboutStartingContent: aboutContent});
})

app.get('/contact',(req,res)=>{
  res.render("contact",{ aboutContactContent: contactContent});
})

app.get('/compose',(req,res)=>{
  res.render("compose");
})

app.post('/compose',(req,res)=>{
  
  const post = new Post ({

    title: req.body.Title,
 
    content: req.body.PostBody
 
  });
  // const post={title: req.body.Title, content: req.body.PostBody};
  // posts.push(post);
  post.save();
  
  res.redirect('/');
  console.log(post.title); 
  // console.log(post.content);  
});

app.get('/posts/:postId',(req,res)=>{
  // check out the _id here normal methods wont work due to some object type error so use the below code for that issue regarding object type errors for _id
  let reqId=_.lowerCase(req.params.postId);
  reqId=reqId.replace(/\s/g, '');
  if (mongoose.Types.ObjectId.isValid(reqId))
  {
    Post.findOne({_id:reqId}).then(data=>{
      res.render("post",{title:data.title,content: data.content});
    }).catch(err=>{
      console.log(err);
    })
  }
  
  
  // Post.forEach(function(post)
  // {
  //   const storedTitle=post.title;
  //   if(reqTitle===_.lowerCase(storedTitle)){
  //     res.render("post",{title: post.title, content: post.content});
  //   }
    
  // })
  
 
  });
  
  



app.listen(3000, (req,res)=> {
  console.log("Server started on port 3000");
});
