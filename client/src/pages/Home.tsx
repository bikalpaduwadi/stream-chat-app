import {
  Chat,
  Thread,
  Window,
  Channel,
  MessageList,
  ChannelList,
  MessageInput,
  ChannelHeader,
  LoadingIndicator,
} from "stream-chat-react";

import { useLoggedInAuth } from "../context/AuthContext";

import 'stream-chat-react/dist/css/v2/index.css';
import StreamChannelList from "../component/StreamChannelList";

const Home = () => {
  const { user, streamChat } = useLoggedInAuth();

  if (!streamChat) {
    return <LoadingIndicator />;
  }

  const customActions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'Custom: Copy text': (message: any) => {
      navigator.clipboard.writeText(message.text || '');
    },
  };

  return (
    <Chat client={streamChat}>
      <ChannelList
        List={StreamChannelList}
        sendChannelsToList
        filters={{ members: { $in: [user?.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList customMessageActions={customActions} />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default Home;
