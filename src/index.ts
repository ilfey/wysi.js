import { platform } from 'process';
import { join } from 'path';
import { OSError } from './errors';

export function getFilePath(): string { // TODO remove export

	let filename: string

	switch (platform) {
		case "linux": {
			filename = "linux";
			break;
		}
		case "darwin": {
			filename = "darwin";
			break;
		}
		case "win32": {
			filename = "win.exe";
			break;
		}
		default: {
			throw new OSError("Your OS is not supported. You can try to build the library for your OS.");
		}
	}

	return join(__dirname, "bin", filename);
}