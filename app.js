const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const { error } = require("console");

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
//public is the name of the folder that we want to keep static

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const FirstName = req.body.fName;
    const LastName = req.body.lName;
    const email = req.body.EmailAdd;
    //console.log(FirstName, LastName, email);

    const data = {
        // the format below comes from mailchimp
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : FirstName,
                    LNAME : LastName
                }
            }
        ]
    };
    
    // flatpack your json data
    var jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/23d6448742";
    const options = {
        method : "POST",
        auth : "smakshi_a:56ac12b77592a15719991b0bf029fb0d-us21"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    
    //console.log(request);
    console.log(response.statusCode);
    //request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});

//56ac12b77592a15719991b0bf029fb0d-us21
// audience id = 23d6448742