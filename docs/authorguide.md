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

## File Locations

All source files for the generated website are contained within the `docs` folder. The file structure within this folder is mostly determined by the minutiae of how GitHub Pages/Jekyll works.

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

TO DO — update wording on static assets.

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