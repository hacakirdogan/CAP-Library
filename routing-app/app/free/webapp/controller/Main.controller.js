sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, ODataModel, exportLibrary, Spreadsheet) {
    "use strict";

    var EdmType = exportLibrary.EdmType;

    return Controller.extend("free.controller.Main", {
      onInit: function () {
        // var oModel = new ODataModel({
        //   serviceUrl: "/browse/",
        // });
        // var oList = oModel.bindList("/Vehicles");
        // const oBinding = oList.getBinding("items");
        // console.log(oBinding);
      },
      onBeforeRendering: function () {},
      onAfterRendering: function () {},
      onRoute: function () {
        start();
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
      createColumnConfig: function () {
        var aCols = [];

        aCols.push({
          property: "vehicle",
          type: EdmType.String,
        });

        aCols.push({
          property: "customer",
          type: EdmType.String,
        });

        aCols.push({
          property: "arrival",
          type: EdmType.Time,
        });

        aCols.push({
          property: "departure",
          type: EdmType.Time,
        });

        aCols.push({
          property: "distance",
          type: EdmType.Number,
        });

        return aCols;
      },
      onExport: function () {
        var aCols, oRowBinding, oSettings, oSheet, oTable;

        if (!this._oTable) {
          this._oTable = this.byId("routeTable");
        }

        oTable = this._oTable;
        oRowBinding = oTable.getBinding("items");
        aCols = this.createColumnConfig();

        oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: "Level",
          },
          dataSource: oRowBinding,
          fileName: "routeTable.xlsx",
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },
    });
  }
);
