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

import "stream-chat-react/dist/css/v2/index.css";

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
    if (!tokenData?.token || !authUser) return;

    let isMounted = true;

    const initChat = async () => {
      try {
        console.log("🚀 Initializing Stream Chat...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // ✅ Prevent multiple connections
        if (client.userID) {
          console.log("⚠️ User already connected");
          setChatClient(client);
          return;
        }

        // ✅ Connect user (NO base64 image)
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic?.startsWith("http")
              ? authUser.profilePic
              : undefined, // avoid base64 crash
          },
          tokenData.token,
          {
            presence: true, // 🟢 online/offline
          }
        );

        // ✅ Unique channel
        const channelId = [authUser._id, targetUserId]
          .sort()
          .join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(currChannel);
        }
      } catch (error) {
        console.error("❌ Chat init error:", error);
        toast.error("Chat connection failed!");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
    };
  }, [tokenData?.token, authUser?._id, targetUserId]);

  // 📞 Video Call
  const handleVideoCall = () => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({
      text: `📞 Join video call: ${callUrl}`,
    });

    toast.success("Call link sent!");
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] bg-black text-white">
      <Chat client={chatClient} theme="messaging dark">
        <Channel channel={channel}>
          <div className="w-full relative flex flex-col h-full">

            {/* 🔥 Call Button */}
            <CallButton handleVideoCall={handleVideoCall} />

            <Window>
              {/* 🟢 Header (online/offline auto) */}
              <ChannelHeader />

              {/* 💬 Messages (typing + reactions + read receipts) */}
              <MessageList
                typingIndicator
                messageActions={["react", "reply", "edit", "delete"]}
              />

              {/* ✍️ Input (files + images supported) */}
              <MessageInput
                focus
                additionalTextareaProps={{
                  placeholder: "Type a message...",
                }}
              />
            </Window>

            {/* 🧵 Threads */}
            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;