import express from "express";
import calculatorRoutes from "./modules/calculator/routes";
import eanRoutes from "./modules/ean/routes";

const app = express();
app.use(express.json());

app.use("/calc", calculatorRoutes);
app.use("/ean", eanRoutes);

export default app;
