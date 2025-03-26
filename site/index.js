const express= require("express");
const path = require("path");
app= express();

app.set("view engine", "ejs")
console.log("Calea proiectului:",__dirname);
console.log("Calea fisierului index.js:",__filename);
console.log("Calea folderului de lucru:",process.cwd());

app.use("/resurse", express.static(path.join(__dirname,"resurse")))

app.get(["/","/home","/index"],function(req, res){
    res.render("pagini/index");
}
)

app.get("/despre",function(req, res){
    res.render("pagini/despre");
}
)

// app.get("/index/a",function(req, res){
//     res.render("pagini/index");
// }
// )


app.get("/fisier", function(req, res){
    res.sendfile(path.join(__dirname,"package.json"));
})

app.get("/cerere", function(req, res){
    res.send("<p style='color:blue'>Buna seara!</p>");
})

app.get("/abc", function(req, res, next){
    res.write("Data de azi:");
    next();
})


app.get("/abc", function(req, res, next){
    res.write((new Date())+"");
    res.end()
    // next();
})


app.get("/abc", function(req, res, next){
    console.log("-----------------------------------")
    next();
})


app.listen(8080);
console.log("Serverul a pornit")


