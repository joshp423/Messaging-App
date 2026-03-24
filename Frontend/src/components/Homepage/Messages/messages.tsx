import { useState } from "react"


function Messages() {

    const [soloMessages, setSoloMessages] = useState([])
    const [groupMessages, setGroupMessages] = useState([])
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