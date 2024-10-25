---
title: Author's Guide
---
This site is creative commons, [hosted on GitHub](https://github.com/bartificer/programming-by-stealth), and published on [GitHub Pages](https://pages.github.com) using the [Bartificer Jekyll Theme](https://github.com/bartificer/bartificer-jekyll-theme). Contributions in the form of corrections are welcome via [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

The content is written in [Markdown](https://www.markdownguide.org/cheat-sheet/) with [YAML](https://en.wikipedia.org/wiki/YAML) front matter for metadata.

When ever possible, all content should be coded in pure Markdown, but very ocassionally it may be necessary to add additional markup. When that is the case, HTML can be included in the Markdown files, but avoid using hard-coded styling, instead use appropriate HTML 5 markup with [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS classes.

Note that this document is a work in progress.

## File Locations

Instalments for the primary series are stored as markdown files in the folder `docs/_pbs`, while PBS Tidbits are stored in `docs/_tidbits`.

Images and other static files that need to be linked to from within instalments are stored in appropriately named sub-folders of `docs/assets/`, e.g. `docs/assets/pbs1/Screen-Shot-2015-10-07-at-22.41.46-e1444254317754.png`.

The original files that will be included in an instalment's resources ZIP file are stored in appropriately named sub-folders of the `instalmentResources` folder, e.g. `instalmentResources/pbs85`. The published instalment resource zip files are stored in the `instalmenmtZips` folder with appropriate filenames, e.g. `instalmentZips/pbs85.zip`.

## Overall Document Structure

Instalments should start with YAML front matter of the following form:

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

Section headings within the instalment content are coded as second-level headings, i.e. `## Some Heading`.

Code snippets should facilitate syntax highlighting by adding the language name after the opening three back-ticks as described in the Syntax Highlighting sub-section of the [Extended Syntax section of the Markdown docs](https://www.markdownguide.org/extended-syntax/).

## Adding Notes

Notes of two kinds can be added using style annotations in conjunction with the Markdown syntax for block quotes.

You can important sections users need to notice with markup of the form:

```markdown
> Some warning or other important text!
{: .notice}
```

And you can add the opposite, an aside, with markup of the form:

```markdown
> Some interesting tidbit related to the content, but not part of it.
{: .aside}
```

## Adding Figures

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