import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(file);
  }
}
walk(sourceRoot);
assert.ok(sourceFiles.length >= 5, 'Expected TypeScript source files');
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
    },
  });
  const errors = (result.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `${path.relative(root, file)} has TypeScript/TSX syntax errors`);
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
assert.equal(manifest.name, 'Driving School Simulator');
assert.ok(manifest.icons.length > 0, 'PWA manifest should define an icon');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.ok(packageJson.dependencies.react && packageJson.dependencies.three);
const original = path.join(root, 'reference', 'ORIGINAL_PROJECT.zip');
assert.ok(fs.statSync(original).size > 0, 'Original ZIP reference must be present');
const runtimeFiles = sourceFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
assert.ok(!/from\s+['"]https?:\/\//.test(runtimeFiles), 'Runtime source must not import remote modules');
assert.ok(!/https?:\/\//.test(runtimeFiles), 'Runtime source must not contain remote service URLs');
console.log(`PASS: ${sourceFiles.length} TypeScript/TSX files transpile without syntax diagnostics.`);
console.log('PASS: PWA manifest, local dependency declarations and original archive reference exist.');
console.log('PASS: No remote imports or remote service URLs found in runtime TypeScript source.');
console.log('NOTE: This is a source-level check, not a full typecheck, app build, browser test or device test.');
