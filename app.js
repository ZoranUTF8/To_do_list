const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
//---------------------------------
// DD MONGODB
//Connection url
mongoose.connect("mongodb+srv://admin-zoran:Moeko2021@cluster0.8sn8a.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
// items Schema
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "ERROR: No name inserted!"]
  }
});
const customListSchema = {
  name: String,
  items: [itemsSchema]
};
//Mongoose model
const Item = mongoose.model(
  "Item",
  itemsSchema
);
const CustomList = mongoose.model(
  "customList",
  customListSchema
);


const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];








// --------------------------------
// EXPRESS METHODS

app.get("/", function(req, res) {

  // mongoose method to find items in the DB
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err + "THIS IS ERROR");
        } else {
          console.log("INSERTED DEFAULT ARRAY");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});
// end of app.get /


// Form for adding new items
app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.postButton;

  const itemToSave = new Item({
    name: itemName
  });

  if (listName === "Today") {
    itemToSave.save();
    res.redirect("/");
  } else {
    CustomList.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(itemToSave);
      foundList.save();
      res.redirect("/" + listName);
    });
  };






});
app.post("/delete", function(req, res) {
  const checkedItem_id = req.body.checkboxDelete;
  const listName = req.body.deleteItemListName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItem_id, function(err) {
      if (err) {
        console.log("ERROR: " + err);
      } else {
        console.log("Deleted item");
        res.redirect("/");
      }
    });
  } else {
    CustomList.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItem_id
        }
      }
    }, function(err, foundList) {
      if (!err) {
        console.log("UPDATED: " + listName);
        res.redirect("/" + listName);
      } else {
        console.log("ERROR IN UPDATING THE LIST: " + listName);
      }

    });
  }

});
// end of app.post /

//Dinamic route
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  CustomList.findOne({
      name: customListName
    },
    function(err, result) {
      if (!err) {
        if (!result) {
          const customList = new CustomList({
            name: customListName,
            items: defaultItems
          });
          customList.save();
          res.redirect("/" + customListName);
        } else {
          res.render("list", {
            listTitle: customListName,
            newListItems: result.items
          });
        }
      } else {
        console.log("ERROR while searching database." + err);
      }

    });



});;
//end off dinamic route

app.get("/about", function(req, res) {
  res.render("about");
});
// end of about get


//Run localy and heroku port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has  started successfully.");
});


// --------- CUSTOM FUNCTIONS ------------
function getAllPosts() {
  Item.find(function(err, items) {
    if (err) {
      console.log("ERROR " + err);
    } else {
      mongoose.connection.close();

      items.forEach((item, items) => {
        return items;
      });
    };
  });
}
