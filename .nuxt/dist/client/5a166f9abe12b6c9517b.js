(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{568:function(t,e,n){"use strict";n(49);var o,r,l,d,c=n(18),h={data:function(){return{dialog:{isLoading:!1,isOpen:!1,model:{form:{render:function(){return""}}},oldModel:{}}}},computed:{isChanged:function(){return JSON.stringify(this.dialog.model)!==JSON.stringify(this.dialog.oldModel)},dialogTitle:function(){return this.dialog.model._id?"Редактирование записи":"Создание записи "}},methods:{open:(d=Object(c.a)(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.dialog.isLoading=!0,this.dialog.isSaving=!1,this.dialog.isOpen=!0,this.dialog.oldModel={},!e._id){t.next=10;break}return t.next=7,this.$store.dispatch("".concat(e.type,"/read"),{id:e._id});case 7:this.dialog.model=t.sent,t.next=11;break;case 10:this.dialog.model=e;case 11:Object.assign(this.dialog.oldModel,this.dialog.model),this.dialog.isLoading=!1;case 13:case"end":return t.stop()}}),t,this)}))),function(t){return d.apply(this,arguments)}),onClose:function(){this.isChanged?this.dialog.isOpen=!confirm("Close?"):this.dialog.isOpen=!1},save:(l=Object(c.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.dialog.isSaving=!0,this.dialog.oldModel={},!this.dialog.model._id){t.next=8;break}return t.next=5,this.$store.dispatch("".concat(this.dialog.model.type,"/update"),{updated_item:this.dialog.model});case 5:this.dialog.model=t.sent,t.next=11;break;case 8:return t.next=10,this.$store.dispatch("".concat(this.dialog.model.type,"/create"),{new_item:this.dialog.model});case 10:this.dialog.model=t.sent;case 11:Object.assign(this.dialog.oldModel,this.dialog.model),this.dialog.isSaving=!1;case 13:case"end":return t.stop()}}),t,this)}))),function(){return l.apply(this,arguments)}),saveAndClose:(r=Object(c.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.save();case 2:this.onClose();case 3:case"end":return t.stop()}}),t,this)}))),function(){return r.apply(this,arguments)}),remove:(o=Object(c.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch("".concat(this.dialog.model.type,"/remove"),{id:this.dialog.model._id});case 2:this.dialog.isOpen=!1;case 3:case"end":return t.stop()}}),t,this)}))),function(){return o.apply(this,arguments)})}},m=n(23),v=n(26),f=n.n(v),_=n(107),C=n(563),x=n(562),k=n(612),w=n(136),y=n(108),O=n(172),V=n(549),S=n(582),component=Object(m.a)(h,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-dialog",{attrs:{width:"900",scrollable:"",persistent:t.isChanged},model:{value:t.dialog.isOpen,callback:function(e){t.$set(t.dialog,"isOpen",e)},expression:"dialog.isOpen"}},[t.dialog.isLoading?n("v-card",{attrs:{color:"primary",dark:""}},[n("v-card-text",[t._v("\n      Идет загрузка...\n      "),n("v-progress-linear",{staticClass:"mb-0",attrs:{indeterminate:"",color:"white"}})],1)],1):n("v-card",[n("v-card-title",{staticClass:"grey lighten-3 elevation-1",staticStyle:{"z-index":"900"},domProps:{textContent:t._s(t.dialogTitle)}}),t._v(" "),n("v-card-text",{staticClass:"pt-3"},[n(t.dialog.model.form,{tag:"component",attrs:{item:t.dialog.model}})],1),t._v(" "),n("v-card-actions",{staticClass:"grey lighten-3 elevation-1"},[this.dialog.model._id?n("v-btn",{staticClass:"ma-3",attrs:{dark:"",color:"red lighten-2"},on:{click:t.remove}},[n("v-icon",{staticClass:"hidden-md-and-up"},[t._v("fa-trash-alt")]),t._v(" "),n("span",{staticClass:"hidden-sm-and-down"},[t._v("Удалить")])],1):t._e(),t._v(" "),n("v-spacer"),t._v(" "),n("v-btn",{staticClass:"ma-3",on:{click:t.onClose}},[n("v-icon",{staticClass:"hidden-md-and-up"},[t._v("fa-door-open")]),t._v(" "),n("span",{staticClass:"hidden-sm-and-down"},[t._v("Закрыть")])],1),t._v(" "),[n("v-btn",{staticStyle:{"border-top-right-radius":"0","border-bottom-right-radius":"0"},attrs:{dark:"",color:"green lighten-2"},on:{click:t.save}},[t.dialog.isSaving?n("v-progress-circular",{attrs:{indeterminate:""}}):[n("v-icon",{staticClass:"hidden-md-and-up"},[t._v("fa-save")]),t._v(" "),n("span",{staticClass:"hidden-sm-and-down"},[t._v("Сохранить")])]],2),t._v(" "),n("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"ml-0 hidden-sm-and-down",staticStyle:{"border-top-left-radius":"0","border-bottom-left-radius":"0"},attrs:{dark:"",color:"green lighten-2"},on:{click:t.saveAndClose}},o),[n("v-icon",{attrs:{color:"white"}},[t._v("fa-sign-out-alt")])],1)]}}])},[t._v(" "),n("span",[t._v("Сохранить и выйти")])])]],2)],1)],1)}),[],!1,null,null,null);e.a=component.exports;f()(component,{VBtn:_.a,VCard:C.a,VCardActions:x.a,VCardText:x.b,VCardTitle:x.c,VDialog:k.a,VIcon:w.a,VProgressCircular:y.a,VProgressLinear:O.a,VSpacer:V.a,VTooltip:S.a})},617:function(t,e,n){"use strict";n.r(e);var o=n(359),r={transition:"fade",components:{AppModal:n(568).a},data:function(){return{table:{isLoading:!0,search:"",headers:[{text:"Бортовой номер",value:"busnumber"},{text:"Марка",value:"mark"},{text:"Цвет",value:"color"},{text:"Год",value:"year"},{text:"Статус",value:"status"}]}}},computed:{items:function(){return this.$store.getters["buses/list"]}},methods:{onNewItem:function(){this.$refs.modal.open(new o.a)},onRowClick:function(t){this.$refs.modal.open(t)}},mounted:function(){var t=this;this.$store.dispatch("buses/readAll").then((function(e){t.table.isLoading=!1}))}},l=n(23),d=n(26),c=n.n(d),h=n(107),m=n(563),v=n(562),f=n(616),_=n(136),C=n(549),x=n(77),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-card",{staticClass:"mt-5"},[n("v-card-title",[t._v("\n    Автобусы\n    "),n("v-spacer"),t._v(" "),n("v-text-field",{attrs:{label:"Поиск"},model:{value:t.table.search,callback:function(e){t.$set(t.table,"search",e)},expression:"table.search"}}),t._v(" "),n("v-btn",{attrs:{fab:"",dark:"",absolute:"",top:"",right:"",color:"green lighten-2"},on:{click:t.onNewItem}},[n("v-icon",[t._v("fa-plus")])],1)],1),t._v(" "),n("v-data-table",{attrs:{"sort-by":"busnumber",loading:t.table.isLoading,headers:t.table.headers,search:t.table.search,items:t.items,"mobile-breakpoint":0,"loading-text":"Loading..."},on:{"click:row":t.onRowClick},scopedSlots:t._u([{key:"item.busnumber",fn:function(e){var n=e.item;return[t._v("\n      "+t._s(n.busnumber)+" "+t._s(n.capacity)+"\n    ")]}}])}),t._v(" "),n("app-modal",{ref:"modal"})],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{VBtn:h.a,VCard:m.a,VCardTitle:v.c,VDataTable:f.a,VIcon:_.a,VSpacer:C.a,VTextField:x.a})}}]);