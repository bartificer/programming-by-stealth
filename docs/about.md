---
title: Bart & Allison
opengraph:
  title: About the PBS Creators
  description: Find Bart & Allison online.
---
# About the Authors

This series is co-created by Bart Busschots & Allison Sheridan. In addition to co-creation of the Programming By Stealth Podcast, Bart and Allison co-created the [Taming the Terminal](https://ttt.bartificer.net/book.html) podcast and book (thanks to Helma Van der Linden).

{% assign creators_collection = site.collections | where: "label", "creators" | first -%}
{% assign creators = creators_collection.docs | where: "guest", false -%}
{% for creator in creators -%}
## <a name="{{ creator.slug }}"></a>{{ creator.short_name }}
{{ creator.output }}
{% endfor -%}

## Guests

From time to time, Bart & Allison invite guests to write instalmetns and/or appear on the acompanying podcast episodes.

{% assign guests = creators_collection.docs | where: "guest", true -%}
{% for guest in guests -%}
* [{{ guest.url }}]({{ guest.display_name }})</a>
{% endfor %}