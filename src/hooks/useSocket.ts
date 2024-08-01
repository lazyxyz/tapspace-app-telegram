import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://api.tap-space.com/";

const useSocket = () => {
  const toast = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setConnected(true);
    });

    socketInstance.on("connect_error", (error: any) => {
      console.error("Connection error:", error);
    });

    socketInstance.on("connect_failed", () => {
      console.error("Connection failed");

      toast({
        status: "error",
        title: "Failed",
        description: String("Connection socket failed"),
        position: "top-right",
        isClosable: true,
        duration: 3000,
      });
    });

    return () => {
      if (socketInstance) {
        console.log("Socket disconnected");
        socketInstance.disconnect();
      }
    };
  }, []);

  const emit = (event: string, data: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    } else {
      console.log("Socket not connected or instance is undefined");
      toast({
        status: "error",
        title: "Failed",
        description: String("Socket not connected or instance is undefined"),
        position: "top-right",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    } else {
      console.log("Socket instance is undefined");
    }
  };

  return { emit, on, connected };
};

export default useSocket;
