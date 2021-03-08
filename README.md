# Backend-API-Data-Store


Requirements to run the program:
Node.js:
MYSQL workbench
AWS RDS (tool to build databases on the cloud) (using SQL)
Postman to test the backend API 


To install node and the required modules: 

npm install express --save
npm install mysql --save
npm install express@4.17.1 node-cron@2.0.3


Creating an order and returning an order uuid
Example on how to post (insert) to the database in postman: 
http://localhost:3000/cars?manufacturer=fiat&model=500&price=333

This will then create a new entry in the database and return the following in postman:

{
   "manufacturer": "fiat",
   "model": "500",
   "price": "333",
   "id": "6840529f-8015-11eb-8a21-0653a157c10e"
}


Updating an order:
Using a patch request, you can choose an entry with its unique uuid and update the model, price and manufacturer in postman: 
Example on updating the record we just created: 

http://localhost:3000/cars/6840529f-8015-11eb-8a21-0653a157c10e?&manufacturer=renault&model=XZQ&price=2000




Getting an order with all it’s detail: 

Simple get request in express js, using the unique uuid to return all of the records information. E.g. in postman:

http://localhost:3000/cars/6840529f-8015-11eb-8a21-0653a157c10e

Which would return:

[
   {
       "id": "6840529f-8015-11eb-8a21-0653a157c10e",
       "manufacturer": "renault",
       "model": "XZQ",
       "price": "2000",
       "created": "2021-03-08T14:04:22.000Z"
   }
]





Generating a unique UUID for every entry: 
Created triggers in MYSQL workbench to ensure that every new entry creates a new UUID primary key  (saved as id in the table)

In order to allow the trigger to work, RDS requires custom parameters and setting the following parameter to true: 

parameter ‘log_bin_trust_function_creators’ and set its value to “1”.



Deleting 3 day old records
Firstly I created a new column in my database called created, and within MYSQL workbench, I set the default of this column as CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP: 



In order to delete entries older than 3 days, I used the Cron scheduler module, which runs a task when the program is running. In my case, every 12 hours the program would delete records older than 3 days with the following:

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

In the first line 0 */12 * * * represents 3 days in the cron library. 


