import { getSessionHistory } from "@/services/session.service";
import SessionClient from "./SessionClient";

export default async function SessionsPage() {
    const sessions = await getSessionHistory();

    return(
        <SessionClient sessions={sessions} />
    )
    
} 