var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_crypto = require("crypto");
var import_express = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_products = require("./products");
const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3e3;
const app = (0, import_express.default)();
const user = [];
const purchase = [];
let SimulatedDay = 0;
app.use(import_body_parser.default.json());
app.use((req, res, next) => {
  const val = req.rawHeaders;
  for (let i = 0; i < val.length; i++) {
    if (val[i] == "Simulated-Day") {
      SimulatedDay = parseInt(val[++i]);
      console.log(SimulatedDay);
      break;
    }
  }
  next();
});
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
app.get("/accounts", (req, res) => {
  res.send(user);
});
app.get("/accounts/:accountId", (req, res) => {
  const accID = req.params["accountId"];
  console.log(accID);
  let resp;
  for (const usr of user) {
    if (usr.uuid == accID) {
      if (usr.simulatedDay === SimulatedDay) {
        const tmpUsr = { ...usr };
        tmpUsr.balance = tmpUsr.balance - tmpUsr.underProcessBal;
        resp = tmpUsr;
      } else {
        usr.underProcessBal = 0;
        resp = usr;
      }
      break;
    }
  }
  if (resp !== void 0) {
    res.send(resp);
  } else {
    res.send("No user found with given account ID: " + accID);
  }
});
app.post("/accounts", (req, res) => {
  const { name } = req.body;
  const temp = {
    name,
    balance: 0,
    uuid: (0, import_crypto.randomUUID)(),
    createdOn: /* @__PURE__ */ new Date(),
    lastUpdated: /* @__PURE__ */ new Date(),
    simulatedDay: SimulatedDay,
    underProcessBal: 0
  };
  user[user.length] = temp;
  res.send(user);
});
app.post("/accounts/:accountId/deposits", (req, res) => {
  const accID = req.params["accountId"];
  const { amount } = req.body;
  for (const usr of user) {
    if (usr.uuid == accID) {
      usr.simulatedDay = SimulatedDay;
      usr.balance = usr.balance + amount;
      if (usr.simulatedDay == SimulatedDay) {
        usr.underProcessBal = amount;
      }
      usr.lastUpdated = /* @__PURE__ */ new Date();
      break;
    }
  }
  res.send(user);
});
app.get("/products", (req, res) => {
  res.send(import_products.products);
});
app.post("/accounts/:accountId/purchases", (req, res) => {
  const { productId } = req.body;
  const accID = req.params["accountId"];
  let resp;
  let flag = true;
  if (purchase.length > 0) {
    for (let i = purchase.length; i > 0; i--) {
      const currPurch = purchase[i - 1];
      if (currPurch.accountId == accID) {
        if (currPurch.simulatedDay > SimulatedDay) {
          flag = false;
          res.statusCode = 400;
          resp = "Purchase not allowed before existing request..";
          break;
        }
      }
    }
  }
  if (flag) {
    for (const usr of user) {
      if (usr.uuid == accID) {
        for (const currProd of import_products.products) {
          if (currProd.id == productId && currProd.stock > 0 && currProd.price <= usr.balance) {
            console.log("Processing Purchase..");
            const tempPurch = {
              accountId: accID,
              simulatedDay: SimulatedDay,
              productId
            };
            purchase[purchase.length] = tempPurch;
            --currProd.stock;
            usr.balance = usr.balance - currProd.price;
            resp = "Purchase of " + productId + " is succesfull..";
          } else {
            res.statusCode = 409;
            resp = "You are not allowed to purchase..";
          }
        }
      }
    }
  }
  res.send(resp);
});
app.post("/products", (req, res) => {
  const { title } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  const { stock } = req.body;
  const tempProd = {
    id: (0, import_crypto.randomUUID)(),
    title,
    description,
    price,
    stock
  };
  import_products.products[import_products.products.length] = tempProd;
  res.send(tempProd);
});
//# sourceMappingURL=main.js.map
