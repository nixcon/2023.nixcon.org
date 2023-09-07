<script>
  export let level,
    image,
    alt,
    url,
    extraClasses = "";

  const sizes = {
    gold: "w-48",
    silver: "w-32",
    bronze: "w-16",
  };

  if (image === undefined) throw "Image not set";
  if (alt === undefined) throw "Alt not set";
  if (url === undefined) throw "url not set";

  let src = `sponsors/${image}`;
  let classes = `${sizes[level]} ${extraClasses}`;
</script>

<li>
  <a href={url} target="_blank" rel="external">
    <img {src} class={classes} {alt} />
  </a>
</li>
