import "./whatsapp.worker";

console.log("[workers] started — agents online 24/7");

function shutdown(signal: string): void {
  console.log(`[workers] received ${signal}, shutting down`);
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
