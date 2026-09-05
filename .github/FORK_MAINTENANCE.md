# Maintained RTL fork

This fork keeps a small RTL/LTR assistant-output customization on top of
[`pingdotgg/t3code`](https://github.com/pingdotgg/t3code).

## Automation

- `Fork Sync` checks upstream every six hours and merges `upstream/main` into
  the fork, preserving previous conflict resolutions. Changes to its workflow
  also trigger a sync to verify the automation immediately.
- A push to `main` that changes application code triggers `Fork Linux Release`,
  including pushes created by automatic syncs and manual conflict resolution.
- `Fork Linux Release` publishes an x64 AppImage and Electron update manifest
  to this fork's GitHub Releases.
- A merge conflict opens (or updates) an issue named `Automatic upstream sync
conflict` and leaves `main` unchanged.

The original upstream release, relay deployment, and CI workflows are disabled
in this fork because they depend on private upstream infrastructure and
credentials.

## Local remotes

The intended local layout is:

```text
origin    https://github.com/hermon586/t3code.git
upstream  https://github.com/pingdotgg/t3code.git
```

The previous automatic-direction implementation is preserved in the
`archive/bidi-auto-20260718` branch.
