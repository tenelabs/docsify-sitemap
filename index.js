let generatedXML = "";

window.showToast = function (text, duration = 3000) {
  Toastify({
    text,
    duration,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#333",
      color: "#fff",
      borderRadius: "5px",
    },
  }).showToast();
};

document.getElementById("sitemapForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  // for (const [key, value] of data.entries()) {
  //   console.log(`${key}: ${value}`);
  // }

  const website = data.get("website")?.trim();
  const owner = data.get("owner")?.trim();
  const repo = data.get("repo")?.trim();
  const base = data.get("base")?.trim();
  const branch = data.get("branch")?.trim();
  const pat = data.get("pat")?.trim();

  const output = document.querySelector(".output pre code");
  const downloadBtn = document.getElementById("downloadBtn");

  output.textContent = "Generating sitemap...";
  downloadBtn.disabled = true;
  document.getElementById("output").scrollIntoView({ behavior: "smooth" });
  try {
    showToast("Generating sitemap...");
    generatedXML = await generateSitemap({
      website,
      owner,
      repo,
      base,
      branch,
      pat,
    });
    output.textContent = generatedXML;
    Prism.highlightElement(output);
    showToast("Sitemap generated successfully");
    downloadBtn.disabled = false;
  } catch (err) {
    console.error(err);
    output.textContent = "Failed to generate sitemap. See console for details.";
    showToast("Failed to generate sitemap");
  }
});

export async function generateSitemap({ website, owner, repo, base, pat }) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${website}/</loc>
  </url>
</urlset>`;
  return sitemap;
}

(function init() {
  fetch("./package.json")
    .then((res) => res.json())
    .then((pkg) => {
      document.getElementById("version").textContent = `v${pkg.version}`;
    })
    .catch((err) => {
      console.error("Failed to load version:", err);
    });

  fetch("./README.md")
    .then((res) => res.text())
    .then((md) => {
      document.getElementById("content").innerHTML = marked.parse(md);
      buildTOC();
    })
    .catch((err) => {
      console.error("Failed to load README:", err);
    });

  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  const form = document.getElementById("sitemapForm");

  form.addEventListener("input", () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem("sitemapFormData", JSON.stringify(data));
  });

  const saved = localStorage.getItem("sitemapFormData");
  if (saved) {
    const data = JSON.parse(saved);
    for (const [key, value] of Object.entries(data)) {
      const input = form.elements[key];
      if (input) input.value = value;
    }
  }
})();

window.copy = function () {
  if (!generatedXML) {
    showToast("Click 'Generate Sitemap' to start.");
    return;
  }
  navigator.clipboard
    .writeText(generatedXML)
    .then(() => {
      showToast("Sitemap copied to clipboard.");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard.");
    });
};

window.downloadSitemap = function () {
  if (!generatedXML) {
    showToast("No sitemap generated yet");
    return;
  }

  const blob = new Blob([generatedXML], { type: "application/xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sitemap.xml";
  link.click();
};

function buildTOC() {
  const headings = Array.from(
    document.querySelectorAll("#docs h1, #docs h2, #docs h3")
  );
  const tocContainer = document.getElementById("toc");
  if (!tocContainer || headings.length === 0) return;

  const firstH1Index = headings.findIndex((h) => h.tagName === "H1");
  if (firstH1Index === -1 || firstH1Index === headings.length - 1) return;

  const relevantHeadings = headings.slice(firstH1Index + 1);

  const tocList = document.createElement("ol");
  tocList.className = "toc-list";

  relevantHeadings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    const text = heading.textContent;
    const id = heading.id || text.toLowerCase().replace(/[^\w]+/g, "-");
    heading.id = id;

    const li = document.createElement("li");
    li.style.marginLeft = `${(level - 1) * 25}px`;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = text;

    li.appendChild(link);
    tocList.appendChild(li);
  });

  tocContainer.innerHTML = "<h3>Table of Contents</h3>";
  tocContainer.appendChild(tocList);
}
