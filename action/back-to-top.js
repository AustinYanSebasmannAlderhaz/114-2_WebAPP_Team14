(function () {
    const elementNames = [
        "flow",
        "focus",
        "motion",
        "energy",
        "strength",
        "balance",
        "life"
    ];

    const currentScript = document.currentScript;
    const scriptUrl = currentScript ? currentScript.src : window.location.href;
    const elementImages = elementNames.map((name) => new URL(`../img/Element/${name}.png`, scriptUrl).href);

    function createBackToTopButton() {
        if (document.querySelector(".back-to-top-btn")) {
            return;
        }

        const button = document.createElement("button");
        button.className = "back-to-top-btn";
        button.type = "button";
        button.setAttribute("aria-label", "返回頂部");
        button.innerHTML = `
            <span class="back-to-top-orb" aria-hidden="true">
                <img src="${elementImages[0]}" alt="">
            </span>
            <span class="back-to-top-label">返回頂部</span>
        `;

        const icon = button.querySelector("img");
        let imageIndex = 0;

        elementImages.forEach((src) => {
            const image = new Image();
            image.src = src;
        });

        window.setInterval(() => {
            imageIndex = (imageIndex + 1) % elementImages.length;
            icon.classList.add("is-switching");

            window.setTimeout(() => {
                icon.src = elementImages[imageIndex];
                icon.classList.remove("is-switching");
            }, 160);
        }, 1400);

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        document.body.appendChild(button);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createBackToTopButton);
    } else {
        createBackToTopButton();
    }
})();
