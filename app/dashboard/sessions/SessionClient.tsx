'use client'
import { SessionHistory } from "@/types/training";

interface Props {
    sessions: SessionHistory[];
}

export default function SessionClient({ sessions }: Props) {
    return (
        <div>
            <h1>Training Sessions</h1>
            <div>
                <div>
                    <input type="text" placeholder="Search skills or dates..." />
                    <div></div>{/* Tady budou filters */}
                </div>
                
            </div>
        </div>
    );
}