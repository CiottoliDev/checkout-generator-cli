import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

export function buildNewFileName(path: string, nameToAdd: string): string {
	if (!path) throw "Errore! Il path richiesto non esiste.";

	let filename = basename(path, ".csv");
	filename = `${filename} ${nameToAdd}.csv`;

	const dir = dirname(path);
	const newPath = join(dir, filename);

	if (existsSync(newPath)) {
		return buildNewFileName(newPath, nameToAdd);
	}

	return newPath;
}

export function readMap(path: string) {
	return readFileSync(path, { encoding: "utf-8" });
}

export function readCsv(path: string) {
	return readFileSync(path, { encoding: "utf-8" });
}

export async function writeCsv(content: string, path: string) {
	return writeFileSync(path, content);
}
