(() => {
    "use strict";

    const toast = document.querySelector("[data-toast]");
    let toastTimer;

    const showToast = (message) => {
        if (!toast) return;
        const messageElement = toast.querySelector("[data-toast-message]");
        if (messageElement) messageElement.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    };

    const menuButton = document.querySelector("[data-menu-toggle]");
    const mainNav = document.querySelector("[data-main-nav]");

    menuButton?.addEventListener("click", () => {
        const isOpen = mainNav?.classList.toggle("is-open") ?? false;
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    const cartCount = document.querySelector("#cart-count");
    document.querySelectorAll("[data-add-cart]").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.added === "true") {
                showToast("Tài liệu này đã có trong giỏ");
                return;
            }

            button.dataset.added = "true";
            button.textContent = "Đã thêm ✓";
            button.classList.remove("btn-secondary");
            button.classList.add("btn-outline");

            if (cartCount) {
                cartCount.textContent = String(Number.parseInt(cartCount.textContent || "0", 10) + 1);
            }

            showToast(`Đã thêm “${button.dataset.product ?? "tài liệu"}” vào giỏ`);
        });
    });

    const normalizeText = (value) => value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const searchInput = document.querySelector("[data-search]");
    const filterButtons = [...document.querySelectorAll("[data-filter]")];
    const productCards = [...document.querySelectorAll("[data-product-card]")];
    const emptySearch = document.querySelector("[data-empty-search]");
    let activeFilter = "all";

    const filterProducts = () => {
        const query = normalizeText(searchInput?.value ?? "");
        let visibleCount = 0;

        productCards.forEach((card) => {
            const matchesSearch = normalizeText(card.dataset.name ?? "").includes(query);
            const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
            const isVisible = matchesSearch && matchesCategory;
            card.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });

        if (emptySearch) emptySearch.style.display = visibleCount === 0 ? "block" : "none";
    };

    searchInput?.addEventListener("input", filterProducts);
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter ?? "all";
            filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
            filterProducts();
        });
    });

    const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    });

    const updateCartSummary = () => {
        const items = [...document.querySelectorAll("[data-cart-item]")];
        const total = items.reduce((sum, item) => sum + Number(item.dataset.price ?? 0), 0);
        const itemLabel = document.querySelector("[data-cart-label]");
        const subtotal = document.querySelector("[data-cart-subtotal]");
        const totalElement = document.querySelector("[data-cart-total]");
        const checkoutButton = document.querySelector("#checkout-button");

        if (itemLabel) itemLabel.textContent = `${items.length} sản phẩm`;
        if (subtotal) subtotal.textContent = currencyFormatter.format(total);
        if (totalElement) totalElement.textContent = currencyFormatter.format(total);
        if (cartCount) cartCount.textContent = String(items.length);

        if (checkoutButton && items.length === 0) {
            checkoutButton.setAttribute("aria-disabled", "true");
            checkoutButton.textContent = "Giỏ hàng đang trống";
            checkoutButton.addEventListener("click", (event) => event.preventDefault(), { once: true });
        }
    };

    document.querySelectorAll("[data-remove-item]").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest("[data-cart-item]");
            const title = item?.querySelector("h3")?.textContent ?? "Tài liệu";
            item?.remove();
            updateCartSummary();
            showToast(`Đã xóa “${title}” khỏi giỏ`);
        });
    });

    document.querySelectorAll("[data-copy-target]").forEach((button) => {
        button.addEventListener("click", async () => {
            const target = document.getElementById(button.dataset.copyTarget ?? "");
            const value = target?.textContent?.trim();
            if (!value) return;

            try {
                await navigator.clipboard.writeText(value);
                button.textContent = "Đã chép";
                showToast("Đã sao chép vào bộ nhớ tạm");
                window.setTimeout(() => button.textContent = "Sao chép", 1600);
            } catch {
                showToast("Không thể sao chép tự động");
            }
        });
    });

    const countdown = document.querySelector("[data-countdown]");
    if (countdown) {
        let seconds = Number(countdown.dataset.countdown ?? 0);
        const timer = window.setInterval(() => {
            seconds = Math.max(0, seconds - 1);
            const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
            const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
            countdown.textContent = `${minutes}:${remainingSeconds}`;
            if (seconds === 0) window.clearInterval(timer);
        }, 1000);
    }

    document.querySelectorAll("[data-demo-download]").forEach((button) => {
        button.addEventListener("click", () => showToast("Tính năng tải sẽ hoạt động sau khi nối dữ liệu thật"));
    });
})();
