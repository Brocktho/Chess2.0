import path from "path";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import compression  from "compression";
import morgan  from "morgan";
import fs from "fs";
import { createRequestHandler } from "@remix-run/express";


const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

if (!fs.existsSync(BUILD_DIR)) {
  console.warn(
    "Build directory doesn't exist, please run `npm run dev` or `npm run build` before starting the server."
  );
}

const app = express();



// You need to create the HTTP server from the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new Server(httpServer);

// Then you can use `io` to listen the `connection` event and get a socket
// from a client

let boards = {};
io.of(/^\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g).on("connection", (socket) => {
  const namespace = socket.nsp;
  const thisGame = namespace.name;

  if(boards[`${thisGame}`] === undefined){
    boards[`${thisGame}`] = {
      players: [],
      playerCount: 0,
    }
  }

  socket.on("thisPlayer", data => {
    boards[`${thisGame}`].playerCount++
    let isNew = true;
    let position = 0;
    boards[`${thisGame}`].players.every( (player, index) => {
      if(player.name === data){
        isNew = false;
        position = player.position;
        player.socketId = socket.id
        return false;
      }
      return true;
    })
    console.log(`Is new?: ${isNew}`);
    console.log(data);
    if(isNew){
      let newPlayer = {
        name: data,
        position: boards[`${thisGame}`].playerCount,
        socketId: socket.id,
      }
      position = newPlayer.position;
      boards[`${thisGame}`].players.push(newPlayer);
    }
    if(typeof position === "undefined"){
      position = 0;
      socket.emit("chessPlayer", position);
    }else{
      socket.emit("chessPlayer", position);
    }
    console.log(boards[`${thisGame}`]);
    
    
  })

  socket.emit("connection", socket.id);
  
  socket.on("chatMessage", (data) => {
    socket.broadcast.emit("updateChat", data);
    io.to(socket.id).emit("updateWorked", true);
  })
  socket.on("chess", (data) => {
    console.log(socket.id, data);
    io.to(socket.id).emit("boardStart", "Chess Board is live!");
  });
  socket.on("chatLoad", (data) => {
    console.log("chatLoad");
    if(data){
      io.to(socket.id).emit("chatStart", "Chat initialized");
    }
  })
  socket.on("sendMove", (data) => {
    let response = {
      location: data.access.location,
      color: data.access.color,
      newLocation: data.nextLocation,
    }
    socket.broadcast.emit("chessMove", response);
  })
  socket.on("disconnect", () => {
    console.log(socket.id)
    boards[`${thisGame}`].players.every( (player) => {
      if(player.socketId === socket.id){
        boards[`${thisGame}`].playerCount--
        return false;
      }
    });
  })
  
});

io.of(/^(?:\/play)$/).on('connection', (socket) => {
  console.log('play connected');
  count++
  socket.emit("connection", socket.id);
  socket.emit("chessPlayer", count);
  
  socket.on("chatMessage", (data) => {
    console.log(data)
    socket.broadcast.emit("updateChat", data);
    io.to(socket.id).emit("updateWorked", true);
  })
  socket.on("chess", (data) => {
    console.log(socket.id, data);
    io.to(socket.id).emit("boardStart", "Chess Board is live!");
  });
  socket.on("chatLoad", (data) => {
    if(data){
      io.to(socket.id).emit("chatStart", "Chat initialized");
    }
  })
  socket.on("sendMove", (data) => {
    let response = {
      location: data.access.location,
      color: data.access.color,
      newLocation: data.nextLocation,
    }
    socket.broadcast.emit("chessMove", response);
  })
  socket.on("disconnect", () => {
    count--
  })
})

io.of('/').on("connection", (socket) => {
  // from this point you are on the WS connection with a specific client
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
  })

  socket.on("chatMessage", (data) => {
    console.log(data)
    socket.emit("message", data);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
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
    ? createRequestHandler({ build: require("./build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("./build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT || 5000;

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