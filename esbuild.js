/* Minimal, watch-friendly build for a VS Code extension */
const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    outfile: 'dist/extension.js',
    external: ['vscode'], // VS Code injects this module
    logLevel: 'info'
  });

  if (watch) {
    console.log('[watch] build started');
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
