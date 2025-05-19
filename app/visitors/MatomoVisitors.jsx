import Client from "./Client";
import { fetchData } from "../utils/fetchData";

// Function to fetch raw Matomo data from the API
async function fetchMatomoRawData(siteID, startDate, endDate) {
  "use server";

  const apiKey = process.env.MATOMO_API_KEY;
  const apiUrl = process.env.MATOMO_API_URL;

  if (!apiKey || !apiUrl) {
    console.warn(
      "MATOMO_API_KEY or MATOMO_API_URL not set. Skipping data fetch."
    );
    return null;
  }

  const matomoParams = {
    idSite: siteID,
    period: startDate && endDate ? "range" : "day",
    date:
      startDate && endDate ? `${startDate},${endDate}` : startDate || "today",
    format: "JSON",
    module: "API",
    method: "Live.getLastVisitsDetails",
    token_auth: apiKey,
    expanded: 1,
    filter_limit: -1,
  };

  const queryParams = new URLSearchParams(matomoParams).toString();
  const url = `${apiUrl}?${queryParams}`;
  console.log("Constructed URL:", url);

  const fetchedData = await fetchData(url);

  if (!fetchedData) {
    console.warn("No data fetched from Matomo.");
    return null;
  }

  return fetchedData;
}

// Function to process raw Matomo data (extract nodes and links)
function processMatomoData(fetchedData) {
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
    const regexL3S = /^https:\/\/www\.l3s\.de\/.*$/;
    const regexZenodo = /^https:\/\/zenodo\.org\/.*$/;
    const regexMedium = /^https:\/\/medium\.com\/.*$/;
    const regexCeur = /^https:\/\/ceur-ws\.org\/.*$/;

    if (url === "https://www.orkg.org/") return "ORKG main";

    const matchOrkg = url.match(regexOrkg);
    if (matchOrkg) {
      let nodePart = matchOrkg[1];
      if (nodePart === "u") return "user";
      if (nodePart.match(regexContribution)) return "contribution editor";
      if (nodePart.startsWith("comparison")) return "comparison?contributions";
      return nodePart;
    }

    if (regexDOI.test(url)) return "DOI link";
    if (regexGitTIB.test(url)) return "TIBHannover GitLab link";
    if (regexTIB.test(url)) return "tib.eu Link";
    if (regexScholar.test(url)) return "scholar.google Link";
    if (regexTIBBlog.test(url)) return "TIB Blog";
    if (regexL3S.test(url)) return "L3S Link";
    if (regexZenodo.test(url)) return "Zenodo Link";
    if (regexMedium.test(url)) return "Medium Link";
    if (regexCeur.test(url)) return "Ceur Link";

    return url; // fallback
  };

  fetchedData.forEach((visitor) => {
    let userPath = [];
    visitor.actionDetails.forEach((page) => {
      let pageUrlCut = processUrl(page.subtitle || "Unknown Page");
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

  const nodes = Array.from(nodesSet).map((node) => ({ id: node }));
  const links = Array.from(linksMap.values());

  return { nodes, links };
}

// Combined server function
async function fetchMatomoData(siteID, startDate, endDate) {
  "use server";
  const rawData = await fetchMatomoRawData(siteID, startDate, endDate);
  return rawData ? processMatomoData(rawData) : null;
}

// Server component to render
export default async function MatomoVisitors({
  siteID = 29,
  startDate,
  endDate,
}) {
  const processedData = await fetchMatomoData(siteID, startDate, endDate);

  if (!processedData) {
    return (
      <div className="text-center text-gray-500 p-4">
        No Matomo data available. Please check API configuration or try again
        later.
      </div>
    );
  }

  const { nodes, links } = processedData;

  return <Client data={{ nodes, links }} fetchMatomoData={fetchMatomoData} />;
}
