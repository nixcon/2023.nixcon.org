<script lang="ts">
    import { Player, DefaultUi, Hls } from '@vime/svelte';
    /**
     * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
     */
    const hlsConfig = {
        // ...
    };
</script>

<Player
        controls
        autoplay
        muted
>
    <Hls version="latest" config="{hlsConfig}">
        <source data-src="https://cdn.c3voc.de/hls/s3/native_hd.m3u8" type="application/x-mpegURL" />
        <source data-src="https://cdn.c3voc.de/hls/s3/native_sd.m3u8" type="application/x-mpegURL" />
    </Hls>

    <DefaultUi />
</Player>