const express = require("express");
const Joi = require('joi')
const ProductDetailSchema=Joi.object({
  date1: Joi.date().required(),
  productname1:Joi.string().required(),
  category1:Joi.string().required(),
  serialno1:Joi.string().max(9).min(8).required(),
  price1:Joi.number().integer().max(10000000000).min(500).required()

})

const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
const router = express.Router();
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "TrustCare",
  port: 5432,
});

// client.query("CREATE TABLE if not exists PatientDetails(id SERIAL PRIMARY KEY,date varchar(255) ,fullname VARCHAR(255),age Int not null,birthdate VARCHAR(255),phonenumber VARCHAR(255) ,address VARCHAR(255)not null,hospitalname VArchar not null,consultingdr VARCHAR(255),medicines VARCHAR(255),medicalreceptionist VARCHAR(255));");
// client.query("INSERT INTO PatientDetails values(1,'02-07-2024','Sayali Bhosale',25,'13-02-1999','9876543210','Katraj','Bharti Hospital','Dr priya chavan','paracitamole, omi,uscoff','shweta mehta')");
// client.query("select * from patientdetails").then((data) => console.log(data.rows, "sdfghjk"));
// client.query("DROP TABLE patientdetails;");

// client.query("CREATE TABLE if not exists Signupdata(id bigserial PRIMARY KEY,fullname varchar(255),email varchar(255),pass varchar(50),confirmpassword varchar(50))");
// client.query("INSERT INTO Signupdata(fullname,email,pass,confirmpassword) values('abc3','abc','abc56','abc56')")
// client.query("select * from Signupdata").then((data) => console.log(data.rows, "sdfghjk"));
// client.query("DROP TABLE Signupdata;");

// client.query("select * from login").then((data) => console.log(data.rows, "sdfghjk"));
// client.query("DROP TABLE login;");



// client.query("CREATE TABLE if not exists ProductDetails(id SERIAL PRIMARY KEY,date varchar(255) ,productname VARCHAR(255),category VARCHAR(255) not null,serialno VARCHAR(255) not null ,price int not null);");
// client.query("INSERT INTO ProductDetails values(1,'02-07-2024','Apple Macbook pro 13','Laptop','MB1234567',90000)");
client.query("select * from ProductDetails").then((data) => console.log(data.rows, "sdfghjk"));
// client.query("DROP TABLE ProductDetails;");



client.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

router.get("/data", (req, res) => {
  client.query(`select * from ProductDetails`, (err, data) => {
    if (err) {
      res.send(error);
    } else {
      res.send(data.rows);
    }
  });
});



router.post("/login", (req, res) => {
  // console.log(req.body,"loginnnn");
  // Check if the user exists in the database
  client.query(`SELECT * FROM Signupdata WHERE email='${req.body.user1}' AND pass='${req.body.pass1}'`, (err, data) => {
    console.log(err,"rrrrrrrrrr",data);
    if (err) {
     
      res.send(err);
    } else if (data.rows.length > 0) {
      // If user exists, return user data
      //res.send(data.rows[0]);
      console.log(err,"rrrrrrrrrr");
      return res.send({ success: true, message: "Login successful" });
    } else {
      res.send({ success: false, message: "Invalid email or password" });
    }
  });
});

router.post("/signup", (req, res) => {
  client.query(`SELECT * FROM Signupdata WHERE email='${req.body.user1}' AND pass='${req.body.pass1}'`, (err, data) => {
   
   console.log("data"); if (err) {
      res.send(err);
    } else if (data.rows.length > 0) {
      // If user exists, return user data
      //res.send(data.rows[0]);
       res.send({ success: true, message: "signup successful user present" });
    } else {
      console.log("else");
     client.query(`insert into Signupdata(fullname,email,pass,confirmpassword)
        values('${req.body.user1}','${req.body.user1}','${req.body.pass1}','${req.body.pass1}')`,
        (err) => {
          console.log(err,"dgfhjk");
          if (err) 
            res.send(err);
            else
            res.send({ success: true, message: "sign up successful for new user" });
    }
   ) }
})
    
 
});

router.post("/data", (req, res) => {
 const {error} =ProductDetailSchema.validate(req.body)
 if (error) {
  return res.status(400).send(error.details[0].message);
}
  client.query(`insert into ProductDetails(date,productname,category,serialno,price)
    values('${req.body.date1}','${req.body.productname1}','${req.body.category1}','${req.body.serialno1}',${req.body.price1})`,
    (err) => {
      console.log(err);
      if (err) {
        res.send(err);
      } else {
        res.send({ msg: "data updated" });
      }
    }
  );

});

router.delete("/data/:id", (req, res) => {
  client.query(`delete from ProductDetails where id=${req.params.id}`, (data, err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("data deleted");
    }
  });
});


router.put("/data/:id", (req, res) => {
  const {error} =ProductDetailSchema.validate(req.body)
 if (error) {
  return res.status(400).send(error.details[0].message);
}
  const { date,productname,category,serialno,price}  =req.body;
client.query(
  `UPDATE ProductDetails SET date='${date}', productname='${productname}', category='${category}', serialno='${serialno}', price=${price}`,
  (data, err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ msg: "data updated successfully" });
    }
  }
);
 
});

app.use(router);

app.listen(8000, () => {
  console.log("server started");
});




