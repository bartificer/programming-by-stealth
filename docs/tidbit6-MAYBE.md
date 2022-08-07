# PBS Tibit 6 of Y — Lessons Learned from Porting This-Ti.me to Webpack

TO DO

## Matching Podcast Episode

TO DO

## Preparation — re-factor all-in-one HTML File to 3 Files

index.html → src/index.html + src/index.js + src/index.css

## Phase 1 — Straight Migration to Webpack

```sh
npm init
```

Need to fall back to Bootstrap 4

```sh
npm install --save bootstrap@4
```

Need to fall back to Font Awesome 5

```sh
npm install --save @fortawesome/fontawesome-free@5
```

Need to fall back to JSCookie 2

```sh
npm install --save js-cookie@2
```

Other libs were fine at full current version:

```sh
npm install --save jquery bootstrap-4-autocomplete moment tempusdominus-bootstrap-4 urijs mustache is_js @bartificer/human-join

## TO DO

Migrate to new is-js replacement

