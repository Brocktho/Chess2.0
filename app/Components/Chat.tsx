import {useEffect, useState, useRef} from 'react';
import invariant from 'tiny-invariant';
import type { Socket } from "socket.io-client";
import { useOptionalUser } from "~/utils";
import type { chatMessage } from "~/types";

const Chat = ({socket} : {socket : Socket | undefined}) => {
    const user = useOptionalUser();
    const [chatItems, setChatItems] = useState<Array<chatMessage> | null>([]);
    const chatItemsHold = useRef<Array<chatMessage>>([]);
    const socketConnection = useRef<string>("guest");

    const refreshDom = async () => {
        setChatItems(null);
    }
    
    const updateChat = async () => {
        await refreshDom();
        setChatItems(chatItemsHold.current);
    }

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        let target = event.target as HTMLFormElement
        let chat = target.chat as HTMLInputElement
        event.preventDefault();
            if(chat.value !== ''){
            let message : chatMessage = {
                name: user ? user.email : socketConnection.current, 
                message:chat.value
            };
            chatItemsHold.current.push(message);
            updateChat();
            chat.value = "";
            socket?.emit('chatMessage', message );
        }
    }

    useEffect(() => {
        if (!socket) return;


        socket.on("connection", (data : string) => {
            socketConnection.current = `Guest-${data}`;
        })
        socket.on("chatStart", (data : string) => {
            console.log('chat start')
            chatItemsHold.current.push({
                name:"Server",
                message: data
            });
            updateChat();
        })
        socket.on("boardStart", (data : string) => {
            console.log("board start");
            chatItemsHold.current.push({
                name: "Server",
                message: data,
            });
            updateChat();
        })

    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("chatLoad", true);
    }, []);
    console.log(socketConnection.current);
    console.log(chatItemsHold.current);
    return (
        <div className="bg-white w-96 h-96 flex flex-col gap-4">
            {chatItems && chatItems.map( (item) => 
            {
                return <p>{item.name}: {item.message}</p>
            })}
            <form onSubmit={(event) => handleSubmit(event)}>
                <input type="text" name="chat" id="chat" className="rounded-full border-2"/>
                <input type="submit" value="Send" className="w-full rounded-full bg-green-500"/>
            </form>
        </div>
    )
}

export default Chat;