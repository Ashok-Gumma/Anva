import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!authUser || !tokenData?.streamToken || !callId) return;

    let isMounted = true;

    const initCall = async () => {
      try {
        console.log("📞 Initializing call...");

        // ✅ Create video client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic?.startsWith("http")
              ? authUser.profilePic
              : undefined, // ❌ avoid base64 crash
          },
          token: tokenData.streamToken,
        });

        // ✅ Create / join call
        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        if (isMounted) {
          setClient(videoClient);
          setCall(callInstance);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Call error:", error);
        toast.error("Failed to join call");
        setLoading(false);
      }
    };

    initCall();

    // ✅ Cleanup (VERY IMPORTANT)
    return () => {
      isMounted = false;

      if (call) {
        call.leave();
      }

      if (client) {
        client.disconnectUser();
      }
    };
  }, [tokenData?.streamToken, authUser?._id, callId]);

  if (isLoading || loading) return <PageLoader />;

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <p>Could not initialize call</p>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // ✅ Auto redirect when leaving call
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      {/* 🎥 Video Layout */}
      <SpeakerLayout />

      {/* 🎛️ Controls (mute, leave, camera) */}
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;