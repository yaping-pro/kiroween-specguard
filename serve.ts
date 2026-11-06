import { serve } from "bun";
import { join } from "path";

const PORT = Number(process.env.PORT || 3000);

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;
    if (pathname === "/" || pathname === "") pathname = "/public/index.html";

    const filePath = join(import.meta.dir, pathname.replace(/^\//, ""));
    const file = Bun.file(filePath);

    if (await file.exists()) {
      let contentType = "text/plain";
      if (pathname.endsWith(".html")) contentType = "text/html";
      else if (pathname.endsWith(".ts")) contentType = "text/javascript";
      else if (pathname.endsWith(".js")) contentType = "text/javascript";
      else if (pathname.endsWith(".css")) contentType = "text/css";
      else if (pathname.endsWith(".json")) contentType = "application/json";

      return new Response(file, {
        headers: { "Content-Type": contentType }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
});

console.log(`SpecGuard Dashboard server listening on http://localhost:${PORT}`);
