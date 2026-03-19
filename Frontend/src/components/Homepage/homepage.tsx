import { useEffect, useState } from 'react';
import { type messageSolo } from '../../types/messageSolo'
import { type messageGroup } from '../../types/messageGroup';

function Homepage() {
    const [messagesSolo, setMessagesSolo] = useState<messageSolo[]>([])
    const [messageGroup, setMessagesGroup] = useState<messageGroup[]>([])

    useEffect(() => {
        try {
        fetch("https://localhost:3000/receive-messages")
        } catch (err) {

        }
    })
}

export default Homepage

    