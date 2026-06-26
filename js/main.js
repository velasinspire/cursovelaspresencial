/* ==========================================================================
   Velas Inspire — Curso Presencial
   main.js — comportamento da página + carregamento de conteúdo variável
   ========================================================================== */

(function () {
  "use strict";

  /**
   * DEFAULT_DATA é uma cópia dos valores de data/content.json.
   *
   * Por que existe essa cópia?
   * Quando a página é aberta diretamente pelo arquivo (duplo clique,
   * caminho "file:///..."), o navegador bloqueia por segurança a leitura
   * de outros arquivos via fetch() — então o JSON externo não carrega.
   *
   * Para a página nunca quebrar nesse cenário, aplicamos esses valores
   * padrão imediatamente. Se o site estiver hospedado em um servidor
   * (Hostinger, Netlify, GitHub Pages, ou até um servidor local), o
   * fetch('data/content.json') funciona normalmente e os valores do
   * arquivo JSON substituem estes — assim basta editar o content.json
   * para atualizar a página, sem tocar no código.
   *
   * Se for continuar editando só pelo arquivo local, mantenha este
   * objeto e o data/content.json sincronizados.
   */
  const DEFAULT_DATA = {
    site: {
      brandName: "Inspire",
      navCta: "Garantir minha vaga",
      footerTagline: "Aromas e Velas — Experiências que despertam memórias e sensações.",
      footerSlogan: "Desfrute o bem-estar."
    },
    course: {
      eyebrow: "Curso presencial · Joinville/SC",
      date: "18/07",
      dateFull: "18 de julho",
      time: "10h–15h",
      timeFull: "10h às 15h",
      timeNote: "com pausa para coffee break",
      location: "Joinville/SC",
      addressHtml: "Rua João Pinheiro, 248<br>Floresta, Joinville/SC",
      spots: 10
    },
    pricing: {
      fullPriceIntegers: "370",
      fullPriceCents: "00",
      installmentsText: "em até 2x sem juros no cartão",
      pixText: "ou R$ 349,90 à vista no PIX"
    },
    scarcity: {
      text: "vagas disponíveis — as confirmações acontecem por ordem de pagamento."
    },
    testimonial: {
      quote: "Tudo maravilhoso e preparado com muito carinho! Indico pra todas.",
      author: "Tainara Jensen"
    },
    form: {
      googleFormAction: "https://docs.google.com/forms/d/e/1FAIpQLSeXjSrhtcs1ZSEsIRyGsXXQ7t3UksM0sWoQd7LLiKjoq_BSSA/formResponse"
    }
  };

  // guarda os dados resolvidos (padrão ou vindos do content.json) para uso no handler do formulário
  window.__SITE_DATA__ = DEFAULT_DATA;

  /** Busca um valor aninhado em um objeto a partir de um caminho "a.b.c" */
  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  /** Aplica os valores de `data` em todos os elementos marcados com data-bind / data-bind-html */
  function applyData(data) {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind");
      const value = getPath(data, path);
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-bind-html]").forEach((el) => {
      const path = el.getAttribute("data-bind-html");
      const value = getPath(data, path);
      if (value !== undefined) el.innerHTML = value;
    });

    window.__SITE_DATA__ = data;
  }

  // 1) aplica os valores padrão imediatamente — garante que a página nunca fique em branco
  applyData(DEFAULT_DATA);

  // 2) tenta carregar a versão "viva" do content.json (funciona quando hospedado em um servidor)
  fetch("data/content.json", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error("content.json indisponível"))))
    .then((data) => applyData(data))
    .catch(() => {
      // Aberto via file:// ou content.json indisponível — mantém DEFAULT_DATA, sem quebrar a página.
    });

  /* ---------------------------------------------------------------------- */
  /* Scroll reveal                                                          */
  /* ---------------------------------------------------------------------- */
  function initRevealAnimations() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------- */
  /* Formulário de inscrição                                                */
  /* ---------------------------------------------------------------------- */
  function initForm() {
    const form = document.getElementById("inspire-form");
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = submitButton ? submitButton.querySelector("span") : null;
    const status = document.getElementById("form-status");
    const targetFrame = document.getElementById("google-form-target");
    let submitTimer;

    function setStatus(message, type) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove("is-success", "is-error");
      if (type) status.classList.add(type);
    }

    function setSubmitting(isSubmitting) {
      if (!submitButton) return;
      submitButton.disabled = isSubmitting;
      submitButton.setAttribute("aria-busy", isSubmitting ? "true" : "false");
      if (submitLabel) {
        submitLabel.textContent = isSubmitting
          ? submitButton.getAttribute("data-loading-label")
          : submitButton.getAttribute("data-default-label");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const action = window.__SITE_DATA__ && window.__SITE_DATA__.form && window.__SITE_DATA__.form.googleFormAction;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!action) {
        setStatus("Não foi possível encontrar a configuração de envio. Tente novamente em instantes.", "is-error");
        return;
      }

      setSubmitting(true);
      setStatus("Enviando sua inscrição...", null);
      form.setAttribute("action", action);

      if (targetFrame) {
        targetFrame.onload = function () {
          clearTimeout(submitTimer);
          form.reset();
          setStatus("Inscrição enviada com sucesso! Em breve entraremos em contato com as informações de pagamento.", "is-success");
          setSubmitting(false);
        };
      }

      submitTimer = window.setTimeout(function () {
        setStatus("Não conseguimos confirmar o envio agora. Verifique sua conexão e tente novamente.", "is-error");
        setSubmitting(false);
      }, 12000);

      form.submit();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initRevealAnimations();
    initForm();
  });
})();
