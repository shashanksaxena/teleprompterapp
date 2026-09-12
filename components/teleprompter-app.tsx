"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";

import { AppHeader } from "@/components/app-header";
import { ControlBar } from "@/components/control-bar";
import { DownloadGateModal } from "@/components/download-gate-modal";
import { RecordingPanel } from "@/components/recording-panel";
import { RecordingStage } from "@/components/recording-stage";
import { SavedScriptsPanel } from "@/components/saved-scripts-panel";
import { ScriptEditor } from "@/components/script-editor";
import { SettingsPanel } from "@/components/settings-panel";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRecorder } from "@/hooks/use-recorder";
import { useSpeechScroll } from "@/hooks/use-speech-scroll";
import { useTeleprompter } from "@/hooks/use-teleprompter";
import { DEFAULT_SETTINGS, DEFAULT_SCRIPT, DEMO_SCRIPT, FREE_SCRIPT_LIMIT, STORAGE_KEYS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { AppSettings, SavedScript, UserPlan } from "@/lib/types";
import { createId, downloadBlob } from "@/lib/utils";

export function TeleprompterApp() {
  const { data: session, status } = useSession();
  const draftStore = useLocalStorage<string>(STORAGE_KEYS.draft, DEFAULT_SCRIPT);
  const settingsStore = useLocalStorage<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const [scriptTitle, setScriptTitle] = useState("Untitled Script");
  const [cloudScripts, setCloudScripts] = useState<SavedScript[]>([]);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [isStageMode, setIsStageMode] = useState(false);
  const [stageHasStarted, setStageHasStarted] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);
  const [pendingAudioDownload, setPendingAudioDownload] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const teleprompter = useTeleprompter({
    speed: settingsStore.value.speed
  });
  const recorder = useRecorder();

  const speech = useSpeechScroll({
    onAdvance: teleprompter.scrollByDelta
  });

  const activePlan: UserPlan = {
    isPremium: Boolean(session?.user?.isPremium || premiumUnlocked),
    name: session?.user?.isPremium || premiumUnlocked ? "Premium" : "Free"
  };

  const savedScripts = status === "authenticated" ? cloudScripts : [];
  const canSaveMore =
    status === "authenticated" && (activePlan.isPremium || savedScripts.length < FREE_SCRIPT_LIMIT);

  useEffect(() => {
    document.documentElement.dataset.theme = settingsStore.value.theme;
  }, [settingsStore.value.theme]);

  useEffect(() => {
    if (!isStageMode) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isStageMode]);

  useEffect(() => {
    const stopWhenLeaving = () => {
      if (document.visibilityState === "hidden" || !document.hasFocus()) {
        teleprompter.pause();
        recorder.stop();
      }
    };

    document.addEventListener("visibilitychange", stopWhenLeaving);
    window.addEventListener("pagehide", stopWhenLeaving);
    return () => {
      document.removeEventListener("visibilitychange", stopWhenLeaving);
      window.removeEventListener("pagehide", stopWhenLeaving);
    };
  }, [recorder.stop, teleprompter.pause]);

  useEffect(() => {
    if (status !== "authenticated") {
      setCloudScripts([]);
      return;
    }

    let cancelled = false;

    async function loadScripts() {
      const response = await fetch("/api/scripts", { cache: "no-store" });
      if (!response.ok || cancelled) {
        return;
      }

      const payload = (await response.json()) as {
        scripts: SavedScript[];
      };

      if (!cancelled) {
        setCloudScripts(payload.scripts);
      }
    }

    void loadScripts();

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "1" && status === "authenticated") {
      setDownloadModalOpen(true);
      params.delete("payment");
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
    if (params.get("payment") === "success" && status === "authenticated") {
      setPremiumUnlocked(true);
      setPendingDownload(true);
      params.delete("payment");
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, [status]);

  const handleSettingsChange = (patch: Partial<AppSettings>) => {
    if (patch.theme && patch.theme !== settingsStore.value.theme) {
      trackEvent("select_theme", {
        theme: patch.theme
      });
    }

    if (typeof patch.speed === "number" && patch.speed !== settingsStore.value.speed) {
      trackEvent("adjust_scroll_speed", {
        speed: patch.speed
      });
    }

    if (typeof patch.fontSize === "number" && patch.fontSize !== settingsStore.value.fontSize) {
      trackEvent("adjust_font_size", {
        font_size: patch.fontSize
      });
    }

    if (typeof patch.mirrorMode === "boolean" && patch.mirrorMode !== settingsStore.value.mirrorMode) {
      trackEvent("toggle_mirror_mode", {
        enabled: patch.mirrorMode
      });
    }

    if (typeof patch.mirrorCamera === "boolean" && patch.mirrorCamera !== settingsStore.value.mirrorCamera) {
      trackEvent("toggle_camera_mirror", {
        enabled: patch.mirrorCamera
      });
    }

    if (typeof patch.isFullscreen === "boolean" && patch.isFullscreen !== settingsStore.value.isFullscreen) {
      trackEvent("toggle_fullscreen", {
        enabled: patch.isFullscreen
      });
    }

    settingsStore.setValue({
      ...settingsStore.value,
      ...patch
    });
  };

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<AppSettings["theme"]>).detail;
      if (nextTheme === "light" || nextTheme === "dark") {
        handleSettingsChange({ theme: nextTheme });
      }
    };

    window.addEventListener("teleprompter:theme-change", handleThemeChange);
    return () => window.removeEventListener("teleprompter:theme-change", handleThemeChange);
  }, [handleSettingsChange]);

  const handleSaveScript = () => {
    const content = draftStore.value.trim();
    if (!content) {
      return;
    }

    if (status !== "authenticated") {
      void signIn("google");
      trackEvent("blocked_save_script", {
        reason: "unauthenticated"
      });
      return;
    }

    if (!canSaveMore) {
      return;
    }

    const titleLine = content.split("\n").find((line) => line.trim().length > 0)?.slice(0, 36) || scriptTitle;

    const nextScript: SavedScript = {
      id: createId(),
      title: titleLine,
      content,
      updatedAt: new Date().toISOString()
    };

    void (async () => {
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nextScript)
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { script: SavedScript };
      setCloudScripts((current) => [payload.script, ...current.filter((script) => script.id !== payload.script.id)]);
    })();
    trackEvent("save_script", {
      save_location: "cloud",
      script_length: content.length
    });
    trackEvent("script_created", {
      script_length: content.length
    });
    setScriptTitle(titleLine);
  };

  const handleDeleteScript = (scriptId: string) => {
    trackEvent("delete_script", {
      save_location: status === "authenticated" ? "cloud" : "local"
    });

    if (status === "authenticated") {
      void fetch(`/api/scripts/${scriptId}`, {
        method: "DELETE"
      }).then(() => {
        setCloudScripts((current) => current.filter((script) => script.id !== scriptId));
      });
    }
  };

  const handleLoadScript = (script: SavedScript) => {
    draftStore.setValue(script.content);
    setScriptTitle(script.title);
    teleprompter.restart();
    trackEvent("load_script", {
      title: script.title
    });
  };

  const handleClearScript = () => {
    draftStore.setValue("");
    setScriptTitle("Untitled Script");
    teleprompter.restart();
    trackEvent("clear_script");
  };

  const handleLoadDemoScript = () => {
    draftStore.setValue(DEMO_SCRIPT);
    setScriptTitle("Welcome Demo");
    teleprompter.restart();
    trackEvent("load_demo_script");
  };

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      handleSettingsChange({ isFullscreen: true });
      return;
    }

    await document.exitFullscreen();
    handleSettingsChange({ isFullscreen: false });
  };

  useEffect(() => {
    const syncFullscreen = () => {
      settingsStore.setValue((current) => ({
        ...current,
        isFullscreen: Boolean(document.fullscreenElement)
      }));
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, [settingsStore.setValue]);

  const exitStage = async () => {
    setStageHasStarted(false);
    setIsStageMode(false);
  };

  const handleTogglePlayback = async () => {
    if (teleprompter.isPlaying) {
      teleprompter.pause();
      recorder.pause();
      trackEvent("pause_teleprompter", {
        progress_percent: Math.round(teleprompter.progress * 100)
      });
      return;
    }

    if (!isStageMode) {
      const started = await recorder.start(false);
      if (!started) {
        return;
      }

      teleprompter.restart();
      teleprompter.measure();
      setStageHasStarted(true);
      setIsStageMode(true);
      trackEvent("recording_started", {
        camera: true
      });
      return;
    }

    if (!recorder.isRecording) {
      const restarted = await recorder.start(true);
      if (!restarted) {
        return;
      }
    }

    recorder.resume();
    setStageHasStarted(true);
    teleprompter.measure();
    teleprompter.play();
    trackEvent("play_teleprompter", {
      speed: settingsStore.value.speed,
      font_size: settingsStore.value.fontSize,
      mirror_mode: settingsStore.value.mirrorMode
    });
  };

  const handleStop = async () => {
    teleprompter.restart();
    recorder.stop();
    await exitStage();
    requestAnimationFrame(() => {
      document.getElementById("recording-preview")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
    trackEvent("stop_teleprompter");
  };

  const handleRestart = () => {
    teleprompter.restart();
    setStageHasStarted(false);
    trackEvent("restart_teleprompter");
  };

  const authorizeDownload = async () => {
    setDownloadError(null);

    if (status !== "authenticated") {
      setDownloadModalOpen(true);
      return false;
    }

    try {
      const response = await fetch("/api/download/authorize", { method: "POST" });
      if (response.ok) {
        return true;
      }

      if (response.status === 402) {
        setDownloadModalOpen(true);
        trackEvent("open_download_paywall", {
          authenticated: true
        });
        trackEvent("free_download_limit_reached");
      } else {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setDownloadError(payload?.error || "Download authorization failed. Please sign in again and retry.");
      }
    } catch {
      setDownloadError("Download authorization could not reach the server. Please retry.");
    }

    return false;
  };

  const handleDownload = async () => {
    if (!recorder.recordingBlob && recorder.isRecording) {
      setPendingDownload(true);
      recorder.stop();
      void exitStage();
      trackEvent("prepare_download_after_recording");
      return;
    }

    if (!recorder.recordingBlob) {
      return;
    }

    if (!(await authorizeDownload())) {
      return;
    }

    const extension = recorder.recordingBlob.type.includes("mp4") ? "mp4" : "webm";
    downloadBlob(recorder.recordingBlob, `freeteleprompter-reel-${Date.now()}.${extension}`);
    trackEvent("download_reel", {
      plan: activePlan.name.toLowerCase()
    });
    trackEvent("video_downloaded", {
      plan: activePlan.name.toLowerCase()
    });
  };

  const handleDownloadAudio = async () => {
    if (!recorder.audioBlob) {
      return;
    }

    if (status !== "authenticated") {
      setPendingAudioDownload(true);
      setDownloadModalOpen(true);
      return;
    }

    if (!(await authorizeDownload())) {
      setPendingAudioDownload(true);
      return;
    }

    downloadBlob(recorder.audioBlob, `freeteleprompter-camera-off-${Date.now()}.mp3`);
    setPendingAudioDownload(false);
    trackEvent("download_audio_track", {
      plan: activePlan.name.toLowerCase()
    });
  };

  useEffect(() => {
    if (!pendingDownload || !recorder.recordingBlob) {
      return;
    }

    setPendingDownload(false);
    void handleDownload();
  }, [pendingDownload, recorder.recordingBlob]);

  const handleToggleVoice = () => {
    speech.toggle();
    if (!speech.enabled && speech.supported) {
      trackEvent("voice_scroll_started");
    }
    trackEvent("toggle_voice_scroll", {
      supported: speech.supported,
      enabled: !speech.enabled
    });
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        void handleTogglePlayback();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleTogglePlayback]);

  const metrics = useMemo(
    () => ({
      isPlaying: teleprompter.isPlaying,
      progress: teleprompter.progress,
      voiceChecking: speech.checking,
      voiceSupported: speech.supported,
      voiceEnabled: speech.enabled,
      voiceListening: speech.listening,
      voiceError: speech.error,
      isRecording: recorder.isRecording,
      recorderSupported: recorder.isSupported,
      recorderError: recorder.error
    }),
    [
      recorder.error,
      recorder.isRecording,
      recorder.isSupported,
      speech.enabled,
      speech.error,
      speech.checking,
      speech.listening,
      speech.supported,
      teleprompter.isPlaying,
      teleprompter.progress
    ]
  );

  return (
    <main className="mx-auto flex min-h-screen w-full min-w-0 max-w-[1180px] flex-col gap-5 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
      {isStageMode ? (
        <RecordingStage
          stageRef={stageRef}
          viewportRef={teleprompter.viewportRef}
          contentRef={teleprompter.contentRef}
          liveStream={recorder.liveStream}
          recordingUrl={recorder.recordingUrl}
          script={draftStore.value}
          fontSize={settingsStore.value.fontSize}
          mirrorMode={settingsStore.value.mirrorMode}
          mirrorCamera={settingsStore.value.mirrorCamera}
          speed={settingsStore.value.speed}
          hasStarted={stageHasStarted}
          isRecording={recorder.isRecording}
          elapsedSeconds={recorder.elapsedSeconds}
          offset={teleprompter.offset}
          metrics={metrics}
          onReady={() => {
            requestAnimationFrame(() => {
              teleprompter.measure();
            });
          }}
          onSpeedChange={(speed) => handleSettingsChange({ speed })}
          onToggleMirrorMode={() =>
            handleSettingsChange({
              mirrorMode: !settingsStore.value.mirrorMode
            })
          }
          onToggleMirrorCamera={() =>
            handleSettingsChange({
              mirrorCamera: !settingsStore.value.mirrorCamera
            })
          }
          onRestart={handleRestart}
          onTogglePlay={handleTogglePlayback}
          onTogglePreview={() => {
            teleprompter.restart();
            teleprompter.measure();
            setStageHasStarted(false);
          }}
          onScriptChange={(value) => draftStore.setValue(value)}
          onStop={handleStop}
          onToggleVoice={handleToggleVoice}
          onDownload={handleDownload}
          canDownload={Boolean(recorder.recordingBlob) || recorder.isRecording}
        />
      ) : null}

      <AppHeader plan={activePlan} compact />

      <div id="app-tools" className="space-y-5">
        {downloadError ? (
          <div className="rounded-[12px] border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            {downloadError}
          </div>
        ) : null}
        {!isStageMode ? (
          <section className="glass-panel min-w-0 overflow-hidden rounded-[18px] p-4 md:p-5">
            <ScriptEditor
              script={draftStore.value}
              onScriptChange={draftStore.setValue}
              onSaveScript={handleSaveScript}
              saveDisabled={!draftStore.value.trim() || (status === "authenticated" && !canSaveMore)}
              saveLabel={status === "authenticated" ? "Save script" : "Sign in to save"}
              onClearScript={handleClearScript}
              onLoadDemoScript={handleLoadDemoScript}
            />

            <div className="mt-3 min-w-0">
              <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr]">
                  <ControlBar
                    embedded
                    className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-2.5"
                    metrics={metrics}
                    onTogglePlay={handleTogglePlayback}
                    onStop={handleStop}
                    onRestart={handleRestart}
                    onToggleVoice={handleToggleVoice}
                    onDownload={handleDownload}
                    canDownload={Boolean(recorder.recordingBlob) || recorder.isRecording}
                  />

                  <SettingsPanel
                    embedded
                    settings={settingsStore.value}
                    onSettingsChange={handleSettingsChange}
                    onToggleFullscreen={handleToggleFullscreen}
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <SavedScriptsPanel
            isAuthenticated={status === "authenticated"}
            scripts={savedScripts}
            plan={activePlan}
            onLoadScript={handleLoadScript}
            onDeleteScript={handleDeleteScript}
          />

          <RecordingPanel
            id="recording-preview"
            liveStream={recorder.liveStream}
            recordingUrl={recorder.recordingUrl}
            audioUrl={recorder.audioUrl}
            isRecording={recorder.isRecording}
            recordingDurationSeconds={recorder.recordingDurationSeconds}
            isPremium={activePlan.isPremium}
            onDownload={handleDownload}
            onDownloadAudio={handleDownloadAudio}
          />
        </div>
      </div>

      <footer className="glass-panel rounded-[18px] p-4 md:p-5">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <p className="section-kicker">About the product</p>
            <h2 className="mt-2 text-base font-semibold">Online teleprompter for reels, YouTube videos and presentations</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              FreeTeleprompter.in is a browser-based teleprompter that helps creators, teachers, founders, and video
              teams read scripts smoothly while recording from desktop or mobile. Paste a script, adjust speed, mirror
              the text for teleprompter glass, and record a take without switching tools.
            </p>
          </div>
          <div>
            <p className="section-kicker">Best for</p>
            <h2 className="mt-2 text-base font-semibold">Built for fast recording and repeat workflows</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Use it for talking-head content, product demos, classes, practice sessions, marketing videos, and
              creator workflows where reading naturally on camera matters.
            </p>
          </div>
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <p className="section-kicker">Quick flow</p>
            <h3 className="mt-2 text-sm font-semibold">How it works</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Paste your script, choose light or dark mode, set the scrolling speed, and tap play to open the camera
              stage before starting the teleprompter.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="section-kicker">FAQ</p>
            <h2 className="mt-2 text-base font-semibold">Frequently asked questions</h2>
            <div className="mt-3 space-y-3 text-sm text-[var(--text-soft)]">
              <div>
                <h3 className="font-semibold text-[var(--text)]">Can I use this teleprompter on mobile?</h3>
                <p className="mt-1">
                  Yes. The interface is designed for mobile-first recording sessions with sticky controls and a full
                  screen camera stage.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">Does it support mirror mode?</h3>
                <p className="mt-1">
                  Yes. You can mirror the script for teleprompter glass and mirror the camera preview separately on the
                  recording stage.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">Can I save my scripts?</h3>
                <p className="mt-1">
                  Yes. Signed-in users can save scripts to their account, and premium users are prepared for unlimited
                  saved scripts with ad-free usage.
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="section-kicker">Why it stands out</p>
            <h2 className="mt-2 text-base font-semibold">Why FreeTeleprompter.in stands out</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Unlike a basic cue prompter demo, this teleprompter is structured for real usage with Google auth,
              account-based saved scripts, recording, and a clear download plan for creators who want a dependable
              browser-based recording workflow.
            </p>
            <p className="mt-4 text-sm text-[var(--text-soft)]">
              Built for young creators, educators, founders, coaches, teachers, and marketers who want a clean tool
              that works fast on desktop and mobile.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="section-kicker">Editorial notes</p>
            <h2 className="mt-2 text-base font-semibold">Maintained as a practical recording workspace</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              This site is maintained to help people write, practice, and record better on-camera scripts. We keep the
              teleprompter fast, document how it works, and explain features such as mirror mode, saved scripts, voice
              scroll, and recording behavior before users rely on it in a live workflow.
            </p>
          </div>
          <div>
            <p className="section-kicker">Site links</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
              <Link href="/how-to-use" className="underline-offset-4 hover:underline">
                How to use
              </Link>
              <Link href="/free-online-teleprompter" className="underline-offset-4 hover:underline">
                Free online teleprompter
              </Link>
              <Link href="/ai-teleprompter" className="underline-offset-4 hover:underline">
                AI teleprompter
              </Link>
              <Link href="/teleprompter-app" className="underline-offset-4 hover:underline">
                Teleprompter app
              </Link>
              <Link href="/video-teleprompter" className="underline-offset-4 hover:underline">
                Video teleprompter
              </Link>
              <Link href="/browser-teleprompter" className="underline-offset-4 hover:underline">
                Browser teleprompter
              </Link>
              <Link href="/automatic-teleprompter" className="underline-offset-4 hover:underline">
                Automatic teleprompter
              </Link>
              <Link href="/articles" className="underline-offset-4 hover:underline">
                Articles
              </Link>
              <Link href="/about" className="underline-offset-4 hover:underline">
                About
              </Link>
              <Link href="/contact" className="underline-offset-4 hover:underline">
                Contact
              </Link>
              <Link href="/privacy" className="underline-offset-4 hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="underline-offset-4 hover:underline">
                Terms
              </Link>
              <Link href="/teleprompter-for-reels" className="underline-offset-4 hover:underline">
                Reels guide
              </Link>
              <Link href="/teleprompter-for-instagram-reels" className="underline-offset-4 hover:underline">
                Instagram reels
              </Link>
              <Link href="/teleprompter-for-youtube" className="underline-offset-4 hover:underline">
                YouTube guide
              </Link>
              <Link href="/teleprompter-for-online-teaching" className="underline-offset-4 hover:underline">
                Online teaching
              </Link>
              <Link href="/mirror-mode-teleprompter" className="underline-offset-4 hover:underline">
                Mirror mode
              </Link>
              <Link href="/voice-scroll-teleprompter" className="underline-offset-4 hover:underline">
                Voice scroll
              </Link>
              <Link href="/teleprompter-tips" className="underline-offset-4 hover:underline">
                Teleprompter tips
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <DownloadGateModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        onDownload={handleDownload}
        recordingReady={Boolean(recorder.recordingBlob)}
        onSubscriptionActivated={() => {
          setPremiumUnlocked(true);
          setDownloadModalOpen(false);
          if (pendingAudioDownload) {
            void handleDownloadAudio();
          }
          trackEvent("activate_premium_subscription", {
            source: "upi_confirmation"
          });
        }}
      />
    </main>
  );
}
