---
title: Author's Guide
---
This site is creative commons, [hosted on GitHub](https://github.com/bartificer/programming-by-stealth), and published on [GitHub Pages](https://pages.github.com) using the [Bartificer Jekyll Theme](https://github.com/bartificer/bartificer-jekyll-theme). Contributions in the form of corrections are welcome via [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

The content is written in [Markdown](https://www.markdownguide.org/cheat-sheet/) with [YAML](https://en.wikipedia.org/wiki/YAML) front matter for metadata.

When ever possible, all content should be coded in pure Markdown, but very ocassionally it may be necessary to add additional markup. When that is the case, HTML can be included in the Markdown files, but avoid using hard-coded styling, instead use appropriate HTML 5 markup with [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS classes.

Note that this document is a work in progress.

## File Locations

All files that will form part of the website are in the `docs/` folder. This folder is converted to the published website by the GitHub Pages content management system. This means this folder has a common structure with other GitHub Pages sites:

1.  Series of posts are stored in folders  named for their slug pre-fixed by an underscore. PBS has two series:
   1. The  main PBS series is stored in `docs/_pbs`
   2. The PBS Tidbits are stored in `docs/_tidbits`
2. Static assets (mostly screenshots on this site), that is to say, files that are not transformed by GitHub Pages are stored in the `docs/assests` folder. To help keep things organised in that folder, sub-folders should be made f or the appropriate instalments, e.g. `docs/assets/pbs1/*` for static assists

Because the original files that will get bundled into the instalment ZIP files are effectively source code. For the asset that will be published, i.e. the ZIP file, these files are stored in appropriately named sub-folders in the `instalmentResources` folder.

**ALLISON** — how is the compromise below? Over time we can pay down the technological debt and start moving all the old ZIPs, but for now, let's move on better at least.

Before January 2025, instalment ZIP files were stored outside the website folder (`docs`) despite being static assets. This was a mistake made by Bart back in 2019 before he fully understood GitHub Pages.

Starting in January 2025, **Instalment ZIPs should be stored directly in the the static assets folder** as `docs/assets/pbsN.zip` with `N` replaced with the appropriate instalment number. 

**Mermaid diagram of all this** - https://www.mermaidchart.com/app/projects/47ab2aec-0ec6-41c1-81ea-379b040e478f/diagrams/2b116a0a-cd95-4227-8f21-9c21e4f5ddfb/version/v0.1/edit

## Document Structure

Each Markdown file must have the following big-picture structure:

```
---
YAML FONT MATTER HERE
---
## First Heading

Some content

## Second Heading

Some More Content

etc.
```

Note that top-level headings within the document are level-two headings (`##`, this is because at a HTML level, the instalment title will be rendered with a top-level heading tag).

### Document Metadata (YAML Front Matter)

The YAML front matter is the document's metadata. Between the opening and closing three-dash lines the front matter consists of YAML code representing a dictionary of key-value pairs. The order of the pairs is irrelevant, what matters is that the needed keys are present, that they have valid values. Within arrays, the order is also un-important.

An example of complete and correct YAML metadata for an instalment is shown below:

```yaml
---
title: MVC in XKpasswd-js
instalment: 171
creators: [bart, allison, helma]
date: 2024-09-28
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_09_28A.mp3
---
```

The table below describes the supported fields in detail:

| Field        | Type                 | Required              | Description                                                  |
| :----------- | :------------------- | --------------------- | :----------------------------------------------------------- |
| `title`      | String               | Always                | The base title for the episode, the series details will be added around this base title by the theme. This base title is used to build the title at the top of the page, the page's title in browser tabs/windows, and if the page is an instalment, the instalment's link text in the relevant listing on the home page. |
| `instalment` | Integer              | Instalments & Tidbits | The instalment's number within the relevant series, i.e. PBS `n` or PBS Tidbit `n`. |
| `creators`   | Array of Strings     | Instalments & Tidbits | The slugs for the instalment's creators, usually `[bart, allison]`, but any base filename from the `docs/_creators` folder is a valid slug. |
| `date`       | ISO 8601 date string | Instalments & Tidbits | The publish date for the instalment as an ISO 8601 formatted date, i.e. `YYYY-MM-DD`, so Christmas 2025 would be `2025-12-25`. _**Warnings** — instalment listings and navigation links are sorted on this field, so omitting it has unpredictable side-effects. Also, instalments with dates in the future are not published to the live website!_ |
| `opengraph`  | Dictionary           | Optional              | An optional link to the MP3 file associated with a page or instalment. In theory, OpenGraph-aware clients like social media apps can use this field to add a play button to their link previews, but in reality, this part of the spec is rarely if ever implemented, so omitting this tag is not a big deal. _**Note:** Bart likes to maintain this field purely for future-proofing, all other authors are free to ignore it completely!_ |

_**Note:** for a refresher on YAML syntax, see PBS instalments [168](./pbs168) & [169](./pbs169)._

### Adding Code Snippets

Code snippets should facilitate syntax highlighting by adding the language name after the opening three back-ticks as described in the Syntax Highlighting sub-section of the [Extended Syntax section of the Markdown docs](https://www.markdownguide.org/extended-syntax/).

### Adding Notes

Notes of two kinds can be added using style annotations in conjunction with the Markdown syntax for block quotes.

You can important sections users need to notice with markup of the form:

```markdown
> Some warning or other important text!
{: .notice}
```

And you can add the opposite, an aside, with markup of the form:

```markdown
> Some interesting comment related to the content, but not part of it.
{: .aside}
```

### Adding Figures

Single figures with captions can be added with markup of the form:

```html
<figure>
    <img src="assets/pbsXXX/YYY.png" alt="Some Alt Text">
    <figcaption>A nice caption</figcaption>
</figure>
```

Groups of figures that stack nicely at all screensizes can be added with markup of the form:

```html
<div class="fig-group">
    <figure>
        <img src="assets/pbsXXX/YYY1.png" alt="Some Alt Text for the first figure">
        <figcaption>A nice caption for the first figure</figcaption>
    </figure>
    …
    <figure>
        <img src="assets/pbsXXX/YYYn.png" alt="Some Alt Text for the last figure">
        <figcaption>A nice caption for the last figure</figcaption>
    </figure>
</div>
```