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
  managerDisplay();
});

function managerDisplay(){

    // Creates menu options to the manager
    inquirer.prompt([
      {
        type: "list",
        message: "Choose one of the options below",
        name: "options",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product' ]
      }

    ])  .then(function(answer) {
            if (answer.options === 'View Products for Sale') {
                vewAllProducts();
                
            } else if (answer.options === 'View Low Inventory') {
                viewLowInvetory();
            
            } else if (answer.options === 'Add to Inventory') {
                add2Inventory(term);
            
            } else if (answer.options === 'Add New Product') {
                addNewProduct();
            }
        });
  }

  function vewAllProducts() {
 
    console.log("Displaying all products in store...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      for(let i = 0; i < res.length; i++) {
        console.log(`Item ID: ${res[i].item_id} Product Name: ${res[i].product_name} Department Name: ${res[i].department_name} Unit Price: ${res[i].price} Stock Quantity: ${res[i].stock_quantity}`);
        console.log("");
      }
      managerDisplay();;
    });
  }

  function viewLowInvetory() {
    let query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {
        if (err) throw err;
        let stock = res[0].stock_quantity;
        for(let i = 0; i < res.length; i++) {
            if(stock < 5) {
                console.log("");
                console.log("The following product is low in stock");
                console.log("========================================");
                console.log(`You have only ${res[i].stock_quantity} units of ${res[i].product_name}. See details below...`);
                console.log("");
                console.log(`Item ID: ${res[i].item_id} Product Name: ${res[i].product_name} Department Name: ${res[i].department_name} Stock Quantity: ${res[i].stock_quantity}`);
                console.log("");
            } else {
                console.log("Inventory is healthy!!!");
            }

        }
        managerDisplay();;
      });

  }
