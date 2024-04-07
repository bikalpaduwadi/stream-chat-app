import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";

type AuthContext = {
  user?: User;
  streamChat?: StreamChat;
  signup: UseMutationResult<AxiosResponse, unknown, User>;
  login: UseMutationResult<{ token: string; user: User }, unknown, string>;
};

type User = {
  id: string;
  name: string;
  image?: string;
};

const Context = createContext<AuthContext | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(Context) as AuthContext;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoggedInAuth = () => {
  return useContext(Context) as AuthContext &
    Required<Pick<AuthContext, "user">>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>("");
  const [streamChat, setstreamChat] = useState<StreamChat>();

  const signup = useMutation({
    mutationFn: (user: User) => {
      return axios.post(`${serverUrl}/signup`, user);
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const login = useMutation({
    mutationFn: (id: string) => {
      return axios.post(`${serverUrl}/login`, { id }).then((res) => {
        return res.data as { token: string; user: User };
      });
    },
    onSuccess(data) {
      setUser(data.user);
      setToken(data.token);
    },
  });

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const streamChatClient = new StreamChat(
      import.meta.env.VITE_STREAM_API_KEY
    );

    // User is already connected
    if (
      streamChatClient.tokenManager.token === token &&
      streamChatClient.userID === user.id
    ) {
      return;
    }

    let isInterrupted = false;

    const connectPromise = streamChatClient
      .connectUser(user, token)
      .then(() => {
        if (isInterrupted) {
          return;
        }

        setstreamChat(streamChatClient);
      });

    return () => {
      isInterrupted = true;
      setstreamChat(undefined);
      connectPromise.then(() => {
        streamChatClient.disconnectUser();
      });
    };
  }, [user, token]);

  return (
    <Context.Provider value={{ signup, login, user, streamChat }}>
      {children}
    </Context.Provider>
  );
};
