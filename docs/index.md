---
title: Programming by Stealth
opengraph:
  title: About Programming by Stealth
  description: The Programming by Stealth blog and podcast series
  url: https://pbs.bartificer.net/
---
# About

Programming by Stealth is an ongoing collaborative project between [Bart Busschots](https://bartb.ie/) of [Bartificer Creations](https://bartificer.net/) and Allison Sheridan of the [NosillaCast Apple Podcast](https://podfeet.com). The idea is to sneak up on real programming in small easy steps, using the allure of the web as the carrot to entice people forward.

Each instalment consists of an article written by Bart and an accompanying episode of our Programming By Stealth Podcast where Bart and Allison cover the same material in a conversational form. Allison's role is to play the proverbial _everyperson_ and pepper Bart with questions to help clarify the material (and to produce the podcast.) You can subscribe to the [Programming By Stealth podcast](https://podfeet.com/ccatp/pbs-rss.xml) directly in your podcatcher of choice, or listen from the embedded player in each instalment.

The series is intended to be evergreen, but if you play along in real-time you can join the community in the [Podfeet Slack](https://podfeet.com/slack). The challenges set in the series are definitely more fun in real time.

# Series Index

Looking for something in an instalment of Programming By Stealth? Check out the PBS Index, created by listener Dorothy. You can find the PBS Index at [bartb.ie/pbsindex](https://bartb.ie/pbsindex).

# Instalments

> # Note
> Most of the instalments linked below were automatically converted from HTML to Markdown in April 2020. The conversion may not always be perfect, but all mistakes are slowly being fixed as they're noticed. Feel free to submit pull requests on GitHub if you find and fix any problems 🙂
>
> A big thank-you to NosillaCastaway [Helma van der Linden](https://github.com/hepabolu) for doing the hard work of scripting the automatic conversion to Markdown.
{: .aside}

{% assign pbs_collection = site.collections | where: "label", "pbs" | first -%}
{% include instalmentList.html my_collection=pbs_collection %}

# <a name="tidbits"></a>Related Contents

* Bart occasionally makes posts related to the series, but not strictly a part of it:
  {% assign tidbits_collection = site.collections | where: "label", "tidbits" | first -%}
  {% include instalmentList.html my_collection=tidbits_collection %}
* A blog post by Allison Sheridan explaining how she added support for currencies with different numbers of decimal places to her sample solution to PBS 88: [When Currency Rate Decimals Go Wrong — www.podfeet.com/…](https://www.podfeet.com/blog/2020/02/when-currency-rate-decimals-go-wrong/)