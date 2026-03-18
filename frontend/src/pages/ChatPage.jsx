import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, checkGrammar } from "../lib/api";
import { Sparkles, X } from "lucide-react";

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

  // Grammar Modal State
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [grammarText, setGrammarText] = useState("");
  const [grammarResult, setGrammarResult] = useState("");
  const [isGrammarLoading, setIsGrammarLoading] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (client.userID !== authUser._id) {
          if (client.userID) await client.disconnectUser();
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              // We omit the image here because base64 strings break the WebSocket URL limits!
            },
            tokenData.token
          );
        }

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleCheckGrammar = async () => {
    if (!grammarText.trim()) return;
    setIsGrammarLoading(true);
    try {
      const response = await checkGrammar(grammarText);
      setGrammarResult(response.reply);
    } catch (error) {
      setGrammarResult("Failed to check grammar.");
    } finally {
      setIsGrammarLoading(false);
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>

      {/* Grammar AI FAB */}
      <button 
        onClick={() => setIsGrammarModalOpen(true)}
        className="fixed bottom-24 right-6 btn btn-circle btn-primary btn-lg shadow-2xl z-50"
        title="AI Grammar Check"
      >
        <Sparkles className="size-6" />
      </button>

      {/* Grammar Modal */}
      {isGrammarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="p-4 border-b border-base-content/10 flex justify-between items-center bg-primary/10">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Sparkles className="text-primary size-5" /> AI Grammar Assistant
              </h3>
              <button onClick={() => setIsGrammarModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Paste text to check before sending:</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24 text-base focus:ring-2 focus:ring-primary"
                  placeholder="Hey, how is you doing today?"
                  value={grammarText}
                  onChange={(e) => setGrammarText(e.target.value)}
                ></textarea>
              </div>
              
              <button 
                className="btn btn-primary w-full" 
                onClick={handleCheckGrammar}
                disabled={isGrammarLoading || !grammarText.trim()}
              >
                {isGrammarLoading ? <span className="loading loading-spinner"></span> : "Analyze Grammar"}
              </button>

              {grammarResult && (
                <div className="mt-4 p-4 rounded-xl bg-base-200 border border-base-content/10 whitespace-pre-wrap text-sm leading-relaxed">
                  <h4 className="font-semibold mb-2 opacity-70">Analysis:</h4>
                  {grammarResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatPage;
