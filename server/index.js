const { app } = require("../src/shared");
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());

app.listen(PORT, () => {
  console.log(`Listening on port number ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("testing");
});

const userRoutes = require("../src/routes/userRoutes");
app.use("/store", userRoutes);
