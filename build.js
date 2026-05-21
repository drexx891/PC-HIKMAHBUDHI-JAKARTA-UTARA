const fs = require('fs');

const sourceHtml = fs.readFileSync('opini.html', 'utf8');
const sejarahHtml = fs.readFileSync('sejarah.html', 'utf8');

function extractSection(id) {
    const regex = new RegExp(`(<section id="${id}"[\\s\\S]*?</section>)`, 'i');
    const match = sourceHtml.match(regex);
    if (!match) return '';
    
    const beforeSection = sourceHtml.substring(0, match.index);
    const commentMatch = beforeSection.match(/(<!-- ============================================================\s*.*?\s*============================================================ -->\s*)$/);
    if (commentMatch) {
        return commentMatch[1] + match[1];
    }
    return match[1];
}

const sections = {
    'tentang': { title: 'Tentang Kami', file: 'tentang.html', content: extractSection('tentang') },
    'visi-misi': { title: 'Visi dan Misi', file: 'visi-misi.html', content: extractSection('visi-misi') },
    'pengurus': { title: 'Susunan Pengurus', file: 'pengurus.html', content: extractSection('pengurus') },
    'ikrar': { title: 'Ikrar HIKMAHBUDHI', file: 'ikrar.html', content: extractSection('ikrar') },
    'badan-otonom': { title: 'Badan Otonom', file: 'badan-otonom.html', content: extractSection('badan-otonom') },
    'kaderisasi': { title: 'Kaderisasi', file: 'kaderisasi.html', content: extractSection('kaderisasi') },
    'opini': { title: 'Opini', file: 'opini.html', content: extractSection('opini') }
};

// What about berita? Opini was the last one that survived? Let's check if opini.html has berita.
const hasBerita = sourceHtml.includes('id="berita"');
console.log('Opini has berita:', hasBerita);
if (hasBerita) {
    sections['berita'] = { title: 'Berita', file: 'berita.html', content: extractSection('berita') };
} else {
    // If not in opini.html, we can extract from index.html.bak or the current STAGED index.html which has berita.
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const beritaMatch = indexHtml.match(/(<section id="berita"[\s\S]*?<\/section>)/i);
    if (beritaMatch) {
        const beforeSection = indexHtml.substring(0, beritaMatch.index);
        const commentMatch = beforeSection.match(/(<!-- ============================================================\s*.*?\s*============================================================ -->\s*)$/);
        const content = commentMatch ? commentMatch[1] + beritaMatch[1] : beritaMatch[1];
        sections['berita'] = { title: 'Berita', file: 'berita.html', content: content };
    }
}

const breadcrumbStart = sejarahHtml.indexOf('<h1 class="breadcrumb-title"');
const titleStart = sejarahHtml.indexOf('>', breadcrumbStart) + 1;
const titleEnd = sejarahHtml.indexOf('</h1>', titleStart);

const contentAreaRegex = /<!-- ={60}\s*TIMELINE CONTENT\s*={60} -->[\s\S]*?(?=<!-- ={60}\s*FOOTER\s*={60} -->)/;

const navReplacements = [
    { from: /href="index\.html#beranda"/g, to: 'href="index.html"' },
    { from: /href="#beranda"/g, to: 'href="index.html"' },
    { from: /href="index\.html#tentang"/g, to: 'href="tentang.html"' },
    { from: /href="#tentang"/g, to: 'href="tentang.html"' },
    { from: /href="index\.html#sejarah"/g, to: 'href="sejarah.html"' },
    { from: /href="#sejarah"/g, to: 'href="sejarah.html"' },
    { from: /href="index\.html#visi-misi"/g, to: 'href="visi-misi.html"' },
    { from: /href="#visi-misi"/g, to: 'href="visi-misi.html"' },
    { from: /href="index\.html#pengurus"/g, to: 'href="pengurus.html"' },
    { from: /href="#pengurus"/g, to: 'href="pengurus.html"' },
    { from: /href="index\.html#ikrar"/g, to: 'href="ikrar.html"' },
    { from: /href="#ikrar"/g, to: 'href="ikrar.html"' },
    { from: /href="index\.html#berita"/g, to: 'href="berita.html"' },
    { from: /href="#berita"/g, to: 'href="berita.html"' },
    { from: /href="index\.html#badan-otonom"/g, to: 'href="badan-otonom.html"' },
    { from: /href="#badan-otonom"/g, to: 'href="badan-otonom.html"' },
    { from: /href="index\.html#opini"/g, to: 'href="opini.html"' },
    { from: /href="#opini"/g, to: 'href="opini.html"' },
    { from: /href="index\.html#kaderisasi"/g, to: 'href="kaderisasi.html"' },
    { from: /href="#kaderisasi"/g, to: 'href="kaderisasi.html"' },
    { from: /href="index\.html#kontak"/g, to: 'href="#kontak"' }
];

function applyNavReplacements(html) {
    let result = html;
    for (const r of navReplacements) {
        result = result.replace(r.from, r.to);
    }
    return result;
}

for (const key in sections) {
    const sec = sections[key];
    if (!sec.content) continue;
    
    let html = sejarahHtml;
    // Replace Title
    html = html.substring(0, titleStart) + sec.title + html.substring(titleEnd);
    
    // Breadcrumb trail
    const trailRegex = /<li>[^<]*?<\/li>\s*(?=<\/ul>)/;
    html = html.replace(trailRegex, `<li>${sec.title}</li>\n            `);
    
    // Replace content
    html = html.replace(contentAreaRegex, sec.content + '\n\n  ');
    html = applyNavReplacements(html);
    
    fs.writeFileSync(sec.file, html);
    console.log('Fixed ' + sec.file);
}

// Ensure index.html is also updated correctly with only Hero, Stats, Sambutan, Berita
const indexHtml = fs.readFileSync('index.html', 'utf8');
const sambutanRegex = /(<!-- ============================================================\s*SAMBUTAN KETUA\s*============================================================ -->\s*<section class="cta-section">[\s\S]*?<\/section>)/;
const sambutanMatch = indexHtml.match(sambutanRegex);
const sambutanContent = sambutanMatch ? sambutanMatch[1] : '';

const indexTentangStart = indexHtml.indexOf('<!-- ============================================================\r\n       TENTANG KAMI / ABOUT');
const indexTentangStartFallback = indexHtml.indexOf('<!-- ============================================================\n       TENTANG KAMI / ABOUT');
const startIndex = indexTentangStart !== -1 ? indexTentangStart : indexTentangStartFallback;

const indexBeritaStart = indexHtml.indexOf('<!-- ============================================================\r\n       BERITA / NEWS');
const indexBeritaStartFallback = indexHtml.indexOf('<!-- ============================================================\n       BERITA / NEWS');
const endIndex = indexBeritaStart !== -1 ? indexBeritaStart : indexBeritaStartFallback;

if (startIndex !== -1 && endIndex !== -1) {
    let newIndexHtml = indexHtml.substring(0, startIndex) + sambutanContent + '\n\n  ' + indexHtml.substring(endIndex);
    newIndexHtml = applyNavReplacements(newIndexHtml);
    fs.writeFileSync('index.html', newIndexHtml);
    console.log('Updated index.html');
}
