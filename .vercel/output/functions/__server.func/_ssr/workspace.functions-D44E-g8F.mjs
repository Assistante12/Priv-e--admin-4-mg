import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BGPqiCXF.mjs";
import { t as createSsrRpc } from "./createSsrRpc-6Bh1AQeg.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace.functions-D44E-g8F.js
/** Liste (avec recherche + pagination) des workspaces accessibles au compte. */
var listWorkspaces = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	search: stringType().max(120).optional(),
	limit: numberType().int().min(1).max(100).optional(),
	offset: numberType().int().min(0).optional()
}).parse(d ?? {})).handler(createSsrRpc("095b6437ed3d46ebaa6b6b39fdd5999d3f0a0aa23855f81bc0462589a2f44f79"));
/** Manondro raha ity kaonty ity no kaonty foibe (admin) — ampiasain'ny menu. */
var getWorkspaceAccess = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("55c70ed2a1bb2110bea0e0d3e4e7b032555a10c0f442f3aad1da31e755b10b21"));
var createWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().trim().min(1).max(80),
	email: stringType().trim().email().max(160),
	password: stringType().min(6).max(200)
}).parse(d)).handler(createSsrRpc("744b6be0a8526d2232e099596abc01cd200195c5b263342ffdad45ca40c4d37d"));
/** Manamarina ny mot de passe an'ny workspace dia mamadika ny workspace mavitrika. */
var unlockWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	password: stringType().min(1).max(200)
}).parse(d)).handler(createSsrRpc("b1210d9098378b1f0d6e15450419b1f306257d88168cd5ba8e6ea95cf6d44297"));
/** "Mot de passe oublié" : ny tompon'ny workspace afaka mamerina mot de passe vaovao. */
var resetWorkspacePassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	email: stringType().trim().email().max(160),
	new_password: stringType().min(6).max(200)
}).parse(d)).handler(createSsrRpc("958d450de5ff86fd27160e5f846f99500d27f1037c20002fe121e01fe947364e"));
var switchWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("7bdf26987ed3e55771579c731ccfe1d76586780ba65644698a45f4f777e085ea"));
var renameWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	name: stringType().trim().min(1).max(80)
}).parse(d)).handler(createSsrRpc("b5e84fec666cd2831592eea985291bfa7fa56c8690bbe5aabf157eddbf425261"));
var deleteWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("84f6237ee7a4389bfd3d9596a4a7980368f4e83bdae80dad74e0027555a07dca"));
/**
* Fidirana amin'ny workspace amin'ny alalan'ny Email + Mot de passe.
* Tsy mila mahita ny lisitry ny workspace hafa ny mpampiasa: ampy ny mari-pamantarana.
*/
var unlockWorkspaceByEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().trim().email().max(160),
	password: stringType().min(1).max(200)
}).parse(d)).handler(createSsrRpc("c74f0594f7f044233a3b6b96fbd193b3c7348d55356d196254980d7826a96194"));
//#endregion
export { renameWorkspace as a, unlockWorkspace as c, listWorkspaces as i, unlockWorkspaceByEmail as l, deleteWorkspace as n, resetWorkspacePassword as o, getWorkspaceAccess as r, switchWorkspace as s, createWorkspace as t };
