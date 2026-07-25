# Maintained RTL fork

This fork keeps a small RTL/LTR assistant-output customization on top of
[`pingdotgg/t3code`](https://github.com/pingdotgg/t3code).

## Automation

- `Fork Sync` checks upstream every six hours and rebases the fork-specific
  commits onto `upstream/main`.
- A successful sync that changes application code dispatches `Fork Linux
Release`.
- `Fork Linux Release` publishes an x64 AppImage and Electron update manifest
  to this fork's GitHub Releases.
- A rebase conflict opens (or updates) an issue named `Automatic upstream sync
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
