const express = require('express');
const app = express();
const port = 3000;

const cron = require('node-cron'); //importing the cron module to schedule tasks (used to delete 3 day old records)


const connection = require("./server");


app.listen(port, () => console.log("listening on port 3000") + port)


//Scheduling the delete query every 12 hours (deleting records older than 3 days)
cron.schedule('0 */12 * * *', function () {  //CRON SCHEDULER 
    app.delete("/cars", (req, res) => { 
        connection.connect(function (err) {
            connection.query(`DELETE FROM main.cars WHERE created < (NOW() - INTERVAL 3 DAY)`, function (err, result) {
                if (err) res.send(err);
                if (result) res.send(result);
            });

        });
    });
});

app.get("/cars/:id", (req, res) => { //get record based on id (uuid) e.g. http://localhost:3000/cars/a5ad957c-7d1b-11eb-8a21-0653a157c10e
    connection.connect(function (err) {
        connection.query(`SELECT * FROM main.cars WHERE id = '${req.params.id}'`, function (err, result) {
            if (err) res.send(err);
            if (result) res.send(result);
        });

    });
});






//Get all cars from online store 
app.get('/cars', (req, res) => {
    connection.connect(function (err) {
        connection.query(`SELECT * FROM main.cars`, function (err, result) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

//Updating a model
app.patch("/cars/:id", (req, res) => { //get record based on id (uuid) e.g. http://localhost:3000/cars/a5ad957c-7d1b-11eb-8a21-0653a157c10e
    connection.connect(function (err) {

        //Read path parameters
        let carId = req.params["id"];

        //Loading the contents 
        let body = req.body;
        //Loading the request into variables 
        let manufacturer = req.query.manufacturer;
        let model = req.query.model;
        let price = req.query.price;

        // prepare the UPDATE command
        let query = `UPDATE main.cars SET manufacturer='${manufacturer}',model='${model}',price ='${price}' WHERE id='${carId}'`;

        //run the query 
        connection.query(query, function (err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });

    });
});



//Allow post methods 
app.post('/cars', (req, res) => {
    if (req.query.manufacturer && req.query.model && req.query.price) {
        console.log('Request received'); //logging to check if post request has beeen made 

        connection.connect(function (err) { //query the connection then call an SQL INSERT method to put new record in database. 
            connection.query('INSERT INTO main.cars (manufacturer, model, price) VALUES (?, ?, ?)',
                [req.query.manufacturer, req.query.model, req.query.price],
                function (err, result, fields) {
                    if (err) {
                        res.send(err);
                    } else {
                        connection.query('SELECT id, created FROM main.cars WHERE manufacturer = ? AND model = ?', //query the database to find the car based on id (UUID) and update the other fields
                            [req.query.manufacturer, req.query.model],
                            function (err, result) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send({
                                        manufacturer: req.query.manufacturer,
                                        model: req.query.model,
                                        price: req.query.price,
                                        id: result[0].id,
                                        created: result.date
                                    });
                                }
                            });
                    }
                });
        });
    }
});
