nova.commands.register("shellTools.promptFilter", promptFilter);
nova.commands.register("shellTools.runSelection", runSelection);
nova.commands.register("shellTools.insertOutput", insertOutput);

var LAST_FILTER_COMMAND_KEY = "gareth.computer.ShellTools.lastFilterCommand";
var LAST_INSERT_COMMAND_KEY = "gareth.computer.ShellTools.lastInsertCommand";
var RUN_SELECTION_OUTPUT_PREFIX_KEY = "computer.gareth.ShellTools.runSelection.prefix";

var COMMAND_INPUT_LABEL_TEXT = "Command:";
var COMMAND_INPUT_FILTER_PROMPT = "Filter";
var COMMAND_INPUT_INSERT_PROMPT = "Insert";

function promptFilter(editor) {
    var command = nova.config.get(LAST_FILTER_COMMAND_KEY);
    var options = { value: command, prompt: COMMAND_INPUT_FILTER_PROMPT };
    nova.workspace.showInputPanel(COMMAND_INPUT_LABEL_TEXT, options, (command) => {
        if (command) {
            filter(command, editor);
        }
    });
}

function filter(command, editor) {
    var range = !editor.selectedRange.empty
        ? editor.selectedRange
        : new Range(0, editor.document.length);

    var process = new Process("/bin/sh", { args: ["-c", command] });
    var text = editor.getTextInRange(range);
    Promise.filter(process, text).then((formatted) => {
        editor.edit((e) => {
            e.replace(range, formatted);
        });
    })
    .then(() => {
        nova.config.set(LAST_FILTER_COMMAND_KEY, command);
    })
    .catch((error) => {
        nova.workspace.showErrorMessage(error);
    });
}

Promise.filter = (process, text) => {
    return new Promise((resolve, reject) => {
        var formatted = "", error = "";

        process.onStdout((line) => {
            formatted += line;
        });

        process.onStderr((line) => {
            console.error("stderr:", line);
            error += line;
        });

        process.onDidExit((status) => {
            console.log("finished with status", status);
            if (status != 0) {
                console.error("process finished with non-zero status");
                reject(error);
                return;
            }
            resolve(formatted);
        });

        console.log("launching process with args:", process.args);
        process.start();
        var writer = process.stdin.getWriter();
        writer.ready.then(() => {
            return writer.write(text);
        });
        writer.ready.then(() => {
            writer.close();
        });
    });
};

Promise.execute = (process) => {
    return new Promise((resolve, reject) => {
        var formatted = "", error = "";

        process.onStdout((line) => {
            formatted += line;
        });

        process.onStderr((line) => {
            console.error("stderr:", line);
            error += line;
        });

        process.onDidExit((status) => {
            console.log("finished with status", status);
            if (status != 0) {
                console.error("process finished with non-zero status");
                reject(error);
                return;
            }
            resolve(formatted);
        });

        console.log("launching process with args:", process.args);
        process.start();
    });
};

function runSelection(editor) {
    var range = editor.selectedRange;
    var command = editor.getTextInRange(range);
    var process = new Process("/bin/sh", { args: ["-c", command] });
    var prefix = nova.config.get(RUN_SELECTION_OUTPUT_PREFIX_KEY);
    Promise.execute(process).then((output) => {
        var formatted = output;
        if (formatted.endsWith("\n")) {
            formatted = formatted.substring(0, formatted.length-1);
        }
        formatted = formatted.split("\n").map((line) => {
            return prefix + line;
        }).join("\n");
        editor.edit((e) => {
            e.insert(range.end, "\n" + formatted);
        });
    })
    .catch((error) => {
        nova.workspace.showErrorMessage(error);
    });
}

function insertOutput(editor) {
    var command = nova.config.get(LAST_INSERT_COMMAND_KEY);
    var options = { value: command, prompt: COMMAND_INPUT_INSERT_PROMPT };
    nova.workspace.showInputPanel(COMMAND_INPUT_LABEL_TEXT, options, (command) => {
        if (command) {
            insert(command, editor);
        }
    });
}

function insert(command, editor) {
    var range = editor.selectedRange;
    var process = new Process("/bin/sh", { args: ["-c", command] });
    Promise.execute(process).then((output) => {
        var formatted = output;
        if (formatted.endsWith("\n")) {
            formatted = formatted.substring(0, formatted.length-1);
        }
        editor.edit((e) => {
            e.insert(range.end, formatted);
        });
    })
    .then(() => {
        nova.config.set(LAST_INSERT_COMMAND_KEY, command);
    })
    .catch((error) => {
        nova.workspace.showErrorMessage(error);
    });
}
