import {useEffect, useState, useRef} from 'react';
import invariant from 'tiny-invariant';
import { useSocket } from "~/context";

const Chat = () => {
    const socket = useSocket();
    const [chatItems, setChatItems] = useState<Array<string> | null>([]);
    const chatItemsHold = useRef<Array<string>>([]);

    const refreshDom = async () => {
        setChatItems(null);
    }

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        let target = event.target as HTMLFormElement
        let chat = target.chat as HTMLInputElement
        event.preventDefault();
        let message = chat.value;
        await refreshDom();
        chatItemsHold.current.push(message);
        setChatItems(chatItemsHold.current);
        socket?.emit('chatMessage', message );
    }

    useEffect(() => {
        if (!socket) return;
        
        socket.on("event", (data) => {
            console.log(data);
        });
        
        socket.on("alert", (data) => {
            console.log(data);
            socket.emit("alert", {x: "you deserve this"});
        })
        socket.emit("chat message", "new shit");

        socket.on('message', async (data : string) => {
            console.log('found socket')
            
        })

    }, [socket]);

    useEffect(() => {
        console.log("load Chat");
        if (!socket) return;
            console.log('found socket');
        socket.on("connection", (data : string) => {
            chatItemsHold.current.push(data);
            setChatItems(chatItemsHold.current);
        })
        socket.on('message', (data : string) => {
            console.log('found socket')
            chatItemsHold.current.push(data);
            setChatItems(chatItemsHold.current);
        })

    }, []);
    console.log(chatItemsHold.current);
    return (
        <div className="bg-white w-96 h-96 flex flex-col gap-4">
            {chatItems && chatItems.map( (item) => 
            {
                return <p>{item}</p>
            })}
            <form onSubmit={(event) => handleSubmit(event)}>
                <input type="text" name="chat" id="chat" className="rounded-full border-2"/>
                <input type="submit" value="Send" className="w-full rounded-full bg-green-500"/>
            </form>
        </div>
    )
}

export default Chat;