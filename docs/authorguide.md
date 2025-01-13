---
title: Author's Guide
---
This site is creative commons, [hosted on GitHub](https://github.com/bartificer/programming-by-stealth), and published on [GitHub Pages](https://pages.github.com) using the [Bartificer Jekyll Theme](https://github.com/bartificer/bartificer-jekyll-theme). Contributions in the form of corrections are welcome via [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

The content is written in [Markdown](https://www.markdownguide.org/cheat-sheet/) with [YAML](https://en.wikipedia.org/wiki/YAML) front matter for metadata.

When ever possible, all content should be coded in pure Markdown, but very ocassionally it may be necessary to add additional markup. When that is the case, HTML can be included in the Markdown files, but avoid using hard-coded styling, instead use appropriate HTML 5 markup with [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS classes.

Note that this document is a work in progress.

# Taxonomy (Content Organisation)

All content on this site falls into one of the following four categories:

1. **Stand-alone Pages** — these are permanent pages that do not belong to any on-going series. They include the home page, the about page, and this author guide. These pages have no taxonomical metadata associated with them.
2. **PBS Instalments** — a sequence of tutorial-style posts collected together in a GitHub Pages/Jekyll [Collection](https://jekyllrb.com/docs/collections/) with the slug `pbs`. Each instalment defines the following additional taxonomical information:
   1. A sequence number within the series
   2. Optionally, GitHub Pages/Jekyll [Tags](https://jekyllrb.com/docs/posts/#tags) — note that as of January 2025, support for this feature within the theme is limited.
   3. Optionally, a mini-series name. This deeper level of organisation is not directly provided by GitHub Pages/Jekyll, but a custom additon provided by the Bartificer theme.
3. **PBS Tidbits** — a collection with the slug `tidbits` containing stand-alone special posts that are is in some way related to the main PBS series, but not part of it. Each tidbit defines the following additional taxonomical information:
   1. A sequence number
   2. Optionally, GitHub Pages/Jekyll [Tags](https://jekyllrb.com/docs/posts/#tags) — note that as of January 2025, support for this feature within the theme is limited.
4. **Creator Details** — a hidden GitHub Pages/Jekyll collection with the slug `creators` continaing content snippets describing the people who have co-created PBS instalment and/or tidbits. The details captured in this connection are injected into the [About the Authors](/about) page. Creators are divided into two categories:
   1. Regular Hosts — as of January 2025, just Bart & Allison.
   2. Guests — contributors who have joined for a few instalments (a work-in-progress as of January 2025)

This taxonomy facilitates the following theme features:

1. The instalment lists on the front page
2. The fine-tuning of instalment titles for optimal display in four distinct contexts:
   1. Instament Page Title
   2. Browser Window/Tab Title
   3. Instalment Name in listings
   4. The Next & Previous links at the bottom of each instalment
3. The Next & Previous links at the bottom of each instalment
4. The clear labelling of mini-series and the Next & Previous links within each mini-series. Note that the Next & Previous mini-series links work when a mini-series is spread out over non-contiguous instalments.
5. Creator credits at the top of each instalment linking to the appropriate section of the *About the Authors* page.
6. Tag displays on the instalments lists and at the top of each instalment.
   1. **WIP:** a tags page allowing quick access to specific instalments by tag.

## File Locations

All source files for the generated website are contained within the `docs` folder. The file structure within this folder is mostly determined by the minutiae of how GitHub Pages/Jekyll works.

### Site Content (Markdown Files)

The Markdown files defining the content and metadata for the four content types described above are located in the folders listed below. Note that these locations are entirely determined by how GitHub Pages/Jekyll works, and the commonality is that collections are stored in folders with names consisting of their slug pre-fixed with an underscore (`_`).

1. **Stand-alone Pages** are stored in the root of the `docs` folder.
2. **PBS Instalments** are stored in the `docs/_pbs` folder.
3. **PBS Tidbits** are stored in the `docs/_tidbits` folder.
4. **Creator Details** are stored in the `docs/_creators` folder.

GitHubs Pages/Jekyll coverts all Markdown files to HTML files when generating the published website, and it does so by applying the following naming rules:

1. **Stand-alone Pages** get published as their original file name without the `.md` extension, e.g. `docs/about.md` becomes `https://pbs.bartificer.net/about`.
2. **PBS Instalments** also get published as their original file names without the `.md` extension, e.g. `docs/_pbs/pbs42.md` becomes `https://pbs.bartificer.net/pbs142`. _**Note** that this is an unusual configuration, and a result of Bart's inexperience with GitHub Pages at the outset of the project. Changing this configuration now would break too many links, so it has become technical debt that can\'t be easily paid down 🙁_
3. **PBS Tidbits** also get published as their original file names without the `.md` extension, e.g. `docs/_tidbits/tidbit3.md` becomes `https://pbs.bartificer.net/tidbit3`. _(The same note as above applies here.)_
4. **Creator Details** are not mapped to any URL as they are content snippets rather than full pages.

### Static Assets (Mostly Images)

GitHub Pages/Jekyll refers to files that do not get translated during site generation as *static assets*. The standard location for static assets is `docs/assets`. To avoid clutter, sub-folders are added for assets associated with each instalment, e.g. `docs/assets/pbs1/*`. If an instalment only has a small number of static assets, it is OK to store the assets directly within `docs/assets` profiled the file-name is prefixed with the appropriate series prefix, instalment number, and a dash, e.g. `docs/assets/pbs1-SomeScreenshot.png`.

### Instalment Zips

The original files that will be included in an instalment's ZIP file are stored in an appropriately named sub-folders of the `instalmentResources` folder, e.g. `instalmentResources/pbs85`.

As of January 2025 the storage location for the instalment ZIP files is in flux:

* The ZIP files for older instalments that have not yet been moved are stored in `instalmentZips` folder with appropriate filenames, e.g. `instalmentZips/pbs85.zip`.
* The ZIP files for new instalments are stored in the `docs/assets`  folder with appropriate file names, e.g. `docs/assets/pbs175.zip`.

**WIP Mermaid diagram of all this** - https://www.mermaidchart.com/app/projects/47ab2aec-0ec6-41c1-81ea-379b040e478f/diagrams/2b116a0a-cd95-4227-8f21-9c21e4f5ddfb/version/v0.1/edit

-----

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

The YAML front matter is the document's metadata. Between the opening and closing three-dash lines the front matter consists of YAML code representing a dictionary of key-value pairs. The order of the pairs is irrelevant, what matters is that the needed keys are present, that they have valid values. For keys with arrays as values, the order of items within the arrays is also irrelevant.

_**Note:** for a refresher on YAML syntax, see PBS instalments [168](./pbs168) & [169](./pbs169)._

The need front matter varies depending on the content type.

#### Front Matter for PBS Instalments & Tidbits

The majority of content on this site consists of PBS instalments, followed in a distant second by PBS Tidbits.

The YAML metadata needed for both of these content types is almost identical, the one difference is that `miniseries` are only valid in PBS Instalments.

An example of complete and correct YAML metadata for a  instalment is shown below:

```yaml
---
title: How XKpasswd-js Applies Model View Controller
instalment: 171
miniseries: MVC
tags: [software engineering, javascript]
creators: [bart, allison, helma]
date: 2024-09-28
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_09_28A.mp3
---
```

The table below describes the supported fields in detail:

| Field        | Type                 | Required                | Description                                                  |
| :----------- | :------------------- | ----------------------- | :----------------------------------------------------------- |
| `title`      | String               | Always                  | The base title for the episode, the series details will be added around this base title by the theme. This base title is used to build the title at the top of the page, the page's title in browser tabs/windows, and if the page is an instalment, the instalment's link text in the relevant listing on the home page. |
| `instalment` | Integer              | Instalments & Tidbits   | The instalment's number within the relevant series, i.e. PBS `n` or PBS Tidbit `n`. |
| `miniseries` | String               | Optional in Instalments | The name of the mini-series exactly how it will appear on the website. e.g. `Git` |
| `creators`   | Array of Strings     | Instalments & Tidbits   | The slugs for the instalment's creators, usually `[bart, allison]`, but any base filename from the `docs/_creators` folder is a valid slug. |
| `date`       | ISO 8601 date string | Instalments & Tidbits   | The publish date for the instalment as an ISO 8601 formatted date, i.e. `YYYY-MM-DD`, so Christmas 2025 would be `2025-12-25`. _**Warnings** — instalment listings and navigation links are sorted on this field, so omitting it has unpredictable side-effects. Also, instalments with dates in the future are not published to the live website!_ |
| `opengraph`  | Dictionary           | Optional                | An optional link to the MP3 file associated with a page or instalment. In theory, OpenGraph-aware clients like social media apps can use this field to add a play button to their link previews, but in reality, this part of the spec is rarely if ever implemented, so omitting this tag is not a big deal. _**Note:** Bart likes to maintain this field purely for future-proofing, all other authors are free to ignore it completely!_ |

#### Front Matter for Stand-alone Pages

Only one metadata field is required on stand-alone pages, `title`, but additional OpenGraph details are recommended to control how social media apps generate their link previews.  The following is a complete example:

```yaml
---
title: Bart & Allison
opengraph:
  title: About the PBS Creators
  description: Find Bart & Allison online.
---
# Top Level Page Heading
```

_**Note:** because the theme does not auto-generate top-level headings for stand-alone pages, a top-level heading should be added immediately after the front matter._

The following table describes the supported fields in detail:

| Field                  | Type       | Required    | Description                                                  |
| :--------------------- | :--------- | ----------- | :----------------------------------------------------------- |
| `title`                | String     | Always      | The page's title as it will appear in browser tabs/window labels. |
| `opengraph`            | Dictionary | Recommended | A dictionary complying with the OpenGraph standard, the fields below are recommended. |
| `opengraph.title`      | String     | Recommended | The title for use in link previews,                          |
| `opengraph.desription` | String     | Recommended | A one-line summary of the page for use in link previews.     |

#### Front Matter for Author Details

TO DO

### Adding Code Snippets

All code snippets should be marked up using the appropriate Markdown syntax.

Multi-line code snippets should facilitate syntax highlighting by adding the language name after the opening three back-ticks as described in the Syntax Highlighting sub-section of the [Extended Syntax section of the Markdown docs](https://www.markdownguide.org/extended-syntax/).

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