let initialDate = '1970-01-01';
// Function to get the current date in "YYYY-MM-DD" format
function getCurrentDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const day = String(now.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
function changePage(newPage) {
	const currentUrl = new URL(window.location.href);
	currentUrl.searchParams.set('page', newPage);
	window.location.href = currentUrl.href;
}

function goToSelectedPage() {
	const selectedPage = document.getElementById("pageSelector").value;
	const currentUrl = new URL(window.location.href);
	currentUrl.searchParams.set('page', selectedPage);
	window.location.href = currentUrl.href;
}

function clearAllFilters() {
	const currentUrl = new URL(window.location.href.split('?')[0]);
	
	localStorage.removeItem('selectedEndDate');
	localStorage.removeItem('selectedStartDate');
	localStorage.removeItem('savedPN');
	localStorage.removeItem('savedTestType');
	const startDateInput = document.getElementById('startDate');
	startDateInput.value = initialDate;
	const endDateInput = document.getElementById('endDate');
	endDateInput.value = getCurrentDate();
	
	const pn = document.getElementById('pnSelector');
	pn.value = '';
	const testType = document.getElementById('testTypeSelector');
	testType.value = '';
	
	window.location.href = currentUrl.href;
}

function applyFilters() {
	const currentUrl = new URL(window.location.href);
	const pn = document.getElementById("pnSelector").value;
	const testType = document.getElementById("testTypeSelector").value;
	const startDate = document.getElementById("startDate").value;
	const endDate = document.getElementById("endDate").value;
	let hasDatesError = false;
	
	const currentDate = getCurrentDate();
	if (startDate > currentDate || endDate > currentDate) {
		alert("Start and end dates cannot be greater than today's date.");
		hasDatesError = true;
	} else if (startDate && endDate) {
		if (startDate > endDate) {
			alert("Start date must be less than or equal to end date.");
			hasDatesError = true;
		}
		currentUrl.searchParams.set('startDate', startDate);
		currentUrl.searchParams.set('endDate', endDate);
	} else {
		currentUrl.searchParams.delete('startDate');
		currentUrl.searchParams.delete('endDate');
	}
	if (hasDatesError) {
		startDateInput.style.border = "1px solid red";
		endDateInput.style.border = "1px solid red";
		return;
	}
	if(pn){
		currentUrl.searchParams.set('PN',pn);
	}else {
		currentUrl.searchParams.delete('PN');
	}
	if(testType){
		currentUrl.searchParams.set('TEST_TYPE',testType);
	}else {
		currentUrl.searchParams.delete('TEST_TYPE');
	}
	window.location.href = currentUrl.href;
}

function downloadRawData() {
	const currentUrl = new URL(window.location.href);
	const currentUrlFilter = currentUrl.searchParams.toString();
	const fetchUrl = `/findAll?${currentUrlFilter}`;
	console.log(`fetch data from url: ${fetchUrl}`);
	fetch(fetchUrl)
		.then(res => res.json())
		.then( data => {
			const csvData = jsonToCsv(data);
			
			const blob = new Blob([csvData],{type: 'text/csv'});
			
			const a = document.createElement('a');
			a.href = window.URL.createObjectURL(blob);
			a.download = 'data.csv';
			a.style.display = 'none';
			
			document.body.appendChild(a);
			a.click();
			
			document.body.removeChild(a);
		}).catch(error => {
			console.error('Error:', error);
		});
}

function jsonToCsv(jsonData) {
	const csvArray = [];
	const keys = Object.keys(jsonData[0]);
	csvArray.push(keys.join(','));
	
	jsonData.forEach(item => {
		const values = keys.map(key => item[key]);
		csvArray.push(values.join(','));
	});
	
	return csvArray.join('\n');
}

// Get filters elements
const endDateInput = document.getElementById('endDate');
const startDateInput = document.getElementById('startDate');
const selectedPN = document.getElementById("pnSelector");
const selectedTestType = document.getElementById("testTypeSelector");
const pageSelector = document.getElementById("pageSelector");

// Try to retrieve the previously selected filters from localStorage
const savedEndDate = localStorage.getItem('selectedEndDate');
const savedStartDate = localStorage.getItem('selectedStartDate');
const savedPN = localStorage.getItem('savedPN');
const savedTestType = localStorage.getItem('savedTestType');

// If a filter was applied, set it as the input value
if(savedEndDate) {
	endDateInput.value = savedEndDate;
}else {
	endDateInput.value = getCurrentDate();
}

if(savedStartDate) {
	startDateInput.value = savedStartDate;
}else {
	startDateInput.value = initialDate;
}
if(savedPN){
	selectedPN.value = savedPN;
} else {
	selectedPN.value = '';
}
if(savedTestType){
	selectedTestType.value = savedTestType;
}else {
	selectedTestType.value = '';
}

startDateInput.addEventListener('change', function() {
	localStorage.setItem('selectedStartDate', startDateInput.value);
	applyFilters();
});
endDateInput.addEventListener('change', function() {
	localStorage.setItem('selectedEndDate', endDateInput.value);
	applyFilters();
});
selectedPN.addEventListener('change',function() {
		localStorage.setItem('savedPN',selectedPN.value);
		applyFilters();
});
selectedTestType.addEventListener('change',function() {
	localStorage.setItem('savedTestType',selectedTestType.value);
	applyFilters();
});
pageSelector.addEventListener('change',function() {
	goToSelectedPage();
});
document.getElementById('btnDownload').addEventListener('click',function(){
	downloadRawData();
});
document.getElementById('btnCleanFilters').addEventListener('click',function(){
	clearAllFilters();
});