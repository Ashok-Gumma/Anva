import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        setLoading(true);

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // ✅ connect user
        await client.connectUser(
          {
            id: authUser._id.toString(),
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // ✅ create channel
        const channelId = [authUser._id, targetUserId]
          .map(String)
          .sort()
          .join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [
            authUser._id.toString(),
            targetUserId.toString(),
          ],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Chat init error:", error);
        toast.error("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [tokenData, authUser, targetUserId]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton
              handleVideoCall={() => {
                const callUrl = `${window.location.origin}/call/${channel.id}`;

                channel.sendMessage({
                  text: `Join video call: ${callUrl}`,
                });

                toast.success("Call link sent!");
              }}
            />

            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;