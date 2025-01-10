---
title: Author's Guide
---
This site is creative commons, [hosted on GitHub](https://github.com/bartificer/programming-by-stealth), and published on [GitHub Pages](https://pages.github.com) using the [Bartificer Jekyll Theme](https://github.com/bartificer/bartificer-jekyll-theme). Contributions in the form of corrections are welcome via [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

The content is written in [Markdown](https://www.markdownguide.org/cheat-sheet/) with [YAML](https://en.wikipedia.org/wiki/YAML) front matter for metadata.

When ever possible, all content should be coded in pure Markdown, but very ocassionally it may be necessary to add additional markup. When that is the case, HTML can be included in the Markdown files, but avoid using hard-coded styling, instead use appropriate HTML 5 markup with [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS classes.

Note that this document is a work in progress.

## File Locations

Instalments for the primary series are stored as markdown files in the folder `docs/_pbs`, while PBS Tidbits are stored in `docs/_tidbits`.

**BART** why are they in separate folders? what's the implication of putting a tidbit file in the _pbs_ directory?

Images and other static files that need to be linked to from within instalments are stored in appropriately named sub-folders of `docs/assets/`, e.g. `docs/assets/pbs1/Screen-Shot-2015-10-07-at-22.41.46-e1444254317754.png`.

**BART** why are the assets in a different (and HIGHER) directory? why wouldn't the assets for pbs be in the `_pbs` folder? Hunting up and down the directory structure to find the files is tedious. I would picture logically, if we have to have a dir called `_pbs` then why not have the pbs folders inside it with the .md files and the assets (not in another subfolder called assets)?

The original files that will be included in an instalment's resources ZIP file are stored in appropriately named sub-folders of the `instalmentResources` folder, e.g. `instalmentResources/pbs85`. The published instalment resource zip files are stored in the `instalmenmtZips` folder with appropriate filenames, e.g. `instalmentZips/pbs85.zip`.

**BART** again why? why make upper-level structures? why not keep all of this in the `__pbs`folder for the instalment? what is the value of this structure and what would go wrong if I put assets or instalment resources inside the `_pbs`folder? there is a *meaning* to it, yes?

**commentary**  Here's why I harp on this. It means if I'm editing pbs35, I go to `programming-by-stealth/docs/_pbs/pbs35.md` to get to the Markdown file. But to get to the instalment resources, I have to go up out of `_pbs`, up out of docs, down into instalment resources and into pbs35.  I suspect this is some organizational model you adopted ages ago and it's the way you think to organize things but it's antithetical to how I organize things. i would have one folder for pbs35 and it would have the .md, the zip and maybe a folder for the installment resources within it, and if there were a LOT of images I might have an assets folder in there too but probably not. It may not be fair for me to twist your brain to the way I organize things but I am twisted up in a knot every time I have to find something with this structure. Maybe on our next project we could decide on the organization before you get your heart set on it?   

**Mermaid diagram of all this** - https://www.mermaidchart.com/app/projects/47ab2aec-0ec6-41c1-81ea-379b040e478f/diagrams/2b116a0a-cd95-4227-8f21-9c21e4f5ddfb/version/v0.1/edit

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

## YAML Front Matter

The table below describes the supported fields in the YAML front matter:

| Field        | Type                 | Required              | Description                                                  |
| :----------- | :------------------- | --------------------- | :----------------------------------------------------------- |
| `title`      | String               | Always                | The base title for the episode, the series details will be added around this base title by the theme. This base title is used to build the title at the top of the page, the page's title in browser tabs/windows, and if the page is an instalment, the instalment's link text in the relevant listing on the home page. |
| `instalment` | Integer              | Instalments & Tidbits | The instalment's number within the relevant series, i.e. PBS `n` or PBS Tidbit `n`. |
| `creators`   | Array of Strings     | Instalments & Tidbits | The slugs for the instalment's creators, usually `[bart, allison]`, but any base filename from the `docs/_creators` folder is a valid slug. |
| `date`       | ISO 8601 date string | Instalments & Tidbits | The publish date for the instalment as an ISO 8601 formatted date, i.e. `YYYY-MM-DD`, so Christmas 2025 would be `2025-12-25`. _**Warnings** — instalment listings and navigation links are sorted on this field, so omitting it has unpredictable side-effects. Also, instalments with dates in the future are not published to the live website!_ |
| `opengraph`  | Dictionary           | Optional              | An optional link to the MP3 file associated with a page or instalment. In theory OpenGraph-aware clients like social media apps can use this field to add a play button to their link previews, but in reality this part of the spec is rarely if ever implemented, so omitting this tag is not a big deal. _**Note:** Bart likes to maintain this field purely for future-proofing, all other authors are free to ignore it completely!_ |

_**Note:** for a refresher on YAML syntax, see PBS instalments [168](./pbs168) & [169](./pbs169)._

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