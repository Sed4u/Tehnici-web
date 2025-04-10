const express= require("express");
const path = require("path");
const fs=require("fs");
app= express();

app.set("view engine", "ejs")


obGlobal ={
    obErori:null
}


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    
    obGlobal.obErori=JSON.parse(continut)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)

}

initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})

}


console.log("Calea proiectului:",__dirname);
console.log("Calea fisierului index.js:",__filename);
console.log("Calea folderului de lucru:",process.cwd());

app.use("/resurse", express.static(path.join(__dirname,"resurse")))

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "/resurse/imagini/favicon/favicon.ico"))
})

app.get(["/","/home","/index"],function(req, res){
    res.render("pagini/index", 
        {ip:req.ip}
    );
}
)

// app.get("/despre",function(req, res){
//     res.render("pagini/despre");
// }
// )

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

app.get("/*.ejs", function(req,res,next){
    console.log("Am ajuns aici")
})


app.get("/*", function(req, res){
    try {
        res.render("pagini"+req.url,function(err, rezultatRandare){
            if(err){
                if(err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res,404);
                }
                else{
                    //eroare generala
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezultatRandare);
                afisareEroare(res);
            }
        })
    }
    catch(errRandare){ 
        if(errRandare.message.startsWith("Cannot find module")){
            afisareEroare(res,404);
        }
        else{
            //eroare generala
            afisareEroare(res);
        }
    }
})

app.listen(8080);
console.log("Serverul a pornit")


