const $ = (selector) => document.querySelector(selector);
const projectGrid = $("#project-grid");
const skillGrid = $("#skill-grid");
const serviceGrid = $("#service-grid");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
}
function renderPortfolio(data) {
  $("#availability").textContent = data.availability || "Available for projects";
  $("#intro").textContent = data.intro || "";
  $("#about-text").textContent = data.about || "";
  skillGrid.innerHTML = (data.skills || []).map(skill => `<span>${escapeHtml(skill)}</span>`).join("");
  serviceGrid.innerHTML = (data.services || []).map(([num, title, desc]) =>
    `<article class="service reveal"><b>${escapeHtml(num)}</b><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p></article>`).join("");
  projectGrid.innerHTML = (data.projects || []).map((project, i) =>
    `<article class="project reveal ${i === 0 ? "featured" : ""}">
      <div class="project-image"><span>${escapeHtml(project.category || "PROJECT")}</span></div>
      <div class="project-info"><small>${escapeHtml(project.category || "PROJECT")}</small><h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description)}</p><div class="tags">${(project.tags || []).map(tag => `<em>${escapeHtml(tag)}</em>`).join("")}</div>
      ${project.url ? `<a class="text-link" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">Explore Project ↗</a>` : ""}</div></article>`).join("");
  if (data.contact?.discord) {
    $("#discord-link").href = "https://discord.com/users/" + encodeURIComponent(data.contact.discord);
    $("#discord-link b").textContent = data.contact.discord + " ↗";
  }
  if (data.contact?.email) {
    $("#email-link").href = "mailto:" + data.contact.email;
    $("#email-link b").textContent = data.contact.email + " ↗";
  }
  observeReveals();
}
async function loadPortfolio() {
  try {
    const response = await fetch("/api/portfolio");
    if (!response.ok) throw new Error("Portfolio API unavailable");
    renderPortfolio(await response.json());
  } catch (error) { console.warn(error); }
}
function observeReveals() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
}
$("#menu").addEventListener("click", () => {
  const nav = $("#nav-links");
  const open = nav.classList.toggle("open");
  $("#menu").setAttribute("aria-expanded", String(open));
});
$("#nav-links").querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  $("#nav-links").classList.remove("open");
  $("#menu").setAttribute("aria-expanded", "false");
}));
$("#contact-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $("#submit-btn");
  const status = $("#form-status");
  button.disabled = true;
  button.textContent = "Sending…";
  status.textContent = "";
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not send message.");
    status.textContent = result.message;
    status.style.color = "#a3ff5f";
    form.reset();
  } catch (error) {
    status.textContent = error.message || "Network error. Please try again.";
    status.style.color = "#ff9b9b";
  } finally {
    button.disabled = false;
    button.textContent = "Send Message ↗";
  }
});
$("#year").textContent = new Date().getFullYear();
loadPortfolio();
observeReveals();