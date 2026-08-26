(function () {
  "use strict";

  const data = window.PROTOTYPE_DATA;
  const byId = (id) => document.getElementById(id);
  const state = {
    currentPageId: data && data.pages && data.pages[0] ? data.pages[0].id : "",
    mode: "annotation",
    scenarioId: "",
    pendingChangeId: "",
    annotationsVisible: true,
    annotationWidth: 380
  };
  const MIN_ANNOTATION_WIDTH = 260;
  const RESIZER_WIDTH = 18;

  function create(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function pageById(pageId) {
    return data.pages.find((page) => page.id === pageId);
  }

  function currentPage() {
    return pageById(state.currentPageId);
  }

  function pageStates(page) {
    return page && Array.isArray(page.states) ? page.states : [];
  }

  function pageUrl(page) {
    const url = new URL(page.file, window.location.href);
    url.searchParams.set("v", String(Date.now()));
    if (state.mode === "annotation") url.searchParams.set("prototypeMode", "annotation");
    if (state.scenarioId) {
      url.searchParams.set("prototypeScenario", state.scenarioId);
      url.hash = state.scenarioId;
    }
    return url.href;
  }

  function postToPage(type, payload) {
    const frame = byId("prototype-frame");
    if (frame.contentWindow) frame.contentWindow.postMessage(Object.assign({ type }, payload || {}), "*");
  }

  function updateModeButtons() {
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
    });
  }

  function loadCurrentPage() {
    byId("prototype-frame").src = pageUrl(currentPage());
  }

  function deliverPendingHighlight() {
    if (!state.pendingChangeId) return;
    const changeId = state.pendingChangeId;
    state.pendingChangeId = "";
    window.setTimeout(() => postToPage("prototype:highlight", { changeId }), 0);
  }

  function appendChangeDetail(card, label, value) {
    if (!value) return;
    const row = create("div", undefined, "change-detail");
    row.append(create("span", label, "change-detail-label"), create("span", value, "change-detail-value"));
    card.appendChild(row);
  }

  function renderPageDetails(page) {
    const requirements = byId("page-requirements");
    requirements.replaceChildren();
    (page.requirements || []).forEach((requirement) => requirements.appendChild(create("span", requirement, "requirement-tag")));
    if (!requirements.childElementCount) requirements.appendChild(create("span", "未标注需求", "requirement-tag"));

    byId("page-overview").textContent = page.overview || page.summary || "";
    byId("page-role").textContent = page.pageRole || "";
    const scenario = byId("page-scenario");
    scenario.textContent = page.scenario ? "使用场景：" + page.scenario : "";
    scenario.hidden = !page.scenario;

    const flowSection = byId("page-flow-section");
    const flow = byId("page-flow");
    flow.replaceChildren();
    if (!page.flow || !Array.isArray(page.flow.steps) || !page.flow.steps.length) {
      flowSection.hidden = true;
      return;
    }
    flowSection.hidden = false;
    page.flow.steps.forEach((step, index) => {
      if (index) flow.appendChild(create("span", "→", "flow-arrow"));
      const item = create("span", step.title, "flow-step");
      if (step.id === page.flow.current) item.classList.add("current");
      flow.appendChild(item);
    });
  }

  function renderChanges(page) {
    const target = byId("change-list");
    target.replaceChildren();
    if (!page.changes.length) {
      target.appendChild(create("p", "本页没有新增或修改项。"));
      return;
    }
    page.changes.forEach((change) => {
      const card = create("article", undefined, "change-card");
      const locateChange = () => locateChangeInPage(page, change, card);
      const locate = create("button", change.id);
      locate.type = "button";
      locate.addEventListener("click", (event) => { event.stopPropagation(); locateChange(); });
      card.addEventListener("click", locateChange);
      card.title = "点击定位到原型中的对应区域";
      card.appendChild(locate);
      appendChangeDetail(card, "位置", change.location);
      appendChangeDetail(card, "操作", change.action);
      appendChangeDetail(card, "结果", change.result || change.description);
      target.appendChild(card);
    });
  }

  function renderIllustration(page) {
    const image = byId("page-illustration");
    image.hidden = true;
    image.removeAttribute("src");
    image.alt = (page.overview || page.summary || page.title) + "示意图";
    image.onload = () => {
      if (state.currentPageId === page.id) image.hidden = false;
    };
    image.onerror = () => { image.hidden = true; };
    // 本地 file:// 原型页不会总是随着数据文件更新而刷新图片缓存。
    // 使用本次原型生成时间作为版本参数，确保承载页展示当前插图。
    image.src = page.illustration + "?v=" + encodeURIComponent(data.generatedAt || Date.now());
  }

  function renderSceneControls(page) {
    const target = byId("scene-controls");
    target.replaceChildren();
    const states = pageStates(page);
    if (!states.length) {
      target.hidden = true;
      return;
    }
    target.hidden = false;
    target.appendChild(create("span", "关键状态", "scene-label"));
    const group = create("div", undefined, "scene-switcher");
    const entries = [{ id: "", title: "默认页面" }, ...states];
    entries.forEach((entry) => {
      const button = create("button", entry.title);
      button.type = "button";
      button.setAttribute("aria-pressed", String(entry.id === state.scenarioId));
      button.addEventListener("click", () => setScenario(entry.id));
      group.appendChild(button);
    });
    target.appendChild(group);
  }

  function setScenario(scenarioId) {
    const page = currentPage();
    if (scenarioId && !pageStates(page).some((item) => item.id === scenarioId)) return;
    state.scenarioId = scenarioId;
    renderSceneControls(page);
    loadCurrentPage();
  }

  function setViewport(viewport) {
    byId("viewport-shell").dataset.viewport = viewport;
    document.querySelectorAll("[data-viewport]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.viewport === viewport));
    });
  }

  function setMode(mode) {
    state.mode = mode;
    updateModeButtons();
    loadCurrentPage();
  }

  function locateChangeInPage(sourcePage, change, card) {
    const targetPage = pageById(change.pageId || sourcePage.id);
    if (!targetPage) return;
    const targetScenario = change.stateId || "";
    document.querySelectorAll(".change-card.is-locating").forEach((item) => item.classList.remove("is-locating"));
    card.classList.add("is-locating");
    state.pendingChangeId = change.id;
    const modeChanged = state.mode !== "annotation";
    if (modeChanged) {
      state.mode = "annotation";
      updateModeButtons();
    }
    if (targetPage.id !== state.currentPageId) {
      selectPage(targetPage.id, { scenarioId: targetScenario });
      return;
    }
    if (targetScenario !== state.scenarioId) {
      setScenario(targetScenario);
      return;
    }
    if (modeChanged) {
      loadCurrentPage();
      return;
    }
    deliverPendingHighlight();
  }

  function selectPage(pageId, options) {
    const page = pageById(pageId);
    if (!page) return;
    state.currentPageId = page.id;
    state.scenarioId = options && options.scenarioId ? options.scenarioId : "";
    byId("page-select").value = page.id;
    byId("current-page-title").textContent = page.id + " · " + page.title;
    renderPageDetails(page);
    setViewport(page.viewport === "H5" ? "mobile" : "desktop");
    renderIllustration(page);
    renderChanges(page);
    renderSceneControls(page);
    loadCurrentPage();
    document.querySelectorAll(".page-link").forEach((button) => {
      if (button.dataset.pageId === page.id) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function annotationWidthBounds(layout) {
    const style = getComputedStyle(layout);
    const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    const gap = parseFloat(style.columnGap) || 0;
    const navigationWidth = layout.classList.contains("single-page") ? 0 : 210;
    const columnCount = layout.classList.contains("single-page") ? 3 : 4;
    const minStageWidth = parseFloat(style.getPropertyValue("--prototype-min-width")) || 260;
    return {
      min: MIN_ANNOTATION_WIDTH,
      max: Math.max(MIN_ANNOTATION_WIDTH, Math.floor(layout.clientWidth - padding - gap * (columnCount - 1) - navigationWidth - RESIZER_WIDTH - minStageWidth))
    };
  }

  function applyAnnotationLayout() {
    const layout = document.querySelector(".prototype-layout");
    layout.classList.toggle("annotations-hidden", !state.annotationsVisible);
    if (state.annotationsVisible) {
      const bounds = annotationWidthBounds(layout);
      state.annotationWidth = Math.max(bounds.min, Math.min(bounds.max, state.annotationWidth));
    }
    layout.style.setProperty("--annotation-width", state.annotationWidth + "px");
    const toggle = byId("toggle-annotations");
    toggle.textContent = state.annotationsVisible ? "隐藏注释" : "显示注释";
    toggle.setAttribute("aria-pressed", String(state.annotationsVisible));
  }

  function startResize(event) {
    if (window.innerWidth <= 1050) return;
    const layout = document.querySelector(".prototype-layout");
    const startX = event.clientX;
    const startWidth = state.annotationWidth;
    const bounds = annotationWidthBounds(layout);
    const move = (moveEvent) => {
      state.annotationWidth = Math.max(bounds.min, Math.min(bounds.max, startWidth + startX - moveEvent.clientX));
      applyAnnotationLayout();
    };
    const end = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", end);
      document.body.classList.remove("annotation-resizing");
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", end, { once: true });
    document.body.classList.add("annotation-resizing");
    event.preventDefault();
  }

  function buildNavigation() {
    const select = byId("page-select");
    const nav = byId("page-nav");
    data.pages.forEach((page) => {
      const option = create("option", page.id + " · " + page.title);
      option.value = page.id;
      select.appendChild(option);
    });
    const appendPageLink = (page, container) => {
      const button = create("button", page.id + " · " + page.title, "page-link");
      button.type = "button";
      button.dataset.pageId = page.id;
      button.addEventListener("click", () => selectPage(page.id));
      container.appendChild(button);
    };
    const groupedIds = new Set();
    (data.navigation || []).forEach((primary) => {
      const primaryNode = create("section", undefined, "nav-primary");
      primaryNode.appendChild(create("h2", primary.title, "nav-primary-title"));
      (primary.groups || []).forEach((group) => {
        const groupNode = create("section", undefined, "nav-secondary");
        groupNode.appendChild(create("h3", group.title, "nav-secondary-title"));
        (group.pageIds || []).forEach((pageId) => {
          const page = pageById(pageId);
          if (!page || groupedIds.has(page.id)) return;
          groupedIds.add(page.id);
          appendPageLink(page, groupNode);
        });
        if (groupNode.querySelector(".page-link")) primaryNode.appendChild(groupNode);
      });
      if (primaryNode.querySelector(".page-link")) nav.appendChild(primaryNode);
    });
    const remainingPages = data.pages.filter((page) => !groupedIds.has(page.id));
    if (remainingPages.length) {
      const fallbackNode = create("section", undefined, "nav-primary");
      fallbackNode.appendChild(create("h2", "其他页面", "nav-primary-title"));
      const fallbackGroup = create("section", undefined, "nav-secondary");
      fallbackGroup.appendChild(create("h3", "未分组页面", "nav-secondary-title"));
      remainingPages.forEach((page) => appendPageLink(page, fallbackGroup));
      fallbackNode.appendChild(fallbackGroup);
      nav.appendChild(fallbackNode);
    }
    document.querySelector(".prototype-layout").classList.toggle("single-page", data.pages.length === 1);
  }

  function adaptP12UploadLabel() {
    if (currentPage().id !== "P12") return;
    const frame = byId("prototype-frame");
    const doc = frame.contentDocument;
    const area = doc && doc.querySelector(".right .area");
    if (!area) return;
    const win = frame.contentWindow;
    const style = doc.createElement("style");
    style.textContent = ".file-actions{display:flex;gap:6px;margin:8px 0}.file-actions .btn{height:28px;font-size:12px}.file-list{display:grid;gap:7px;margin-top:9px}.file-item{display:flex;align-items:center;gap:8px;min-height:48px;padding:6px 8px;border:1px solid #dce8e8;border-radius:5px;background:#fff}.file-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:4px;color:#fff;font-size:11px;font-weight:700}.file-icon.image{background:#51aca7}.file-icon.pdf{background:#e36b64}.file-icon.word{background:#4d87c9}.file-info{min-width:0;flex:1}.file-info b,.file-info span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-info b{font-size:12px}.file-info span{margin-top:3px;color:#84939a;font-size:11px}.file-remove{border:0;background:transparent;color:#e05b62;font-size:18px;cursor:pointer}";
    doc.head.appendChild(style);
    let taskNo = 0;
    const tasks = [];
    const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
    const fileMeta = (type, index) => type === "image" ? { icon: "图", name: "材料图片-" + index + ".jpg", size: "1.2 MB" } : type === "pdf" ? { icon: "PDF", name: "检查报告-" + index + ".pdf", size: "2.4 MB" } : { icon: "W", name: "就诊说明-" + index + ".docx", size: "86 KB" };
    const render = () => {
      let html = "<b>材料收集</b>";
      if (!tasks.length) html += "<p class='field'>暂未添加材料收集内容。</p>";
      tasks.forEach((task) => {
        const files = task.files.map((file, index) => { const meta = fileMeta(file.type, index + 1); return "<div class='file-item'><span class='file-icon " + file.type + "'>" + meta.icon + "</span><span class='file-info'><b>" + meta.name + "</b><span>" + meta.size + "</span></span><button class='file-remove' type='button' aria-label='删除文件' onclick='removeTaskFile(" + task.id + "," + index + ")'>×</button></div>"; }).join("");
        const action = task.status === "未发起" ? "<button class='btn primary' onclick='launchTask(" + task.id + ")'>向用户发起材料收集</button>" : task.status === "待用户上传" ? "<button class='btn' onclick='cancelTask(" + task.id + ")'>取消用户端上传材料</button><button class='btn primary' onclick='markUploaded(" + task.id + ")'>模拟用户上传</button>" : task.status === "待审核" ? "<button class='btn primary' onclick='completeTask(" + task.id + ")'>完成审核</button>" : "审核已完成";
        html += `<div class="card"><div class="head"><b>收集内容 ${task.id}</b><span class="status">${task.status}</span></div><button class="btn" style="float:right;color:#f35b62;border-color:#f2a7aa" onclick="deleteTask(${task.id})">删除</button><div class="field" data-change-id="P12-C01"><label>材料标题 <span class="tag">P12-C01</span></label><input class="input" value="${escape(task.title)}" oninput="updateTask(${task.id}, 'title', this.value)"><label>上传说明</label><textarea class="textarea" oninput="updateTask(${task.id}, 'desc', this.value)">${escape(task.desc)}</textarea></div><div class="field" data-change-id="P12-C02"><label>上传附件 <span class="tag">P12-C02</span></label><div class="file-actions"><button class="btn" onclick="addTaskFile(${task.id}, 'image')">＋ 图片</button><button class="btn" onclick="addTaskFile(${task.id}, 'pdf')">＋ PDF</button><button class="btn" onclick="addTaskFile(${task.id}, 'word')">＋ Word</button></div><small>支持 JPG/PNG、PDF、DOC/DOCX，单文件不超过 20MB</small><div class="file-list">${files}</div></div><div class="collection-actions" data-change-id="P12-C03">${action}<span class="tag">P12-C03</span></div></div>`;
      });
      html += "<button class='btn primary' onclick='addMaterialTask()'>＋ 添加材料</button>";
      area.innerHTML = html;
      area.querySelectorAll(".field label").forEach((label) => {
        const text = label.firstChild;
        if (text && text.nodeValue && text.nodeValue.includes("上传附件")) text.nodeValue = "上传";
      });
    };
    win.renderTasks = render;
    win.addMaterialTask = () => { tasks.push({ id: ++taskNo, title: "", desc: "", files: [], status: "未发起" }); render(); };
    win.updateTask = (id, key, value) => { const task = tasks.find((item) => item.id === id); if (task) task[key] = value; };
    win.addTaskFile = (id, type) => { const task = tasks.find((item) => item.id === id); if (!task) return; task.files.push({ type }); render(); win.showToast("已添加" + (type === "image" ? "图片" : type === "pdf" ? "PDF 文件" : "Word 文档")); };
    win.removeTaskFile = (id, index) => { const task = tasks.find((item) => item.id === id); if (!task) return; task.files.splice(index, 1); render(); win.showToast("已删除附件"); };
    win.deleteTask = (id) => { const index = tasks.findIndex((item) => item.id === id); if (index >= 0) tasks.splice(index, 1); render(); win.showToast("已删除当前收集内容"); };
    win.launchTask = (id) => { const task = tasks.find((item) => item.id === id); if (task) task.status = "待用户上传"; render(); win.showToast("已向用户发起材料上传申请"); };
    win.cancelTask = (id) => { const task = tasks.find((item) => item.id === id); if (task) task.status = "未发起"; render(); win.showToast("已取消用户端上传材料"); };
    win.markUploaded = (id) => { const task = tasks.find((item) => item.id === id); if (task) task.status = "待审核"; render(); win.showToast("用户已上传材料，等待审核"); };
    win.completeTask = (id) => { const task = tasks.find((item) => item.id === id); if (task) task.status = "已完成"; render(); win.showToast("材料审核已完成"); };
    render();
    win.setTimeout(render, 0);
  }

  function adaptP07AttachmentTypes() {
    if (currentPage().id !== "P07") return;
    const frame = byId("prototype-frame");
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    if (!doc || !win) return;
    const style = doc.createElement("style");
    style.textContent = ".doc-file{position:relative;width:63px;height:63px;border-radius:5px;padding-top:22px;color:#fff;text-align:center;font-size:11px}.doc-file.pdf{background:#db6a63}.doc-file.word{background:#4c87c8}.doc-file button{position:absolute;top:2px;right:2px;width:18px;height:18px;padding:0;border:0;border-radius:50%;background:rgba(35,54,61,.78);color:#fff;cursor:pointer}.upload-mask{position:fixed;inset:0;z-index:20;display:none;align-items:flex-end;background:rgba(16,31,40,.42)}.upload-mask.show{display:flex}.upload-sheet{width:100%;padding:10px 12px 18px;border-radius:16px 16px 0 0;background:#f6f8f9}.upload-sheet h3{margin:5px 0 10px;text-align:center;font-size:15px}.sheet-option{width:100%;padding:14px;border:0;border-bottom:1px solid #e8edef;background:#fff;color:#263a43;font-size:15px;text-align:left}.sheet-option small{display:block;margin-top:4px;color:#87959a;font-size:11px}.sheet-cancel{width:100%;margin-top:9px;padding:13px;border:0;border-radius:8px;background:#fff;color:#52636b;font-size:15px}.file-kinds[hidden],.main-actions[hidden]{display:none}";
    doc.head.appendChild(style);
    const mask = doc.createElement("div");
    mask.className = "upload-mask";
    mask.innerHTML = "<section class='upload-sheet'><div class='main-actions'><h3>选择上传方式</h3><button class='sheet-option' data-action='file'>文件上传<small>支持图片、PDF、Word 文档</small></button><button class='sheet-option' data-action='camera'>拍照<small>调用相机拍摄并上传图片</small></button><button class='sheet-option' data-action='album'>相册<small>从相册选择图片上传</small></button></div><div class='file-kinds' hidden><h3>选择文件类型</h3><button class='sheet-option' data-action='image'>图片</button><button class='sheet-option' data-action='pdf'>PDF 文档</button><button class='sheet-option' data-action='word'>Word 文档</button></div><button class='sheet-cancel' data-action='cancel'>取消</button></section>";
    doc.body.appendChild(mask);
    let targetButton = null;
    const mainActions = mask.querySelector(".main-actions");
    const fileKinds = mask.querySelector(".file-kinds");
    const close = () => { mask.classList.remove("show"); mainActions.hidden = false; fileKinds.hidden = true; targetButton = null; };
    const addFile = (type, source) => {
      const card = targetButton.closest(".material-card");
      const upload = targetButton.closest(".upload");
      const count = Number(card.dataset.count || 0) + 1;
      card.dataset.count = count;
      card.dataset.uploaded = "true";
      card.querySelector(".state").textContent = "已上传 " + count + " 个";
      const file = doc.createElement("div");
      file.className = type === "image" ? "image" : "doc-file " + type;
      if (type !== "image") file.textContent = type === "pdf" ? "PDF" : "WORD";
      const remove = doc.createElement("button");
      remove.className = type === "image" ? "delete-image" : "";
      remove.type = "button";
      remove.textContent = "×";
      remove.onclick = () => { file.remove(); const left = card.querySelectorAll(".image,.doc-file").length; card.dataset.count = left; card.dataset.uploaded = left ? "true" : "false"; card.querySelector(".state").textContent = left ? "已上传 " + left + " 个" : "待上传"; win.showToast("已删除附件"); };
      file.appendChild(remove);
      upload.insertBefore(file, targetButton);
      win.showToast(source + "上传成功");
      close();
    };
    mask.addEventListener("click", (event) => {
      if (event.target === mask) return close();
      const action = event.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "cancel") return close();
      if (action.dataset.action === "file") { mainActions.hidden = true; fileKinds.hidden = false; return; }
      if (action.dataset.action === "camera") return addFile("image", "拍照");
      if (action.dataset.action === "album") return addFile("image", "相册");
      addFile(action.dataset.action, "文件");
    });
    win.uploadImage = (button) => { targetButton = button; mask.classList.add("show"); };
  }

  function start() {
    if (!data || !Array.isArray(data.pages) || !data.pages.length) {
      document.body.replaceChildren(create("p", "prototype-data.js 中没有可展示的页面。"));
      return;
    }
    byId("project-name").textContent = data.project;
    byId("project-version").textContent = data.version;
    buildNavigation();
    applyAnnotationLayout();
    byId("prototype-frame").addEventListener("load", () => {
      postToPage("prototype:set-mode", { mode: state.mode });
      if (state.scenarioId) postToPage("prototype:scenario", { scenarioId: state.scenarioId });
      else postToPage("prototype:reset");
      deliverPendingHighlight();
    });
    window.addEventListener("message", (event) => {
      const message = event.data || {};
      if (message.type === "prototype:navigate" && pageById(message.pageId)) selectPage(message.pageId);
    });
    selectPage(state.currentPageId);
    byId("page-select").addEventListener("change", (event) => selectPage(event.target.value));
    document.querySelectorAll("[data-viewport]").forEach((button) => button.addEventListener("click", () => setViewport(button.dataset.viewport)));
    document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
    byId("reset-page").addEventListener("click", () => selectPage(state.currentPageId));
    byId("open-page").addEventListener("click", () => window.open(pageUrl(currentPage()), "_blank", "noopener"));
    byId("toggle-annotations").addEventListener("click", () => {
      state.annotationsVisible = !state.annotationsVisible;
      applyAnnotationLayout();
    });
    byId("annotation-resizer").addEventListener("pointerdown", startResize);
    window.addEventListener("resize", applyAnnotationLayout);
  }

  start();
})();
