/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
declare global {
	namespace App {
		export interface Locals {
			available_packages: string[];
			current_package: string;
		}
	}
}

export {};
