<img src="logo/logo.png" />

**Octo Domain Watcher** is a tool that lets you keep a watchful eye on when a domain becomes available right on GitHub.

[![App](https://github.com/nicholasodonnell/octo-domain-watcher/actions/workflows/app.yml/badge.svg)](https://github.com/nicholasodonnell/octo-domain-watcher/actions/workflows/app.yml)

## Usage

Simply [submit a new issue](https://github.com/nicholasodonnell/octo-domain-watcher/issues/new?assignees=&labels=watch-domain&template=domainWatcherIssueTemplate.md&title=%3Cdomain%3E) with the title set to the domain you want to be notified about. When it becomes available you will receive a comment!

This tool runs about once every hour. If you need something more frequent (or private) simply clone this repository and change the [`cron`](/.github/workflows/app.yml#L5) value.
