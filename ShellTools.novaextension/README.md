**Shell Tools** lets you edit text using shell commands.

## Usage

Three commands are currently available:
- **Editor → Shell Tools → Filter Text…**
- **Editor → Shell Tools → Run Selection**
- **Editor → Shell Tools → Insert Output…**

**Filter Text…** will ask for a shell command, then take the current selection, pipe it though that command, and replace the selection with the command output. If nothing is selected, the entire document will be filtered.

**Run Selection** will execute the current selection as a shell command.

**Insert Output…** will ask for a shell command and insert the output at the current cursor position.

All commands will be executed using `/bin/sh` (or whichever shell you choose in the configuration) so you can use complex commands like loops and pipelines.

### Configuration

To configure global preferences, open **Extensions → Extension Library...** then select Shell Tools' **Preferences** tab.
