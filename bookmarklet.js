javascript:(function(){
  if (window.autoClickerUI) {
    alert("Auto Click já carregado!");
    return;
  }

  let mouseX = 0, mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const style = document.createElement("style");
  style.innerHTML = `
    #autoClickerUI {
      position: fixed !important;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.85);
      color: white;
      padding: 15px;
      border-radius: 12px;
      font-family: Arial, sans-serif;
      box-shadow: 0 0 12px rgba(0,0,0,0.5);
      z-index: 2147483647 !important;
    }
    #autoClickerUI input {
      width: 50px;
      margin-left: 5px;
    }
    #autoClickerUI button {
      margin-top: 10px;
      background: #444;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 6px;
      cursor: pointer;
    }
    .click-visual {
      position: fixed;
      width: 20px;
      height: 20px;
      background: rgba(0, 255, 0, 0.5);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      animation: clickPulse 0.3s ease-out;
      z-index: 2147483647;
    }
    @keyframes clickPulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const ui = document.createElement("div");
  ui.id = "autoClickerUI";
  ui.innerHTML = `
    <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">🎯 Auto Click Config</div>
    <label style="font-size: 13px;">Cliques por segundo:</label>
    <input type="number" id="cpsInput" value="5" min="1" max="100">
    <div style="font-size: 12px; margin-top: 8px;">
      <b>F6</b> = Iniciar • <b>F7</b> = Parar
    </div>
    <button id="toggleBtn">Iniciar</button>
    <button id="closeUI" style="background: red;">Fechar</button>
  `;
  document.body.appendChild(ui);

  let clicking = false;
  let intervalId;

  function showClickEffect(x, y) {
    const dot = document.createElement("div");
    dot.className = "click-visual";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 300);
  }

  function startClicking() {
    if (clicking) return;
    const cps = parseFloat(document.getElementById("cpsInput").value);
    if (isNaN(cps) || cps <= 0) {
      alert("CPS inválido");
      return;
    }
    clicking = true;
    document.getElementById("toggleBtn").textContent = "Parar";
    intervalId = setInterval(() => {
      const el = document.elementFromPoint(mouseX, mouseY);
      if (el) {
        const evt = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
        el.dispatchEvent(evt);
        showClickEffect(mouseX, mouseY);
      }
    }, 1000 / cps);
  }

  function stopClicking() {
    if (!clicking) return;
    clicking = false;
    clearInterval(intervalId);
    document.getElementById("toggleBtn").textContent = "Iniciar";
  }

  function toggleClicking() {
    clicking ? stopClicking() : startClicking();
  }

  document.getElementById("toggleBtn").onclick = toggleClicking;
  document.getElementById("closeUI").onclick = () => {
    stopClicking();
    ui.remove();
    style.remove();
    delete window.autoClickerUI;
  };

  document.addEventListener("keydown", (e) => {
    if (e.code === "F6") startClicking();
    if (e.code === "F7") stopClicking();
  });

  window.autoClickerUI = ui;
})();
