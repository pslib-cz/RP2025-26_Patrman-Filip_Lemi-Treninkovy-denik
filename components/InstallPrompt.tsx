"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type BannerState =
  | { visible: false }
  | { visible: true; platform: "ios" | "android" };

export default function InstallPrompt() {
  const [banner, setBanner] = useState<BannerState>({ visible: false });
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isDismissed = sessionStorage.getItem("lemi_install_dismissed");

    if (isStandalone || isDismissed) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      setBanner({ visible: true, platform: "ios" });
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setBanner({ visible: true, platform: "android" });
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setBanner({ visible: false });
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("lemi_install_dismissed", "true");
    setBanner({ visible: false });
  };

  if (!banner.visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] p-3">
      <div className="max-w-md mx-auto bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <Image src="/Lemi-nobg.svg" alt="Lemi" width={32} height={32} />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground">Get the Lemi App</h3>
          <p className="text-xs text-muted-foreground leading-tight">
            {banner.platform === "ios"
              ? "Tap Share and 'Add to Home Screen'"
              : "Install for a better experience!"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {banner.platform === "android" && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              Install
            </button>
          )}
          {banner.platform === "ios" && (
            <Share className="w-5 h-5 text-primary" />
          )}
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
