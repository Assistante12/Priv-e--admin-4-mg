import { n as supabaseAdmin } from "./client.server-D9Q5-j_o.mjs";
import fs from "fs";
import path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-helper.server-BlDDvwDn.js
var APP_URL = process.env.APP_URL || process.env.PUBLIC_URL || "https://ais-dev-i7b5jeeh6qqkeyb3nv4dw4-469517843202.europe-west2.run.app";
/**
* Ensures bucket exists in Supabase Storage with public access enabled.
*/
async function ensureSupabaseBucket(supabaseUrl, supabaseKey, bucketName) {
	try {
		const listRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, { headers: {
			Authorization: `Bearer ${supabaseKey}`,
			apikey: supabaseKey
		} });
		if (listRes.ok) {
			if (!(await listRes.json()).some((b) => b.name === bucketName || b.id === bucketName)) await fetch(`${supabaseUrl}/storage/v1/bucket`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${supabaseKey}`,
					apikey: supabaseKey,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: bucketName,
					name: bucketName,
					public: true,
					file_size_limit: 104857600
				})
			});
		}
	} catch (e) {
		console.warn(`[ensureSupabaseBucket] check/create warning for ${bucketName}:`, e);
	}
}
/**
* Uploads a file (image, video, PDF) to Supabase Storage and returns the permanent public URL.
* Falls back to local public disk storage if Supabase is not connected.
*/
async function uploadMediaFile({ userId, bucket, fileName, contentType, buffer, folder }) {
	const safeName = fileName.replace(/[^\w.-]/g, "_");
	const uniqueKey = `${userId}/${folder ? `${folder}/` : ""}${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;
	let sbUrl = null;
	let sbKey = null;
	try {
		const { data: conn } = await supabaseAdmin.from("supabase_oauth_connections").select("selected_project_url,access_token,projects").eq("user_id", userId).maybeSingle();
		if (conn?.selected_project_url) {
			const projUrl = conn.selected_project_url.replace(/\/$/, "");
			const proj = conn.projects?.find((p) => (p.project_url ?? "").replace(/\/$/, "") === projUrl);
			if (proj?.service_role_key || proj?.anon_key) {
				sbUrl = projUrl;
				sbKey = (proj.service_role_key || proj.anon_key).trim();
			}
		}
		if (!sbUrl || !sbKey) {
			const { data: settings } = await supabaseAdmin.from("settings").select("supabase_project_url,supabase_anon_key,supabase_connected").eq("user_id", userId).maybeSingle();
			if (settings?.supabase_project_url && settings?.supabase_anon_key) {
				sbUrl = settings.supabase_project_url.replace(/\/$/, "");
				sbKey = settings.supabase_anon_key.trim();
			}
		}
	} catch (e) {
		console.warn("[uploadMediaFile] settings lookup error:", e);
	}
	if (sbUrl && sbKey) try {
		await ensureSupabaseBucket(sbUrl, sbKey, bucket);
		const uploadEndpoint = `${sbUrl}/storage/v1/object/${bucket}/${encodeURIComponent(uniqueKey)}`;
		const res = await fetch(uploadEndpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${sbKey}`,
				apikey: sbKey,
				"Content-Type": contentType || "application/octet-stream",
				"x-upsert": "true"
			},
			body: buffer
		});
		if (res.ok) return `${sbUrl}/storage/v1/object/public/${bucket}/${uniqueKey}`;
		else {
			const errTxt = await res.text();
			console.warn(`[uploadMediaFile] Supabase Storage upload failed (${res.status}): ${errTxt}`);
		}
	} catch (sbErr) {
		console.warn("[uploadMediaFile] Supabase Storage network error:", sbErr);
	}
	try {
		const uploadDir = path.join(process.cwd(), "public", "uploads");
		if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
		const localFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;
		const localFilePath = path.join(uploadDir, localFileName);
		fs.writeFileSync(localFilePath, buffer);
		return `${APP_URL}/uploads/${localFileName}`;
	} catch (fsErr) {
		console.error("[uploadMediaFile] Local filesystem write error:", fsErr);
		return `data:${contentType};base64,${buffer.toString("base64")}`;
	}
}
//#endregion
export { uploadMediaFile as t };
