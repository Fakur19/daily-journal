const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // To secure username and password

dotenv.config(); //require to using env, so username and pass can be called

// Dynamic port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

const app = express();

app.set('view engine', 'ejs'); // To use ejs than html
app.use(bodyParser.urlencoded({extended: true})); // to get info from post request/ejs
app.use(express.static("public")); // make static file can be used

// Make connection to cloud database
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfjat.${process.env.DB_HOST}/blogDB`); // Make connection to mongoDB

// Make database schema post
const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postsSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get('/', (req,res) => {
  // To find all posts collection in database, using mongoose line to transverse array on mongodb, similar to transverse an array using foreach
  Post.find({}, (err, foundPosts) => {
    res.render('home', {
      homeStartingContent: homeStartingContent, 
      posts: foundPosts,
    });
  });
});

app.get('/contact', (req,res) => {
  res.render('contact', {contactContent: contactContent});
});

app.get('/about', (req,res) => {
  res.render('about', {aboutContent: aboutContent});
});

app.get('/compose', (req,res) => {
  res.render('compose', {aboutContent: aboutContent});
});

app.post('/compose', (req,res) => {
  // Add new post to posts collection in database
  const post = new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  });
  // Save it to database
  post.save();
  // Redirect to home page to see changes
  res.redirect('/');
});

app.get('/posts/:postID', (req,res) => {
  // Get the _id from every single post
  let requestPostID = req.params.postID;
  // Find the targeted _id and render it to custom post page, using _id as custom route
  Post.findOne({_id:requestPostID}, (err,foundPosts) => {
    if(!err){
      // requestPost = foundPosts._id;
      res.render('post',{
        title:foundPosts.title,
        content:foundPosts.content
      });
    }
  });
});



app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
