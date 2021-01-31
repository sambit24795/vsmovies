require("dotenv").config();
import express from "express";
import { join } from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import jwt from "jsonwebtoken";
import cors from "cors";
import * as imdb from "imdb-scrapper";

import { _prod_ } from "./constants";
import { User } from "./entities/User";

const main = async () => {
  await createConnection({
    type: "postgres",
    logging: !_prod_,
    synchronize: !_prod_,
    username: "postgres",
    password: "root",
    entities: [join(__dirname, "./entities/*.*")],
  });

  //const user = await User.create({ name: "bat" }).save();

  //console.log({ user });

  const app = express();

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });

  app.use(cors({ origin: "*" }));

  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        clientID: "37dc1f6586baa8d56c8d",
        clientSecret: "8e39d7b012a060756cf69145ece023b35aa81bff",
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      async function (_accessToken, _refreshToken, profile, cb) {
        let user = await User.findOne({ where: { githubId: profile.id } });

        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }

        cb(null, {
          accessToken: jwt.sign({ userId: user.id }, "vhgxsvcvjvcjejjegjf", {
            expiresIn: "1y",
          }),
          refreshToken: "",
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    function (req: any, res) {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );

  app.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.send({ user: null });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.send({ user: null });
      return;
    }

    let userId = "";

    try {
      const payload: any = jwt.verify(token, "vhgxsvcvjvcjejjegjf");
      userId = payload.userId;
    } catch (err) {}

    const user = await User.findOne(userId);

    res.send({ user });
  });

  app.get("/trending", (_req, res) => {
    imdb.getTrending([25]).then((val) => res.send(JSON.stringify(val)));
  });

  app.get("/movies/:id", (req, res) => {
    imdb.getCast(req.params.id).then((val) => res.send(JSON.stringify(val)));
  });

  app.get("/movies/genres/:genre", (req, res) => {
    imdb
      .getTrendingGenre(req.params.genre)
      .then((val) => res.send(JSON.stringify(val)));
  });

  app.get("/movies/search/:term", (req, res) => {
    imdb
      .simpleSearch(req.params.term)
      .then((val) => res.send(JSON.stringify(val)));
  });

  app.listen(3000, () => {
    console.log("listening on 3000");
  });
};

main();
