# Changelog

## Release (2025-06-06)

* @sheepdog/svelte 0.12.7 (patch)

#### :memo: Documentation
* [#288](https://github.com/mainmatter/sheepdog/pull/288) docs: docs for multiple packages ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* Other
  * [#323](https://github.com/mainmatter/sheepdog/pull/323) fix publishing for legacy version ([@mansona](https://github.com/mansona))
  * [#316](https://github.com/mainmatter/sheepdog/pull/316) fix: allow breaking as `label` ([@paoloricciuti](https://github.com/paoloricciuti))
* `@sheepdog/svelte`
  * [#322](https://github.com/mainmatter/sheepdog/pull/322) Prepare Release (legacy) ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#321](https://github.com/mainmatter/sheepdog/pull/321) chore: setup release plan to publish to `legacy` ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 3
- Chris Manson ([@mansona](https://github.com/mansona))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))
- [@github-actions[bot]](https://github.com/apps/github-actions)

## Release (2025-06-06)

* @sheepdog/svelte 0.12.6 (patch)

#### :memo: Documentation
* [#288](https://github.com/mainmatter/sheepdog/pull/288) docs: docs for multiple packages ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#321](https://github.com/mainmatter/sheepdog/pull/321) chore: setup release plan to publish to `legacy` ([@paoloricciuti](https://github.com/paoloricciuti))
* Other
  * [#316](https://github.com/mainmatter/sheepdog/pull/316) fix: allow breaking as `label` ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2025-05-23)

* @sheepdog/core 0.2.2 (patch)

#### :bug: Bug Fix
* `@sheepdog/core`
  * [#314](https://github.com/mainmatter/sheepdog/pull/314) fix: better types for optional arguments ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* [#303](https://github.com/mainmatter/sheepdog/pull/303) chore: add require label workflow ([@paoloricciuti](https://github.com/paoloricciuti))
* [#297](https://github.com/mainmatter/sheepdog/pull/297) fix: use spaces in `package.json`'s ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2025-03-21)

* @sheepdog/core 0.2.1 (patch)
* @sheepdog/svelte 0.12.5 (patch)

#### :bug: Bug Fix
* `@sheepdog/core`, `@sheepdog/svelte`
  * [#295](https://github.com/mainmatter/sheepdog/pull/295) fix: update all the imports ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2025-03-21)

* @sheepdog/core 0.2.0 (minor)
* @sheepdog/svelte 0.12.4 (patch)
* @sheepdog/vanilla 0.1.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/core`, `@sheepdog/vanilla`
  * [#253](https://github.com/mainmatter/sheepdog/pull/253) feat: init `@sheepdog/vanilla` ([@paoloricciuti](https://github.com/paoloricciuti))

#### :bug: Bug Fix
* `@sheepdog/vanilla`
  * [#294](https://github.com/mainmatter/sheepdog/pull/294) fix: utils import for vanilla ([@paoloricciuti](https://github.com/paoloricciuti))

#### :memo: Documentation
* [#285](https://github.com/mainmatter/sheepdog/pull/285) docs: update starlight components to use `Astro.locals.starlightRoute` ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* Other
  * [#293](https://github.com/mainmatter/sheepdog/pull/293) Attempt to fix split renovate config ([@nickschot](https://github.com/nickschot))
* `@sheepdog/svelte`, `@sheepdog/vanilla`
  * [#284](https://github.com/mainmatter/sheepdog/pull/284) chore: allow for better treeshake in esbuild/rolldown ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 2
- Nick Schot ([@nickschot](https://github.com/nickschot))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2025-02-14)

@sheepdog/core 0.1.1 (patch)
@sheepdog/svelte 0.12.3 (patch)

#### :bug: Bug Fix
* `@sheepdog/docs`, `@sheepdog/core`, `@sheepdog/svelte`
  * [#273](https://github.com/mainmatter/sheepdog/pull/273) fix: don't call the function if the task has been canceled before starting ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#276](https://github.com/mainmatter/sheepdog/pull/276) chore: change workspace dep ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2025-02-07)

@sheepdog/core 0.1.0 (minor)
@sheepdog/svelte 0.12.2 (patch)

#### :rocket: Enhancement
* `@sheepdog/core`
  * [#270](https://github.com/mainmatter/sheepdog/pull/270) feat: generalize async transform ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#271](https://github.com/mainmatter/sheepdog/pull/271) fix: generalize async transform for `@sheepdog/svelte` ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#251](https://github.com/mainmatter/sheepdog/pull/251) Remove stderr.log & add to gitignore ([@nickschot](https://github.com/nickschot))
* Other
  * [#269](https://github.com/mainmatter/sheepdog/pull/269) build(deps): update dependency @gravityci/cli to v0.0.8 ([@oscard0m](https://github.com/oscard0m))
  * [#252](https://github.com/mainmatter/sheepdog/pull/252) Config renovate to create separate group for docs app updates ([@nickschot](https://github.com/nickschot))
  * [#249](https://github.com/mainmatter/sheepdog/pull/249) add bug issue template ([@beerinho](https://github.com/beerinho))
* `@sheepdog/core`, `@sheepdog/svelte`
  * [#264](https://github.com/mainmatter/sheepdog/pull/264) chore: move tests to `core` and restructure monorepo a bit ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 4
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Nick Schot ([@nickschot](https://github.com/nickschot))
- Oscar Dominguez ([@oscard0m](https://github.com/oscard0m))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-12-06)

@sheepdog/core 0.0.2 (patch)
@sheepdog/svelte 0.12.1 (patch)

#### :bug: Bug Fix
* `@sheepdog/core`
  * [#246](https://github.com/mainmatter/sheepdog/pull/246) Improve error handling of the async transform ([@beerinho](https://github.com/beerinho))

#### :memo: Documentation
* `@sheepdog/docs`
  * [#235](https://github.com/mainmatter/sheepdog/pull/235) Docs: Various fixes in "Mid run cancellation" section ([@brunnerh](https://github.com/brunnerh))

#### :house: Internal
* Other
  * [#245](https://github.com/mainmatter/sheepdog/pull/245) update release-plan ([@mansona](https://github.com/mansona))
* `@sheepdog/docs`
  * [#235](https://github.com/mainmatter/sheepdog/pull/235) Docs: Various fixes in "Mid run cancellation" section ([@brunnerh](https://github.com/brunnerh))
* `@sheepdog/core`, `@sheepdog/svelte`
  * [#231](https://github.com/mainmatter/sheepdog/pull/231) chore: restructure monorepo ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 4
- Chris Manson ([@mansona](https://github.com/mansona))
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))
- [@brunnerh](https://github.com/brunnerh)

## Release (2024-11-08)

@sheepdog/svelte 0.12.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/docs`, `@sheepdog/svelte`
  * [#222](https://github.com/mainmatter/sheepdog/pull/222) feat: add `transform` function to annotate a function to be transformed by the vite plugin ([@paoloricciuti](https://github.com/paoloricciuti))

#### :memo: Documentation
* `@sheepdog/docs`, `@sheepdog/svelte`
  * [#222](https://github.com/mainmatter/sheepdog/pull/222) feat: add `transform` function to annotate a function to be transformed by the vite plugin ([@paoloricciuti](https://github.com/paoloricciuti))
* `@sheepdog/docs`
  * [#223](https://github.com/mainmatter/sheepdog/pull/223) chore: add plausible analytics ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#219](https://github.com/mainmatter/sheepdog/pull/219) woof ([@beerinho](https://github.com/beerinho))
  * [#218](https://github.com/mainmatter/sheepdog/pull/218) Update homepage copy ([@beerinho](https://github.com/beerinho))
  * [#206](https://github.com/mainmatter/sheepdog/pull/206) Fix logo size issue ([@nickschot](https://github.com/nickschot))
  * [#200](https://github.com/mainmatter/sheepdog/pull/200) Update example code snippets to be closer to actual demo ([@nickschot](https://github.com/nickschot))
  * [#205](https://github.com/mainmatter/sheepdog/pull/205) Various style fixes to the timeline ([@nickschot](https://github.com/nickschot))
  * [#203](https://github.com/mainmatter/sheepdog/pull/203) Add copyright to footer ([@nickschot](https://github.com/nickschot))
  * [#201](https://github.com/mainmatter/sheepdog/pull/201) Fix dark mode get started button appearing with the wrong colors ([@nickschot](https://github.com/nickschot))
* Other
  * [#204](https://github.com/mainmatter/sheepdog/pull/204) Improve readme ([@marcoow](https://github.com/marcoow))

#### :house: Internal
* `@sheepdog/docs`
  * [#223](https://github.com/mainmatter/sheepdog/pull/223) chore: add plausible analytics ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#202](https://github.com/mainmatter/sheepdog/pull/202) Add netlify redirects ([@beerinho](https://github.com/beerinho))
* `@sheepdog/svelte`
  * [#221](https://github.com/mainmatter/sheepdog/pull/221) chore: setup `pkg.pr.new` ([@paoloricciuti](https://github.com/paoloricciuti))
* Other
  * [#213](https://github.com/mainmatter/sheepdog/pull/213) enable gravity again ([@marcoow](https://github.com/marcoow))
  * [#210](https://github.com/mainmatter/sheepdog/pull/210) add wildcard redirects ([@beerinho](https://github.com/beerinho))
  * [#207](https://github.com/mainmatter/sheepdog/pull/207) Move netlify.toml to root folder ([@beerinho](https://github.com/beerinho))
  * [#208](https://github.com/mainmatter/sheepdog/pull/208) add LICENSE ([@marcoow](https://github.com/marcoow))

#### Committers: 4
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Marco Otte-Witte ([@marcoow](https://github.com/marcoow))
- Nick Schot ([@nickschot](https://github.com/nickschot))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-10-11)

@sheepdog/svelte 0.11.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#195](https://github.com/mainmatter/sheepdog/pull/195) feat: add utils export ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-10-11)

@sheepdog/svelte 0.10.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#185](https://github.com/mainmatter/sheepdog/pull/185) fix: way better async transform ([@paoloricciuti](https://github.com/paoloricciuti))

#### :bug: Bug Fix
* `@sheepdog/docs`, `@sheepdog/svelte`
  * [#192](https://github.com/mainmatter/sheepdog/pull/192) fix: properly threeshake the library ([@paoloricciuti](https://github.com/paoloricciuti))

#### :memo: Documentation
* `@sheepdog/docs`
  * [#194](https://github.com/mainmatter/sheepdog/pull/194) Update timeline ([@beerinho](https://github.com/beerinho))
  * [#191](https://github.com/mainmatter/sheepdog/pull/191) Turn mainmatter footer logo into a link to the svelte consulting page ([@nickschot](https://github.com/nickschot))
  * [#184](https://github.com/mainmatter/sheepdog/pull/184) Landing page demo integration ([@nickschot](https://github.com/nickschot))
  * [#158](https://github.com/mainmatter/sheepdog/pull/158) docs: add task modifier explainer ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#179](https://github.com/mainmatter/sheepdog/pull/179) Add SheepdogUtils & Linked task docs ([@beerinho](https://github.com/beerinho))
  * [#178](https://github.com/mainmatter/sheepdog/pull/178) Move Task Instance to reference ([@beerinho](https://github.com/beerinho))
  * [#156](https://github.com/mainmatter/sheepdog/pull/156) docs: start building the reference docs ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#165](https://github.com/mainmatter/sheepdog/pull/165) Add "built by Mainmatter" logo to the header ([@nickschot](https://github.com/nickschot))
  * [#164](https://github.com/mainmatter/sheepdog/pull/164) Add Tabs component ([@beerinho](https://github.com/beerinho))
  * [#154](https://github.com/mainmatter/sheepdog/pull/154) Add landing page ([@nickschot](https://github.com/nickschot))
  * [#142](https://github.com/mainmatter/sheepdog/pull/142) docs: async transform explainer ([@paoloricciuti](https://github.com/paoloricciuti))
* `@sheepdog/svelte`
  * [#181](https://github.com/mainmatter/sheepdog/pull/181) Add asyncTransform note ([@beerinho](https://github.com/beerinho))
* `@sheepdog/docs`, `@sheepdog/svelte`
  * [#143](https://github.com/mainmatter/sheepdog/pull/143) Add timeline for docs site ([@beerinho](https://github.com/beerinho))

#### :house: Internal
* `@sheepdog/svelte`
  * [#181](https://github.com/mainmatter/sheepdog/pull/181) Add asyncTransform note ([@beerinho](https://github.com/beerinho))
  * [#171](https://github.com/mainmatter/sheepdog/pull/171) chore: prepare script + renovate config ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#152](https://github.com/mainmatter/sheepdog/pull/152) Add GravityCI ([@beerinho](https://github.com/beerinho))
  * [#151](https://github.com/mainmatter/sheepdog/pull/151) fix: monorepo settings ([@paoloricciuti](https://github.com/paoloricciuti))
* Other
  * [#167](https://github.com/mainmatter/sheepdog/pull/167) update gravity cli to v0.0.2 ([@oscard0m](https://github.com/oscard0m))
  * [#147](https://github.com/mainmatter/sheepdog/pull/147) chore: upgrade `typescript-eslint` ([@paoloricciuti](https://github.com/paoloricciuti))
* `@sheepdog/docs`, `@sheepdog/svelte`
  * [#163](https://github.com/mainmatter/sheepdog/pull/163) Add volta config to subpackages' package.json ([@nickschot](https://github.com/nickschot))
  * [#150](https://github.com/mainmatter/sheepdog/pull/150) Move to monorepo ([@beerinho](https://github.com/beerinho))

#### Committers: 4
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Nick Schot ([@nickschot](https://github.com/nickschot))
- Oscar Dominguez ([@oscard0m](https://github.com/oscard0m))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-07-26)

@sheepdog/svelte 0.9.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#134](https://github.com/mainmatter/sheepdog/pull/134) Extend the TaskInstance derived state ([@beerinho](https://github.com/beerinho))
  * [#132](https://github.com/mainmatter/sheepdog/pull/132) feat: return derived state to `perform` return value ([@paoloricciuti](https://github.com/paoloricciuti))

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#141](https://github.com/mainmatter/sheepdog/pull/141) fix: avoid changing state of successful task to cancelled ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#137](https://github.com/mainmatter/sheepdog/pull/137) fix: make async transform with dot notation too ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#124](https://github.com/mainmatter/sheepdog/pull/124) feat: add Mid run cancellation guide ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 2
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-07-19)

@sheepdog/svelte 0.8.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#116](https://github.com/mainmatter/sheepdog/pull/116) feat: add installation, usage and start docs ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#114](https://github.com/mainmatter/sheepdog/pull/114) Add timeout utility function ([@nickschot](https://github.com/nickschot))
  * [#112](https://github.com/mainmatter/sheepdog/pull/112) Add didCancel util ([@beerinho](https://github.com/beerinho))

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#108](https://github.com/mainmatter/sheepdog/pull/108) Fix docs site title ([@beerinho](https://github.com/beerinho))

#### :house: Internal
* `@sheepdog/svelte`
  * [#129](https://github.com/mainmatter/sheepdog/pull/129) chore: setup netlify deploy ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#122](https://github.com/mainmatter/sheepdog/pull/122) Quality-of-life additions ([@beerinho](https://github.com/beerinho))
  * [#109](https://github.com/mainmatter/sheepdog/pull/109) Prepare Release ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#113](https://github.com/mainmatter/sheepdog/pull/113) Remove `results` array ([@beerinho](https://github.com/beerinho))

#### Committers: 4
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Nick Schot ([@nickschot](https://github.com/nickschot))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))
- [@github-actions[bot]](https://github.com/apps/github-actions)

## Release (2024-07-05)

@sheepdog/svelte 0.7.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#114](https://github.com/mainmatter/sheepdog/pull/114) Add timeout utility function ([@nickschot](https://github.com/nickschot))
  * [#112](https://github.com/mainmatter/sheepdog/pull/112) Add didCancel util ([@beerinho](https://github.com/beerinho))

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#108](https://github.com/mainmatter/sheepdog/pull/108) Fix docs site title ([@beerinho](https://github.com/beerinho))

#### :house: Internal
* `@sheepdog/svelte`
  * [#113](https://github.com/mainmatter/sheepdog/pull/113) Remove `results` array ([@beerinho](https://github.com/beerinho))

#### Committers: 2
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Nick Schot ([@nickschot](https://github.com/nickschot))

## Release (2024-06-21)

@sheepdog/svelte 0.6.1 (patch)

#### :house: Internal
* `@sheepdog/svelte`
  * [#106](https://github.com/mainmatter/sheepdog/pull/106) chore: delete tgz ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-06-21)

@sheepdog/svelte 0.7.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#95](https://github.com/mainmatter/sheepdog/pull/95) Add TaskInstance and derive `last` ([@beerinho](https://github.com/beerinho))

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#98](https://github.com/mainmatter/sheepdog/pull/98) fix: cancelled instances hanging indefinitely ([@paoloricciuti](https://github.com/paoloricciuti))

#### :memo: Documentation
* `@sheepdog/svelte`
  * [#104](https://github.com/mainmatter/sheepdog/pull/104) chore: change website and repo in docs ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 2
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-05-31)

@sheepdog/svelte 0.6.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#92](https://github.com/mainmatter/sheepdog/pull/92) breaking: add instance id and derive is loading ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#89](https://github.com/mainmatter/sheepdog/pull/89) feat: abstract task logic to core ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#88](https://github.com/mainmatter/sheepdog/pull/88) feat: add performCount to derived state ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#56](https://github.com/mainmatter/sheepdog/pull/56) Add keep_latest ([@beerinho](https://github.com/beerinho))
  * [#66](https://github.com/mainmatter/sheepdog/pull/66) feat: more exhaustive async transform ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#76](https://github.com/mainmatter/sheepdog/pull/76) feat: setup starlight for documentation ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#75](https://github.com/mainmatter/sheepdog/pull/75) Update pnpm-lock.yml to use pnpm v9 ([@beerinho](https://github.com/beerinho))
  * [#74](https://github.com/mainmatter/sheepdog/pull/74) Update packages ([@beerinho](https://github.com/beerinho))
  * [#67](https://github.com/mainmatter/sheepdog/pull/67) chore: test for errors thrown in perform ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#72](https://github.com/mainmatter/sheepdog/pull/72) chore: upgrade eslint to v9 and flat config ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#68](https://github.com/mainmatter/sheepdog/pull/68) chore: use pnpm 9 in workflows ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 2
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-05-10)

@sheepdog/svelte 0.5.1 (patch)

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#61](https://github.com/mainmatter/sheepdog/pull/61) feat: link only cancel the instance of the task that was linked ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#65](https://github.com/mainmatter/sheepdog/pull/65) chore(deps): update all non-major dependencies ([@renovate[bot]](https://github.com/apps/renovate))
  * [#62](https://github.com/mainmatter/sheepdog/pull/62) chore: add svelte exports to avoid warning ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-05-03)

@sheepdog/svelte 0.5.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#58](https://github.com/mainmatter/sheepdog/pull/58) feat: better async transform (yield replace await) ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#59](https://github.com/mainmatter/sheepdog/pull/59) chore(deps): update all non-major dependencies ([@renovate[bot]](https://github.com/apps/renovate))
  * [#53](https://github.com/mainmatter/sheepdog/pull/53) chore(deps): update all non-major dependencies ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-04-19)

@sheepdog/svelte 0.4.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#45](https://github.com/mainmatter/sheepdog/pull/45) feat: add max to restartable ([@paoloricciuti](https://github.com/paoloricciuti))

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#41](https://github.com/mainmatter/sheepdog/pull/41) fix: abort when dropping ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#50](https://github.com/mainmatter/sheepdog/pull/50) chore: fix lockfile ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#44](https://github.com/mainmatter/sheepdog/pull/44) Prepare Release ([@github-actions[bot]](https://github.com/apps/github-actions))
  * [#48](https://github.com/mainmatter/sheepdog/pull/48) chore(deps): update all non-major dependencies ([@renovate[bot]](https://github.com/apps/renovate))
  * [#49](https://github.com/mainmatter/sheepdog/pull/49) chore(deps): update dependency @testing-library/svelte to v5 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#46](https://github.com/mainmatter/sheepdog/pull/46) chore: async transform tests ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#42](https://github.com/mainmatter/sheepdog/pull/42) chore(deps): update all non-major dependencies ([@renovate[bot]](https://github.com/apps/renovate))
  * [#43](https://github.com/mainmatter/sheepdog/pull/43) chore: restructure testing and add tests for enqueue ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 2
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))
- [@github-actions[bot]](https://github.com/apps/github-actions)

## Release (2024-04-19)

@sheepdog/svelte 0.3.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#45](https://github.com/mainmatter/sheepdog/pull/45) feat: add max to restartable ([@paoloricciuti](https://github.com/paoloricciuti))

#### :bug: Bug Fix
* `@sheepdog/svelte`
  * [#41](https://github.com/mainmatter/sheepdog/pull/41) fix: abort when dropping ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#46](https://github.com/mainmatter/sheepdog/pull/46) chore: async transform tests ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#42](https://github.com/mainmatter/sheepdog/pull/42) chore(deps): update all non-major dependencies ([@renovate[bot]](https://github.com/apps/renovate))
  * [#43](https://github.com/mainmatter/sheepdog/pull/43) chore: restructure testing and add tests for enqueue ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-03-31)

@sheepdog/svelte 0.2.1 (patch)

#### :house: Internal
* `@sheepdog/svelte`
  * [#40](https://github.com/mainmatter/sheepdog/pull/40) chore: add basic testing setup ([@paoloricciuti](https://github.com/paoloricciuti))
  * [#39](https://github.com/mainmatter/sheepdog/pull/39) chore: format after prepare release ([@paoloricciuti](https://github.com/paoloricciuti))

#### Committers: 1
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))

## Release (2024-03-27)

@sheepdog/svelte 0.2.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#27](https://github.com/mainmatter/sheepdog/pull/27) Add `drop` task ([@beerinho](https://github.com/beerinho))
  * [#29](https://github.com/mainmatter/sheepdog/pull/29) Add `restart` task ([@beerinho](https://github.com/beerinho))

#### :house: Internal
* `@sheepdog/svelte`
  * [#13](https://github.com/mainmatter/sheepdog/pull/13) Update typescript-eslint monorepo to v7 (major) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#36](https://github.com/mainmatter/sheepdog/pull/36) fix formatter & linting ([@beerinho](https://github.com/beerinho))
  * [#35](https://github.com/mainmatter/sheepdog/pull/35) fix linting workflow ([@beerinho](https://github.com/beerinho))
  * [#33](https://github.com/mainmatter/sheepdog/pull/33) Fix lint workflow ([@beerinho](https://github.com/beerinho))
  * [#32](https://github.com/mainmatter/sheepdog/pull/32) Fix lint workflow ([@beerinho](https://github.com/beerinho))
  * [#31](https://github.com/mainmatter/sheepdog/pull/31) Fix linting ([@beerinho](https://github.com/beerinho))

#### Committers: 1
- Daniel Beer ([@beerinho](https://github.com/beerinho))

## Release (2024-03-22)

@sheepdog/svelte 0.1.0 (minor)

#### :rocket: Enhancement
* `@sheepdog/svelte`
  * [#10](https://github.com/mainmatter/sheepdog/pull/10) feat: handlers abstraction + queue ([@paoloricciuti](https://github.com/paoloricciuti))

#### :house: Internal
* `@sheepdog/svelte`
  * [#22](https://github.com/mainmatter/sheepdog/pull/22) Update renovate config ([@beerinho](https://github.com/beerinho))
  * [#14](https://github.com/mainmatter/sheepdog/pull/14) chore(deps): update dependency vite to v5.2.2 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#19](https://github.com/mainmatter/sheepdog/pull/19) chore(deps): update dependency release-plan to ^0.9.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#20](https://github.com/mainmatter/sheepdog/pull/20) chore(deps): update dependency typescript to v5.4.3 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#15](https://github.com/mainmatter/sheepdog/pull/15) chore(deps): update dependency svelte-check to v3.6.8 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#16](https://github.com/mainmatter/sheepdog/pull/16) chore(deps): update dependency @sveltejs/kit to v2.5.4 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#17](https://github.com/mainmatter/sheepdog/pull/17) chore(deps): update dependency vitest to v1.4.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#18](https://github.com/mainmatter/sheepdog/pull/18) chore(deps): update dependency @types/eslint to v8.56.6 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#11](https://github.com/mainmatter/sheepdog/pull/11) chore(deps): update dependency svelte-check to v3.6.6 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#6](https://github.com/mainmatter/sheepdog/pull/6) chore(deps): update dependency @sveltejs/package to v2.3.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#12](https://github.com/mainmatter/sheepdog/pull/12) chore(deps): update dependency vite to v5.1.5 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#5](https://github.com/mainmatter/sheepdog/pull/5) chore(deps): update dependency @sveltejs/kit to v2.5.3 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#8](https://github.com/mainmatter/sheepdog/pull/8) chore(deps): update dependency @types/eslint to v8.56.5 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#9](https://github.com/mainmatter/sheepdog/pull/9) chore(deps): update dependency svelte to v4.2.12 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1](https://github.com/mainmatter/sheepdog/pull/1) chore: Configure Renovate ([@renovate[bot]](https://github.com/apps/renovate))
  * [#3](https://github.com/mainmatter/sheepdog/pull/3) Add release-plan ([@beerinho](https://github.com/beerinho))

#### Committers: 2
- Daniel Beer ([@beerinho](https://github.com/beerinho))
- Paolo Ricciuti ([@paoloricciuti](https://github.com/paoloricciuti))
