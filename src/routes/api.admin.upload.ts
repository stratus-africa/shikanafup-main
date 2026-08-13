import { createAPIFileRoute } from "@tanstack/react-start/api";
import { json } from "@tanstack/react-start";
import fs from "fs";
import path from "path";

export const APIRoute = createAPIFileRoute("/api/admin/upload")({
  POST: async ({ request }) => {
    try {
      // Get auth header
      const authHeader = request.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return json({ error: "Unauthorized" }, { status: 401 });
      }

      const formData = await request.formData();
      const files = formData.getAll("files") as File[];

      if (!files.length) {
        return json({ error: "No files provided" }, { status: 400 });
      }

      const urls: string[] = [];
      const publicDir = path.join(process.cwd(), "public");

      // Ensure public directory exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Process each file
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .toLowerCase()}`;
        const filePath = path.join(publicDir, fileName);

        // Write file to public folder
        fs.writeFileSync(filePath, buffer);

        // Return relative URL
        urls.push(`/${fileName}`);
      }

      return json({ urls });
    } catch (error) {
      console.error("Upload error:", error);
      return json(
        { error: error instanceof Error ? error.message : "Failed to upload images" },
        { status: 500 }
      );
    }
  },
});
