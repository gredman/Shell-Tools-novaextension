**Shell Tools** lets you edit text using shell commands.

## Usage

Three commands are currently available:
- **Editor → Shell Tools → Filter Text…**
- **Editor → Shell Tools → Insert Output…**
- **Editor → Shell Tools → Run Selection**

**Filter Text…** will ask for a shell command, then take the current selection, pipe it though that command, and replace the selection with the command output. If nothing is selected, the entire document will be filtered.

**Insert Output…** will ask for a shell command and insert the output at the current cursor position, overwriting the current selection.

**Run Selection** will execute the current selection as a shell command.

All commands will be executed using `/bin/sh` (or whichever shell you choose in the configuration) so you can use complex commands like loops and pipelines.

### Configuration

To configure global preferences, open **Extensions → Extension Library...** then select Shell Tools' **Preferences** tab.

### Examples

## Filters

- Remove lines starting with '#': `grep -v '^#'`
- Sort lines and remove duplicates: `sort | uniq`
- Base64 encode: `base64`
- Swift Format: `swiftformat`

## Inserts

- Timestamp: `date`
- New UUID: `uuidgen`
- Full path to an executable: `which ruby`
- Math: `echo $(( 1 + 1 ))`
