const adminLoginSection = document.getElementById("adminLogin");
const adminPanelSection = document.getElementById("adminPanel");

if (adminLoginSection) {
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminLoginFeedback = document.getElementById("adminLoginFeedback");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const adminProductForm = document.getElementById("adminProductForm");
  const adminFormFeedback = document.getElementById("adminFormFeedback");
  const adminFormTitle = document.getElementById("adminFormTitle");
  const adminCancelEdit = document.getElementById("adminCancelEdit");
  const adminTableBody = document.getElementById("adminTableBody");
  const pieceField = document.getElementById("pieceField");

  function showLogin() {
    adminLoginSection.classList.remove("is-hidden");
    adminPanelSection.classList.add("is-hidden");
  }

  function showPanel() {
    adminLoginSection.classList.add("is-hidden");
    adminPanelSection.classList.remove("is-hidden");
    loadAdminProducts();
  }

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin-login");
      const data = await res.json();
      if (data.authenticated) showPanel();
      else showLogin();
    } catch {
      showLogin();
    }
  }

  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    adminLoginFeedback.textContent = "Entrando...";
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminLoginForm.password.value }),
      });
      if (res.ok) {
        adminLoginForm.reset();
        adminLoginFeedback.textContent = "";
        showPanel();
      } else {
        const data = await res.json();
        adminLoginFeedback.textContent = data.error || "Senha incorreta.";
      }
    } catch {
      adminLoginFeedback.textContent = "Erro ao entrar. Tenta de novo.";
    }
  });

  adminLogoutBtn.addEventListener("click", async () => {
    await fetch("/api/admin-login", { method: "DELETE" });
    showLogin();
  });

  function togglePieceField() {
    pieceField.style.display = adminProductForm.category.value === "biquinis" ? "" : "none";
  }
  adminProductForm.category.addEventListener("change", togglePieceField);

  function resetForm() {
    adminProductForm.reset();
    adminProductForm.id.value = "";
    adminProductForm.gradientFrom.value = "#ffc46b";
    adminProductForm.gradientTo.value = "#ff8a5b";
    adminFormTitle.textContent = "Novo produto";
    adminCancelEdit.classList.add("is-hidden");
    togglePieceField();
  }
  adminCancelEdit.addEventListener("click", resetForm);

  async function loadAdminProducts() {
    const res = await fetch("/api/produtos");
    const data = await res.json();
    const products = data.products || [];

    adminTableBody.innerHTML = products.length
      ? products
          .map(
            (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.category}${p.piece ? " / " + p.piece : ""}</td>
        <td>${priceLabel(p.priceCents)}</td>
        <td class="admin-table__actions">
          <button type="button" data-edit="${p.id}" class="admin-table__btn">Editar</button>
          <button type="button" data-delete="${p.id}" class="admin-table__btn admin-table__btn--danger">Remover</button>
        </td>
      </tr>`
          )
          .join("")
      : `<tr><td colspan="4">Nenhum produto cadastrado ainda.</td></tr>`;

    adminTableBody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = products.find((p) => String(p.id) === btn.dataset.edit);
        if (!product) return;
        adminProductForm.id.value = product.id;
        adminProductForm.name.value = product.name;
        adminProductForm.desc.value = product.desc || "";
        adminProductForm.price.value = (product.priceCents / 100).toFixed(2);
        adminProductForm.originalPrice.value = product.originalPriceCents
          ? (product.originalPriceCents / 100).toFixed(2)
          : "";
        adminProductForm.category.value = product.category;
        adminProductForm.piece.value = product.piece || "";
        adminProductForm.imageUrl.value = product.imageUrl || "";
        adminProductForm.gradientFrom.value = product.gradientFrom || "#ffc46b";
        adminProductForm.gradientTo.value = product.gradientTo || "#ff8a5b";
        adminProductForm.isNew.checked = !!product.isNew;
        adminProductForm.isBestseller.checked = !!product.isBestseller;
        adminProductForm.sortOrder.value = product.sortOrder || 0;
        adminFormTitle.textContent = `Editando: ${product.name}`;
        adminCancelEdit.classList.remove("is-hidden");
        togglePieceField();
        adminProductForm.scrollIntoView({ behavior: "smooth" });
      });
    });

    adminTableBody.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Remover esse produto da loja?")) return;
        await fetch("/api/produtos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: Number(btn.dataset.delete) }),
        });
        loadAdminProducts();
      });
    });
  }

  adminProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    adminFormFeedback.textContent = "Salvando...";
    const id = adminProductForm.id.value;
    const payload = {
      id: id ? Number(id) : undefined,
      name: adminProductForm.name.value.trim(),
      desc: adminProductForm.desc.value.trim(),
      priceCents: Math.round(Number(adminProductForm.price.value) * 100),
      originalPriceCents: adminProductForm.originalPrice.value
        ? Math.round(Number(adminProductForm.originalPrice.value) * 100)
        : null,
      category: adminProductForm.category.value,
      piece: adminProductForm.category.value === "biquinis" ? adminProductForm.piece.value || null : null,
      imageUrl: adminProductForm.imageUrl.value.trim() || null,
      gradientFrom: adminProductForm.gradientFrom.value,
      gradientTo: adminProductForm.gradientTo.value,
      isNew: adminProductForm.isNew.checked,
      isBestseller: adminProductForm.isBestseller.checked,
      sortOrder: Number(adminProductForm.sortOrder.value) || 0,
    };

    try {
      const res = await fetch("/api/produtos", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        adminFormFeedback.textContent = data.error || "Não deu pra salvar.";
        return;
      }
      adminFormFeedback.textContent = "Salvo!";
      resetForm();
      loadAdminProducts();
    } catch {
      adminFormFeedback.textContent = "Erro ao salvar. Tenta de novo.";
    }
  });

  togglePieceField();
  checkAuth();
}
