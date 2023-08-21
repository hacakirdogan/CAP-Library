sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("free.controller.Main", {
      onInit: function () {
        // var oModel = new ODataModel({
        //   serviceUrl: "/browse/",
        // });
        // var oList = oModel.bindList("/Vehicles");
        // const oBinding = oList.getBinding("items");
        // console.log(oBinding);
      },
      onBeforeRendering: function () {
        // var table = sap.ui.getCore().byId("vehicles_tab");
        // var rows = table.getRows();
      },
      onAfterRendering: function () {
        // var totalRows = this.getView()
        //   .byId("vehicles_tab")
        //   .getAggregation("rows").length;
      },
      handleNav: function (evt) {
        var navCon = this.byId("navCon");
        var target = evt.getSource().data("target");
        if (target) {
          navCon.to(this.byId(target));
        } else {
          navCon.back();
        }
      },
      handleNavII: function (evt) {
        var navCon = this.byId("navConII");
        var target = evt.getSource().data("target");
        if (target) {
          navCon.to(this.byId(target));
        } else {
          navCon.back();
        }
      },
    });
  }
);
