import {
  Chat,
  Window,
  Channel,
  MessageList,
  ChannelList,
  MessageInput,
  ChannelHeader,
  LoadingIndicator,
} from "stream-chat-react";

import { useLoggedInAuth } from "../context/AuthContext";

import "stream-chat-react/dist/css/index.css";

const Home = () => {
  const { user, streamChat } = useLoggedInAuth();

  if (!streamChat) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={streamChat}>
      <ChannelList filters={{ members: { $in: [user?.id] } }} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default Home;
