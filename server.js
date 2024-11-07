var express = require("express");
var cors = require("cors");
var mongoClient = require("mongodb").MongoClient;
var conStr = "mongodb://127.0.0.1:27017";

var app = express();
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/login", (req, res) => {
    mongoClient.connect(conStr)
        .then(obj => {
            var database = obj.db("react-js-tutorial-dashboard");
            database.collection("register_collection").find({}).toArray().then(document => {
                res.send(document);
                res.end();
            });
        })
        .catch(err => {
            console.log(err)
        })
});


app.post("/register", (req, res) => {
    const registerUserDetails = {
        UserId: req.body.UserId,
        UserEmail: req.body.UserEmail,
        Password: req.body.Password
    }
    mongoClient.connect(conStr)
        .then(obj => {
            var database = obj.db("react-js-tutorial-dashboard");
            database.collection("register_collection").insertOne(registerUserDetails)
                .then(() => {
                    console.log("Record Inserted");
                    res.redirect("/login");
                })
        })
});

app.get("/videos", (req, res) => {
    mongoClient.connect(conStr).then((clientObj) => {
        var database = clientObj.db("react-js-tutorial-dashboard");
        database.collection("video_library").find({}).toArray().then((documents) => {
            res.send(documents)
        })
    })
});

app.post("/add_video", (req, res) => {
    var video = {
        "id": req.body.id,
        "title": req.body.title,
        "url": req.body.url,
        "views": parseInt(req.body.views),
        "likes": parseInt(req.body.likes),
        "subscribed": req.body.subscribed
    }

    mongoClient.connect(conStr).then(clientObj => {
        var database = clientObj.db("react-js-tutorial-dashboard");
        database.collection("video_library").insertOne(video).then((result) => {
            console.log("Video Inserted");
            res.redirect("/videos");
        })
    })
})




app.get("/videos/:id", (req, res) => {
    var videoId = parseInt(req.params.id);
    mongoClient.connect(conStr).then((clientObj) => {
        var database = clientObj.db("react-js-tutorial-dashboard");
        database.collection("video_library").find({ id: videoId }).toArray().then(documents => {
            res.send(documents)
        });
    })
});



app.put("/update_video/:id", (req, res) => {
    var video_id = parseInt(req.params.id);
    var video = {
        "title": req.body.title,
        "url": req.body.url,
        "subscribed": req.body.subscribed
    }
    mongoClient.connect(conStr).then(clientObj => {
        var database = clientObj.db("react-js-tutorial-dashboard");
        database.collection("video_library").updateOne({ id: video_id }, { $set:video}).then(result=>{
            console.log('Video Updated');
            res.redirect("/videos")
        })
    })
});



app.delete('/delete_video/:id',(req,res)=>{
    var video_id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("react-js-tutorial-dashboard");
        database.collection("video_library").deleteOne({id:video_id}).then((result)=>{
            console.log("Video Deleted");
        })
    })
})






app.listen("5000");
console.log(`Server Started: http://127.0.0.1:5000`)