import { ChannelListMessengerProps, useChatContext } from "stream-chat-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useLoggedInAuth } from "../context/AuthContext";

const StreamChannelList = (props: ChannelListMessengerProps) => {
  const { loadedChannels } = props;
  const navigate = useNavigate();
  const { logout } = useLoggedInAuth();

  const { setActiveChannel, channel: activeChannel } = useChatContext();

  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <Button
        onClick={() => {
          navigate("/channel/new");
        }}
      >
        New Chat
      </Button>
      <hr className="border-gray-500" />
      {loadedChannels && loadedChannels.length
        ? loadedChannels.map((channel) => {
            const isActive = channel === activeChannel;
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-100";

            return (
              <button
                key={channel.id}
                disabled={isActive}
                onClick={() => setActiveChannel(channel)}
                className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
              >
                {channel.data?.image && (
                  <img
                    src={channel.data.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {channel.data?.name || channel.id}
                </div>
              </button>
            );
          })
        : "No coversation yet"}

      <hr className="border-gray-500 mt-auto" />
      <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
        Logout
      </Button>
    </div>
  );
};

export default StreamChannelList;
