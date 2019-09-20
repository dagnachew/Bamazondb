const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  console.log(`CONNECTED TO PRODUCTS DB`);
  readProducts();
});

//READ
function readProducts() {
  console.log("==============================================");
  console.log("");
  console.log("Welcome to Bamazon\n");
  console.log("==============================================");
  console.log("");
  console.log("Displaying all products in store...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.table(res);
    for(let i = 0; i < res.length; i++) {
      console.log(`Item ID: ${res[i].item_id} Product Name: ${res[i].product_name} Department Name: ${res[i].department_name} Unit Price: ${res[i].price} Stock Quantity: ${res[i].stock_quantity}`);
      console.log("");
    }
    takeOrder();
  });
}

// Take Order from customer

function takeOrder(){
    // Created a series of questions
    inquirer.prompt([
      {
        type: "input",
        name: "productID",
        message: "Please type in the ID of the product you would like to buy."
      },

      {
        type: "input",
        name: "quantity",
        message: "How many units do you want to buy today?"
      }

    ])  .then(function(answer) {
      let query = "Select stock_quantity, item_id, price, product_name FROM products WHERE ?";
      connection.query(query, {item_id: answer.productID}, function(err, res) {
        if(err) throw err;

        let productName = res[0].product_name;
        let price = res[0].price;
        
        if(res[0].stock_quantity < answer.quantity) {
          console.log("==============================================");
          console.log("");
          console.log(`Insuffecient Quantity of ${res[0].product_name} in stock!!! We only have ${res[0].stock_quantity} units in our invertory today. Your order quanity should not be greater than ${res[0].stock_quantity}. Please try again.`)
          console.log("");
          console.log("==============================================");
          console.log("");
          takeOrder();

        } else {
          // console.log(`${productName} added to shopping cart`)
          let newQuantity = res[0].stock_quantity - answer.quantity;
          // let itemprice = price;
          let total =  parseInt(price * answer.quantity);
          connection.query (
            "UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + res[0].item_id,
            function(err, res) {
              if(err) throw err;
              
              console.log("==============================================");
              console.log("");
              console.log(`You bought ${answer.quantity} ${productName}. Each ${productName} costs ${price}. Today's total is ${total} dollars.`);
              console.log(`Your transaction is complete. Thank you for your business.`);
              console.log("");
              console.log("==============================================");
              connection.end();
            }
          );
        }
      })
    });
  }