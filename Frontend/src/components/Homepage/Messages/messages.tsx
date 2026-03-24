import { useEffect, useState } from "react"
import type { messageGroup } from "../../../types/messageGroup"
import type { messageSolo } from "../../../types/messageSolo"

function Messages() {

    const [soloMessages, setSoloMessages] = useState<messageSolo[]>([])
    const [groupMessages, setGroupMessages] = useState<messageGroup[]>([])

    useEffect(() => {
        async function getMessages() {
            try {
                const rsp = await fetch(
                    "http//localhost:3000/receive-messages",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        method: "GET",
                        body: JSON.stringify({
                            id: sessionStorage.getItem("loggedUser")
                        })
                    }
                )
                if (rsp.status === 200) {
                    const data = await rsp.json();
                    setSoloMessages(data.messagesSolo);
                    setGroupMessages(data.messagesGroup);
                    console.log(soloMessages, groupMessages)
                }
            } catch (error) {
                console.error(error);
            }
        }
        getMessages()
    },[])

    
    return (
        <div className="messageLobby">
            <div className="soloMessages">

            </div>
            <div className="groupMessages">

            </div>
        </div>
    )
}

export default Messages