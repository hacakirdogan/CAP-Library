const cds = require("@sap/cds");
module.exports = async function () {
  const remote = await cds.connect.to("RemoteService");
  this.on("*", "Players", (req) => {
    console.log(">> delegating to remote service...");
    return remote.run(req.query);
  });
  this.on("CREATE", "Holes", (req, next) => {
    if (req.data.score - req.data.par == -1) {
      req.data.result = "birdie";
    }
    return next();
  });
};
