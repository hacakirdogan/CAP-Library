sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("free.controller.Inputs", {
      onInit: function () {},
      handleNav: function (evt) {
        var navCon = this.byId("navCon");
        var target = evt.getSource().data("target");
        if (target) {
          navCon.to(this.byId(target));
        } else {
          navCon.back();
        }
      },
      onRegionClick: function (e) {
        MessageToast.show("onRegionClick " + e.getParameter("code"));
      },

      onRegionContextMenu: function (e) {
        MessageToast.show("onRegionContextMenu " + e.getParameter("code"));
      },
    });
  }
);
