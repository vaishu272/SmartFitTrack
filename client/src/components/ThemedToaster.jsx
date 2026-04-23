import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../store/theme";

export default function ThemedToaster() {
  const { isDark } = useTheme();
  const [toastBottom, setToastBottom] = useState(16);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setToastBottom(mq.matches ? 96 : 16);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <Toaster
      position="bottom-center"
      containerStyle={{
        bottom: toastBottom,
      }}
      toastOptions={{
        duration: 2800,
        style: isDark
          ? {
              background: "#171717",
              color: "#fafafa",
              border: "1px solid rgba(56, 189, 248, 0.35)",
            }
          : {
              background: "#ffffff",
              color: "#18181b",
              border: "1px solid rgba(14, 165, 233, 0.35)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            },
      }}
    />
  );
}
