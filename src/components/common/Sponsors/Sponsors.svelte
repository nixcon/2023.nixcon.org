<script>
  import Sponsor from "./Sponsor.svelte";

  export let sponsors,
    level,
    randomize = true;

  const randomizedSponsors = randomize
    ? sponsors
        .map((sponsor) => ({ sponsor, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sponsor }) => sponsor)
    : sponsors;
</script>

{#each randomizedSponsors as sponsor}
    <Sponsor {level} image={sponsor.image} alt={sponsor.alt} url={sponsor.url} extraClasses={sponsor.extraClasses}/>
{/each}
