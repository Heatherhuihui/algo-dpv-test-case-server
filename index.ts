import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PythonShell } from "python-shell";
import fs from "fs";
import { suffixes, problemAvailability } from "./util";

dotenv.config();
const app = express();
app.use(cors());

app.get("/problems", (req: express.Request, res: express.Response) => {
  res.send(problemAvailability);
});

app.get("/submit", (req: express.Request, res: express.Response) => {
  const { code, problem, language } = req.query;
  console.log("problem: ", problem);
  console.log("language: ", language);

  fs.readFile(
    `./deserializer/${language}/${problem}.${suffixes[language as string]}`,
    "utf8",
    function (err: any, data: any) {
      if (err) {
        console.log(err);
        res.send("Unspecified system error");
        return;
      }
      if (language == "python")
        PythonShell.runString(
          code + "\n" + data,
          null,
          // results is an array consisting of messages collected during execution
          function (err, results) {
            if (err) res.send(err.stack);
            else res.send(results);
          }
        );
      else res.send(`${language} is not yet supported`);
    }
  );
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
