const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 7777;
const appRouter = require("./router");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const db = require("./config/dbconfig");
const userMiddleware = require("./middleware/users");

const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Bosh sahifa");
});

app.get("/register", (req, res, next) => {
  db.query(`SELECT * FROM employes ORDER BY id ASC`, (err, result) => {
    if (err) {
      return res.status(400).send({
        msg: err,
      });
    }
    return res.send(result);
  });
});

app.get("/register/:id", (req, res, next) => {
  db.query(
    `SELECT * FROM employes where id=$1`,
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      return res.send(result);
    }
  );
});

app.post("/register", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM employes WHERE LOWER(login) = LOWER($1)`,
    [req.body.login],
    (err, result) => {
      if (result.rows.length) {
        return res.status(409).send({
          msg: "Bu nom allaqachon ishlatilmoqda !",
        });
      } else {
        // username is available
        // bcrypt.hash(req.body.password, 10, (err, hash) => {
        //   if (err) {
        //     return res.status(500).send({
        //       msg: err,
        //     });
        //   } else {
        // has hashed pw => add to database
        db.query(
          `INSERT INTO employes (id, "firstName", "lastName", "middleName", "login", "password", "role") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            Math.floor(Math.random() * 10000),
            req.body.firstName,
            req.body.lastName,
            req.body.middleName,
            req.body.login,
            req.body.password,
            req.body.role,
          ],
          (err, result) => {
            if (err) {
              return res.status(400).send({
                msg: err,
              });
            }
            return res.status(201).send({
              msg: "Ro'yxatga olindi!",
            });
          }
        );
        //   }
        // });
      }
    }
  );
});

app.put("/register/:id", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `UPDATE employes SET "firstName"=$1, "lastName"=$2, "middleName"=$3, "login"=$4, "password"=$5, "role"=$6 WHERE "id" = $7 RETURNING *`,
    [
      req.body.firstName,
      req.body.lastName,
      req.body.middleName,
      req.body.login,
      req.body.password,
      req.body.role,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      return res.status(201).send({
        msg: "Muvaffaqqiyatli o'zagrtitlidi!",
      });
    }
  );
});

app.delete("/register/:id", (req, res) => {
  db.query(
    `DELETE FROM employes WHERE id = $1`,
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          message: "Xatolik yuz berdi",
          msg: err,
        });
      } else {
        return res.status(200).send({
          msg: "Muvaffaqqiyatli o'chirildi!",
        });
      }
    }
  );
});

app.post("/login", (req, res, next) => {
  db.query(
    `SELECT * FROM employes WHERE login = $1`,
    [req.body.login],
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          message: "Xatolik yuz berdi",
          msg: err,
        });
      } else if (!result.rows.length) {
        return res.status(401).send({
          msg: "Login yoki parol notog'ri!",
        });
      } else {
        // bcrypt.compare(
        //   req.body.password,
        //   result.rows[0]["password"],
        //   (bErr, bResult) => {
        //     // wrong password
        //     if (bErr) {
        //       throw bErr;
        //       return res.status(401).send({
        //         msg: "Login yoki parol notog'ri!",
        //       });
        //     }

        //     if (bResult) {
        console.log(result);
        const token = jwt.sign(
          {
            fullName: result.rows[0].firstName + " " + result.rows[0].lastName,
            role: result.rows[0].role,
            userId: result.rows[0].id,
          },
          "secretKey",
          {
            expiresIn: "360s",
          }
        );
        return res.status(200).send({
          msg: "Tizimga kirildi!",
          token,
          // user: result[0],
        });
        // }
        // return res.status(401).send({
        //   msg: "Login yoki parol notog'ri!",
        // });
        // }
        // );
      }
    }
  );
});

app.get("/users", authToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, data) => {
    if (err) {
      res.status(401).json({
        error: err,
        message: "Token muddati tugadi!",
      });
    } else {
      db.query(
        "SELECT * FROM employes where id=$1",
        [data.userId],
        function (error, results, fields) {
          if (error) throw error;
          return res.send({
            error: false,
            data: results.rows[0],
            message: "Fetch Successfully.",
          });
        }
      );
    }
  });
});

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const auth = authHeader.split(" ")[1];
  if (typeof authHeader !== "undefined") {
    req.token = auth;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.use("/api", appRouter);

app.listen(port, () =>
  console.log(`Database connected in http://localhost:${port}`)
);
