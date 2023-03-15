const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken =process.env.MYTOKEN;


app.listen(8000,() =>{
    console.log("webhook is listenging");
});

app.get("/webhook",(req,res)=>{
   let mode = req.query["hub.mode"];
   let challenge =req.query["hub.challenge"];
   let token = req.query["hub.verify_token"];

   if(mode && token){
        if(mode === "subscribe" && token === mytoken){
            res.status(200).send(challenge);
        }else{
            res.status(403);
        }
   }
});

app.post("/webhook",(req,res)=>{
    let para = req.body;

    console.log(JSON.stringify(para,null,2));

    if(para.object){
        if(para.entry &&
             para.entry[0].changes && 
             para.entry[0].changes[0].value.messages && 
             para.entry[0].changes[0].value.messages[0]){
                let phone_no = para.entry[0].changes[0].value.messages[0].value.metadata.phone_number_id;
                let from = para.entry[0].changes[0].value.messages[0].from;
                let msg_body = para.entry[0].changes[0].value.messages[0].text.body;

                axios({
                    method: 'POST',
                    url: 'https://graph.facebook.com/v15.0/'+phone_no+'/messages?access_token='+token,
                    data: {
                        messaging_product: 'whatsapp',
                        to:from,
                        text: {
                            body: "hii",
                        },
                        headers:{
                            "Contect-Type":"application/json"
                        }
                    }
                });
                res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }
});

app.get("/",(req,res)=>{
     res.status(200).send("hello webhook started.");

});