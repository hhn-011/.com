// == FLOATING NAVIGATION: SHOW AFTER INTRODUCTION ==
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".floating-nav");
    const menuButton = document.querySelector(".mobile-menu-button");
    const intro = document.querySelector("#home");
    const footer = document.querySelector("body > .site-footer");
    const navLinks = [...document.querySelectorAll(".floating-nav a")];
    const sections = [...document.querySelectorAll("main section[id]")];

    if (!nav || !menuButton || !intro) return;

    function setMenuOpen(open) {
        nav.classList.toggle("is-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        const symbol = menuButton.querySelector("span");
        if (symbol) symbol.textContent = open ? "✕" : "☰";
    }

    function updateNavigation() {
        const passedIntro = intro.getBoundingClientRect().bottom <= 0;
        const reachedFooter = footer && footer.getBoundingClientRect().top <= window.innerHeight;
        const showNavigation = passedIntro && !reachedFooter;
        nav.classList.toggle("is-visible", showNavigation);
        menuButton.classList.toggle("is-visible", showNavigation);
        if (!showNavigation) setMenuOpen(false);

        let activeId = "home";
        const referenceY = window.innerHeight * 0.42;
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= referenceY) activeId = section.id;
        }
        navLinks.forEach(link => {
            const active = link.getAttribute("href") === "#" + activeId;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }

    menuButton.addEventListener("click", () => setMenuOpen(!nav.classList.contains("is-open")));
    navLinks.forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenuOpen(false);
    });
    document.addEventListener("click", event => {
        if (nav.classList.contains("is-open") && !nav.contains(event.target) && !menuButton.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    let scheduled = false;
    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            updateNavigation();
            scheduled = false;
        });
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) setMenuOpen(false);
        scheduleUpdate();
    });
    updateNavigation();
});

// == CREDENTIALS: ACCESSIBLE CATEGORY TABS ==
document.addEventListener("DOMContentLoaded", () => {
    const tabList = document.querySelector(".credentials-tabs");
    if (!tabList) return;
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));
    function activateTab(index, moveFocus = false) {
        tabs.forEach((tab, i) => {
            const selected = i === index;
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;
            if (panels[i]) panels[i].hidden = !selected;
        });
        if (moveFocus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(index));
        tab.addEventListener("keydown", event => {
            let next = index;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = tabs.length - 1;
            else return;
            event.preventDefault();
            activateTab(next, true);
        });
    });
    activateTab(0);
});
