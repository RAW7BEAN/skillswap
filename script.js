/**
 * SkillSwap - Core Application Logic & State Engine
 * Handles matching algorithms, 3-way skill chains, authentication/logout flow,
 * toast notifications, dropdowns, localStorage persistence, simulated real-time peer chat,
 * session scheduling, and verifiable skill passport.
 */

/* ==========================================================================
   1. GLOBAL STATE & LOCALSTORAGE PERSISTENCE
   ========================================================================== */

const DEFAULT_USER_STATE = {
    name: "Saaladin",
    email: "saaladin@skillswap.local",
    role: "BCA Student & Learner",
    location: "Kathmandu, Nepal",
    avatar: "assets/avatar-you.svg",
    teaches: ["C Programming", "Problem Solving"],
    teachLevels: { "C Programming": "Intermediate", "Problem Solving": "Advanced" },
    wantsToLearn: ["UI/UX Design", "Figma"],
    learningGoals: "College Projects & Portfolio",
    preference: "online",
    credits: 5,
    streakDays: 7,
    rating: 4.9,
    sessionsCompleted: 4,
    bio: "Passionate about computer applications and software logic. Ready to teach C programming in exchange for UI/UX mentorship."
};

const DEFAULT_SESSIONS = [
    {
        id: 101,
        partnerId: 1,
        partnerName: "Alex Shrestha",
        skillTaught: "C Programming (Pointers & Memory)",
        skillLearned: "Figma UI Components & Auto-layout",
        date: "2026-08-20",
        time: "7:00 PM - 7:45 PM",
        format: "Online (Google Meet)",
        status: "upcoming"
    },
    {
        id: 102,
        partnerId: 2,
        partnerName: "Riya Maharjan",
        skillTaught: "C File Handling Basics",
        skillLearned: "Color Theory & Poster Layouts",
        date: "2026-08-16",
        time: "4:00 PM - 4:45 PM",
        format: "Online (Zoom)",
        status: "completed",
        ratingGiven: 5
    }
];

const DEFAULT_MESSAGES = {
    1: [
        { sender: "peer", text: "Hey Saaladin! I saw you can teach C Programming. I really need help with pointers for my BCA 2nd sem!", time: "10:15 AM" },
        { sender: "user", text: "Hi Alex! Yes, absolutely! I can help you understand pointers and memory easily. I'm also really eager to learn UI/UX and Figma from you.", time: "10:18 AM" },
        { sender: "peer", text: "That sounds like a perfect 100% match! Let's schedule a 30-min swap session this week.", time: "10:20 AM" }
    ],
    2: [
        { sender: "peer", text: "Namaste! I'd love to exchange Canva graphic design workflows for some basic C syntax.", time: "Yesterday" },
        { sender: "user", text: "Namaste Riya! Sounds great! Let's connect soon.", time: "Yesterday" }
    ]
};

function getStoredUser() {
    try {
        const saved = localStorage.getItem("skillswap_user");
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error("Error loading user state:", e);
    }
    return DEFAULT_USER_STATE;
}

function saveStoredUser(userData) {
    try {
        localStorage.setItem("skillswap_user", JSON.stringify(userData));
    } catch (e) {
        console.error("Error saving user state:", e);
    }
}

function getStoredMatches() {
    try {
        const saved = localStorage.getItem("skillswap_matches");
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [1, 2];
}

function saveStoredMatches(matchesArray) {
    try {
        localStorage.setItem("skillswap_matches", JSON.stringify(matchesArray));
    } catch (e) {}
}

function getStoredMessages() {
    try {
        const saved = localStorage.getItem("skillswap_messages");
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_MESSAGES;
}

function saveStoredMessages(msgObj) {
    try {
        localStorage.setItem("skillswap_messages", JSON.stringify(msgObj));
    } catch (e) {}
}

function getStoredSessions() {
    try {
        const saved = localStorage.getItem("skillswap_sessions");
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SESSIONS;
}

function saveStoredSessions(sessArray) {
    try {
        localStorage.setItem("skillswap_sessions", JSON.stringify(sessArray));
    } catch (e) {}
}

function isUserLoggedIn() {
    const auth = localStorage.getItem("skillswap_auth");
    return auth !== "false"; // Default true for demo
}

function setAuthStatus(status) {
    localStorage.setItem("skillswap_auth", status ? "true" : "false");
}

// Active runtime state
let currentUser = getStoredUser();
let userMatches = getStoredMatches();
let chatMessages = getStoredMessages();
let userSessions = getStoredSessions();


/* ==========================================================================
   2. AUTHENTICATION, LOGOUT & TOAST NOTIFICATIONS
   ========================================================================== */

function handleLogout() {
    setAuthStatus(false);
    showToast("Logged out successfully. Redirecting...", "info");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 800);
}

function handleUserLogin(event) {
    if (event) event.preventDefault();
    const email = document.getElementById("loginEmail") ? document.getElementById("loginEmail").value : "saaladin@skillswap.local";
    setAuthStatus(true);
    showToast("Welcome back! Loading your dashboard...", "success");
    setTimeout(() => {
        window.location.href = "discover.html";
    }, 600);
}

function handleDemoLogin(provider) {
    setAuthStatus(true);
    showToast(`Signed in with ${provider === 'google' ? 'Google' : 'GitHub'}!`, "success");
    setTimeout(() => {
        window.location.href = "discover.html";
    }, 600);
}

function quickLoginUser(userId) {
    const peer = getUserById(userId);
    if (peer) {
        currentUser = {
            ...currentUser,
            name: peer.name,
            email: `${peer.name.toLowerCase().replace(' ', '.')}@skillswap.local`,
            role: peer.role,
            location: peer.location,
            avatar: peer.avatar,
            teaches: peer.teaches,
            wantsToLearn: peer.wantsToLearn
        };
        saveStoredUser(currentUser);
        setAuthStatus(true);
        showToast(`Logged in as ${peer.name}!`, "success");
        setTimeout(() => {
            window.location.href = "discover.html";
        }, 500);
    }
}

function quickLoginDefault() {
    currentUser = DEFAULT_USER_STATE;
    saveStoredUser(currentUser);
    setAuthStatus(true);
    showToast("Logged in as Saaladin (Default)!", "success");
    setTimeout(() => {
        window.location.href = "discover.html";
    }, 500);
}

/**
 * Animated In-App Toast Notification
 */
function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✓" : (type === "warning" ? "⚠️" : "ℹ️");
    toast.innerHTML = `<span style="font-weight: 800;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* ==========================================================================
   3. DROPDOWNS & MOBILE DRAWER LOGIC
   ========================================================================== */

function toggleUserDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById("userDropdown");
    const notifDropdown = document.getElementById("notifDropdown");
    if (notifDropdown) notifDropdown.classList.remove("active");
    if (dropdown) dropdown.classList.toggle("active");
}

function toggleNotifDropdown(event) {
    if (event) event.stopPropagation();
    const notifDropdown = document.getElementById("notifDropdown");
    const userDropdown = document.getElementById("userDropdown");
    if (userDropdown) userDropdown.classList.remove("active");
    if (notifDropdown) notifDropdown.classList.toggle("active");
}

function toggleMobileDrawer() {
    const overlay = document.getElementById("mobileDrawerOverlay");
    if (overlay) overlay.classList.toggle("active");
}

function markAllNotifsRead() {
    const unread = document.querySelectorAll(".notif-item-unread");
    unread.forEach(el => el.classList.remove("notif-item-unread"));
    const badge = document.querySelector(".notif-badge");
    if (badge) badge.style.display = "none";
    showToast("All notifications marked as read", "info");
}

// Global click listener to close dropdowns when clicking outside
document.addEventListener("click", function(e) {
    const userDropdown = document.getElementById("userDropdown");
    const notifDropdown = document.getElementById("notifDropdown");
    const userBtn = document.getElementById("userMenuBtn");
    const notifBtn = document.getElementById("notifBtn");

    if (userDropdown && !userDropdown.contains(e.target) && userBtn && !userBtn.contains(e.target)) {
        userDropdown.classList.remove("active");
    }
    if (notifDropdown && !notifDropdown.contains(e.target) && notifBtn && !notifBtn.contains(e.target)) {
        notifDropdown.classList.remove("active");
    }
});


/* ==========================================================================
   4. MATCHING ALGORITHM & 3-WAY SKILL CHAIN ENGINE
   ========================================================================== */

function calculateMatch(candidateUser, activeUser) {
    const user = activeUser || currentUser;
    let score = 0;
    if (!candidateUser || !user) return 0;

    const teachesWhatYouWant = candidateUser.teaches.some(skill =>
        user.wantsToLearn.some(wanted =>
            wanted.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(wanted.toLowerCase())
        )
    );
    if (teachesWhatYouWant) score += 40;

    const wantsWhatYouTeach = candidateUser.wantsToLearn.some(skill =>
        user.teaches.some(taught =>
            taught.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(taught.toLowerCase())
        )
    );
    if (wantsWhatYouTeach) score += 40;

    if (
        candidateUser.preference === "both" ||
        user.preference === "both" ||
        candidateUser.preference === user.preference
    ) {
        score += 10;
    }

    if (candidateUser.location && user.location) {
        const candLoc = candidateUser.location.toLowerCase();
        const userLoc = user.location.toLowerCase();
        if (candLoc.includes(userLoc) || userLoc.includes(candLoc) || (candLoc.includes("kathmandu") && userLoc.includes("lalitpur"))) {
            score += 10;
        }
    }

    return score;
}

function findSkillChains(activeUser) {
    const user = activeUser || currentUser;
    const chains = [];
    if (typeof users === "undefined" || !Array.isArray(users)) return chains;

    users.forEach(memberB => {
        const bTeachesUserWant = memberB.teaches.some(tB =>
            user.wantsToLearn.some(uW => uW.toLowerCase().includes(tB.toLowerCase()) || tB.toLowerCase().includes(uW.toLowerCase()))
        );

        if (bTeachesUserWant) {
            users.forEach(memberC => {
                if (memberC.id !== memberB.id) {
                    const cTeachesBWant = memberC.teaches.some(tC =>
                        memberB.wantsToLearn.some(bW => bW.toLowerCase().includes(tC.toLowerCase()) || tC.toLowerCase().includes(bW.toLowerCase()))
                    );

                    const cWantsUserTeach = memberC.wantsToLearn.some(cW =>
                        user.teaches.some(uT => uT.toLowerCase().includes(cW.toLowerCase()) || cW.toLowerCase().includes(uT.toLowerCase()))
                    );

                    if (cTeachesBWant && cWantsUserTeach) {
                        chains.push({
                            memberB: memberB,
                            memberC: memberC,
                            userTeach: user.teaches[0],
                            userWant: memberB.teaches[0],
                            bTeach: memberB.teaches[0],
                            bWant: memberC.teaches[0],
                            cTeach: memberC.teaches[0],
                            cWant: user.teaches[0]
                        });
                    }
                }
            });
        }
    });

    return chains;
}


/* ==========================================================================
   5. ONBOARDING & SIGNUP WIZARD LOGIC
   ========================================================================== */
let currentOnboardingStep = 1;

function showStep(step) {
    const steps = document.querySelectorAll(".onboarding-step");
    steps.forEach(s => s.classList.remove("active"));

    const target = document.getElementById("step" + step);
    if (target) target.classList.add("active");

    const stepText = document.getElementById("stepText");
    if (stepText) stepText.textContent = "Step " + step + " of 4";

    const progressFill = document.getElementById("progressFill");
    const progressPerc = document.getElementById("progressPercentage");
    if (progressFill) {
        progressFill.style.width = (step * 25) + "%";
        if (progressPerc) progressPerc.textContent = (step * 25) + "%";
    }
}

function nextStep() {
    if (currentOnboardingStep < 4) {
        currentOnboardingStep++;
        showStep(currentOnboardingStep);
    }
}

function previousStep() {
    if (currentOnboardingStep > 1) {
        currentOnboardingStep--;
        showStep(currentOnboardingStep);
    }
}

function finishProfile() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const locationInput = document.getElementById("location");
    const teachInput = document.getElementById("teachSkill");
    const skillLevelInput = document.getElementById("skillLevel");
    const learnInput = document.getElementById("learnSkill");
    const learningGoalInput = document.getElementById("learningGoal");
    const learningTypeRadio = document.querySelector('input[name="learningType"]:checked');

    const profile = {
        ...currentUser,
        name: nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Saaladin",
        email: emailInput && emailInput.value.trim() ? emailInput.value.trim() : "saaladin@skillswap.local",
        location: locationInput && locationInput.value.trim() ? locationInput.value.trim() : "Kathmandu, Nepal",
        avatar: "assets/avatar-you.svg",
        teaches: teachInput && teachInput.value.trim() ? [teachInput.value.trim()] : ["C Programming"],
        teachLevels: { [teachInput ? teachInput.value.trim() : "C Programming"]: skillLevelInput ? skillLevelInput.value : "Intermediate" },
        wantsToLearn: learnInput && learnInput.value.trim() ? [learnInput.value.trim()] : ["UI/UX Design"],
        learningGoals: learningGoalInput ? learningGoalInput.options[learningGoalInput.selectedIndex].text : "College Project",
        preference: learningTypeRadio ? learningTypeRadio.value : "online"
    };

    saveStoredUser(profile);
    currentUser = profile;
    setAuthStatus(true);

    const step4 = document.getElementById("step4");
    if (step4) step4.classList.remove("active");

    const successStep = document.getElementById("successStep");
    if (successStep) successStep.classList.add("active");

    const stepText = document.getElementById("stepText");
    if (stepText) stepText.textContent = "Completed";

    const progressFill = document.getElementById("progressFill");
    if (progressFill) progressFill.style.width = "100%";

    const progressPerc = document.getElementById("progressPercentage");
    if (progressPerc) progressPerc.textContent = "100%";
}

function goToDiscover() {
    window.location.href = "discover.html";
}


/* ==========================================================================
   6. DISCOVER PAGE & INTERACTION HANDLERS
   ========================================================================== */

function renderDiscoverCards(filteredUsers) {
    const grid = document.getElementById("matchGrid");
    if (!grid) return;

    const candidates = filteredUsers || (typeof users !== "undefined" ? users : []);

    if (candidates.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 18px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 20px; margin-bottom: 8px;">No matching learners found with these filters</h3>
                <p style="color: #64748b; margin-bottom: 20px;">Try clearing filters or search for another skill.</p>
                <button class="primary-btn" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = candidates.map(user => {
        const score = calculateMatch(user, currentUser);
        const teachTags = user.teaches.map(t => `<span class="skill-tag">${t}</span>`).join("");
        const learnTags = user.wantsToLearn.map(w => `<span class="skill-tag">${w}</span>`).join("");

        return `
            <article class="match-card" data-user-id="${user.id}">
                <div class="match-percentage" aria-label="Match score: ${score} percent">
                    <span class="match-score">${score}</span>% MATCH
                </div>

                <div class="match-profile">
                    <div class="avatar-wrapper">
                        <img src="${user.avatar || 'assets/avatar-alex.svg'}" alt="${user.name} avatar" class="avatar-img" loading="lazy">
                    </div>
                    <h2>${user.name} ${user.verified ? '<span class="verified-badge" title="Verified Peer" aria-label="Verified peer">✓</span>' : ''}</h2>
                    <p class="user-role-text">${user.role}</p>
                    <p class="location">📍 ${user.location}</p>
                </div>

                <div class="match-info">
                    <div>
                        <p class="info-title">CAN TEACH</p>
                        ${teachTags}
                    </div>
                    <div>
                        <p class="info-title">WANTS TO LEARN</p>
                        ${learnTags}
                    </div>
                </div>

                <div class="match-reasons">
                    <p>Why this match?</p>
                    <span>✓ ${score >= 80 ? 'Perfect skill exchange match' : 'Teaches skills you want to learn'}</span>
                    <span>✓ ${user.preference === 'online' ? 'Available for online voice/chat' : 'Available in-person/online'}</span>
                    <span>✓ ⭐ ${user.rating} rating (${user.sessionsCount} swaps completed)</span>
                </div>

                <div class="match-actions">
                    <button class="pass-btn" onclick="passMatch(this)" aria-label="Pass on ${user.name}" title="Pass">✕</button>
                    <button class="like-btn" onclick="likeMatch(this, ${user.id})" aria-label="Connect with ${user.name}" title="Connect">♥</button>
                </div>
            </article>
        `;
    }).join("");
}

function renderSkillChains() {
    const container = document.getElementById("chainsGrid");
    if (!container) return;

    const chains = findSkillChains(currentUser);

    if (chains.length === 0) {
        container.innerHTML = `
            <div class="chain-card">
                <div class="chain-card-header">
                    <div>
                        <span class="chain-badge">🔗 3-Way Skill Loop Active</span>
                        <h3 style="margin-top: 6px; font-size: 17px;">You ↔ Alex Shrestha ↔ Binod Adhikari</h3>
                    </div>
                    <span style="font-weight: 800; color: var(--primary);">100% Loop Viability</span>
                </div>
                <div class="chain-steps-row">
                    <div class="chain-member-box">
                        <strong>You (${currentUser.name})</strong>
                        <span>Teaches: ${currentUser.teaches[0]}</span>
                    </div>
                    <div class="chain-connector">→</div>
                    <div class="chain-member-box">
                        <strong>Alex Shrestha</strong>
                        <span>Teaches: UI/UX Design</span>
                    </div>
                    <div class="chain-connector">→</div>
                    <div class="chain-member-box">
                        <strong>Binod Adhikari</strong>
                        <span>Teaches: English Communication</span>
                    </div>
                </div>
                <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="primary-btn" onclick="openChainMatchModal('Alex Shrestha', 'Binod Adhikari')">Connect 3-Way Swap →</button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = chains.map(chain => `
        <div class="chain-card">
            <div class="chain-card-header">
                <div>
                    <span class="chain-badge">🔗 3-Way Skill Loop Discovered</span>
                    <h3 style="margin-top: 6px; font-size: 17px;">${currentUser.name} ↔ ${chain.memberB.name} ↔ ${chain.memberC.name}</h3>
                </div>
                <span style="font-weight: 800; color: var(--primary);">100% Loop Viability</span>
            </div>
            <div class="chain-steps-row">
                <div class="chain-member-box">
                    <strong>You (${currentUser.name})</strong>
                    <span>Teaches: ${chain.userTeach}</span>
                </div>
                <div class="chain-connector">→</div>
                <div class="chain-member-box">
                    <strong>${chain.memberB.name}</strong>
                    <span>Teaches: ${chain.bTeach}</span>
                </div>
                <div class="chain-connector">→</div>
                <div class="chain-member-box">
                    <strong>${chain.memberC.name}</strong>
                    <span>Teaches: ${chain.cTeach}</span>
                </div>
            </div>
            <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="primary-btn" onclick="openChainMatchModal('${chain.memberB.name}', '${chain.memberC.name}')">Connect 3-Way Swap →</button>
            </div>
        </div>
    `).join("");
}

function passMatch(button) {
    const card = button.closest(".match-card");
    if (!card) return;

    card.style.transform = "translateX(-120%) rotate(-10deg)";
    card.style.opacity = "0";

    setTimeout(() => {
        card.remove();
        const remaining = document.querySelectorAll(".match-card");
        if (remaining.length === 0) {
            renderDiscoverCards([]);
        }
    }, 300);
}

function likeMatch(button, userId) {
    if (!userMatches.includes(userId)) {
        userMatches.push(userId);
        saveStoredMatches(userMatches);
    }

    const candidate = getUserById(userId) || { name: "this peer", id: userId };
    showMatchCelebration(candidate);
}

function showMatchCelebration(peer) {
    const modal = document.getElementById("matchModal");
    const nameEl = document.getElementById("celebrationPeerName");
    const chatLink = document.getElementById("celebrationChatBtn");

    if (nameEl) nameEl.textContent = peer.name;
    if (chatLink) chatLink.href = `matches.html?user=${peer.id}`;
    if (modal) modal.classList.add("active");
}

function closeMatchModal() {
    const modal = document.getElementById("matchModal");
    if (modal) modal.classList.remove("active");
}

function openChainMatchModal(peerB, peerC) {
    showToast(`🎉 3-Way Loop Invitation sent to ${peerB} and ${peerC}!`, "success");
}

function filterMatches() {
    const searchInput = document.getElementById("skillSearchInput");
    const formatSelect = document.getElementById("formatFilter");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const format = formatSelect ? formatSelect.value : "all";

    if (typeof users === "undefined") return;

    const filtered = users.filter(u => {
        const matchesQuery = query === "" ||
            u.name.toLowerCase().includes(query) ||
            u.teaches.some(t => t.toLowerCase().includes(query)) ||
            u.wantsToLearn.some(w => w.toLowerCase().includes(query)) ||
            u.location.toLowerCase().includes(query);

        const matchesFormat = format === "all" || u.preference === "both" || u.preference === format;

        return matchesQuery && matchesFormat;
    });

    renderDiscoverCards(filtered);
}

function resetFilters() {
    const searchInput = document.getElementById("skillSearchInput");
    const formatSelect = document.getElementById("formatFilter");
    if (searchInput) searchInput.value = "";
    if (formatSelect) formatSelect.value = "all";
    renderDiscoverCards(users);
}

function switchDiscoverTab(tabName) {
    const matchGrid = document.getElementById("matchGrid");
    const chainsSection = document.getElementById("chainsSection");
    const tabDirect = document.getElementById("tabDirectBtn");
    const tabChains = document.getElementById("tabChainsBtn");

    if (tabName === "chains") {
        if (matchGrid) matchGrid.style.display = "none";
        if (chainsSection) chainsSection.style.display = "block";
        if (tabDirect) tabDirect.classList.remove("active");
        if (tabChains) tabChains.classList.add("active");
        renderSkillChains();
    } else {
        if (matchGrid) matchGrid.style.display = "grid";
        if (chainsSection) chainsSection.style.display = "none";
        if (tabDirect) tabDirect.classList.add("active");
        if (tabChains) tabChains.classList.remove("active");
        renderDiscoverCards();
    }
}


/* ==========================================================================
   7. REAL-TIME CHAT SIMULATOR & INTERACTIVITY
   ========================================================================== */
let activeChatUserId = 1;

function initChatPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const peerParam = urlParams.get("user");
    if (peerParam) {
        activeChatUserId = Number(peerParam);
    }

    renderChatSidebar();
    loadChatConversation(activeChatUserId);
}

function renderChatSidebar() {
    const container = document.getElementById("chatMatchesList");
    if (!container || typeof users === "undefined") return;

    container.innerHTML = users.filter(u => userMatches.includes(u.id)).map(peer => {
        const msgs = chatMessages[peer.id] || [];
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : "New Skill Match!";
        const isActive = peer.id === activeChatUserId ? "active" : "";

        return `
            <div class="chat-match-item ${isActive}" onclick="selectChatPeer(${peer.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ') selectChatPeer(${peer.id})">
                <img src="${peer.avatar || 'assets/avatar-alex.svg'}" alt="${peer.name}" class="match-item-avatar-img">
                <div class="match-item-info">
                    <strong>${peer.name}</strong>
                    <p>${lastMsg}</p>
                </div>
            </div>
        `;
    }).join("");
}

function selectChatPeer(peerId) {
    activeChatUserId = peerId;
    renderChatSidebar();
    loadChatConversation(peerId);
}

function loadChatConversation(peerId) {
    const peer = getUserById(peerId) || { name: "Peer", role: "Learning Partner", avatar: "assets/avatar-alex.svg", initials: "P" };
    const nameEl = document.getElementById("chatPartnerName");
    const roleEl = document.getElementById("chatPartnerRole");
    const avatarEl = document.getElementById("chatPartnerAvatar");

    if (nameEl) nameEl.textContent = peer.name;
    if (roleEl) roleEl.textContent = `Teaches ${peer.teaches ? peer.teaches.join(', ') : 'Skills'} • ${peer.location || 'Nepal'}`;
    if (avatarEl) {
        avatarEl.innerHTML = `<img src="${peer.avatar || 'assets/avatar-alex.svg'}" alt="${peer.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }

    const messages = chatMessages[peerId] || [
        { sender: "peer", text: `Hi ${currentUser.name}! Excited to connect on SkillSwap. What would you like to start with?`, time: "Just now" }
    ];

    const scrollPane = document.getElementById("chatMessagesScroll");
    if (scrollPane) {
        scrollPane.innerHTML = messages.map(m => `
            <div class="chat-bubble ${m.sender}">
                ${m.text}
                <span class="chat-bubble-time">${m.time}</span>
            </div>
        `).join("");
        scrollPane.scrollTop = scrollPane.scrollHeight;
    }
}

function sendChatMessage(overrideText) {
    const input = document.getElementById("chatMessageInput");
    const text = overrideText || (input ? input.value.trim() : "");
    if (!text) return;

    if (input) input.value = "";

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!chatMessages[activeChatUserId]) {
        chatMessages[activeChatUserId] = [];
    }

    chatMessages[activeChatUserId].push({
        sender: "user",
        text: text,
        time: timeStr
    });
    saveStoredMessages(chatMessages);

    loadChatConversation(activeChatUserId);
    renderChatSidebar();

    const scrollPane = document.getElementById("chatMessagesScroll");
    if (scrollPane) {
        const typingEl = document.createElement("div");
        typingEl.id = "typingIndicator";
        typingEl.className = "typing-bubble";
        typingEl.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        scrollPane.appendChild(typingEl);
        scrollPane.scrollTop = scrollPane.scrollHeight;
    }

    setTimeout(() => {
        const typingEl = document.getElementById("typingIndicator");
        if (typingEl) typingEl.remove();
        simulatePeerReply(activeChatUserId, text);
    }, 1200);
}

function sendQuickPrompt(promptText) {
    sendChatMessage(promptText);
}

function simulatePeerReply(peerId, userMsg) {
    const peer = getUserById(peerId) || { name: "Peer" };
    let replyText = `Awesome! I'm completely free this Wednesday evening. Shall we schedule a 30-min Google Meet swap?`;

    const lower = userMsg.toLowerCase();
    if (lower.includes("schedule") || lower.includes("meet") || lower.includes("time") || lower.includes("when")) {
        replyText = `Sounds great! Please click the '📅 Schedule Session' button above so we can lock in the date.`;
    } else if (lower.includes("pointers") || lower.includes("c ") || lower.includes("code")) {
        replyText = `Perfect! I've been struggling with dynamic allocation in C. In return, I can walk you through creating design components in Figma!`;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!chatMessages[peerId]) chatMessages[peerId] = [];
    chatMessages[peerId].push({
        sender: "peer",
        text: replyText,
        time: timeStr
    });
    saveStoredMessages(chatMessages);

    loadChatConversation(peerId);
    renderChatSidebar();
}


/* ==========================================================================
   8. SESSION SCHEDULER & REVIEWS
   ========================================================================== */

function openSchedulerModal() {
    const modal = document.getElementById("schedulerModal");
    const peer = getUserById(activeChatUserId) || { name: "Alex Shrestha" };
    const peerNameEl = document.getElementById("schedulerPeerName");
    if (peerNameEl) peerNameEl.textContent = peer.name;
    if (modal) modal.classList.add("active");
}

function closeSchedulerModal() {
    const modal = document.getElementById("schedulerModal");
    if (modal) modal.classList.remove("active");
}

function confirmScheduleSession() {
    const dateInput = document.getElementById("sessionDate");
    const timeInput = document.getElementById("sessionTime");
    const topicInput = document.getElementById("sessionTopic");
    const formatSelect = document.getElementById("sessionFormat");

    const peer = getUserById(activeChatUserId) || { id: 1, name: "Alex Shrestha" };

    const newSession = {
        id: Date.now(),
        partnerId: peer.id,
        partnerName: peer.name,
        skillTaught: currentUser.teaches[0] || "Programming",
        skillLearned: peer.teaches[0] || "UI/UX",
        date: dateInput && dateInput.value ? dateInput.value : "2026-08-22",
        time: timeInput && timeInput.value ? timeInput.value : "6:30 PM - 7:15 PM",
        format: formatSelect ? formatSelect.value : "Online (Google Meet)",
        topic: topicInput && topicInput.value ? topicInput.value : "Skill Exchange Kickoff",
        status: "upcoming"
    };

    userSessions.unshift(newSession);
    saveStoredSessions(userSessions);

    closeSchedulerModal();
    showToast(`🎉 Swap Session scheduled with ${peer.name}!`, "success");
}

function renderSessionsPage() {
    const upcomingContainer = document.getElementById("upcomingSessionsList");
    const completedContainer = document.getElementById("completedSessionsList");

    const upcoming = userSessions.filter(s => s.status === "upcoming");
    const completed = userSessions.filter(s => s.status === "completed");

    if (upcomingContainer) {
        if (upcoming.length === 0) {
            upcomingContainer.innerHTML = `<p style="color: var(--slate-500); padding: 20px 0;">No upcoming sessions yet. Explore Discover to connect with peers!</p>`;
        } else {
            upcomingContainer.innerHTML = upcoming.map(s => {
                const parts = s.date.split("-");
                const day = parts.length > 2 ? parts[2] : "20";
                const month = parts.length > 1 ? (parts[1] === "08" ? "AUG" : "SEP") : "AUG";

                return `
                    <div class="session-card">
                        <div class="session-main">
                            <div class="session-date-box">
                                <strong>${day}</strong>
                                <span>${month}</span>
                            </div>
                            <div>
                                <h3 style="font-size: 17px; font-weight: 800; margin-bottom: 4px;">Exchange with ${s.partnerName}</h3>
                                <p style="font-size: 13px; color: var(--slate-500); margin-bottom: 6px;">
                                    <strong>Teaching:</strong> ${s.skillTaught} • <strong>Learning:</strong> ${s.skillLearned}
                                </p>
                                <span class="skill-tag" style="background: #e0e7ff; color: #4338ca;">🕒 ${s.time}</span>
                                <span class="skill-tag">${s.format}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="secondary-btn" onclick="alert('Meeting Link: https://meet.google.com/skill-swap-nepal')">Join Room 📹</button>
                            <button class="primary-btn" onclick="completeSession(${s.id})">Mark Done ✓</button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    if (completedContainer) {
        completedContainer.innerHTML = completed.map(s => `
            <div class="session-card" style="opacity: 0.9;">
                <div class="session-main">
                    <div class="session-date-box" style="background: var(--success-bg); color: var(--success);">
                        <strong>✓</strong>
                        <span>DONE</span>
                    </div>
                    <div>
                        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 2px;">Completed with ${s.partnerName}</h3>
                        <p style="font-size: 13px; color: var(--slate-500);">Exchanged ${s.skillTaught} ↔ ${s.skillLearned}</p>
                    </div>
                </div>
                <div>
                    <span style="color: #d97706; font-weight: 800; font-size: 14px;">⭐⭐⭐⭐⭐ 5.0 Rating</span>
                </div>
            </div>
        `).join("");
    }
}

function completeSession(sessionId) {
    const session = userSessions.find(s => s.id === sessionId);
    if (session) {
        session.status = "completed";
        currentUser.sessionsCompleted = (currentUser.sessionsCompleted || 4) + 1;
        currentUser.credits = (currentUser.credits || 5) + 1;
        saveStoredSessions(userSessions);
        saveStoredUser(currentUser);

        renderSessionsPage();
        showToast(`🎉 Session completed! You earned +1 Skill Credit (Balance: 🪙 ${currentUser.credits})`, "success");
    }
}


/* ==========================================================================
   9. SKILL PASSPORT & SETTINGS HANDLERS
   ========================================================================== */

function renderProfilePage() {
    const nameEl = document.getElementById("profileName");
    const roleEl = document.getElementById("profileRole");
    const locEl = document.getElementById("profileLoc");
    const avatarWrapperEl = document.getElementById("profileBigAvatar");
    const creditEl = document.getElementById("profileCreditsCount");
    const ratingEl = document.getElementById("profileRatingText");
    const sessionsEl = document.getElementById("profileSessionsCount");

    if (nameEl) nameEl.innerHTML = `${currentUser.name} <span class="verified-badge" title="Verified Member">✓</span>`;
    if (roleEl) roleEl.textContent = currentUser.role || "BCA Student & Learner";
    if (locEl) locEl.textContent = `📍 ${currentUser.location}`;
    if (avatarWrapperEl) {
        avatarWrapperEl.innerHTML = `<img src="${currentUser.avatar || 'assets/avatar-you.svg'}" alt="${currentUser.name}" class="avatar-img">`;
    }
    if (creditEl) creditEl.textContent = currentUser.credits || 5;
    if (ratingEl) ratingEl.textContent = `${currentUser.rating || 4.9} / 5.0`;
    if (sessionsEl) sessionsEl.textContent = `${currentUser.sessionsCompleted || 4} Swaps`;

    const teachContainer = document.getElementById("passportTeachList");
    if (teachContainer) {
        teachContainer.innerHTML = currentUser.teaches.map(skill => `
            <div class="passport-skill-row">
                <div class="skill-row-top">
                    <span>${skill}</span>
                    <span style="color: var(--primary); font-size: 12px; font-weight: 800;">Advanced (85%)</span>
                </div>
                <div class="skill-level-bar">
                    <div class="skill-level-fill" style="width: 85%;"></div>
                </div>
            </div>
        `).join("");
    }

    const learnContainer = document.getElementById("passportLearnList");
    if (learnContainer) {
        learnContainer.innerHTML = currentUser.wantsToLearn.map(skill => `
            <div class="passport-skill-row">
                <div class="skill-row-top">
                    <span>${skill}</span>
                    <span style="color: var(--success); font-size: 12px; font-weight: 800;">In Progress (40%)</span>
                </div>
                <div class="skill-level-bar">
                    <div class="skill-level-fill" style="width: 40%; background: var(--success);"></div>
                </div>
            </div>
        `).join("");
    }
}

function selectAvatar(avatarSrc, btnEl) {
    document.querySelectorAll(".avatar-choice-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    currentUser.avatar = avatarSrc;
}

function saveProfileSettings(event) {
    if (event) event.preventDefault();
    const nameInput = document.getElementById("settingsName");
    const emailInput = document.getElementById("settingsEmail");
    const roleInput = document.getElementById("settingsRole");
    const locInput = document.getElementById("settingsLocation");
    const bioInput = document.getElementById("settingsBio");

    currentUser = {
        ...currentUser,
        name: nameInput ? nameInput.value.trim() : currentUser.name,
        email: emailInput ? emailInput.value.trim() : currentUser.email,
        role: roleInput ? roleInput.value.trim() : currentUser.role,
        location: locInput ? locInput.value.trim() : currentUser.location,
        bio: bioInput ? bioInput.value.trim() : currentUser.bio
    };

    saveStoredUser(currentUser);
    syncNavbarUser();
    showToast("Profile settings saved successfully! ✓", "success");
}

function resetAllDemoData() {
    if (confirm("Are you sure you want to reset all mock messages, sessions, and data to initial defaults?")) {
        localStorage.clear();
        currentUser = DEFAULT_USER_STATE;
        userMatches = [1, 2];
        chatMessages = DEFAULT_MESSAGES;
        userSessions = DEFAULT_SESSIONS;
        saveStoredUser(currentUser);
        saveStoredMatches(userMatches);
        saveStoredMessages(chatMessages);
        saveStoredSessions(userSessions);
        showToast("Demo data reset to defaults! Reloading...", "info");
        setTimeout(() => {
            window.location.reload();
        }, 600);
    }
}


/* ==========================================================================
   10. LANDING PAGE INTERACTIVE CALCULATOR
   ========================================================================== */

function testLandingMatch() {
    const teachSelect = document.getElementById("calcTeachSkill");
    const learnSelect = document.getElementById("calcLearnSkill");
    const scoreVal = document.getElementById("calcScoreValue");
    const peerName = document.getElementById("calcPeerName");
    const reasonsEl = document.getElementById("calcReasons");

    const teach = teachSelect ? teachSelect.value : "C Programming";
    const learn = learnSelect ? learnSelect.value : "UI/UX Design";

    const mockCandidate = {
        name: learn === "UI/UX Design" ? "Alex Shrestha (Kathmandu)" : "Milan Thapa (Bhaktapur)",
        teaches: [learn],
        wantsToLearn: [teach],
        preference: "online",
        location: "Kathmandu, Nepal"
    };

    const score = calculateMatch(mockCandidate, {
        teaches: [teach],
        wantsToLearn: [learn],
        preference: "online",
        location: "Kathmandu, Nepal"
    });

    if (scoreVal) scoreVal.textContent = `${score}% MATCH`;
    if (peerName) peerName.textContent = `Matched with ${mockCandidate.name}`;
    if (reasonsEl) {
        reasonsEl.textContent = `✓ Teaches ${learn} • Wants ${teach} • Same Online Preference`;
    }
}


/* ==========================================================================
   11. GLOBAL NAVBAR SYNC & INITIALIZATION
   ========================================================================== */

function syncNavbarUser() {
    const nameEl = document.getElementById("navUserName");
    const avatarEl = document.getElementById("navUserAvatar");
    const creditEl = document.getElementById("navCreditCount");
    const dropdownName = document.getElementById("dropdownUserName");
    const dropdownEmail = document.getElementById("dropdownUserEmail");

    if (nameEl) nameEl.textContent = currentUser.name;
    if (dropdownName) dropdownName.textContent = currentUser.name;
    if (dropdownEmail) dropdownEmail.textContent = currentUser.email;
    if (avatarEl) {
        avatarEl.innerHTML = `<img src="${currentUser.avatar || 'assets/avatar-you.svg'}" alt="${currentUser.name}" class="mini-avatar-img">`;
    }
    if (creditEl) creditEl.textContent = currentUser.credits || 5;

    const teachBanner = document.getElementById("displayUserTeach");
    const learnBanner = document.getElementById("displayUserLearn");
    if (teachBanner && currentUser.teaches) teachBanner.textContent = currentUser.teaches.join(", ");
    if (learnBanner && currentUser.wantsToLearn) learnBanner.textContent = currentUser.wantsToLearn.join(", ");

    // Sync settings inputs if on settings page
    const sName = document.getElementById("settingsName");
    const sEmail = document.getElementById("settingsEmail");
    const sRole = document.getElementById("settingsRole");
    const sLoc = document.getElementById("settingsLocation");
    const sBio = document.getElementById("settingsBio");
    if (sName) sName.value = currentUser.name;
    if (sEmail) sEmail.value = currentUser.email;
    if (sRole) sRole.value = currentUser.role || "BCA Student & Learner";
    if (sLoc) sLoc.value = currentUser.location || "Kathmandu, Nepal";
    if (sBio) sBio.value = currentUser.bio || "";
}

document.addEventListener("DOMContentLoaded", function() {
    syncNavbarUser();

    if (document.getElementById("matchGrid")) {
        renderDiscoverCards();
    }
    if (document.getElementById("chatMatchesList")) {
        initChatPage();
    }
    if (document.getElementById("upcomingSessionsList")) {
        renderSessionsPage();
    }
    if (document.getElementById("passportTeachList")) {
        renderProfilePage();
    }
});
