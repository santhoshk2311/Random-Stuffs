var jsonDataString = '{"quotesData": {"NASDAQ:GOOG": {"price": 622.46,"changeNet": -27.56,"changePercent": -4.24,"volume": 5825700,"prevClose": 650.02,"open": 646.5,"dailyHigh": 647,"dailyLow": 621.23,"wk52High": 670.25,"wk52Low": 473.02,"issuerName": "Google Inc.","marketCap": 166.405483361        },        "NASDAQ:MSFT": {"price": 27.74,"changeNet": -0.36,"changePercent": -1.28,"volume": 59708200,"prevClose": 28.1,"open": 28.05,"dailyHigh": 28.1,"dailyLow": 27.72,"wk52High": 29.46,"wk52Low": 23.65,"issuerName": "Microsoft Corporation","marketCap": 236.424382895        },        "NASDAQ:AAPL": {"price": 421.73,"changeNet": -0.67,"changePercent": -0.16,"volume": 14072200,"prevClose": 422.4,"open": 425.5,"dailyHigh": 427.75,"dailyLow": 421.35,"wk52High": 427.75,"wk52Low": 310.5,"issuerName": "Apple Inc.","marketCap": 392.5823616        },        "INDEX:DJI": {"price": 12392.69,"changeNet": 32.77,"changePercent": 0.265,"volume": 122200287,"prevClose": 0,"open": 12359.31,"dailyHigh": 12409.08,"dailyLow": 12333.85,"wk52High": 12928.5,"wk52Low": 10404.5,"issuerName": "Dow Jones Industrials"        },        "INDEX:SPX": {"price": 1280.7,"changeNet": 2.89,"changePercent": 0.226,"volume": 582309800,"prevClose": 0,"open": 1277.83,"dailyHigh": 1281.99,"dailyLow": 1274.55,"wk52High": 1370.58,"wk52Low": 1074.77,"issuerName": "S&P 500"}}}';
var updateFilter;
var myColumnDefs,myDataSource,myConfigs,myDataTable;


function updateFilter () {
	var filterText = YAHOO.util.Dom.get('stockExchangeComboSelect').value;
	if (filterText == "ALL")
		filterText = "";
	var state = myDataTable.getState();
	state.sortedBy = {key:'stockName', dir:YAHOO.widget.DataTable.CLASS_ASC};			
	// Get filtered data
	myDataSource.sendRequest(filterText,{			
		success : myDataTable.onDataReturnInitializeTable,
		failure : myDataTable.onDataReturnInitializeTable,
		scope   : myDataTable,
		argument: state
	});
}

YAHOO.util.Event.addListener(window, "load", function() {
	MyStockViewer = function() { 	
		
		var stockData = YAHOO.lang.JSON.parse(jsonDataString);
		var newJsonStockData = {};		
		newJsonStockData['quotesData'] = [];
		var index=0;
		var optEl,stockExchanges = [];		
		for (var stockNameKey in stockData.quotesData) {
			var stkExchStr = stockNameKey.split(":")[0];
			var found = false;
			for (var idx=0;idx<stockExchanges.length;idx++) {
				if (stockExchanges[idx].indexOf(stkExchStr) != -1) {
					found = true;
					break;
				}
			}
			if (!found)
				stockExchanges.push(stkExchStr);						
			newJsonStockData['quotesData'][index]= {};
			newJsonStockData['quotesData'][index]['stockName'] = stockNameKey;
			newJsonStockData['quotesData'][index]['price'] = stockData.quotesData[stockNameKey].price;
			newJsonStockData['quotesData'][index]['changeNet'] = stockData.quotesData[stockNameKey].changeNet;
			newJsonStockData['quotesData'][index]['changePercent'] = stockData.quotesData[stockNameKey].changePercent;
			newJsonStockData['quotesData'][index]['volume'] = stockData.quotesData[stockNameKey].volume;
			newJsonStockData['quotesData'][index]['prevClose'] = stockData.quotesData[stockNameKey].prevClose;
			newJsonStockData['quotesData'][index]['open'] = stockData.quotesData[stockNameKey].open;
			newJsonStockData['quotesData'][index]['dailyHigh'] = stockData.quotesData[stockNameKey].dailyHigh;
			newJsonStockData['quotesData'][index]['dailyLow'] = stockData.quotesData[stockNameKey].dailyLow;
			newJsonStockData['quotesData'][index]['wk52High'] = stockData.quotesData[stockNameKey].wk52High;
			newJsonStockData['quotesData'][index]['wk52Low'] = stockData.quotesData[stockNameKey].wk52Low;
			newJsonStockData['quotesData'][index]['issuerName'] = stockData.quotesData[stockNameKey].issuerName;
			newJsonStockData['quotesData'][index]['marketCap'] = stockData.quotesData[stockNameKey].marketCap;
			index++;
			//newJsonStockData.push({stockName:stockNameKey});
		}		
		
		for (var idx=0;idx<stockExchanges.length;idx++) {
			optEl = document.createElement("OPTION");
			optEl.innerHTML = stockExchanges[idx];
			optEl.value = stockExchanges[idx];
			document.getElementById("stockExchangeComboSelect").options.add(optEl);
		}
		this.stockNameFormatter = function (elLiner, oRecord, oColumn, oData) {
			elLiner.innerHTML =  oData.split(":")[1];
		};
		
		this.stockMarketFormatter = function (elLiner, oRecord, oColumn, oData) {
			elLiner.innerHTML = oRecord._oData.stockName.split(":")[0];
		};
		
		this.stockIndicatorFormatter = function (elLiner, oRecord, oColumn, oData) {
			if (oRecord.getData('changeNet') > 0)
				elLiner.innerHTML = '&nbsp;<img src="images/up-arrow.PNG">';
			else 
				elLiner.innerHTML = '&nbsp;<img src="images/down-arrow.PNG">';
		};
		
		this.convertToNumberFormatter = function (elLiner, oRecord, oColumn, oData) {			
			elLiner.innerHTML = parseInt(oData); 
		}
		
		this.colorNumberFormatter = function (elLiner, oRecord, oColumn, oData) {
			if (oData >=0) {
				elLiner.innerHTML = '<p><font size="3" color="green"><b>' + oData +'</b></font></p>';
			} else {
				elLiner.innerHTML = '<p><font size="3" color="red"><b>' + oData +'</b></font></p>';
			}
		}
		
		YAHOO.widget.DataTable.Formatter.stockName = this.stockNameFormatter;
		YAHOO.widget.DataTable.Formatter.stockMarket = this.stockMarketFormatter;
		YAHOO.widget.DataTable.Formatter.stockIndicator = this.stockIndicatorFormatter;
		YAHOO.widget.DataTable.Formatter.convertToNumber = this.convertToNumberFormatter;
		YAHOO.widget.DataTable.Formatter.colorNumber = this.colorNumberFormatter;
		
		myColumnDefs = [
			{key:"stockIndicator", label: "Stock Indicator",formatter:"stockIndicator"},						
			{key:"stockName", label: "Stock Name",sortable:true,formatter:"stockName"},
			{key:"stockMarket", label: "Stock Market",sortable:true,formatter:"stockMarket"},
			{key:"price",label:"Price",sortable:true},
			{key:"changeNet",label:"Change Net",sortable:true,formatter:"colorNumber"},
			{key:"changePercent",label:"Change Percent",sortable:true,formatter:"colorNumber"},
			{key:"volume",label:"Volume",sortable:true},
			{key:"prevClose",label:"Previous Close",sortable:true},
			{key:"open",label:"Open",sortable:true},
			{key:"dailyHigh",label:"Daily High",sortable:true},
			{key:"dailyLow",label:"Daily Low",sortable:true},
			{key:"wk52High",label:"Weekly High",sortable:true},
			{key:"wk52Low",label:"Weekly Low",sortable:true},
			{key:"issuerName",label:"Issuer Name"},
			{key:"marketCap",label:"Market Cap",sortable:true}
			
		];
		
		myDataSource = new YAHOO.util.DataSource(newJsonStockData.quotesData);
		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		
		myDataSource.responseSchema = {		
			fields: [
				{key:"stockName"},
				{key:"price",parser:"number"},
				{key:"changeNet",parser:"number"},
				{key:"changePercent",parser:"number"},
				{key:"volume",parser:"number"},
				{key:"prevClose",parser:"number"},
				{key:"open",parser:"number"},
				{key:"dailyHigh",parser:"number"},
				{key:"dailyLow",parser:"number"},
				{key:"wk52High",parser:"number"},
				{key:"wk52Low",parser:"number"},
				{key:"issuerName"},
				{key:"marketCap",parser:"number"}
			]
		};

	
		
		myDataSource.doBeforeCallback =function (req,raw,res,cb) {
            // This is the filter function
            var data     = res.results || [],
                filtered = [],
                i,l;

            if (req) {
                req = req.toLowerCase();
                for (i = 0, l = data.length; i < l; ++i) {
                    if (!data[i].stockName.toLowerCase().indexOf(req)) {
                        filtered.push(data[i]);
                    }
                }
                res.results = filtered;
            } 

            return res;
        } 
		myDataTable =  new YAHOO.widget.DataTable("stockTable",myColumnDefs,myDataSource,
			{sortedBy:{key:"stockName", dir:"desc"},
				draggableColumns:true,
				paginator: new YAHOO.widget.Paginator({rowsPerPage:10,containers:'stockPaginator'})
			});		
			
		
		// Nulls out myDlg to force a new one to be created
        myDataTable.subscribe("columnReorderEvent", function(){
            newCols = true;
            YAHOO.util.Event.purgeElement("dt-dlg-picker", true);
            YAHOO.util.Dom.get("dt-dlg-picker").innerHTML = "";
        }, this, true);		

		return {
			oDS: myDataSource,
			oDT: myDataTable
		}
	}();
});