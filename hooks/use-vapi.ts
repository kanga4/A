import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { v4 as uuidv4 } from "uuid";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "7dee42ab-16f2-400a-96a9-2394328835d6";
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "4f60f7fe-fd7f-4369-94fd-c8d60ea42924";

const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<
    { role: string; text: string; timestamp: string; isFinal: boolean }[]
  >([]);
  const vapiRef = useRef<any>(null);
  const userIdRef = useRef<string>(uuidv4());

  const initializeVapi = useCallback(() => {
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;

      vapiInstance.on("call-start", () => {
        setIsSessionActive(true);
      });

      vapiInstance.on("call-end", () => {
        setIsSessionActive(false);
        setConversation([]);
      });

      vapiInstance.on("volume-level", (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on("message", (message: any) => {
        if (message.type === "transcript") {
          setConversation((prev) => {
            const timestamp = new Date().toLocaleTimeString();
            const updated = [...prev];

            const isFinal = message.transcriptType === "final";
            const existingIndex = updated.findIndex(
              (msg) => msg.role === message.role && !msg.isFinal
            );

            const newEntry = {
              role: message.role,
              text: message.transcript,
              timestamp,
              isFinal,
            };

            if (isFinal && existingIndex !== -1) {
              updated[existingIndex] = newEntry;
            } else if (!isFinal && existingIndex !== -1) {
              updated[existingIndex].text = message.transcript;
            } else {
              updated.push(newEntry);
            }

            return updated;
          });
        }

        if (
          message.type === "function-call" &&
          message.functionCall.name === "changeUrl"
        ) {
          const url = message.functionCall.parameters.url.toLowerCase();
          if (url) window.location.href = url;
        }
      });

      vapiInstance.on("error", (err: Error) => {
        console.error("Vapi error:", err);
      });
    }
  }, []);

  useEffect(() => {
    initializeVapi();
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async () => {
    if (!vapiRef.current) return;
    try {
      if (isSessionActive) {
        await vapiRef.current.stop();
      } else {
        const timestamp = new Date().toISOString();
        await vapiRef.current.start(assistantId, {
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en-US",
          },
          recordingEnabled: false,
          variableValues: {
            userId: userIdRef.current,
            timestamp,
            sessionId: `${userIdRef.current}-${timestamp}`,
          },
        });
      }
    } catch (e) {
      console.error("Call toggle error:", e);
    }
  };

  const say = (msg: string, endAfter = false) => {
    if (vapiRef.current) {
      vapiRef.current.say(msg, endAfter);
    }
  };

  const sendMessage = (role: string, content: string) => {
    if (vapiRef.current) {
      vapiRef.current.send({
        type: "add-message",
        message: { role, content },
      });
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      vapiRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  };

  return {
    volumeLevel,
    isSessionActive,
    conversation,
    toggleCall,
    say,
    sendMessage,
    toggleMute,
    isMuted,
    userId: userIdRef.current,
  };
};

export default useVapi;