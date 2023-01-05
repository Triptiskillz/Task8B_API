var express = require("express");
var app = express();
app.use(express.json());
var cors = require("cors");
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { listData } = require("./json.js");
const { json } = require("express");

app.get("/shops", function (req, res) {
  let arr = listData.shops;
  res.send(arr);
});

app.post("/shops", function (req, res) {
  let body = req.body;
  let maxid = listData.shops.reduce(
    (acc, curr) => (curr.shopId >= acc ? curr.shopId : acc),
    0
  );
  let newid = maxid + 1;
  let newShop = { shopId: newid, ...body };
  listData.shops.push(newShop);
  res.send(newShop);
});
app.get("/products", function (req, res) {
  let arr = listData.products;
  res.send(arr);
});

app.post("/products", function (req, res) {
  let body = req.body;
  let maxid = listData.products.reduce(
    (acc, curr) => (curr.productId >= acc ? curr.productId : acc),
    0
  );
  let newid = maxid + 1;
  let newShop = { productId: newid, ...body };
  listData.products.push(newShop);
  res.send(newShop);
});
app.get("/products/:id", function (req, res) {
  let id = +req.params.id;
  let list = listData.products.find((st) => st.productId === id);
  if (list) res.send(list);
  else res.status(404).send("No Item founds");
});
app.put("/products/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;

  let index = listData.products.findIndex((st) => st.productId === id);
  if (index >= 0) {
    let updateProducts = { productId: id, ...body };
    listData.products[index] = updateProducts;
    res.send(updateProducts);
  } else {
    res.status(404).send("No Item founds");
  }
});

app.get("/purchases", function (req, res) {
  let arr = listData.purchases;
  let shop = +req.query.st;
  let product = req.query.product;

  let sort = req.query.sort;
  let item = listData.shops.filter((st) => st.shopId == shop);
  if (shop) {
    arr = arr.filter((e) => item.find((st) => st.shopId == e.shopId));
  }
  if (product) {
    let productArr = product.split(",");
    let item1 = listData.products.filter((st) =>
      productArr.find((c) => {
        let product1 = c.substring(2, product.length);
        return +(st.productId) == +(product1);
      })
    );
    arr = arr.filter((e) => item1.find((st) => st.productId == e.productid));
  }

  if (sort === "QtyAsc") {
    arr.sort((s1, s2) => s1.quantity - s2.quantity);
  }
  if (sort === "QtyDesc") {
    arr.sort((s1, s2) => s2.quantity - s1.quantity);
  }

  if (sort === "ValueAsc") {
    arr.sort((s1, s2) => {
      let n1 = s1.quantity * s1.price;
      let n2 = s2.quantity * s2.price;
      if (n1 > n2) {
        return 1;
      } else if (n1 < n2) {
        return -1;
      } else 0;
    });
  }

  if (sort === "ValueDesc") {
    arr.sort((s1, s2) => {
      let n1 = s1.quantity * s1.price;
      let n2 = s2.quantity * s2.price;
      if (n1 > n2) {
        return -1;
      } else if (n1 < n2) {
        return 1;
      } else 0;
    });
  }
  res.send(arr);
});
app.get("/purchases/shops/:id", function (req, res) {
  let id = +req.params.id;
  let list = listData.purchases.filter((st) => st.shopId === id);
  if (list) res.send(list);
  else res.status(404).send("No Item founds");
});
app.get("/purchases/products/:id", function (req, res) {
  let id = +req.params.id;
  let list = listData.purchases.filter((st) => st.productid === id);
  if (list) res.send(list);
  else res.status(404).send("No Item founds");
});

app.get("/purchases/totalPurchase/shop/:id", function (req, res) {
  let id = +req.params.id;
  let list = listData.purchases.filter((st) => st.shopId === id);
  let newitemValue = [];
  let value = 0;
  let valueArr = list.map((e) => {
    value = e.price * e.quantity;
    let json = {
      shopId: e.shopId,
      productid: e.productid,
      quantity: e.quantity,
      value: value,
    };
    newitemValue.push(json);
  });
  let arr1 = listData.products.filter((st) =>
    newitemValue.find((e) => e.productid == st.productId)
  );

  // let arr = { ...arr1 };
  if (arr1) res.send(arr1);
  else res.status(404).send("No Item founds");
});

app.get("/purchases/totalPurchase/product/:id", function (req, res) {
  let id = +req.params.id;
  let list = listData.purchases.filter((st) => st.productid === id);
  let newitemValue = [];
  let value = 0;
  let valueArr = list.map((e) => {
    value = e.price * e.quantity;
    let json = {
      shopId: e.shopId,
      productid: e.productid,
      quantity: e.quantity,
      value: value,
    };
    newitemValue.push(json);
  });
  let arr1 = listData.shops.filter((st) =>
    newitemValue.find((e) => e.shopId == st.shopId)
  );

  // let arr2 = arr1.map((e) => {
  //   let n = newitemValue.filter((p) => {
  //     let q = 0;
  //     if (e.shopId == p.shopId) {
  //        q = p.quantity + q;
  //       return q
  //     }
  //   });
  //   console.log(n);
  // });

  // let arr = { ...arr1 };
  if (arr1) res.send(arr1);
  else res.status(404).send("No Item founds");
});

app.post("/purchases", function (req, res) {
  let body = req.body;
  let maxid = listData.purchases.reduce(
    (acc, curr) => (curr.purchaseId >= acc ? curr.purchaseId : acc),
    0
  );
  let newid = maxid + 1;
  let newpurchases = { purchaseId: newid, ...body };
  listData.purchases.push(newpurchases);
  res.send(newpurchases);
});
