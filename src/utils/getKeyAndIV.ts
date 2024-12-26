import { type BinaryLike, pbkdf2Sync } from "node:crypto";

export const getKeyAndIV = (password: BinaryLike, salt: BinaryLike) => {
	const key = pbkdf2Sync(password, salt, 100000, 32, "sha256");
	const iv = pbkdf2Sync(password, salt, 100000, 16, "sha256");
	return { key, iv };
};
