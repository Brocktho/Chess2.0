import { useEffect, useState, useRef } from "react";
import invariant from "tiny-invariant";
import type { Socket } from "socket.io-client";
import { isUser } from "~/utils";

import type { chatMessage } from "~/types";

const Chat = ({
  dispatch,
  chatItems,
  chatName,
}: {
  dispatch: Function;
  chatItems: Array<chatMessage> | null;
  chatName: string;
}) => {
  const chatItemsHold = useRef<Array<chatMessage>>([]);
  const previous = useRef<Array<chatMessage>>([]);
  const socketConnection = useRef<string>("guest");
  let optimistic: NodeJS.Timeout;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let target = event.target as HTMLFormElement;
    let chat = target.chat as HTMLInputElement;
    event.preventDefault();
    if (chat.value !== "") {
      const MESSAGE = {
        name: chatName,
        message: chat.value,
      };
      chatItemsHold.current.push(MESSAGE);
      dispatch({ type: "send chat", message: MESSAGE });
      chat.value = "";
    }
  };

  return (
    <div className="flex h-96 w-96 flex-col justify-between rounded-xl bg-white shadow-xl">
      <div className="flex h-4/5 w-full flex-col items-center overflow-y-auto px-6 pt-2 text-xs">
        <h1 className="text-lg">Live Chat</h1>
        {chatItems &&
          chatItems.map((item, index) => {
            return (
              <p
                key={index}
                className="w-full rounded-xl bg-blue-500 text-white"
              >
                {item.name}: {item.message}
              </p>
            );
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
