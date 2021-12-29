**Shell Tools** lets you edit text using shell commands.

## Usage

Two commands are currently available:
- **Editor → Shell Tools → Filter with…**
- **Editor → Shell Tools → Run Selection**

**Filter with…** will ask for a shell command, then take the current selection, pipe it though that command, and replace the selection with the command output. If nothing is selected, the entire document will be filtered.

**Run Selection** will execute the current selection as a shell command.

Both commands will be executed using `/bin/sh` so complex commands like loops and pipelines *should* work fine.

### Configuration

To configure global preferences, open **Extensions → Extension Library...** then select Shell Tools' **Preferences** tab.
