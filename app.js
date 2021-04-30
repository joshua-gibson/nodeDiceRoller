const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + "/public"));
app.use(
  "/build/",
  express.static(path.join(__dirname, "node_modules/three/build"))
);

app.use(
  "/loaders/",
  express.static(
    path.join(__dirname, "node_modules/three/examples/jsm/loaders")
  )
);

app.use(
  "/@enable3d/",
  express.static(path.join(__dirname, "node_modules/@enable3d/ammo-on-nodejs"))
);

app.use(
  "/dgb/",
  express.static(path.join(__dirname, "node_modules/dat.gui/build"))
);

app.use(
  "/jsm/",
  express.static(path.join(__dirname, "node_modules/three/examples/jsm"))
);

app.listen(8080, () => console.log("Visit http://127.0.0.1:8080"));
