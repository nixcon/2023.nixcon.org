<script>
  export let level,
    image,
    alt,
    url,
    extraClasses = "";

  const sizes = {
    gold: "w-56",
    silver: "w-36",
    bronze: "h-10",
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
