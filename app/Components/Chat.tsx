import { useEffect, useRef, useState } from 'react';
import { isUser } from '~/utils';

import type { Socket } from "socket.io-client";
import type { IdentifyUser } from "~/models/user.server";
import type { chatMessage } from "~/types";

const Chat = ({
  socket,
  user,
}: {
  socket: Socket | undefined;
  user: IdentifyUser;
}) => {
  const [chatItems, setChatItems] = useState<Array<chatMessage> | null>([]);
  const chatItemsHold = useRef<Array<chatMessage>>([]);
  const previous = useRef<Array<chatMessage>>([]);
  const socketConnection = useRef<string>("guest");
  let optimistic: NodeJS.Timeout;
  const thisWindow = typeof window !== "undefined";

  const refreshDom = async () => {
    setChatItems(null);
  };

  const updateChat = async () => {
    await refreshDom();
    setChatItems(chatItemsHold.current);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let target = event.target as HTMLFormElement;
    let chat = target.chat as HTMLInputElement;
    event.preventDefault();
    if (chat.value !== "") {
      let message: chatMessage;
      if (isUser(user)) {
        message = {
          name: user ? user.username : socketConnection.current,
          message: chat.value,
        };
      } else {
        message = {
          name: user
            ? user.username.substring(0, 10)
            : socketConnection.current.substring(0, 10),
          message: chat.value,
        };
      }
      previous.current = chatItemsHold.current;
      chatItemsHold.current.push(message);
      updateChat();
      chat.value = "";
      socket?.emit("chatMessage", message);
      optimistic = setTimeout(() => {
        chatItemsHold.current = previous.current;
        updateChat();
      }, 2000);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("connection", (data: string) => {
      if (thisWindow) {
        if (!localStorage.getItem("guestUser")) {
          localStorage.setItem("guestUser", self.crypto.randomUUID());
        }
        let guest = localStorage.getItem("guestUser") as string;
        socketConnection.current = `Guest-${guest.slice(-5)}`;
      }
    });
    socket.on("chatStart", (data: string) => {
      chatItemsHold.current.push({
        name: "Server",
        message: data,
      });
      updateChat();
    });
    socket.on("boardStart", (data: string) => {
      chatItemsHold.current.push({
        name: "Server",
        message: data,
      });
      updateChat();
    });
    socket.on("updateChat", (data: chatMessage) => {
      chatItemsHold.current.push(data);
      updateChat();
    });
    socket.on("updateWorked", (data: boolean) => {
      clearTimeout(optimistic);
    });
  }, [socket]);

  useEffect(() => {
    if (thisWindow) {
      if (!user && !localStorage.getItem("guestUser")) {
        localStorage.setItem("guestUser", self.crypto.randomUUID());
      }
    }
    if (!socket) return;
    socket.emit("chatLoad", true);
  }, []);

  return (
    <div className="flex h-96 w-96 flex-col justify-between rounded-xl bg-white shadow-xl">
      <div className="flex h-4/5 w-full flex-col items-center gap-2 overflow-y-auto px-6 pt-2 text-xs">
        <h1 className="text-lg">Live Chat</h1>
        {chatItems &&
          chatItems.map((item, index) => {
            if (item.name === user.username.substring(0, 10)) {
              return (
                <div
                  key={index}
                  className="flex w-3/4 flex-col gap-1 self-start rounded-xl bg-blue-500 p-2 text-white"
                >
                  <p className="underline">{item.name}</p>
                  <p className="">{item.message}</p>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="flex w-3/4 flex-col gap-1 self-start rounded-xl bg-green-500 p-2 text-white"
                >
                  <p className="underline">{item.name}</p>
                  <p className="">{item.message}</p>
                </div>
              );
            }
          })}
        {}
      </div>
      <form
        className="flex flex-col gap-2 p-4"
        onSubmit={(event) => handleSubmit(event)}
      >
        <input
          type="text"
          name="chat"
          id="chat"
          placeholder="Enter Chat Message"
          className="w-full rounded-full border-2 pl-2"
        />
        <input
          type="submit"
          value="Send"
          className="w-full cursor-pointer rounded-full border-2 border-green-500 bg-transparent text-green-500 hover:border-none hover:bg-green-500 hover:py-0.5 hover:text-white"
        />
      </form>
    </div>
  );
};

export default Chat;
