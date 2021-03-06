const path = require("path");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const { createRequestHandler } = require("@remix-run/express");
const { Board } = require("./boardLogic.cjs");

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

if (!fs.existsSync(BUILD_DIR)) {
  console.warn(
    "Build directory doesn't exist, please run `npm run dev` or `npm run build` before starting the server."
  );
}

const app = express();

// You need to create the HTTP server require(the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new Server(httpServer);

// Then you can use `io` to listen the `connection` event and get a socket
// require(a client
let boards = {};
io.of(
  /^\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g
).on("connection", (socket) => {
  const namespace = socket.nsp;
  const thisGame = namespace.name;

  if (boards[`${thisGame}`] === undefined) {
    boards[`${thisGame}`] = {
      players: [],
      playerCount: 0,
      board: new Board(),
    };
  }

  socket.on("thisPlayer", (data) => {
    let isNew = true;
    let position = 0;
    boards[`${thisGame}`].players.every((player, index) => {
      if (player.name === data) {
        isNew = false;
        position = player.position;
        player.socketId = socket.id;
        return false;
      }
      return true;
    });
    console.log(`Is new?: ${isNew}`);
    console.log(data);
    if (isNew) {
      boards[`${thisGame}`].playerCount++;
      let newPlayer = {
        name: data,
        position: boards[`${thisGame}`].playerCount,
        socketId: socket.id,
      };
      position = newPlayer.position;
      boards[`${thisGame}`].players.push(newPlayer);
    }
    if (typeof position === "undefined") {
      position = 0;
      socket.emit("chessPlayer", position);
    } else {
      socket.emit("chessPlayer", position);
    }
    socket.emit("boardState", boards[`${thisGame}`].board);
    console.log(boards[`${thisGame}`]);
  });

  socket.emit("connection", socket.id);

  socket.on("chatMessage", (data) => {
    socket.broadcast.emit("updateChat", data);
    io.to(socket.id).emit("updateWorked", true);
  });
  socket.on("chess", (data) => {
    console.log(socket.id, data);
    io.to(socket.id).emit("boardStart", "Chess Board is live!");
  });
  socket.on("chatLoad", (data) => {
    console.log("chatLoad");
    if (data) {
      io.to(socket.id).emit("chatStart", "Chat initialized");
    }
  });
  socket.on("sendMove", (data) => {
    let response = {
      location: data.access.location,
      color: data.access.color,
      newLocation: data.nextLocation,
    };
    socket.broadcast.emit("chessMove", response);
  });
  socket.on("disconnect", () => {
    console.log(socket.id);
    
  });
});

io.of("/").on("connection", (socket) => {
  // require(this point you are on the WS connection with a specific client
  console.log(socket.id, "connected");

  socket.emit("confirmation", "connected!");

  socket.emit("connection", socket.id);

  socket.on("event", (data) => {
    console.log(socket.id, data);
    socket.emit("event", "pong");
  });

  socket.on("chat message", (data) => {
    console.log(socket.id, data);
    socket.emit("message", "Append this");
  });

  socket.on("chatMessage", (data) => {
    console.log(data);
    socket.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(compression());

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("../build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("../build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
