const bodyParser = require("body-parser"),
mongoose         = require("mongoose"),
express          = require("express"),
app              = express()


//App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/vernal_blog", { useNewUrlParser: true, useUnifiedTopology: true });



//Mongoose Config: Set-up Schema
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
//Mongoose Config: Compile Schema into a model to access methods
const Blog = mongoose.model("Blog", blogSchema);


// Blog.create(
// {
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1587613990051-1b291c1a7080?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
//     body: "This is a new blog post."
// }, function(err, blog){

//     if(err){
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED BLOG: ");
//         console.log(blog);
//     }
// });



//RESTful Routes
//INDEX- display all blogs
app.get("/", function(req,res){
    res.redirect("/blogs")
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});










const port = process.env.PORT || 5500;

app.listen(port, function(){
	console.log("Vernal Blog Has Started!");
});
