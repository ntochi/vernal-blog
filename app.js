const bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride   = require("method-override"),
mongoose         = require("mongoose"),
express          = require("express"),
Blog		     = require("./models/blog"),
app              = express()



//App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/vernal_blog", { useNewUrlParser: true, useUnifiedTopology: true });


// Create first/test database
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
//INDEX- list all blogs
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

//NEW- display form for new blog
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE- create a new blog, then redirect
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	//Get data from form & save to database
	Blog.create(req.body.blog, function (err, newBlog) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/blogs");
		}
	});
});

//SHOW- show info about a specific blog
app.get("/blogs/:id", function (req, res){
	Blog.findById(req.params.id, function(err, specificBlog){
		if(err){
			console.log(err);
		} else {
			res.render("show", {blog: specificBlog});
		}
	});
});

//EDIT- display form to edit one blog
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, editBlog){
		if(err){
			console.log(err);
		} else {
			res.render("edit", {blog: editBlog});
		}
	});
});

//UPDATE- update particular blog, then redirect
app.put("/blogs/:id", function (req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs/" + req.params.id)
		}
	});
});

//DESTROY- delete a particular blog, then redirect
app.delete("/blogs/:id", function (req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs")
		}
	});
});


const port = process.env.PORT || 5500;

app.listen(port, function(){
	console.log("Vernal Blog Server Has Started!");
});
