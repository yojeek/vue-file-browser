import { defineComponent as h, ref as y, openBlock as n, createElementBlock as c, createElementVNode as u, toDisplayString as d, createCommentVNode as m, Fragment as f, renderList as k, normalizeClass as D } from "vue";
const g = h({
  name: "FileBrowser",
  props: {
    rootDirectory: {
      type: Object,
      required: !0
    }
  },
  setup(e, { emit: t }) {
    const s = y(null), o = y(e.rootDirectory), i = [];
    function p(l) {
      s.value = l, t("select-file", l);
    }
    function r(l) {
      i.push(o.value), o.value = l, t("change-directory", l);
    }
    function a() {
      i.length > 0 && (o.value = i.pop());
    }
    return {
      selectedFile: s,
      currentDirectory: o,
      goUp: a,
      selectFile: p,
      changeDirectory: r
    };
  },
  emits: ["select-file", "change-directory"]
}), v = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [o, i] of t)
    s[o] = i;
  return s;
}, _ = { class: "file-browser-wrapper" }, C = { key: 0 }, b = { class: "file-browser-list" }, F = {
  key: 0,
  class: "directory up"
}, $ = ["onClick"], w = ["onClick"];
function B(e, t, s, o, i, p) {
  return n(), c("div", _, [
    e.currentDirectory ? (n(), c("div", C, [
      u("h2", null, d(e.currentDirectory.name), 1),
      u("ul", b, [
        e.currentDirectory !== e.rootDirectory ? (n(), c("li", F, [
          u("button", {
            onClick: t[0] || (t[0] = (...r) => e.goUp && e.goUp(...r))
          }, "..")
        ])) : m("", !0),
        (n(!0), c(f, null, k(e.currentDirectory.directories, (r) => (n(), c("li", {
          key: r.name,
          class: "directory"
        }, [
          u("button", {
            onClick: (a) => e.changeDirectory(r)
          }, d(r.name), 9, $)
        ]))), 128)),
        (n(!0), c(f, null, k(e.currentDirectory.files, (r) => (n(), c("li", {
          key: r.name,
          class: D({ "file-selected": e.selectedFile === r, file: !0 })
        }, [
          u("button", {
            onClick: (a) => e.selectFile(r)
          }, d(r.name), 9, w)
        ], 2))), 128))
      ])
    ])) : m("", !0)
  ]);
}
const E = /* @__PURE__ */ v(g, [["render", B], ["__scopeId", "data-v-b96d0c77"]]);
export {
  E as FileBrowser
};
