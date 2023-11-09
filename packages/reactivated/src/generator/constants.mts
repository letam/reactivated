#!/usr/bin/env node

import fs from "fs";

// Must be above the compile import as get-stdin used by
// json-schema-to-typescript messes up the descriptor even if unused.
const stdinBuffer = fs.readFileSync(0);

import {
    Project,
    SourceFile,
    StructureKind,
    SyntaxKind,
    VariableDeclarationKind,
    WriterFunction,
    Writers,
} from "ts-morph";

const schema = JSON.parse(stdinBuffer.toString("utf8"));

const project = new Project();

const interfaces = project.createSourceFile("");

const {urls, templates, types, values} = schema;

for (const name of Object.keys(values)) {
    // Top level constants are deprecated.
    // Because enums and classes will often have dots and the like.
    if (name.includes(".")) {
        continue;
    }

    interfaces.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
            {
                name,
                initializer: Writers.assertion(
                    JSON.stringify(values[name], null, 4),
                    "const",
                ),
            },
        ],
    });
}

interfaces.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
        {
            name: "constants",
            initializer: Writers.assertion(JSON.stringify(values, null, 4), "const"),
        },
    ],
});

process.stdout.write(interfaces.getText());
