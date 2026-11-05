(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const menuButton = document.querySelector("#mobile-toggle");
    const mobileMenu = document.querySelector("#mobile-menu");

    // Menú móvil accesible.
    if (menuButton && mobileMenu) {
      const menuIcon = menuButton.querySelector("i");

      const closeMenu = () => {
        mobileMenu.hidden = true;
        mobileMenu.classList.remove("show");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
        if (menuIcon) {
          menuIcon.classList.remove("ph-x");
          menuIcon.classList.add("ph-list");
        }
      };

      menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeMenu();
          return;
        }

        mobileMenu.hidden = false;
        requestAnimationFrame(() => mobileMenu.classList.add("show"));
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Cerrar menú");
        if (menuIcon) {
          menuIcon.classList.remove("ph-list");
          menuIcon.classList.add("ph-x");
        }
      });

      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });

      document.addEventListener("click", (event) => {
        if (
          menuButton.getAttribute("aria-expanded") === "true" &&
          !mobileMenu.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {
          closeMenu();
        }
      });
    }

    // Animación del recorrido de trabajo en Inicio.
    const stepItems = document.querySelectorAll(".step-item");
    if (stepItems.length && "IntersectionObserver" in window) {
      const stepObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      stepItems.forEach((item) => stepObserver.observe(item));
    }

    // Acordeón de preguntas frecuentes: una respuesta abierta a la vez.
    const faqButtons = document.querySelectorAll(".faq-question");
    faqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const answerId = button.getAttribute("aria-controls");
        const answer = answerId ? document.getElementById(answerId) : null;
        const shouldOpen = button.getAttribute("aria-expanded") !== "true";

        faqButtons.forEach((otherButton) => {
          const otherId = otherButton.getAttribute("aria-controls");
          const otherAnswer = otherId ? document.getElementById(otherId) : null;
          otherButton.setAttribute("aria-expanded", "false");
          if (otherAnswer) otherAnswer.hidden = true;
        });

        button.setAttribute("aria-expanded", String(shouldOpen));
        if (answer) answer.hidden = !shouldOpen;
      });
    });

    // Formulario: prepara un correo con los datos ingresados.
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const subject = `Consulta desde PidoFácil - ${formData.get("negocio")}`;
        const message = [
          `Nombre: ${formData.get("nombre")}`,
          `Correo: ${formData.get("correo")}`,
          `Negocio: ${formData.get("negocio")}`,
          `Celular: ${formData.get("celular") || "No indicado"}`,
          "",
          "Mensaje:",
          formData.get("mensaje")
        ].join("\n");

        const mailto = `mailto:contacto@pidofacil.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailto;
      });
    }

    // Aparición progresiva de tarjetas y bloques con efecto cascada automático.
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (revealItems.length && "IntersectionObserver" in window) {
      body.classList.add("motion-ready");

      const parentContainers = new Map();

      revealItems.forEach((item) => {
        const parent = item.parentElement;
        if (!parentContainers.has(parent)) {
          parentContainers.set(parent, []);
        }
        parentContainers.get(parent).push(item);
      });

      parentContainers.forEach((items) => {
        items.forEach((item, index) => {
          const delay = item.dataset.delay !== undefined ? Number(item.dataset.delay) : index * 100;
          item.style.setProperty("--reveal-delay", `${delay}ms`);
        });
      });

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -36px 0px"
      });

      revealItems.forEach((item) => revealObserver.observe(item));
    }
  });
})();