import express from "express";
import http from "http";
import {} from "dotenv/config";
const app = express();
app.set("port", process.env.PORT || 5000);

// Try to define BasePath and routes ..

// Endpoints

app.use("/config", function (req, res) {
  console.log("Displaying ENV values ..", process.env.DB_HOST);
});

const server = http.createServer(app);
server.listen(app.get("port"), () =>
  console.log(
    `Provisioning Manager App listening to port ${app.get(
      "port"
    )} for accepting requests `
  )
);
