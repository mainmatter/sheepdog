# Changelog

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
