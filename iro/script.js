// ==========================================
// Issues Reporting Outlet (IRO) - Core Logic
// ==========================================

// --- Initial Mock Data Seeds ---
const INITIAL_REPORTS = [
    {
        id: "001",
        title: "Theft around Hostel Area",
        description: "A student was mugged around 8:00 PM near the hostel gate. A phone and some cash were stolen by two individuals who fled on a motorcycle. Security personnel need to increase evening patrols in this dark corridor.",
        category: "Security",
        reporterType: "student",
        faculty: "Science",
        reporterName: "Anonymous",
        community: "Oba Street",
        location: "Close to the hostel gate, beside the uncompleted building",
        severity: "High",
        image: null,
        status: "Pending",
        date: "Jul 08, 2026",
        time: "08:15 PM",
        comment: "Security unit has been notified. Patrols will be scheduled for this area.",
        timeline: [
            { status: "Pending", date: "Jul 08, 2026", time: "08:15 PM", note: "Report submitted anonymously by Student." }
        ]
    },
    {
        id: "002",
        title: "Major Potholes near Main Gate",
        description: "Large deep potholes have formed on the main tarred road just a few meters from the AAUA Gate. Vehicles are forced to slow down abruptly or swerve, which is causing dangerous near-miss collisions during rush hour. It needs urgent patching.",
        category: "Roads",
        reporterType: "resident",
        faculty: null,
        reporterName: "Dr. Ajayi",
        community: "Campus Areas",
        location: "50 meters from the AAUA main entrance arch, heading towards town",
        severity: "Medium",
        image: null,
        status: "In Progress",
        date: "Jul 05, 2026",
        time: "10:30 AM",
        comment: "Maintenance unit has contacted local road engineers. Patching work scheduled for next Monday.",
        timeline: [
            { status: "Pending", date: "Jul 05, 2026", time: "10:30 AM", note: "Report submitted by Dr. Ajayi." },
            { status: "In Progress", date: "Jul 07, 2026", time: "09:00 AM", note: "Work order created. Maintenance team dispatched for assessment." }
        ]
    },
    {
        id: "003",
        title: "5-Day Transformer Power Outage",
        description: "The electricity transformer serving Sangisha community exploded during the heavy rainstorm on Tuesday. The entire community has been in total darkness since then. Students cannot study or charge devices, and business activities are completely grounded.",
        category: "Electricity",
        reporterType: "student",
        faculty: "Social & Management Sciences",
        reporterName: "Anonymous",
        community: "Sangisha",
        location: "Sangisha junction transformer post",
        severity: "Medium",
        image: null,
        status: "Resolved",
        date: "Jul 02, 2026",
        time: "04:45 PM",
        comment: "The electricity board replaced the blown coils and restored supply to the Sangisha grid.",
        timeline: [
            { status: "Pending", date: "Jul 02, 2026", time: "04:45 PM", note: "Report submitted by Student." },
            { status: "In Progress", date: "Jul 03, 2026", time: "11:00 AM", note: "Utility company engineers contacted for transformer diagnosis." },
            { status: "Resolved", date: "Jul 06, 2026", time: "02:00 PM", note: "Repair completed. Power grid energized and tested." }
        ]
    },
    {
        id: "004",
        title: "Burst Water Main Pipe",
        description: "A clean water utility pipe burst open near the shop fronts in Medoline. Clean drinking water is gushing out heavily, flooding the pedestrian path and turning the area into a muddy pool. It has been running for 24 hours.",
        category: "Water",
        reporterType: "resident",
        faculty: null,
        reporterName: "Adeboye K.",
        community: "Medoline",
        location: "Opposite Medoline Bakery",
        severity: "Low",
        image: null,
        status: "Pending",
        date: "Jul 09, 2026",
        time: "11:20 AM",
        comment: "",
        timeline: [
            { status: "Pending", date: "Jul 09, 2026", time: "11:20 AM", note: "Report submitted by Resident." }
        ]
    }
];

// ==========================================
// PROFESSIONAL NOTIFICATION SYSTEMS (TOAST & MODAL)
// ==========================================

// --- 1. Custom Toast Notification System ---
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-card`;
    
    let icon = '';
    if (type === 'success') {
        icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
        icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
        icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('visible'), 10);
    
    // Auto Dismiss
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- 2. Custom Confirmation Modal System ---
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    
    const btnConfirm = document.getElementById('modal-btn-confirm');
    const btnCancel = document.getElementById('modal-btn-cancel');
    
    // Clone buttons to clear previous event listeners
    const newBtnConfirm = btnConfirm.cloneNode(true);
    const newBtnCancel = btnCancel.cloneNode(true);
    
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);
    
    newBtnConfirm.addEventListener('click', () => {
        onConfirm();
        modal.classList.add('hidden');
    });
    
    newBtnCancel.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.classList.remove('hidden');
}

// --- 3. Stats Counter Animation ---
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

// --- State Management Helpers ---
function getReports() {
    let reports = localStorage.getItem("iro_reports");
    if (!reports) {
        localStorage.setItem("iro_reports", JSON.stringify(INITIAL_REPORTS));
        return INITIAL_REPORTS;
    }
    return JSON.parse(reports);
}

function saveReports(reports) {
    localStorage.setItem("iro_reports", JSON.stringify(reports));
}

// --- Image Handling Helpers ---
let uploadedImageBase64 = null;

// --- Lightweight Client Router ---
function router() {
    const hash = window.location.hash || '#home';
    
    // Reset Mobile Nav Menu if open
    document.getElementById("nav-links").classList.remove("mobile-active");
    document.getElementById("nav-toggle").classList.remove("open");

    // Extract section ID and parameters
    let sectionId = hash;
    let reportId = null;

    if (hash.startsWith('#details')) {
        sectionId = '#details';
        const queryParams = new URLSearchParams(hash.split('?')[1] || '');
        reportId = queryParams.get('id');
    }

    // Map Hash to View Element IDs
    const viewMap = {
        '#home': 'view-home',
        '#report': 'view-report',
        '#view': 'view-view',
        '#details': 'view-details',
        '#admin': 'view-admin'
    };

    const targetSectionId = viewMap[sectionId] || 'view-home';

    // Update Nav Link Active class
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === sectionId || (sectionId === '#details' && href === '#view')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Switch View Section visibility
    document.querySelectorAll('.view-section').forEach(section => {
        if (section.id === targetSectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Trigger View Render Functions
    if (targetSectionId === 'view-home') {
        renderHomeStats();
    } else if (targetSectionId === 'view-view') {
        renderReportsList();
    } else if (targetSectionId === 'view-details') {
        if (reportId) {
            renderReportDetails(reportId);
        } else {
            window.location.hash = '#view';
        }
    } else if (targetSectionId === 'view-admin') {
        renderAdminDashboard();
    }
}

// Ensure routing runs on hashchange and page load
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
    getReports(); // Seed default reports if needed
    router();
});

// Mobile Nav Toggle Action
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("open");
        navLinks.classList.toggle("mobile-active");
    });
}


// ==========================================
// VIEW RENDERING LOGIC
// ==========================================

// --- 1. HOME VIEW ---
function renderHomeStats() {
    const reports = getReports();
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'Pending').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;

    const totalVal = document.getElementById("stat-total");
    const pendingVal = document.getElementById("stat-pending");
    const resolvedVal = document.getElementById("stat-resolved");

    if (totalVal && pendingVal && resolvedVal) {
        animateValue(totalVal, 0, total, 700);
        animateValue(pendingVal, 0, pending, 700);
        animateValue(resolvedVal, 0, resolved, 700);
    }
}


// --- 2. REPORT ISSUE VIEW ---
const reporterStudentBtn = document.getElementById("reporter-student");
const reporterResidentBtn = document.getElementById("reporter-resident");
const facultyGroup = document.getElementById("faculty-group");
const reporterTypeHidden = document.getElementById("field-reporter-type");

// Toggle Student vs Resident reporter type inputs
if (reporterStudentBtn && reporterResidentBtn) {
    reporterStudentBtn.addEventListener("click", () => {
        reporterStudentBtn.classList.add("active");
        reporterResidentBtn.classList.remove("active");
        facultyGroup.style.display = "flex";
        reporterTypeHidden.value = "student";
        document.getElementById("field-faculty").required = true;
    });

    reporterResidentBtn.addEventListener("click", () => {
        reporterResidentBtn.classList.add("active");
        reporterStudentBtn.classList.remove("active");
        facultyGroup.style.display = "none";
        reporterTypeHidden.value = "resident";
        document.getElementById("field-faculty").required = false;
        document.getElementById("field-faculty").value = "";
    });
}

// Anonymous Toggle Logic with Collapse Transitions
const anonymousCheckbox = document.getElementById("field-anonymous");
const nameInputContainer = document.getElementById("name-input-container");
const fieldNameInput = document.getElementById("field-name");
if (anonymousCheckbox && nameInputContainer && fieldNameInput) {
    anonymousCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            nameInputContainer.classList.add("collapsed");
            fieldNameInput.value = "";
            fieldNameInput.disabled = true;
            fieldNameInput.placeholder = "Reporting Anonymously...";
        } else {
            nameInputContainer.classList.remove("collapsed");
            fieldNameInput.disabled = false;
            fieldNameInput.placeholder = "Enter your name or leave empty";
        }
    });
}

// Severity Selection Buttons
const severityBtns = document.querySelectorAll(".btn-severity");
const severityHidden = document.getElementById("field-severity");
severityBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        severityBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        severityHidden.value = btn.getAttribute("data-severity");
    });
});

// Image Upload Base64 conversion & Preview
const imageInput = document.getElementById("field-image");
const uploadPrompt = document.getElementById("upload-prompt");
const uploadPreviewContainer = document.getElementById("upload-preview-container");
const uploadImgPreview = document.getElementById("upload-img-preview");
const btnRemoveImg = document.getElementById("btn-remove-img");
const uploadZone = document.getElementById("upload-zone");

if (imageInput) {
    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        handleUploadedFile(file);
    });
}

// Professional Drag & Drop Handler
if (uploadZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.add("drag-over");
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove("drag-over");
        }, false);
    });

    uploadZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleUploadedFile(file);
    });
}

function handleUploadedFile(file) {
    if (file) {
        if (!file.type.startsWith('image/')) {
            showToast("Unsupported file type. Please upload an image.", "error");
            if (imageInput) imageInput.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast("File size exceeds 2MB limit.", "error");
            if (imageInput) imageInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            uploadedImageBase64 = evt.target.result;
            uploadImgPreview.src = uploadedImageBase64;
            uploadPrompt.classList.add("hidden");
            uploadPreviewContainer.classList.remove("hidden");
            showToast("Evidence photo attached successfully.", "info");
        };
        reader.readAsDataURL(file);
    }
}

if (btnRemoveImg) {
    btnRemoveImg.addEventListener("click", (e) => {
        e.stopPropagation(); 
        uploadedImageBase64 = null;
        if (imageInput) imageInput.value = "";
        uploadImgPreview.src = "";
        uploadPreviewContainer.classList.add("hidden");
        uploadPrompt.classList.remove("hidden");
        showToast("Evidence photo detached.", "info");
    });
}

// Submit Form Action
const reportForm = document.getElementById("report-form");
if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const reports = getReports();
        const lastId = reports.length > 0 ? Math.max(...reports.map(r => parseInt(r.id))) : 0;
        const newId = String(lastId + 1).padStart(3, '0');

        const title = document.getElementById("field-title").value.trim();
        const description = document.getElementById("field-description").value.trim();
        const category = document.getElementById("field-category").value;
        const reporterType = reporterTypeHidden.value;
        const faculty = document.getElementById("field-faculty").value;
        const community = document.getElementById("field-community").value;
        const location = document.getElementById("field-location").value.trim();
        const severity = severityHidden.value;
        const isAnonymous = anonymousCheckbox.checked;
        const nameVal = fieldNameInput.value.trim();

        let reporterName = "Anonymous";
        if (!isAnonymous && nameVal) {
            reporterName = nameVal;
        }

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const formattedTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const newReport = {
            id: newId,
            title: title,
            description: description,
            category: category,
            reporterType: reporterType,
            faculty: reporterType === 'student' ? faculty : null,
            reporterName: reporterName,
            community: community,
            location: location,
            severity: severity,
            image: uploadedImageBase64,
            status: "Pending",
            date: formattedDate,
            time: formattedTime,
            comment: "",
            timeline: [
                { 
                    status: "Pending", 
                    date: formattedDate, 
                    time: formattedTime, 
                    note: `Report filed by ${reporterName} (${reporterType === 'student' ? 'Student' : 'Resident'}).` 
                }
            ]
        };

        reports.push(newReport);
        saveReports(reports);

        // Reset inputs
        reportForm.reset();
        uploadedImageBase64 = null;
        if (uploadPreviewContainer) uploadPreviewContainer.classList.add("hidden");
        if (uploadPrompt) uploadPrompt.classList.remove("hidden");
        fieldNameInput.disabled = false;
        fieldNameInput.placeholder = "Enter your name or leave empty";
        nameInputContainer.classList.remove("collapsed");
        reporterStudentBtn.click(); 

        showToast(`Report #${newId} filed successfully!`, "success");
        setTimeout(() => {
            window.location.hash = "#view";
        }, 600);
    });
}


// --- 3. VIEW REPORTS LIST VIEW ---
const filterSearch = document.getElementById("filter-search");
const filterCategory = document.getElementById("filter-category");
const statusTabs = document.querySelectorAll(".tab-btn");
let activeStatusFilter = "All";

if (filterSearch) filterSearch.addEventListener("input", renderReportsList);
if (filterCategory) filterCategory.addEventListener("change", renderReportsList);
statusTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        statusTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeStatusFilter = tab.getAttribute("data-status");
        renderReportsList();
    });
});

function renderReportsList() {
    const reports = getReports();
    const container = document.getElementById("reports-list-container");
    const emptyState = document.getElementById("reports-empty");

    const searchQuery = filterSearch ? filterSearch.value.toLowerCase().trim() : "";
    const categoryQuery = filterCategory ? filterCategory.value : "All";

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery) ||
                             report.description.toLowerCase().includes(searchQuery) ||
                             report.location.toLowerCase().includes(searchQuery) ||
                             report.id.includes(searchQuery);

        const matchesCategory = categoryQuery === "All" || report.category === categoryQuery;
        const matchesStatus = activeStatusFilter === "All" || report.status === activeStatusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filteredReports.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }
    emptyState.classList.add("hidden");

    container.innerHTML = filteredReports.map(report => {
        const isStudent = report.reporterType === 'student';
        const reporterString = report.reporterName === 'Anonymous' 
            ? `Anonymous ${isStudent ? 'Student' : 'Resident'}`
            : `${report.reporterName} (${isStudent ? 'Student' : 'Resident'})`;

        return `
            <div class="report-card glass-card" onclick="window.location.hash='#details?id=${report.id}'">
                <div>
                    <div class="report-header">
                        <span class="report-id">#${report.id}</span>
                        <span class="badge status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span>
                    </div>
                    <h3>${report.title}</h3>
                    <p class="report-desc-snippet">${report.description}</p>
                </div>
                <div>
                    <div style="margin-bottom: 0.75rem;">
                        <span class="badge sev-${report.severity.toLowerCase()}">Severity: ${report.severity}</span>
                        <span class="badge" style="background:rgba(255, 255, 255, 0.03); color:var(--text-secondary); margin-left:0.5rem;">${report.category}</span>
                    </div>
                    <div class="report-footer">
                        <div class="footer-meta-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>${reporterString}</span>
                        </div>
                        <div class="footer-meta-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span>${report.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}


// --- 4. REPORT DETAILS VIEW ---
function renderReportDetails(id) {
    const reports = getReports();
    const report = reports.find(r => r.id === id);
    const container = document.getElementById("details-content-container");

    if (!report) {
        container.innerHTML = `<div class="empty-state"><h3>Report not found</h3><p>The report you are looking for does not exist or has been deleted.</p></div>`;
        return;
    }

    const isStudent = report.reporterType === 'student';
    const reporterNameString = report.reporterName === 'Anonymous'
        ? `Anonymous ${isStudent ? 'Student' : 'Resident'}`
        : report.reporterName;

    const reporterRoleString = isStudent 
        ? `Student (${report.faculty || 'Unspecified Faculty'})`
        : `Community Resident`;

    const evidenceImageHTML = report.image 
        ? `<div class="evidence-box">
             <h4>Supporting Evidence</h4>
             <img src="${report.image}" alt="Evidence Picture">
           </div>`
        : '';

    const officerCommentHTML = report.comment
        ? `<div class="sidebar-block glass-card officer-memo-card">
             <div class="memo-header">
                <span>OFFICER MEMO</span>
                <span>Verified</span>
             </div>
             <p class="memo-content">${report.comment}</p>
           </div>`
        : `<div class="sidebar-block glass-card officer-memo-card" style="border-left-color: var(--text-muted);">
             <div class="memo-header" style="color:var(--text-muted)">
                <span>OFFICER MEMO</span>
                <span>Awaiting Review</span>
             </div>
             <p class="memo-empty">No administrator feedback has been written yet for this report.</p>
           </div>`;

    const timelineHTML = report.timeline.map((event, idx) => `
        <div class="timeline-event">
            <div class="timeline-dot ${idx === report.timeline.length - 1 ? 'active' : ''}"></div>
            <div class="timeline-time">${event.date} &bull; ${event.time}</div>
            <div class="timeline-title">${event.status}</div>
            <div class="timeline-desc">${event.note}</div>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="details-main">
            <div class="details-card glass-card">
                <div class="details-meta-badges">
                    <span class="report-id">#${report.id}</span>
                    <span class="badge status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span>
                    <span class="badge sev-${report.severity.toLowerCase()}">${report.severity} Severity</span>
                    <span class="badge" style="background:rgba(255, 255, 255, 0.03); color:var(--text-secondary);">${report.category}</span>
                </div>
                
                <h1 class="details-title">${report.title}</h1>

                <div class="details-sub-row">
                    <div class="meta-field">
                        <span class="meta-field-label">Reported By</span>
                        <span class="meta-field-value">${reporterNameString}</span>
                    </div>
                    <div class="meta-field">
                        <span class="meta-field-label">Affiliation</span>
                        <span class="meta-field-value">${reporterRoleString}</span>
                    </div>
                    <div class="meta-field">
                        <span class="meta-field-label">Community / Area</span>
                        <span class="meta-field-value">${report.community}</span>
                    </div>
                    <div class="meta-field">
                        <span class="meta-field-label">Date Submitted</span>
                        <span class="meta-field-value">${report.date} at ${report.time}</span>
                    </div>
                </div>

                <div class="meta-field" style="margin-bottom: 2rem;">
                    <span class="meta-field-label">Specific Location</span>
                    <span class="meta-field-value" style="font-weight: 300;">${report.location}</span>
                </div>

                <div class="details-description-box">
                    <h4>Description of Issue</h4>
                    <p>${report.description}</p>
                </div>

                ${evidenceImageHTML}
            </div>
        </div>

        <div class="details-sidebar">
            <div class="sidebar-block glass-card">
                <h3>Resolution Timeline</h3>
                <div class="timeline">
                    ${timelineHTML}
                </div>
            </div>
            ${officerCommentHTML}
        </div>
    `;
}


// --- 5. ADMIN DASHBOARD VIEW ---
const adminFilterSearch = document.getElementById("admin-filter-search");
const adminFilterCategory = document.getElementById("admin-filter-category");
const btnResetData = document.getElementById("btn-reset-data");

if (adminFilterSearch) adminFilterSearch.addEventListener("input", renderAdminDashboard);
if (adminFilterCategory) adminFilterCategory.addEventListener("change", renderAdminDashboard);

if (btnResetData) {
    btnResetData.addEventListener("click", () => {
        showConfirmModal(
            "Restore Mock Database",
            "This will completely overwrite all local changes and restore the default 4 reports. Are you sure you want to proceed?",
            () => {
                localStorage.removeItem("iro_reports");
                getReports();
                renderAdminDashboard();
                showToast("Mock database restored.", "success");
            }
        );
    });
}

// --- Admin Authentication Form Logic ---
const adminLoginForm = document.getElementById("admin-login-form");
const loginErrorMsg = document.getElementById("login-error-msg");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById("admin-username").value.trim();
        const passwordInput = document.getElementById("admin-password").value.trim();

        if (usernameInput === "admin" && passwordInput === "admin123") {
            sessionStorage.setItem("iro_admin_logged_in", "true");
            if (loginErrorMsg) loginErrorMsg.classList.add("hidden");
            adminLoginForm.reset();
            renderAdminDashboard();
            showToast("Successfully authenticated as Admin.", "success");
        } else {
            if (loginErrorMsg) loginErrorMsg.classList.remove("hidden");
            showToast("Authentication failed. Check credentials.", "error");
        }
    });
}

// Admin Logout Logic
const btnAdminLogout = document.getElementById("btn-admin-logout");
if (btnAdminLogout) {
    btnAdminLogout.addEventListener("click", () => {
        sessionStorage.removeItem("iro_admin_logged_in");
        renderAdminDashboard();
        showToast("Logged out of Admin Panel.", "info");
    });
}

function renderAdminDashboard() {
    const loggedIn = sessionStorage.getItem("iro_admin_logged_in") === "true";
    const loginContainer = document.getElementById("admin-login-container");
    const dashboardContainer = document.getElementById("admin-dashboard-container");

    if (!loggedIn) {
        if (loginContainer) loginContainer.classList.remove("hidden");
        if (dashboardContainer) dashboardContainer.classList.add("hidden");
        return;
    }

    if (loginContainer) loginContainer.classList.add("hidden");
    if (dashboardContainer) dashboardContainer.classList.remove("hidden");

    const reports = getReports();
    const tableBody = document.getElementById("admin-table-rows");

    // Render Stats counters with count up animation
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'Pending').length;
    const progress = reports.filter(r => r.status === 'In Progress').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const rejected = reports.filter(r => r.status === 'Rejected').length;

    const totalW = document.getElementById("admin-total-count");
    const pendingW = document.getElementById("admin-pending-count");
    const progressW = document.getElementById("admin-progress-count");
    const resolvedW = document.getElementById("admin-resolved-count");
    const rejectedW = document.getElementById("admin-rejected-count");

    if (totalW && pendingW && progressW && resolvedW && rejectedW) {
        animateValue(totalW, 0, total, 600);
        animateValue(pendingW, 0, pending, 600);
        animateValue(progressW, 0, progress, 600);
        animateValue(resolvedW, 0, resolved, 600);
        animateValue(rejectedW, 0, rejected, 600);
    }

    // Filters
    const searchQuery = adminFilterSearch ? adminFilterSearch.value.toLowerCase().trim() : "";
    const categoryQuery = adminFilterCategory ? adminFilterCategory.value : "All";

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery) ||
                             report.description.toLowerCase().includes(searchQuery) ||
                             report.reporterName.toLowerCase().includes(searchQuery) ||
                             report.id.includes(searchQuery);
        const matchesCategory = categoryQuery === "All" || report.category === categoryQuery;
        return matchesSearch && matchesCategory;
    });

    if (filteredReports.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:3rem;">No matching reports in system.</td></tr>`;
        return;
    }

    let rowsHTML = "";
    filteredReports.forEach(report => {
        const isStudent = report.reporterType === 'student';
        const reporterString = report.reporterName === 'Anonymous' 
            ? `Anonymous ${isStudent ? 'Student' : 'Resident'}`
            : `${report.reporterName} (${isStudent ? 'Student' : 'Resident'})`;

        rowsHTML += `
            <tr id="row-${report.id}">
                <td style="font-weight:700; color:var(--accent-teal)">#${report.id}</td>
                <td>
                    <div class="admin-cell-title">${report.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted)">Area: ${report.community}</div>
                </td>
                <td>${report.category}</td>
                <td><span class="admin-cell-reporter">${reporterString}</span></td>
                <td><span class="badge sev-${report.severity.toLowerCase()}">${report.severity}</span></td>
                <td>
                    <select class="admin-select-status" onchange="updateReportStatus('${report.id}', this.value)">
                        <option value="Pending" ${report.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${report.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${report.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Rejected" ${report.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td>
                    <div class="admin-actions">
                        <button class="btn-icon" title="View details" onclick="window.location.hash='#details?id=${report.id}'">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="btn-icon" title="Edit Comments" onclick="toggleAdminCommentEditor('${report.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </button>
                        <button class="btn-icon delete" title="Delete report" onclick="deleteReport('${report.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
            
            <tr id="editor-${report.id}" class="admin-editor-row hidden">
                <td colspan="7">
                    <div class="admin-editor-wrapper">
                        <div class="editor-left">
                            <span class="editor-label">Write Official Commentary / Feedback Memo</span>
                            <textarea id="comment-text-${report.id}" rows="3" class="admin-comment-textarea" placeholder="Provide instructions, verify status details, or report resolutions to the reporter...">${report.comment || ''}</textarea>
                            <div class="editor-actions">
                                <button class="btn btn-primary btn-sm" onclick="saveAdminComment('${report.id}')">Save Memo</button>
                                <button class="btn btn-secondary btn-sm" onclick="toggleAdminCommentEditor('${report.id}')">Cancel</button>
                            </div>
                        </div>
                        <div class="editor-right">
                            <div class="editor-meta-info">
                                <div><strong>Location description:</strong> ${report.location}</div>
                                <div><strong>Date/time submitted:</strong> ${report.date} at ${report.time}</div>
                                <div><strong>Severity:</strong> ${report.severity}</div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = rowsHTML;
}

// Update report status dropdown action
window.updateReportStatus = function(id, newStatus) {
    const reports = getReports();
    const reportIndex = reports.findIndex(r => r.id === id);

    if (reportIndex !== -1) {
        const report = reports[reportIndex];
        const oldStatus = report.status;
        
        if (oldStatus !== newStatus) {
            report.status = newStatus;
            
            const today = new Date();
            const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            report.timeline.push({
                status: newStatus,
                date: dateStr,
                time: timeStr,
                note: `Status updated from ${oldStatus} to ${newStatus} by Administrator.`
            });

            saveReports(reports);
            renderAdminDashboard();
            showToast(`Report #${id} updated to ${newStatus}.`, "info");
        }
    }
};

window.toggleAdminCommentEditor = function(id) {
    const editorRow = document.getElementById(`editor-${id}`);
    if (editorRow) {
        editorRow.classList.toggle("hidden");
    }
};

window.saveAdminComment = function(id) {
    const reports = getReports();
    const reportIndex = reports.findIndex(r => r.id === id);
    const commentText = document.getElementById(`comment-text-${id}`).value.trim();

    if (reportIndex !== -1) {
        reports[reportIndex].comment = commentText;
        
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        reports[reportIndex].timeline.push({
            status: reports[reportIndex].status,
            date: dateStr,
            time: timeStr,
            note: "Officer added feedback and instructions memo."
        });

        saveReports(reports);
        toggleAdminCommentEditor(id);
        renderAdminDashboard();
        showToast("Memo comment saved.", "success");
    }
};

window.deleteReport = function(id) {
    showConfirmModal(
        "Delete Report permanently",
        `Are you sure you want to delete report #${id}? This action is irreversible and should only be done for test or spam reports.`,
        () => {
            let reports = getReports();
            reports = reports.filter(r => r.id !== id);
            saveReports(reports);
            renderAdminDashboard();
            showToast(`Report #${id} has been permanently deleted.`, "success");
        }
    );
};
