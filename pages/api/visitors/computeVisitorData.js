// app/api/visitors/computeVisitorData.js
export function computeVisitorData(fetchedData) {
    const nodesSet = new Set();
    const linksMap = new Map();

    const processUrl = (url) => {
        const regexOrkg = /orkg\.org\/([^\/?]+)/;
        const regexContribution = /^contribution-editor/;
        const regexDOI = /^https:\/\/doi\.org\/.*$/;
        const regexGitTIB = /^https:\/\/gitlab\.com\/TIBHannover\/.*$/;
        const regexTIB = /^https:\/\/www\.tib\.eu\/.*$/;
        const regexScholar = /^https:\/\/scholar\.google\.com\/.*$/;
        const regexTIBBlog = /^https:\/\/blogs\.tib\.eu\/.*$/;
        const regexL3S= /^https:\/\/www\.l3s\.de\/.*$/;
        const regexZenodo= /^https:\/\/zenodo\.org\/.*$/;
        const regexMedium= /^https:\/\/medium\.com\/.*$/;
        const regexCeur= /^https:\/\/ceur-ws\.org\/.*$/;

        if (url === "https://www.orkg.org/") {
            return "ORKG main";
        }

        const matchOrkg = url.match(regexOrkg);
        if (matchOrkg) {
            let nodePart = matchOrkg[1];
            if (nodePart === "u") return "user";
            if (nodePart.match(regexContribution)) return "contribution editor";
            if (nodePart.startsWith("comparison")) return "comparison?contributions";
            return nodePart;
        }

        if (regexDOI.test(url)) {
            return "DOI link";
        }
        if (regexGitTIB.test(url)) {
            return "TIBHannover GitLab link";
        }
        if (regexTIB.test(url)) {
            return "tib.eu Link";
        }
        if (regexScholar.test(url)) {
            return "scholar.google Link";
        }
        if (regexTIBBlog.test(url)) {
            return "TIB Blog";
        }
        if (regexL3S.test(url)) {
            return "L3S Link";
        }
        if (regexZenodo.test(url)) {
            return "Zenodo Link";
        }
        if (regexMedium.test(url)) {
            return "Medium Link";
        }
        if (regexCeur.test(url)) {
            return "Ceur Link";
        }

        return url;
    };

    fetchedData.forEach(visitor => {
        let userPath = [];
        visitor.actionDetails.forEach(page => {
            let pageUrlCut = processUrl(page.subtitle || 'Unknown Page');
            userPath.push(pageUrlCut);
            nodesSet.add(pageUrlCut);
        });

        for (let i = 0; i < userPath.length - 1; i++) {
            const source = userPath[i];
            const target = userPath[i + 1];
            const linkKey = `${source}->${target}`;

            if (linksMap.has(linkKey)) {
                linksMap.get(linkKey).value += 1;
            } else {
                linksMap.set(linkKey, { source, target, value: 1 });
            }
        }
    });

    const nodes = Array.from(nodesSet).map(node => ({ id: node }));
    const links = Array.from(linksMap.values());

    return { nodes, links };
}
