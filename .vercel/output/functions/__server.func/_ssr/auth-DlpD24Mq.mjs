import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import "../_libs/firebase.mjs";
import { a as sendPasswordResetEmail, i as onAuthStateChanged, l as updatePassword, n as createUserWithEmailAndPassword, o as signInWithEmailAndPassword, s as signInWithPopup, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import { t as auth } from "./config-CbtXGA-s.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { j as LoaderCircle, tt as Bot } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DlpD24Mq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/auth.tsx?tsr-split=component";
function AuthPage() {
	const navigate = useNavigate();
	const router = useRouter();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [forgotOpen, setForgotOpen] = (0, import_react.useState)(false);
	const [resetEmail, setResetEmail] = (0, import_react.useState)("");
	const [recovery, setRecovery] = (0, import_react.useState)(false);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const isRecovery = typeof window !== "undefined" && (window.location.hash.includes("mode=resetPassword") || window.location.search.includes("mode=resetPassword") || window.location.hash.includes("type=recovery"));
		if (isRecovery) setRecovery(true);
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user && !isRecovery) navigate({
				to: "/dashboard",
				replace: true
			});
		});
		return () => {
			unsubscribe();
		};
	}, [navigate]);
	const handleForgot = async (e) => {
		e.preventDefault();
		const target = (resetEmail || email).toLowerCase().trim();
		if (!target) {
			toast.error("Veuillez saisir votre e-mail");
			return;
		}
		setLoading(true);
		try {
			await sendPasswordResetEmail(auth, target);
			toast.success("E-mail de réinitialisation envoyé. Vérifiez votre boîte de réception.");
			setForgotOpen(false);
		} catch (err) {
			toast.error(err?.message || "Erreur lors de l'envoi de l'e-mail");
		} finally {
			setLoading(false);
		}
	};
	const handleUpdatePassword = async (e) => {
		e.preventDefault();
		if (newPassword.length < 6) {
			toast.error("Le mot de passe doit contenir au moins 6 caractères");
			return;
		}
		setLoading(true);
		try {
			if (!auth.currentUser) throw new Error("Aucun utilisateur connecté");
			await updatePassword(auth.currentUser, newPassword);
			toast.success("Mot de passe mis à jour !");
			setRecovery(false);
			await router.invalidate();
			await navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (err) {
			toast.error(err?.message || "Erreur lors de la mise à jour du mot de passe");
		} finally {
			setLoading(false);
		}
	};
	const handleGoogle = async () => {
		setLoading(true);
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			toast.success("Connexion Google réussie !");
			await router.invalidate();
			await navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (err) {
			toast.error(err?.message || "Erreur lors de la connexion Google");
		} finally {
			setLoading(false);
		}
	};
	const handleEmail = async (e) => {
		e.preventDefault();
		if (!email.trim() || !password) {
			toast.error("Veuillez remplir votre e-mail et mot de passe");
			return;
		}
		setLoading(true);
		try {
			const normalizedEmail = email.toLowerCase().trim();
			if (mode === "signup") {
				await createUserWithEmailAndPassword(auth, normalizedEmail, password);
				toast.success("Compte Firebase créé avec succès !");
			} else {
				await signInWithEmailAndPassword(auth, normalizedEmail, password);
				toast.success("Connexion réussie !");
			}
			await router.invalidate();
			await navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (err) {
			toast.error(err?.message || "Erreur lors de la connexion");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-4",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-7 w-7" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-3xl font-bold gradient-text",
							children: "Assistante Virtuelle"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 128,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-muted-foreground mt-2 text-sm",
							children: "IA automatique pour Facebook Messenger & commentaires"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 124,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-6",
					children: recovery ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit: handleUpdatePassword,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "new-password",
							children: "Nouveau mot de passe"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "new-password",
							type: "password",
							required: true,
							minLength: 6,
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							placeholder: "••••••••"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 136,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "submit",
							className: "w-full bg-primary hover:bg-primary/90 font-semibold",
							disabled: loading,
							children: [loading && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 29
							}, this), "Enregistrer le nouveau mot de passe"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 140,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 135,
						columnNumber: 23
					}, this) : forgotOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
						onSubmit: handleForgot,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "reset-email",
								children: "Email du compte"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 146,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "reset-email",
								type: "email",
								required: true,
								value: resetEmail || email,
								onChange: (e) => setResetEmail(e.target.value),
								placeholder: "vous@example.com"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 147,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "submit",
								className: "w-full bg-primary hover:bg-primary/90 font-semibold",
								disabled: loading,
								children: [loading && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 150,
									columnNumber: 29
								}, this), "Envoyer le lien de réinitialisation"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 149,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => setForgotOpen(false),
								className: "w-full text-xs text-muted-foreground hover:text-foreground",
								children: "← Retour à la connexion"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 153,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 36
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2 mb-6 rounded-lg bg-muted p-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setMode("signin"),
								className: `flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === "signin" ? "bg-card text-foreground" : "text-muted-foreground"}`,
								children: "Connexion"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setMode("signup"),
								className: `flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === "signup" ? "bg-card text-foreground" : "text-muted-foreground"}`,
								children: "Inscription"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 157,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
							onSubmit: handleEmail,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "email",
									children: "Email"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 168,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "vous@example.com"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 169,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 167,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									htmlFor: "password",
									children: "Mot de passe"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 172,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									id: "password",
									type: "password",
									required: true,
									minLength: 4,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 171,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "submit",
									className: "w-full bg-primary hover:bg-primary/90 font-semibold",
									disabled: loading,
									children: [loading && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 176,
										columnNumber: 31
									}, this), mode === "signin" ? "Se connecter avec Email" : "Créer un compte Email"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 175,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 166,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "my-4 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 182,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs text-muted-foreground",
									children: "ou"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 183,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 184,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 181,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full font-semibold",
							disabled: loading,
							onClick: handleGoogle,
							children: [loading && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 29
							}, this), "Continuer avec Google"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 15
						}, this),
						mode === "signin" && /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => {
								setResetEmail(email);
								setForgotOpen(true);
							},
							className: "mt-4 w-full text-sm text-primary hover:underline",
							children: "Mot de passe oublié ?"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 194,
							columnNumber: 37
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 23
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-center text-xs text-muted-foreground mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "hover:text-foreground",
						children: "← Retour"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 205,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 204,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 123,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuthPage as component };
