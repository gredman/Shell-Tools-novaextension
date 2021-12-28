nova.commands.register("shellTools.promptFilter", promptFilter);

function promptFilter(editor) {
    nova.workspace.showInputPanel("Command", {}, (command) => {
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
