import React from 'react';
import { useSignalR } from '../context/SignalRContext.jsx';
import '../styles/Style.css';

const UserCount = () => {
    const { userCount } = useSignalR();

    return (
        <div className="user-count">
            <p>Current Users Online: {userCount}</p>
        </div>
    );
};

export default UserCount;