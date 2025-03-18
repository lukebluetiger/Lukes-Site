import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();
export const SignalRProvider = ({ children }) => {
    SignalRProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };
    const [userCount, setUserCount] = useState(0);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/userCountHub', {
                skipNegotiation: true,  // skipNegotiation as we specify WebSockets
                transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
              })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log('Connected to SignalR hub');

                    connection.on('updateusercount', (count) => {
                        setUserCount(count);
                    });
                })
                .catch((err) => console.error('Connection failed: ', err));

            // Clean up on unmount
            return () => {
                connection.stop();
            };
        }
    }, [connection]);

    return (
        <SignalRContext.Provider value={{ userCount }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => useContext(SignalRContext);