<script lang="ts">
	import { task, type Task } from '$lib/task.js';

  type Challenger = {
    name: string;
    progress: number;
  };

  let challengers: Challenger[] = [];
  for (let i = 1; i <= 3; i++) {
    challengers.push({
      name: `Challenger ${i}`,
      progress: 0,
    })
  }

  let winner: Challenger|undefined;

  const runTheRace = task(async function* (_, { abortController, link }) {
    console.log('Run the race')
    let challengerRaces = challengers.map(challenger => {
      return link(race).perform(challenger);
    })
    let first = await Promise.race(challengerRaces);
    console.log(`First arrived is ${first.name}`);
    abortController.abort();
    return first;
  });

  const race = task(async function* ([challenger]: [challenger: Challenger]) {
    console.log(`${challenger.name} runs`);
    while (challenger.progress < 100) {
      await new Promise((r) => setTimeout(r, Math.random() * 100 + 100));
		  yield;
      challenger.progress = Math.min(
        100,
        Math.floor(challenger.progress + Math.random() * 20),
      );
      console.log(`${challenger.name} progress: ${challenger.progress}`);
    }
    return challenger;
  });

</script>

<button
	on:click={async () => {
    winner = await runTheRace.perform();
	}}
>Start race</button>

<button
	on:click={() => {
    challengers[0].progress = 50;
    challengers[1].progress = 20;
    challengers[2].progress = 70;
	}}
>Test</button>

{#each challengers as challenger}
  <div>
    <span>{challenger.name}</span>
    <progress max="100" value={challenger.progress} />
  </div>
{/each}

{#if winner}
	<p>The winner is {winner.name}</p>
{/if}