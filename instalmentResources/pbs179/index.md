---
title: Home
---
# PBS Jekyll Demo Site

![An Illustration showing the PBS logo over the GitHub and Jekyll Logos with a plus between them](illustrations/siteIllustration.png){:.img-fluid}

This is a [Jekyll](https://jekyllrb.com)-powered website designed to be tested locally and deployed on [GitHub Pages](https://pages.github.com).

It serves as the basis for the examples in the [Programming by Stealth](https://pbs.bartificer.net) mini-series on using Jekyll as a Content Management System compatible with GitHub Pages.

## Site Pages

{%- assign list_pages = site.html_pages | where_exp: "item", "item.title != 'Home'" %}
{%- for p in list_pages %}
- [{{ p.title }}]({{ p.url | relative_url }})
{%- else %}
- *No pages yet*
{%- endfor %}