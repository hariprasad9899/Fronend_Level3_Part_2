
let job = document.getElementsByClassName('job')[0];
let allNode = document.getElementsByClassName('all')[0];
let clonedJobNode = job.cloneNode(1);
const selectedSection = document.getElementsByClassName('selected')[0];
const clear = document.getElementById('clear') 

// clear button to select all the job sections and display them with no filters
// also removes the tablets from the existing filter div
clear.onclick = function() {
    let allJobs = [...document.getElementsByClassName('openjobs')];
    let tablets = [...document.getElementsByClassName('tablet')]
    for(let eachJob of allJobs) {
        if(!eachJob.classList.contains('spl')) eachJob.style.display = "flex";
    }
    for(let eachTab of tablets) eachTab.remove();
    selectedSection.style.display = "none";
}

window.onload = function() {
    
    // will fetch the json data from the file initially and return it in json when called
    async function getData() {
        let pureData = await fetch("./data.json");
        let jsonData = await pureData.json();
        return jsonData;
    }

    // initial function which will create a 11 clone node from the existing node created in the html file by looping 
    // through the json fole sections
    async function fillData() {
        let usersData = await getData();
        for(let jobData of usersData) {
            let allNode = document.getElementsByClassName('all')[0];
            let job = document.getElementsByClassName('job')[0];
            let clonedJobNode = job.cloneNode(1);
            clonedJobNode.classList.remove('spl');
            clonedJobNode.style.display = "flex"; // adding flex, since the main node is displayed as none
            clonedJobNode.dataset.skills = ""; // adding data attribute for filter purpose 
            setElements(jobData,clonedJobNode); // making sperate function call for updating dom elements from json data
            setSkills(jobData,clonedJobNode); // making seperate function call for updating knows skills of a user on right side
            allNode.appendChild(clonedJobNode); // appending the child node (one job) to a div called "all"
        }
        let updatedJobs = document.getElementsByClassName('job');// creating this, so that all the new added nodes will be updated in the new variable
        return updatedJobs; // returning the new updated nodes when any function is called
    }


    function setElements(jobData,myNode) {
        // updating some dom elements (on left side)
        let cimg = [...myNode.getElementsByClassName('cimg')];
        cimg.forEach(elem => elem.src = jobData.logo);
        let cname = myNode.getElementsByClassName('cname')[0];
        cname.innerText = jobData.company;
        let cpos = myNode.getElementsByClassName('cpos')[0];
        cpos.innerText = jobData.position;
        let addInfo = [jobData.postedAt,jobData.contract,jobData.location];
        let cinfo = [...myNode.getElementsByClassName('cinfo')];
        for(let j in cinfo) cinfo[j].innerText = addInfo[j];
        let newTag = myNode.getElementsByClassName('new')[0];
        let featuredTag = myNode.getElementsByClassName('featured')[0];
        if(jobData.new === false) newTag.style.display = "none";
        if(jobData.featured === false) featuredTag.style.display = "none";
    }

    function setSkills(jobData,myNode) {
        // updating some dom elements (on right side) 
        let skills = myNode.getElementsByClassName('mySkills')[0];
        let pElem = [...skills.getElementsByTagName('p')];
        pElem[0].innerText = jobData.role;
        pElem[1].innerText = jobData.level;
        // dataset for sorting purpose
        myNode.dataset.skills += jobData.role + " ";
        myNode.dataset.skills += jobData.level + " ";
        let skillSet = jobData.languages.concat(jobData.tools) // combining languages and tool in one array
        for (let val of skillSet) {
            let pNode = document.createElement('p'); 
            pNode.innerText = val;
            myNode.dataset.skills += val + " "; // dataset for sorting purpose
            skills.appendChild(pNode); // creating p element, giving value and adding it to the myskills
        }
    }

    

    // helped function => will return the selected / applied filter in array
    function appliedFilters() {
        const values = document.getElementsByClassName('values')[0];
        let tabletElem = [...values.getElementsByClassName('tablet')]
        let filterElems = [];
        for(let each of tabletElem) {
            let pElem = each.getElementsByTagName('p')[0];
            filterElems.push(pElem.textContent)
        }
        return filterElems;
    }
    
    // once data has been filled, the below function will add event listeners to the tablets on the right side
    async function addData() {
        let updatedJobs = await fillData();
        let myUpdatedJobs = [...updatedJobs];
        for (let eachElem of myUpdatedJobs) {
            let mySkills = eachElem.getElementsByClassName('mySkills')[0];
            let skills = [...mySkills.getElementsByTagName('p')];
            for(let i of skills) {
                i.addEventListener('click', ()=> {
                    selectedSection.style.display = "flex";
                    addFilters(i.innerText) // addfilter function will add the clicked values in the top of the filter div
                })
            }
        }
    }


    // function that will add the selected filters in the top
    function addFilters(val) {
        let addedFilters = appliedFilters();
        console.log(addedFilters,val);
        if(addedFilters.indexOf(val) >= 0) { // will check if something is already added and excludes it
            return 
        } else {
            // will create a tablet (already strucutred and validated in html file) and add it in the top filter selected div
            const values = document.getElementsByClassName('values')[0];
            let myDiv = document.createElement('div');
            myDiv.className = "tablet";
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');
            p2.className = "closeSelected"
            p1.innerText = val;
            p2.innerHTML = '&times;'
            myDiv.appendChild(p1);
            myDiv.appendChild(p2);
            values.appendChild(myDiv);
            closebtn(); // added to reinstantiate the close btn function for newly added tabelts
            sortData(); // sort data will update the sorting function
        }
    }

    

    // core function used to sort 
    async function sortData() {
        let allJobs = [...document.getElementsByClassName('openjobs')]; // will select all the jobs
        let filterElem = appliedFilters(); // array of selected filters
        for(let eachJob of allJobs) { // iterating through each array dispaying nobe, when match in filter not foudn in dataset values
            if(!eachJob.classList.contains('spl')) { // exception of clone parent node in html file
                let jobSkills =  eachJob.dataset.skills; // getting skills as a plain text
                for(let filterVal of filterElem) {
                    if(!jobSkills.includes(filterVal)) {
                        eachJob.style.display = "none";
                    }
                }
            }
        }
    }
    // reverse sorting when user remove the filter
    function reverseSortData() {
        let allJobs = [...document.getElementsByClassName('job')];
        let filterElem = appliedFilters();
        for(let eachJob of allJobs) {
            if(filterElem.length > 0) {
                if(!eachJob.classList.contains('spl')) { // exception of clone parent node in html file
                    let jobSkills =  eachJob.dataset.skills;
                    for(let filter of filterElem) {
                        if(jobSkills.includes(filter)) {
                            eachJob.style.display = "flex"; // shows when match found
                        } else {
                            eachJob.style.display = "none"; // removed when match not found
                        }
                    }
                }
            } else if(!eachJob.classList.contains('spl')) {
                eachJob.style.display = "flex"; // will show al lthe jobs when no filter is choosen
                selectedSection.style.display = "none"; // removes the filter bar on the top
            } 
        }
    }

    // close btn for clear
    let closebtn = function() {
        const closeSelected = [...document.getElementsByClassName('closeSelected')];
        closeSelected.forEach(elem => {
            elem.addEventListener('click', () => {
                elem.parentElement.remove(); // will remove the clicked element
                reverseSortData(); // calling the function for reinstantiation
            })
        })
    }
    closebtn();

    // calling the adddata function, which will start the whole program onload
    addData();
}