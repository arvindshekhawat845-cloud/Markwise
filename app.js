// MARKWISE - BRAND GOVERNANCE SYSTEM

let reviews = [];
let editingRuleId = null;

// Default brand rules
const defaultGuidelines = [
  {
    id: "RULE-001",
    title: "Terminology",
    description: 'Always use "learners" instead of "customers".',
    category: "Terminology",
    severity: "Medium",
    keyword: "customers",
    correction: "learners"
  },
  {
    id: "RULE-002",
    title: "Brand Voice",
    description: "Use a professional, friendly and helpful tone.",
    category: "Tone",
    severity: "Low",
    keyword: "",
    correction: ""
  },
  {
    id: "RULE-003",
    title: "Prohibited Claims",
    description: "Never use guarantee claims for results.",
    category: "Prohibited Claims",
    severity: "High",
    keyword: "guarantee",
    correction: "aim to"
  },
  {
    id: "RULE-004",
    title: "Success Claims",
    description: "Do not make unsupported 100% success claims.",
    category: "Prohibited Claims",
    severity: "High",
    keyword: "100%",
    correction: ""
  },
  {
    id: "RULE-005",
    title: "Brand Colours",
    description: "Use approved brand colours in visual materials.",
    category: "Visual Identity",
    severity: "Low",
    keyword: "",
    correction: ""
  }
];

let guidelines = [];

// Load saved data
function loadSavedData() {
  try {
    const savedRules = localStorage.getItem("markwiseGuidelines");
    guidelines = savedRules ? JSON.parse(savedRules) : defaultGuidelines;

    if (!Array.isArray(guidelines)) {
      guidelines = defaultGuidelines;
    }

    const savedReviews = JSON.parse(
      localStorage.getItem("markwiseReviews") || "[]"
    );

    reviews = Array.isArray(savedReviews) ? savedReviews : [];

  } catch (error) {
    guidelines = defaultGuidelines;
    reviews = [];
  }

  saveGuidelines();
}

// Save rules
function saveGuidelines() {
  localStorage.setItem(
    "markwiseGuidelines",
    JSON.stringify(guidelines)
  );
}

// Navigation
function showPage(id, button) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  updateDashboard();

  if (id === "guidelines") {
    renderGuidelines();
  }
}

// Display all guidelines
function renderGuidelines() {
  const list = document.getElementById("guidelineList");

  list.innerHTML = "";

  document.getElementById("guidelineCount").textContent =
    guidelines.length;

  document.getElementById("totalRules").textContent =
    guidelines.length;

  if (guidelines.length === 0) {
    list.textContent = "No brand rules added yet.";
    return;
  }

  guidelines.forEach(rule => {
    const box = document.createElement("div");
    box.className = "item";

    const title = document.createElement("strong");
    title.textContent = rule.id + " · " + rule.title;

    const description = document.createElement("p");
    description.textContent = rule.description;

    const category = document.createElement("span");
    category.className = "tag blue";
    category.textContent = rule.category;

    const severity = document.createElement("span");
    severity.className = "tag";
    severity.textContent = rule.severity + " Severity";

    box.append(title, description, category, severity);

    const editButton = document.createElement("button");
    editButton.className = "secondary";
    editButton.textContent = "Edit";

    editButton.onclick = () => editRule(rule.id);

    const deleteButton = document.createElement("button");
    deleteButton.className = "secondary";
    deleteButton.textContent = "Delete";

    deleteButton.onclick = () => deleteRule(rule.id);

    box.append(editButton, deleteButton);

    list.appendChild(box);
  });
}

// Add or update a rule
function saveRule(event) {
  event.preventDefault();

  const title = document.getElementById("ruleTitle").value.trim();
  const description =
    document.getElementById("ruleDescription").value.trim();

  const category = document.getElementById("ruleCategory").value;
  const severity = document.getElementById("ruleSeverity").value;

  const keyword =
    document.getElementById("ruleKeyword").value.trim();

  const correction =
    document.getElementById("ruleCorrection").value.trim();

  if (!title || !description || !keyword) {
    document.getElementById("guidelineMessage").textContent =
      "Please fill all required fields, including trigger word.";
    return;
  }

  if (editingRuleId !== null) {
    const rule = guidelines.find(r => r.id === editingRuleId);

    if (rule) {
      Object.assign(rule, {
        title,
        description,
        category,
        severity,
        keyword,
        correction
      });
    }

    document.getElementById("guidelineMessage").textContent =
      "Rule updated successfully!";
  } else {
    const newRule = {
      id: "RULE-" + String(Date.now()).slice(-6),
      title,
      description,
      category,
      severity,
      keyword,
      correction
    };

    guidelines.push(newRule);

    document.getElementById("guidelineMessage").textContent =
      "New rule added successfully!";
  }

  saveGuidelines();
  cancelRuleEdit();
  renderGuidelines();
  updateDashboard();
}

// Edit a rule
function editRule(id) {
  const rule = guidelines.find(r => r.id === id);

  if (!rule) return;

  editingRuleId = id;

  document.getElementById("ruleTitle").value = rule.title;
  document.getElementById("ruleDescription").value =
    rule.description;
  document.getElementById("ruleCategory").value = rule.category;
  document.getElementById("ruleSeverity").value = rule.severity;
  document.getElementById("ruleKeyword").value = rule.keyword;
  document.getElementById("ruleCorrection").value =
    rule.correction;

  document.getElementById("guidelineFormTitle").textContent =
    "Edit Brand Rule";

  document.getElementById("saveRuleButton").textContent =
    "Update Rule";

  document.getElementById("cancelEditButton").style.display =
    "inline-block";

  document.getElementById("guidelineForm").scrollIntoView({
    behavior: "smooth"
  });
}

// Cancel editing
function cancelRuleEdit() {
  editingRuleId = null;

  document.getElementById("guidelineForm").reset();

  document.getElementById("guidelineFormTitle").textContent =
    "Add a Brand Rule";

  document.getElementById("saveRuleButton").textContent =
    "Add Rule";

  document.getElementById("cancelEditButton").style.display =
    "none";
}

// Delete a rule
function deleteRule(id) {
  const confirmed = confirm("Are you sure you want to delete this rule?");

  if (!confirmed) return;

  guidelines = guidelines.filter(rule => rule.id !== id);

  saveGuidelines();
  renderGuidelines();
  updateDashboard();
}
// CONTENT REVIEW SYSTEM

function checkContent() {
  const input = document.getElementById("contentInput");
  const content = input.value.trim();
  const results = document.getElementById("results");

  results.innerHTML = "";

  if (!content) {
    results.textContent = "Please enter some content first.";
    return;
  }

  let issues = [];

  // Check every active brand rule
  guidelines.forEach(rule => {
    if (!rule.keyword) return;

    const escaped = rule.keyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(escaped, "i");

    if (regex.test(content)) {
      issues.push({
        name: rule.title,
        source: rule.id,
        severity: rule.severity,
        suggestion: rule.correction
          ? "Replace '" + rule.keyword + "' with '" +
            rule.correction + "'."
          : rule.description,
        keyword: rule.keyword,
        correction: rule.correction
      });
    }
  });

  // Approved fact check
  if (content.toLowerCase().includes("60%")) {
    issues.push({
      name: "Claim does not match approved fact",
      source: "FACT-001",
      severity: "High",
      suggestion: "Use the approved demo claim: up to 40%.",
      keyword: "60%",
      correction: "up to 40%"
    });
  }

  const record = {
    id: Date.now(),
    content: content,
    issues: issues,
    status: issues.length === 0
      ? "No issues detected"
      : "Needs review",
    date: new Date().toLocaleString()
  };

  reviews.unshift(record);

  localStorage.setItem(
    "markwiseReviews",
    JSON.stringify(reviews)
  );

  displayResults(record);
  // Show reviewer decision buttons
document.getElementById("decisionPanel").style.display = "block";

document.getElementById("decisionMessage").textContent = "";

currentReviewId = record.id;
  updateDashboard();
}


// DISPLAY REVIEW RESULTS


function displayResults(record) {
  const results = document.getElementById("results");

  results.innerHTML = "";

  const title = document.createElement("h3");
  title.style.marginTop = "22px";
  title.textContent = "Review Results";

  results.appendChild(title);

  if (record.issues.length === 0) {
    const success = document.createElement("div");

    success.className = "success";
    success.style.marginTop = "12px";

    success.textContent =
      "No configured demo rule violations detected. This does not mean every claim has been independently verified.";

    results.appendChild(success);
    return;
  }

  const count = document.createElement("p");

  count.style.margin = "10px 0";
  count.textContent =
    record.issues.length + " issue(s) detected.";

  results.appendChild(count);

  record.issues.forEach(issue => {
    const box = document.createElement("div");
    box.className = "result";

    const name = document.createElement("strong");
    name.textContent = issue.name;

    const source = document.createElement("p");
    source.textContent =
      "Source: " + issue.source +
      " | Severity: " + issue.severity;

    const suggestion = document.createElement("p");
    suggestion.textContent =
      "Suggested correction: " + issue.suggestion;

    box.append(name, source, suggestion);

    // Apply suggestion button
    if (issue.keyword && issue.correction) {
      const btn = document.createElement("button");

      btn.className = "secondary";
      btn.textContent = "Apply Suggestion";

      btn.onclick = () => {
        const input = document.getElementById("contentInput");

        const escaped = issue.keyword.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        const regex = new RegExp(escaped, "gi");

        input.value = input.value.replace(
          regex,
          issue.correction
        );

        btn.textContent = "Applied to Editor";
        btn.disabled = true;
      };

      box.appendChild(btn);
    }

    results.appendChild(box);
  });
}



// DASHBOARD, HISTORY AND INSIGHTS


// ================= DASHBOARD & INSIGHTS =================

function updateDashboard() {
  const total = reviews.length;

  const approved = reviews.filter(
    r => r.status === "Approved"
  ).length;

  const rejected = reviews.filter(
    r => r.status === "Rejected"
  ).length;

  const pending = total - approved - rejected;

  const totalIssues = reviews.reduce(
    (sum, r) => sum + r.issues.length,
    0
  );

  // Dashboard statistics
  document.getElementById("totalReviews").textContent = total;
  document.getElementById("totalIssues").textContent = totalIssues;
  document.getElementById("approvedReviews").textContent = approved;
  document.getElementById("rejectedReviews").textContent = rejected;
  document.getElementById("pendingReviews").textContent = pending;
  document.getElementById("totalRules").textContent = guidelines.length;

  // Insights statistics
  document.getElementById("insightReviews").textContent = total;
  document.getElementById("insightIssues").textContent = totalIssues;

  // Recent Activity
  const recent = document.getElementById("recentActivity");
  const history = document.getElementById("historyList");

  if (total === 0) {
    recent.className = "empty";
    recent.textContent = "No reviews yet. Submit your first content.";

    if (history) {
      history.className = "empty";
      history.textContent = "No review history available yet.";
    }
  } else {
    recent.className = "";
    recent.innerHTML = "";

    reviews.slice(0, 4).forEach(r => {
      const div = document.createElement("div");
      div.className = "item";

      const strong = document.createElement("strong");

      const displayStatus =
        r.status === "Approved" || r.status === "Rejected"
          ? r.status
          : r.status;

      strong.textContent = displayStatus;

      const p = document.createElement("p");
      p.textContent = r.content.slice(0, 90) + " · " + r.date;

      div.append(strong, p);
      recent.appendChild(div);
    });

    // History table
    if (history) {
      history.className = "";
      history.innerHTML = "";

      const table = document.createElement("table");

      table.innerHTML =
        "<tr><th>Content</th><th>Issues</th><th>Status</th></tr>";

      reviews.forEach(r => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.textContent = r.content.slice(0, 45);

        const td2 = document.createElement("td");
        td2.textContent = r.issues.length;

        const td3 = document.createElement("td");
        td3.textContent = r.status;

        tr.append(td1, td2, td3);
        table.appendChild(tr);
      });

      history.appendChild(table);
    }
  }

  // Rule Pattern Insights
  const patterns = document.getElementById("rulePatterns");
  const counts = {};

  reviews.forEach(r => {
    r.issues.forEach(issue => {
      if (!counts[issue.source]) {
        counts[issue.source] = {
          count: 0,
          name: issue.name
        };
      }

      counts[issue.source].count++;
    });
  });

  if (patterns) {
    patterns.innerHTML = "";

    if (Object.keys(counts).length === 0) {
      patterns.className = "empty";
      patterns.textContent = "No detected rule patterns yet.";
    } else {
      patterns.className = "";

      Object.keys(counts).forEach(key => {
        const div = document.createElement("div");
        div.className = "item";

        const strong = document.createElement("strong");
        strong.textContent = counts[key].name;

        const p = document.createElement("p");
        p.textContent =
          key + " · " + counts[key].count + " occurrence(s)";

        div.append(strong, p);
        patterns.appendChild(div);
      });
    }
  }
}

// ================= END DASHBOARD & INSIGHTS =================



// INITIALIZE APPLICATION

document
  .getElementById("guidelineForm")
  .addEventListener("submit", saveRule);

loadSavedData();
renderGuidelines();
updateDashboard();

// ================= APPROVED FACTS =================

let approvedFacts = [];
let editingFactId = null;

const defaultFacts = [
  {
    id: "FACT-001",
    title: "Onboarding Improvement",
    description: "NovaLearn can help reduce onboarding time by up to 40%, according to the fictional 2025 demo study.",
    source: "Fictional 2025 demo study"
  },
  {
    id: "FACT-002",
    title: "Support",
    description: "NovaLearn provides 24/7 support.",
    source: "Fictional demo information"
  },
  {
    id: "FACT-003",
    title: "Plans",
    description: "NovaLearn offers three subscription plans.",
    source: "Fictional demo information"
  }
];

function loadFacts() {
  try {
    const saved = localStorage.getItem("markwiseFacts");
    approvedFacts = saved ? JSON.parse(saved) : defaultFacts;

    if (!Array.isArray(approvedFacts)) {
      approvedFacts = defaultFacts;
    }
  } catch (error) {
    approvedFacts = defaultFacts;
  }
}

function saveFacts() {
  localStorage.setItem("markwiseFacts", JSON.stringify(approvedFacts));
}

function renderFacts() {
  const list = document.getElementById("factList");
  const count = document.getElementById("factCount");

  if (!list || !count) return;

  count.textContent = approvedFacts.length + " approved facts";

  list.innerHTML = approvedFacts.map(fact => `
    <div class="item">
      <strong>${escapeFactText(fact.id)} · ${escapeFactText(fact.title)}</strong>
      <p>${escapeFactText(fact.description)}</p>
      <small>Source: ${escapeFactText(fact.source)}</small>
      <br>
      <span class="tag green">Approved demo fact</span>
      <br><br>
      <button onclick="editFact('${fact.id}')">Edit</button>
      <button onclick="deleteFact('${fact.id}')">Delete</button>
    </div>
  `).join("");
}

function escapeFactText(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function saveFact(event) {
  event.preventDefault();

  const title = document.getElementById("factTitle").value.trim();
  const description = document.getElementById("factDescription").value.trim();
  const source = document.getElementById("factSource").value.trim();

  if (!title || !description || !source) {
    alert("Please fill all fields.");
    return;
  }

  if (editingFactId) {
    approvedFacts = approvedFacts.map(fact =>
      fact.id === editingFactId
        ? { ...fact, title, description, source }
        : fact
    );
  } else {
    approvedFacts.push({
      id: "FACT-" + Date.now().toString().slice(-6),
      title,
      description,
      source
    });
  }

  saveFacts();
  renderFacts();
  cancelFactEdit();

  document.getElementById("factMessage").textContent =
    "Fact saved successfully!";
}

function editFact(id) {
  const fact = approvedFacts.find(item => item.id === id);
  if (!fact) return;

  editingFactId = id;

  document.getElementById("factTitle").value = fact.title;
  document.getElementById("factDescription").value = fact.description;
  document.getElementById("factSource").value = fact.source;

  document.getElementById("saveFactButton").textContent = "Update Fact";
  document.getElementById("cancelFactEditButton").style.display = "inline-block";

  document.getElementById("factForm").scrollIntoView({
    behavior: "smooth"
  });
}

function cancelFactEdit() {
  editingFactId = null;

  document.getElementById("factForm").reset();
  document.getElementById("saveFactButton").textContent = "+ Add Approved Fact";
  document.getElementById("cancelFactEditButton").style.display = "none";
}

function deleteFact(id) {
  if (!confirm("Are you sure you want to delete this fact?")) return;

  approvedFacts = approvedFacts.filter(fact => fact.id !== id);

  saveFacts();
  renderFacts();
}

// Initialize Approved Facts
document.getElementById("factForm").addEventListener("submit", saveFact);

loadFacts();
renderFacts();

// ================= REVIEWER DECISION =================

let currentReviewId = null;

function reviewDecision(decision) {

  if (!currentReviewId) {
    alert("Please check content first.");
    return;
  }

  const record = reviews.find(
    item => item.id === currentReviewId
  );

  if (!record) {
    alert("Review record not found.");
    return;
  }

  record.status = decision;
  record.decisionDate = new Date().toLocaleString();

  localStorage.setItem(
    "markwiseReviews",
    JSON.stringify(reviews)
  );

  document.getElementById("decisionMessage").textContent =
    "Content " + decision + " successfully!";

  updateDashboard();

  alert("Content " + decision + " successfully!");
}

// ================= END REVIEWER DECISION =================


