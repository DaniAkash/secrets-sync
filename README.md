# secrets-sync 🔐

**Secrets Sync** is a powerful CLI tool to manage and sync your secrets, dotfiles, and configuration files to AWS S3 with full end-to-end (E2E) encryption. It ensures your sensitive data is securely stored and easily accessible across machines.

## Features

- **End-to-End Encryption**: Your files are encrypted locally before uploading to S3.
- **Simple Push & Pull Commands**: Sync secrets or configuration files with ease.
- **Secure Initialization**: Set up your environment with S3 credentials and an encryption password.
- **Overwrite Control**: Decide whether to overwrite files during push or pull operations.

## Installation

To install `secrets-sync`, use npm or any of your favorite package manager:

```bash
npm install -g secrets-sync
```

## Usage

Run `secrets-sync --help` to see the available commands and options:

```
Usage: secrets-sync [options] [command]

Sync Secrets, dotfiles and config files to S3 with full E2E encryption

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  init                        Initialize secrets-sync on a new machine with S3 credentials and encryption password.
  push [options] <file-name>  Push a secret / config file to S3.
  pull [options] <file-name>  Pull a secret / config file from S3.
  help [command]              display help for command
```

### Commands

1. `init`

Initialize secrets-sync on a new machine. You’ll be prompted to set up your S3 credentials and an encryption password.

```
secrets-sync init
```

2. `push`

Push a secret or config file to S3.

```
Usage: secrets-sync push [options] <file-name>

Push a secret / config file to S3.

Arguments:
  file-name          Name of the file to push to S3.

Options:
  -o, --overwrite    Overwrite the file if it already exists. (default: false)
  -p, --path <path>  Path to the file to push to S3.
  -h, --help         display help for command
```

3. `pull`

Pull a secret or config file from S3.

```
Usage: secrets-sync pull [options] <file-name>

Pull a secret / config file from S3.

Arguments:
  file-name          Name of the file to pull from S3.

Options:
  -o, --overwrite    Overwrite the file if it already exists. (default: false)
  -p, --path <path>  Path to save the file.
  -h, --help         display help for command
```

