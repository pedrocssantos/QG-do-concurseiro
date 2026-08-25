const fs = require('fs');

let content = fs.readFileSync('src/app.ts', 'utf8');

// Fix Escape key logic
content = content.replace(/document\.querySelectorAll\("\.modal-dialog:not\(\.hidden\)"\)\.forEach\(m => m\.close\(\)\);/g, 'document.querySelectorAll("dialog[open]").forEach(m => (m as HTMLDialogElement).close());');

// Fix close btn logic
content = content.replace(/const modal = btn\.closest\("\.modal-dialog"\);\s*if \(modal\) modal\.close\(\);/g, 'const modal = btn.closest(".modal-dialog") as HTMLDialogElement;\n        if (modal) modal.close();');

// Fix overlay click logic
// overlay.close() needs cast
content = content.replace(/overlay\.addEventListener\("click", \(e\) => {\s*if \(e\.target === overlay\) {\s*overlay\.close\(\);\s*}\s*}\);/g, 'overlay.addEventListener("click", (e) => {\n        if (e.target === overlay) {\n          (overlay as HTMLDialogElement).close();\n        }\n      });');

fs.writeFileSync('src/app.ts', content);
