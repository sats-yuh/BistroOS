import dotenv from "dotenv";
dotenv.config();

import { server } from "./app.js";
import { dbConnect } from "./db.js";

const PORT = process.env.PORT;

dbConnect()
  .then(() => {
    console.log("mongoose ready");
    server.listen(PORT, () => {
      console.log(`Server Ready at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
