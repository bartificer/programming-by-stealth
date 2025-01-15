---
title: Author's Guide
---
# Programming by Stealth Author's Guide

This site is licensed creative commons, [hosted on GitHub](https://github.com/bartificer/programming-by-stealth), and published using [GitHub Pages](https://pages.github.com) with the [Bartificer Jekyll Theme](https://github.com/bartificer/bartificer-jekyll-theme). Contributions in the form of corrections are welcome via [pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

All content is authored in [Markdown](https://www.markdownguide.org/cheat-sheet/), and [YAML](https://en.wikipedia.org/wiki/YAML) front matter is used to encode the metadata.

GitHub Pages is a [static site generator](https://en.wikipedia.org/wiki/Static_site_generator) built on version 3 of the open source [Jekyll](https://jekyllrb.com) static site generator. The contents of the `docs` folder gets transformed into the published website using GitHub actions. The site is re-built each time a new commit is pushed to the `master` branch.

For the site to build correctly all content must be authored using valid Markdown syntax, and the necessary metadata must be present in correctly formatted YAML front matter.

This document describe's the sit'e taxonomy and how both content and metadata should be authored in order to produce the desired outcomes.

# Taxonomy (Content Organisation)

All content on this site falls into one of the following four categories:

1. **Stand-alone Pages** — these are permanent pages that do not belong to any on-going series. They include the home page (`docs/index.md`), the *About the Authors* page (`docs/about.md`), and this authors guide (`docs/authorguide.md`). These pages have no taxonomical metadata associated with them.
2. **PBS Instalments** — a sequence of tutorial-style posts collected together in a GitHub Pages/Jekyll [Collection](https://jekyllrb.com/docs/collections/) with the slug `pbs`. Each instalment defines the following additional taxonomical information:
   1. A sequence number within the collection
   2. Optionally, GitHub Pages/Jekyll [Tags](https://jekyllrb.com/docs/posts/#tags) — _**note** that as of January 2025, support for this feature within the theme is limited_.
   3. Optionally, a mini-series name. This deeper level of organisation is not directly provided by GitHub Pages/Jekyll, but a custom addition provided by the Bartificer theme.
3. **PBS Tidbits** — a collection with the slug `tidbits` containing stand-alone special posts that are in some way related to the main PBS series, but not part of it. Each tidbit defines the following additional taxonomical information:
   1. A sequence number within the collection
   2. Optionally, GitHub Pages/Jekyll [Tags](https://jekyllrb.com/docs/posts/#tags)
4. **Creator Details** — a hidden GitHub Pages/Jekyll collection with the slug `creators` containing content snippets describing the people who have co-created PBS instalments and/or Tidbits. The details captured in this collection are injected into the [About the Authors](/about) page. Creators are divided into two types:
   1. **Regular Hosts** — as of January 2025, just Bart & Allison.
   2. **Guests** — contributors who have joined for a few instalments (a work-in-progress as of January 2025)

This taxonomy enables the following theme features:

1. Automatic creation of the instalment indexes on the front page
2. The fine-tuning of instalment titles for optimal display in four distinct contexts:
   1. Instalment Page Title
   2. Browser Window/Tab Title
   3. Instalment Name in indexes
   4. The Next & Previous links at the bottom of each instalment and Tidbit
3. The Next & Previous links at the bottom of each instalment and Tidbit
4. The clear labeling of each mini-series and the Next & Previous links within each mini-series instalment. Note that the Next & Previous mini-series links work even when a mini-series is spread over non-contiguous Instalments (e.g. the Git mini-series which includes Instalments 101 to 120, and 172 to 174).
5. Automatic generation of OpenGraph metadata on all Instalments & Tidbits
6. Creator credits at the top of each instalment and Titbit linking to the appropriate section of the *About the Authors* page.
7. Tag lists:
   1. At the top of each instalment and tidbit
   2. In the instalment and Tidbit listings on the front page.
   3. **FUTURE:** the tags page which allows quick access to specific instalments by tag.

## File Locations

All source files for the generated website are contained within the `docs` folder. The file structure within this folder is mostly determined by the minutiae of how GitHub Pages/Jekyll works.

### Site Content (Markdown Files)

The Markdown files defining the content and metadata for the four content types described above are located in the folders listed below. Note that these locations are entirely determined by how GitHub Pages/Jekyll works, and the commonality is that collections are stored in folders with names consisting of their slug pre-fixed with an underscore (`_`).

1. **Stand-alone Pages** are stored in the root of the `docs` folder.
2. **PBS Instalments** are stored in the `docs/_pbs` folder.
3. **PBS Tidbits** are stored in the `docs/_tidbits` folder.
4. **Creator Details** are stored in the `docs/_creators` folder.

GitHub Pages/Jekyll converts all Markdown files to HTML files when generating the published website, and it does so by applying the following naming rules:

1. **Stand-alone Pages** get published as their original file name without the `.md` extension, e.g. `docs/about.md` becomes `https://pbs.bartificer.net/about`.
2. **PBS Instalments** also get published as their original file names without the `.md` extension, e.g. `docs/_pbs/pbs42.md` becomes `https://pbs.bartificer.net/pbs142`. _**Note** that this is an unusual configuration, and a result of Bart's inexperience with GitHub Pages at the outset of the project. Changing this configuration now would break too many links, so it has become technical debt that can\'t be easily paid down 🙁_
3. **PBS Tidbits** also get published as their original file names without the `.md` extension, e.g. `docs/_tidbits/tidbit3.md` becomes `https://pbs.bartificer.net/tidbit3`. _(The same note as above applies here.)_
4. **Creator Details** are not mapped to any URL as they are content snippets rather than full pages.

### Static Assets (Mostly Images)

GitHub Pages/Jekyll refers to files that do not get translated during site generation as *static assets*. The standard location for static assets is `docs/assets`. To avoid clutter, sub-folders are added for assets associated with each instalment, e.g. `docs/assets/pbs1/*`. If an instalment only has a small number of static assets, it is OK to store the assets directly within `docs/assets` provided the file name is prefixed with the appropriate series prefix, instalment number, and a dash, e.g. `docs/assets/pbs1-SomeScreenshot.png`.

### Instalment Zips

Some instalments have associated files as examples and those same files are provided by the readers in ZIP format. 

The original files that will be included in an instalment's ZIP file are stored in an appropriately named subfolder of the `instalmentResources` folder, e.g. `instalmentResources/pbs85`.

As of January 2025 the storage location for the instalment ZIP files is in flux:

* The ZIP files for older instalments that have not yet been moved are stored in `instalmentZips` folder with appropriate filenames, e.g. `instalmentZips/pbs85.zip`.
* The ZIP files for new instalments are stored in the `docs/assets`  folder with appropriate file names, e.g. `docs/assets/pbs175.zip`.

**WIP Mermaid diagram of all this** - https://www.mermaidchart.com/app/projects/47ab2aec-0ec6-41c1-81ea-379b040e478f/diagrams/2b116a0a-cd95-4227-8f21-9c21e4f5ddfb/version/v0.1/edit

## Authoring Content

The vast majority of content on this site is in PBS Instalments, followed in a distant second by PBS Tidbits. For completeness this section describes each of the four content types, but most authors can ignore all but the first subsection which describes authoring instalments & Tidbits.

The Markdown files for each content type consist of metadata in the form of YAML front matter followed by content. The front matter is wrapped with lines containing just three dashes, and consists of the YAML representation of a single dictionary of key-value pairs. Because this is metadata, the order of the pairs is irrelevant. What matters is that the needed keys are present, that they have valid values. For keys with arrays as values, the order of items within the arrays is also irrelevant.

_**Note:** for a refresher on YAML syntax, see PBS instalments [168](./pbs168) & [169](./pbs169)._

### Authoring Instalments & Tidbits

**Reminder:** PBS instalments are in `docs/_pbs/pbsN.md` where `N` is the instalment's number, and Tidbits are in `docs/_tidbits/tidbitN.md` where `N` is the Tidbit's number.

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

In terms of the YAML front matter, there is just one difference between instalments and Tidbits. The key `miniseries` is only valid in PBS Instalments.

Below is the complete and correct YAML metadata for instalment 171 which is part of the MVC mini-series:

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
| `title`      | String               | Always                  | The base title for the episode, the series details will be added around this base title by the theme. This base title is used to build the title at the top of the page, the page's title in browser tabs/windows, and if the page is an instalment, the instalment's link text in the relevant index on the home page. |
| `instalment` | Integer              | Instalments & Tidbits   | The instalment's number within the relevant series, i.e. PBS `n` or PBS Tidbit `n`. |
| `miniseries` | String               | Optional in Instalments | The name of the mini-series exactly how it will appear on the website. e.g. `Git` |
| `creators`   | Array of Strings     | Instalments & Tidbits   | The slugs for the instalment's creators, usually `[bart, allison]`, but any base filename from the `docs/_creators` folder is a valid slug. |
| `date`       | ISO 8601 date string | Instalments & Tidbits   | The publish date for the instalment as an ISO 8601 formatted date, i.e. `YYYY-MM-DD`, so Christmas 2025 would be `2025-12-25`. _**Warnings** — instalment listings and navigation links are sorted on this field, so omitting it has unpredictable side-effects. Also, instalments with dates in the future are not published to the live website!_ |
| `opengraph`  | Dictionary           | Optional                | An optional link to the MP3 file associated with a page or instalment. In theory, OpenGraph-aware clients like social media apps can use this field to add a play button to their link previews, but in reality, this part of the spec is rarely if ever implemented, so omitting this tag is not a big deal. _**Note:** Bart likes to maintain this field purely for future-proofing. All other authors are free to ignore it completely!_ |

### Authoring Standalone Pages

Stand alone pages use a simpler template than instalments, so require much less metadata. However, unlike instalments and Tidbits, the simpler theme requires the page author to add the page's top-level heading as the first line of the page's markdown content. To allow the page to have a shorter and pithier title in browser tab/window labels, pages also have a `title` key in the front matter.

The basic structure is as follows:

```
---
YAML FRONT MATTER HERE
---
# Page Heading

Some Content.

## Optional Sub-heading

Maybe some more content.
```

As an example, the *About the Authors* page starts as follows:

```yaml
---
title: Bart & Allison
opengraph:
  title: About the PBS Creators
  description: Find Bart & Allison online.
---
# About the Authors

This series is co-created by Bart Busschots & Allison Sheridan …
```

Notice that this page makes use of the ability to specify different titles for the page itself and the tab/window header shown in the browser. In this case the tab will be titled *"Bart & Allison"*, while the page's content is headed with *"About the Authors"*

The following table describes the supported front matter fields in detail:

| Field                  | Type       | Required    | Description                                                  |
| :--------------------- | :--------- | ----------- | :----------------------------------------------------------- |
| `title`                | String     | Always      | The page's title as it will appear in browser tabs/window labels. |
| `opengraph`            | Dictionary | Recommended | A dictionary complying with the OpenGraph standard, the fields below are recommended. |
| `opengraph.title`      | String     | Recommended | The title for use in link previews.                          |
| `opengraph.desription` | String     | Recommended | A one-line summary of the page for use in link previews.     |

### Creating/Updating Creator Details

**Reminder:** creator details are in `docs/_creators/SLUG.md` where `SLUG` is the creator's slug, e.g. Bart's slug is `bart` so his details are in `docs/_creators/bart.md`.

The creators collection is different from the collections for PBS and the Tidbits because it is *hidden*. This means that the markdown files in `docs/_creators` do not have a URL in the generated site. Instead, creators are injected into the *About the Authors* (`docs/about.md`) page using  [Liquid template tags](https://jekyllrb.com/docs/liquid/) (the templating language used by GitHub Pages/Jekyll). **It's not necessary to understand Liquid templates to update the details for an existing creator or add a new creator**.

The site supports two kinds of creators:

1. Regular Hosts
2. Guests

The regular hosts get an entire section each on the [About the Authors](/about) page, while guests simply get a one-line entry with a link in the guest list.

#### Updating the Details for a Regular Host

The Markdown files for the regular hosts have the following overall structure:

```
---
YAML FRONT MATTER GOES HERE
---
The host's bio in Markdown.
```

As an example, Allison's Markdown file (`docs/_creators/allison.md`) starts:

```
---
display_name: Allison Sheridan
short_name: Allison
guest: false
---
Allison hosts the NosillaCast Apple Podcast, produced weekly since May 2005 …
```

The following table describes the supported front matter fields in detail:

| Field          | Type    | Required | Description                                                  |
| :------------- | :------ | -------- | :----------------------------------------------------------- |
| `display_name` | String  | Yes      | The creator's full name.                                     |
| `short_name`   | String  | Yes      | The creator's first name or the nickname they prefer in contexts where space is constrained. |
| `guest`        | Boolean | Yes      | Must be `false` for primary creators.                        |

#### Updating the details for an Existing Guest or Adding a New Guest

The details for existing guests are updated by editing their file in the `docs/_creators` folder.

Adding a new guest requires creating a new markdown file in `docs/_creators`. The file's base name must be the guest's slug. For consistency, please use [camelCase](https://en.wikipedia.org/wiki/Camel_case). For community members like Helma, just the first name is sufficient as the slug, but for guests from outside the community, please use `firstnameSurname`. 

Guests are associated with instalments or Tidbits by including their slug in the `creators` array in the appropriate instalment or Tidbit's front matter.

The Markdown files for the guests have the following overall structure:

```
---
YAML FRONT MATTER GOES HERE
---
```

In other words, **a Markdown file that contains only YAML front matter**.

As an example, this is Helma's complete Markdown file (`docs/_craetors/helma.md`):

```yaml
---
display_name: Helma van der Linden
short_name: Helma
guest: true
external_url: https://github.com/hepabolu
---
```

The following table describes the supported front matter fields in detail:

| Field          | Type    | Required | Description                                                  |
| :------------- | :------ | -------- | :----------------------------------------------------------- |
| `display_name` | String  | Yes      | The creator's full name.                                     |
| `short_name`   | String  | Yes      | The creator's first name or the nickname they prefer in contexts where space is constrained. |
| `guest`        | Boolean | Yes      | Must be `true` for guest creators.                           |
| `external_url` | String  | Yes      | A valid URL link.                                            |

### Advanced Markup (in Markdown Files)

Whenever possible, all content should be coded in pure Markdown, but very occasionally it may be necessary to add additional markup. When that is the case, HTML can be included in the Markdown files, but avoid using hard-coded styling, instead use appropriate HTML 5 markup with [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS classes.

The theme provides support for a number of non-standard or advanced Markdown features as described below.

#### Adding Code Snippets

All code snippets should be marked up using the appropriate Markdown syntax.

Multi-line code snippets should facilitate syntax highlighting by adding the language name after the opening three back-ticks as described in the Syntax Highlighting sub-section of the [Extended Syntax section of the Markdown docs](https://www.markdownguide.org/extended-syntax/).

#### Adding Notes

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

#### Adding Figures

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