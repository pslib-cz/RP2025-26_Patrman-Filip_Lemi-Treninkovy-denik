"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [iosShowGuide, setIosShowGuide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      if (sessionStorage.getItem("lemi_install_dismissed") === "true") {
        setIsDismissed(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  if (!isMounted || isDismissed) return null;

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    


  if (isStandalone) return null;
  if (!isIOS && !deferredPrompt) return null;


    const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setIsDismissed(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("lemi_install_dismissed", "true");
    setIsDismissed(true);
  };


    return (
    <div className="fixed top-0 left-0 right-0 z-[100] p-3">
      <div className="max-w-md mx-auto bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          <Image src="/Lemi-nobg.svg" alt="Lemi" width={32} height={32} />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground">
            Get the Lemi App
          </h3>
          <p className="text-xs text-muted-foreground leading-tight">
            {isIOS ? (
              <>
                Tap Share and &apos;Add to Home Screen&apos;
                <br />
                <button
                  onClick={() => setIosShowGuide(!iosShowGuide)}
                  className="text-primary font-bold mt-1 underline"
                >
                  Where to find it?
                </button>
              </>
            ) : (
              "Install for a better experience!"
            )}
          </p>
          {iosShowGuide && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Tap the{" "}
                <span className="font-bold text-foreground">Share icon</span>{" "}
                (or tap the{" "}
                <span className="font-bold text-foreground">three dots</span>{" "}
                first). Then scroll down and select{" "}
                <span className="font-bold text-foreground">
                  &apos;Add to Home Screen&apos;
                </span>
                .
              </p>
              <Image
                src="/shareguide.jpg"
                alt="Návod na přidání na plochu"
                width={300}
                height={500}
                className="rounded-xl w-full h-auto"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              Install
            </button>
          )}
          {isIOS && (
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
