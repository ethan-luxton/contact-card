const contact = {
  firstName: "Ethan",
  lastName: "Luxton",
  title: "Wealth Management Associate, FPQP®",
  company: "Coldstream Wealth Management",
  email: "ethan.luxton@coldstream.com",
  phone: "+14254633048",
  displayPhone: "+1 (425) 463-3048",
  website: "https://coldstream.com",
  linkedin: "https://www.linkedin.com/in/ethan-luxton",
  linkedinLabel: "linkedin.com/in/ethan-luxton",
  bio: "I assist clients with every aspect of their financial planning and wealth management needs. From estate planning to tax planning, and everything in-between, we have you covered.",
  profileImage: "assets/ethan-luxton.svg",
};

const toast = document.querySelector("#toast");
let toastTimer;

function renderContact() {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const description = `${fullName}'s digital work contact card. Save contact details or share instantly.`;

  document.title = `${fullName} — Contact`;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = `${fullName} — ${contact.company}`;

  document.querySelector("#profile-name").textContent = fullName;
  document.querySelector("#job-title").textContent = contact.title;
  document.querySelector("#company-name").textContent = contact.company;
  document.querySelector("#company-mark").textContent = contact.company
    .split(/\s+/)
    .filter((word) => !["and", "&", "the"].includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  document.querySelector("#role-company").textContent = contact.company;
  document.querySelector("#contact-bio").textContent = contact.bio;

  const companyLink = document.querySelector("#company-link");
  companyLink.href = contact.website;
  companyLink.setAttribute("aria-label", `${contact.company} website`);

  const profileImage = document.querySelector("#profile-image");
  profileImage.src = contact.profileImage;
  profileImage.alt = `Portrait of ${fullName}`;

  const emailLink = document.querySelector("#email-link");
  emailLink.href = `mailto:${contact.email}`;
  document.querySelector("#email-address").textContent = contact.email;

  const phoneLink = document.querySelector("#phone-link");
  phoneLink.href = `tel:${contact.phone}`;
  document.querySelector("#phone-number").textContent = contact.displayPhone;

  const linkedinLink = document.querySelector("#linkedin-link");
  linkedinLink.href = contact.linkedin;
  document.querySelector("#linkedin-label").textContent = contact.linkedinLabel;
}

renderContact();

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

function createVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${contact.lastName};${contact.firstName};;;`,
    `FN:${contact.firstName} ${contact.lastName}`,
    `ORG:${contact.company}`,
    `TITLE:${contact.title}`,
    `TEL;TYPE=WORK,VOICE:${contact.phone}`,
    `EMAIL;TYPE=WORK:${contact.email}`,
    `URL:${contact.website}`,
    `URL;TYPE=LinkedIn:${contact.linkedin}`,
    "END:VCARD",
  ].join("\r\n");
}

document.querySelector("#save-contact").addEventListener("click", (event) => {
  event.preventDefault();
  const file = new Blob([createVCard()], { type: "text/vcard;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `${contact.firstName}-${contact.lastName}.vcf`.toLowerCase();
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast("Contact card ready to save");
});

async function shareContact() {
  const shareData = {
    title: `${contact.firstName} ${contact.lastName} — ${contact.company}`,
    text: `${contact.firstName} ${contact.lastName}\n${contact.title} at ${contact.company}\n${contact.email}\n${contact.displayPhone}`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error.name !== "AbortError") showToast("Sharing wasn’t available. Try copying the link.");
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    showToast("Contact details copied");
  } catch {
    showToast("Copy this page’s address to share it");
  }
}

document.querySelectorAll("#share-top, #share-contact, #tap-share").forEach((button) => {
  button.addEventListener("click", shareContact);
});
